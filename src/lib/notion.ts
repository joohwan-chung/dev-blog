import { Client } from '@notionhq/client';
import { NotionPage, NotionBlock, Comment, CommentResponse, Reaction, ReactionResponse, ReactionType, PostReactionCounts, Event, EventResponse, EventType } from '@/types/notion';
import { hashPassword } from './password';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export { notion };

/** 사이트맵/RSS용: 블록 조회 없이 id, lastUpdated만 반환 */
export async function getDatabasePagesForSitemap(): Promise<{ id: string; lastUpdated: string }[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          { property: 'Published', date: { is_not_empty: true } },
          { property: 'Hidden', checkbox: { equals: false } },
        ],
      },
      sorts: [{ property: 'Published', direction: 'descending' }],
    });
    return response.results.map((page: unknown) => {
      const p = page as { id: string; last_edited_time: string };
      return { id: p.id, lastUpdated: p.last_edited_time || '' };
    });
  } catch (error) {
    console.error('Error fetching database pages for sitemap:', error);
    return [];
  }
}

/** RSS용: 블록 조회 없이 id, title, description, publishedDate, lastUpdated 반환 */
export async function getDatabasePagesForRss(): Promise<
  { id: string; title: string; description: string; publishedDate: string; lastUpdated: string }[]
> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          { property: 'Published', date: { is_not_empty: true } },
          { property: 'Hidden', checkbox: { equals: false } },
        ],
      },
      sorts: [{ property: 'Published', direction: 'descending' }],
    });
    return response.results.map((page: unknown) => {
      const p = page as {
        id: string;
        last_edited_time: string;
        properties: {
          Name: { title: { plain_text: string }[] };
          Description: { rich_text: { plain_text: string }[] };
          Published: { date: { start: string } | null };
        };
      };
      return {
        id: p.id,
        title: p.properties.Name?.title?.[0]?.plain_text ?? '',
        description: p.properties.Description?.rich_text?.[0]?.plain_text ?? '',
        publishedDate: p.properties.Published?.date?.start ?? p.last_edited_time ?? '',
        lastUpdated: p.last_edited_time ?? '',
      };
    });
  } catch (error) {
    console.error('Error fetching database pages for RSS:', error);
    return [];
  }
}

export async function getDatabasePages(): Promise<NotionPage[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Published',
            date: {
              is_not_empty: true,
            },
          },
          {
            property: 'Hidden',
            checkbox: {
              equals: false,
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
    });

    const pages = await Promise.all(
      response.results.map(async (page: unknown) => {
        const pageData = await getPageContent((page as { id: string }).id);
        const pageObj = page as {
          id: string;
          created_time?: string;
          properties: {
            Name: { title: { plain_text: string }[] };
            Description: { rich_text: { plain_text: string }[] };
            Published: { date: { start: string } | null };
            Tags: { multi_select: { name: string }[] };
            Created?: { date?: { start?: string } };
            Hidden?: { checkbox: boolean };
            AllowComments?: { checkbox: boolean };
          };
          last_edited_time: string;
        };

        return {
          id: pageObj.id,
          title: pageObj.properties.Name.title[0]?.plain_text || '',
          description: pageObj.properties.Description.rich_text[0]?.plain_text || '',
          published: !!pageObj.properties.Published.date?.start,
          publishedDate: pageObj.properties.Published.date?.start || '',
          lastUpdated: pageObj.last_edited_time || '',
          tags: pageObj.properties.Tags.multi_select.map((tag) => tag.name),
          created: pageObj.properties.Created?.date?.start || pageObj.created_time || '',
          content: pageData,
          hidden: pageObj.properties.Hidden?.checkbox || false,
          allowComments: pageObj.properties.AllowComments?.checkbox ?? true, // 기본값은 true
        };
      })
    );

    return pages;
  } catch (error) {
    console.error('Error fetching database pages:', error);
    return [];
  }
}

/** 같은 태그를 가진 다른 포스트를 공통 태그 수 기준 정렬해 limit개 반환 */
export function getRelatedPosts(
  pages: NotionPage[],
  currentId: string,
  currentTags: string[],
  limit: number
): NotionPage[] {
  const tagSet = new Set(currentTags);
  return pages
    .filter((p) => p.id !== currentId && p.tags.some((t) => tagSet.has(t)))
    .map((p) => ({
      ...p,
      _commonTagCount: p.tags.filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => (b as { _commonTagCount: number })._commonTagCount - (a as { _commonTagCount: number })._commonTagCount)
    .slice(0, limit)
    .map(({ _commonTagCount: _, ...p }) => p);
}

const MAX_BLOCK_DEPTH = 15;

interface NotionApiBlock {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: unknown;
}

async function fetchBlockChildren(blockId: string): Promise<NotionApiBlock[]> {
  const results: NotionApiBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });
    results.push(...(response.results as NotionApiBlock[]));
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return results;
}

async function mapNotionBlock(block: NotionApiBlock, depth: number): Promise<NotionBlock> {
  const content = (block[block.type] ?? {}) as NotionBlock['content'];

  if (block.has_children && depth < MAX_BLOCK_DEPTH) {
    const childBlocks = await fetchBlockChildren(block.id);
    content.children = await Promise.all(
      childBlocks.map((child) => mapNotionBlock(child, depth + 1))
    );
  }

  return {
    type: block.type,
    content,
    id: block.id,
  };
}

export async function getPageContent(pageId: string): Promise<NotionBlock[]> {
  try {
    const topLevelBlocks = await fetchBlockChildren(pageId);
    return Promise.all(topLevelBlocks.map((block) => mapNotionBlock(block, 0)));
  } catch (error) {
    console.error('Error fetching page content:', error);
    return [];
  }
}

export async function getPageById(id: string): Promise<NotionPage | null> {
  try {
    const pageData = await notion.pages.retrieve({ page_id: id });
    const content = await getPageContent(id);

    const pageObj = (pageData as unknown) as {
      properties: {
        Name: { title: { plain_text: string }[] };
        Description: { rich_text: { plain_text: string }[] };
        Published: { date: { start: string } | null };
        Tags: { multi_select: { name: string }[] };
        Created: { date: { start: string } };
        Hidden?: { checkbox: boolean };
        AllowComments?: { checkbox: boolean };
      };
      last_edited_time: string;
      cover?: { type: 'file'; file: { url: string } } | { type: 'external'; external: { url: string } } | null;
    };

    let coverUrl: string | undefined;
    if (pageObj.cover?.type === 'file' && pageObj.cover.file?.url) {
      coverUrl = pageObj.cover.file.url;
    } else if (pageObj.cover?.type === 'external' && pageObj.cover.external?.url) {
      coverUrl = pageObj.cover.external.url;
    }

    return {
      id: id,
      title: pageObj.properties.Name.title[0]?.plain_text || '',
      description: pageObj.properties.Description.rich_text[0]?.plain_text || '',
      published: pageObj.properties.Published.date?.start ? true : false,
      publishedDate: pageObj.properties.Published.date?.start || '',
      lastUpdated: pageObj.last_edited_time || '',
      tags: pageObj.properties.Tags.multi_select.map((tag) => tag.name),
      created: pageObj.properties.Created.date?.start || '',
      content: content,
      hidden: pageObj.properties.Hidden?.checkbox || false,
      allowComments: pageObj.properties.AllowComments?.checkbox ?? true,
      coverUrl,
    };
  } catch (error) {
    console.error('Error fetching page by id:', error);
    return null;
  }
}

export async function getSelfIntroducePage(): Promise<NotionPage | null> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Published',
            date: {
              is_not_empty: true,
            },
          },
          {
            property: 'Hidden',
            checkbox: {
              equals: false,
            },
          },
          {
            property: 'Tags',
            multi_select: {
              contains: 'Self Introduce',
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = (response.results[0] as unknown) as {
      id: string;
      properties: {
        Name: { title: { plain_text: string }[] };
        Description: { rich_text: { plain_text: string }[] };
        Published: { date: { start: string } | null };
        Tags: { multi_select: { name: string }[] };
        Created: { date: { start: string } };
      };
      last_edited_time: string;
    };
    const pageData = await getPageContent(page.id);

    return {
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || '',
      description: page.properties.Description.rich_text[0]?.plain_text || '',
      published: !!page.properties.Published.date?.start,
      publishedDate: page.properties.Published.date?.start || '',
      lastUpdated: page.last_edited_time || '',
      tags: page.properties.Tags.multi_select.map((tag) => tag.name),
      created: page.properties.Created.date?.start || '',
      content: pageData,
    };
  } catch (error) {
    console.error('Error fetching self introduce page:', error);
    return null;
  }
}

// 댓글 관련 함수들
// User Comments와 기본 Comments를 통합 조회
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const [basicComments, userComments] = await Promise.all([
      getBasicCommentsByPostId(postId),
      getUserCommentsByPostId(postId)
    ]);

    // 두 배열을 합치고 생성일 기준으로 정렬
    const allComments = [...basicComments, ...userComments];
    allComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return allComments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// 기본 Comments 조회
async function getBasicCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_COMMENTS_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'PostId',
            title: {
              equals: postId,
            },
          },
          {
            property: 'Hidden',
            checkbox: {
              equals: false, // 숨김 처리되지 않은 댓글만
            },
          },
        ],
      },
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'ascending',
        },
      ],
    });

    const comments = response.results.map((comment: unknown) => {
      const commentObj = comment as CommentResponse;
      return {
        id: commentObj.id,
        content: commentObj.properties.Content.rich_text[0]?.plain_text || '',
        postId: commentObj.properties.PostId.title[0]?.plain_text || '',
        postTitle: commentObj.properties.PostTitle?.rich_text[0]?.plain_text || '',
        createdAt: commentObj.properties.CreatedAt.date?.start || '',
        updatedAt: commentObj.last_edited_time || '',
        isAnonymous: commentObj.properties.IsAnonymous.checkbox,
        authorName: commentObj.properties.AuthorName.rich_text[0]?.plain_text || undefined,
        parentId: commentObj.properties.ParentId.rich_text[0]?.plain_text || undefined,
        depth: commentObj.properties.Depth.number || 0,
        hidden: commentObj.properties.Hidden?.checkbox || false,
        replies: [],
      };
    });

    // 댓글을 계층 구조로 변환
    return buildCommentTree(comments);
  } catch (error) {
    console.error('Error fetching basic comments:', error);
    return [];
  }
}

// User Comments 조회
async function getUserCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    if (!process.env.NOTION_USER_COMMENTS_DATABASE_ID) {
      return [];
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_COMMENTS_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'PostId',
            rich_text: {
              equals: postId,
            },
          },
        ],
      },
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'ascending',
        },
      ],
    });

    const comments = response.results.map((comment: unknown) => {
      const commentObj = comment as NotionUserCommentResponse;
      return {
        id: commentObj.id,
        content: commentObj.properties.Content?.rich_text?.[0]?.plain_text || '',
        postId: commentObj.properties.PostId.rich_text[0]?.plain_text || '',
        postTitle: '', // User Comments에는 PostTitle이 없음
        createdAt: commentObj.properties.CreatedAt.date?.start || '',
        updatedAt: commentObj.properties.UpdatedAt.date?.start || '',
        isAnonymous: false, // User Comments는 항상 로그인한 사용자
        authorName: commentObj.properties.AuthorName?.rich_text?.[0]?.plain_text || 'User',
        parentId: commentObj.properties.ParentId?.rich_text?.[0]?.plain_text || undefined,
        depth: 0,
        hidden: false,
        replies: [],
      };
    });

    return comments;
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return [];
  }
}

// 댓글을 계층 구조로 변환하는 함수
function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // 모든 댓글을 맵에 저장
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 댓글을 계층 구조로 구성
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId)!;
      parent.replies!.push(commentWithReplies);
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

// 포스트 제목을 가져오는 함수
export async function getPostTitle(postId: string): Promise<string> {
  try {
    const response = await notion.pages.retrieve({ page_id: postId });
    const page = response as unknown as { properties: { Name: { title: { plain_text: string }[] } } };
    return page.properties.Name.title[0]?.plain_text || '';
  } catch (error) {
    console.error('Error fetching post title:', error);
    return '';
  }
}

export async function createComment(
  postId: string,
  content: string,
  authorName?: string,
  parentId?: string
): Promise<Comment | null> {
  try {
    const depth = parentId ? await getCommentDepth(parentId) + 1 : 0;

    // 3차 댓글까지만 허용
    if (depth > 2) {
      throw new Error('대대댓글까지만 작성할 수 있습니다.');
    }

    // 포스트 제목 가져오기
    const postTitle = await getPostTitle(postId);

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_COMMENTS_DATABASE_ID!,
      },
      properties: {
        Content: {
          rich_text: [
            {
              text: {
                content: content,
              },
            },
          ],
        },
        PostId: {
          title: [
            {
              text: {
                content: postId,
              },
            },
          ],
        },
        CreatedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
        IsAnonymous: {
          checkbox: !authorName,
        },
        AuthorName: {
          rich_text: authorName
            ? [
              {
                text: {
                  content: authorName,
                },
              },
            ]
            : [],
        },
        ParentId: {
          rich_text: parentId
            ? [
              {
                text: {
                  content: parentId,
                },
              },
            ]
            : [],
        },
        Depth: {
          number: depth,
        },
        Hidden: {
          checkbox: false, // 기본적으로 숨김 처리되지 않음
        },
        PostTitle: {
          rich_text: [
            {
              text: {
                content: postTitle,
              },
            },
          ],
        },
      },
    });

    const commentObj = response as unknown as CommentResponse;

    return {
      id: commentObj.id,
      content: commentObj.properties.Content.rich_text[0]?.plain_text || '',
      postId: commentObj.properties.PostId.title[0]?.plain_text || '',
      postTitle: commentObj.properties.PostTitle?.rich_text[0]?.plain_text || '',
      createdAt: commentObj.properties.CreatedAt.date?.start || '',
      updatedAt: commentObj.last_edited_time || '',
      isAnonymous: commentObj.properties.IsAnonymous.checkbox,
      authorName: commentObj.properties.AuthorName.rich_text[0]?.plain_text || undefined,
      parentId: commentObj.properties.ParentId.rich_text[0]?.plain_text || undefined,
      depth: commentObj.properties.Depth.number || 0,
      hidden: commentObj.properties.Hidden?.checkbox || false,
      replies: [],
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}

// 댓글의 깊이를 가져오는 함수
async function getCommentDepth(commentId: string): Promise<number> {
  try {
    const response = await notion.pages.retrieve({ page_id: commentId });
    const commentObj = response as unknown as CommentResponse;
    return commentObj.properties.Depth.number || 0;
  } catch (error) {
    console.error('Error getting comment depth:', error);
    return 0;
  }
}

// 추천/비추천 관련 함수들
export async function getPostReactions(postId: string): Promise<PostReactionCounts> {
  try {
    const [basicReactions, userReactions] = await Promise.all([
      getBasicReactionsByPostId(postId),
      getUserReactionsByPostId(postId)
    ]);

    // 두 배열을 합치기
    const allReactions = [...basicReactions, ...userReactions];

    // 반응 개수 집계
    const reactionCounts: PostReactionCounts = {
      like: 0,
      dislike: 0,
      recommend: 0,
      notRecommend: 0,
    };

    allReactions.forEach(reaction => {
      if (reaction.reactionType === 'not_recommend') {
        reactionCounts.notRecommend++;
      } else if (reaction.reactionType in reactionCounts) {
        reactionCounts[reaction.reactionType as keyof PostReactionCounts]++;
      }
    });

    return reactionCounts;
  } catch (error) {
    console.error('Error fetching post reactions:', error);
    return {
      like: 0,
      dislike: 0,
      recommend: 0,
      notRecommend: 0,
    };
  }
}

// 기본 Reactions 조회
async function getBasicReactionsByPostId(postId: string): Promise<Reaction[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_REACTIONS_DATABASE_ID!,
      filter: {
        property: 'PostId',
        title: {
          equals: postId,
        },
      },
    });

    return response.results.map((reaction: unknown) => {
      const reactionObj = reaction as ReactionResponse;
      return {
        id: reactionObj.id,
        postId: reactionObj.properties.PostId.title[0]?.plain_text || '',
        reactionType: reactionObj.properties.ReactionType.select.name,
        userIp: reactionObj.properties.UserIp.rich_text[0]?.plain_text || '',
        createdAt: reactionObj.properties.CreatedAt.date?.start || '',
        updatedAt: reactionObj.last_edited_time || '',
      };
    });
  } catch (error) {
    console.error('Error fetching basic reactions:', error);
    return [];
  }
}

// User Reactions 조회
async function getUserReactionsByPostId(postId: string): Promise<Reaction[]> {
  try {
    if (!process.env.NOTION_USER_REACTIONS_DATABASE_ID) {
      return [];
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_REACTIONS_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'PostId',
            rich_text: {
              equals: postId,
            },
          },
        ],
      },
    });

    return response.results.map((reaction: unknown) => {
      const reactionObj = reaction as NotionUserReactionResponse;
      return {
        id: reactionObj.properties.ID.title[0]?.plain_text || reactionObj.id,
        postId: reactionObj.properties.PostId.rich_text[0]?.plain_text || '',
        reactionType: reactionObj.properties.ReactionType.select.name as ReactionType,
        userIp: 'logged_in_user', // User Reactions는 로그인한 사용자
        createdAt: reactionObj.properties.CreatedAt.date?.start || '',
        updatedAt: reactionObj.properties.UpdatedAt.date?.start || '',
      };
    });
  } catch (error) {
    console.error('Error fetching user reactions:', error);
    return [];
  }
}

export async function createReaction(
  postId: string,
  reactionType: ReactionType,
  userIp: string
): Promise<Reaction | null> {
  try {
    // 기존 반응이 있는지 확인
    const existingReaction = await getExistingReaction(postId, userIp);

    if (existingReaction) {
      // 기존 반응이 있으면 업데이트
      return await updateReaction(existingReaction.id, reactionType);
    }

    // 새 반응 생성
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_REACTIONS_DATABASE_ID!,
      },
      properties: {
        PostId: {
          title: [
            {
              text: {
                content: postId,
              },
            },
          ],
        },
        ReactionType: {
          select: {
            name: reactionType,
          },
        },
        UserIp: {
          rich_text: [
            {
              text: {
                content: userIp,
              },
            },
          ],
        },
        CreatedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    const reactionObj = response as unknown as ReactionResponse;

    return {
      id: reactionObj.id,
      postId: reactionObj.properties.PostId.title[0]?.plain_text || '',
      reactionType: reactionObj.properties.ReactionType.select.name,
      userIp: reactionObj.properties.UserIp.rich_text[0]?.plain_text || '',
      createdAt: reactionObj.properties.CreatedAt.date?.start || '',
      updatedAt: reactionObj.last_edited_time || '',
    };
  } catch (error) {
    console.error('Error creating reaction:', error);
    return null;
  }
}

export async function deleteReaction(reactionId: string): Promise<boolean> {
  try {
    await notion.pages.update({
      page_id: reactionId,
      archived: true,
    });
    return true;
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return false;
  }
}

async function getExistingReaction(postId: string, userIp: string): Promise<Reaction | null> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_REACTIONS_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'PostId',
            title: {
              equals: postId,
            },
          },
          {
            property: 'UserIp',
            rich_text: {
              equals: userIp,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const reactionObj = response.results[0] as unknown as ReactionResponse;
    return {
      id: reactionObj.id,
      postId: reactionObj.properties.PostId.title[0]?.plain_text || '',
      reactionType: reactionObj.properties.ReactionType.select.name,
      userIp: reactionObj.properties.UserIp.rich_text[0]?.plain_text || '',
      createdAt: reactionObj.properties.CreatedAt.date?.start || '',
      updatedAt: reactionObj.last_edited_time || '',
    };
  } catch (error) {
    console.error('Error getting existing reaction:', error);
    return null;
  }
}

async function updateReaction(reactionId: string, newReactionType: ReactionType): Promise<Reaction | null> {
  try {
    const response = await notion.pages.update({
      page_id: reactionId,
      properties: {
        ReactionType: {
          select: {
            name: newReactionType,
          },
        },
      },
    });

    const reactionObj = response as unknown as ReactionResponse;

    return {
      id: reactionObj.id,
      postId: reactionObj.properties.PostId.title[0]?.plain_text || '',
      reactionType: reactionObj.properties.ReactionType.select.name,
      userIp: reactionObj.properties.UserIp.rich_text[0]?.plain_text || '',
      createdAt: reactionObj.properties.CreatedAt.date?.start || '',
      updatedAt: reactionObj.last_edited_time || '',
    };
  } catch (error) {
    console.error('Error updating reaction:', error);
    return null;
  }
}

// 이벤트 관련 함수들
export async function createEvent(eventData: {
  type: EventType;
  description: string;
  timestamp: string;
  userIp: string;
  page: string;
  userAgent: string;
  referrer: string;
}): Promise<Event | null> {
  try {
    if (!process.env.NOTION_EVENTS_DATABASE_ID) {
      return null;
    }

    if (!process.env.NOTION_API_KEY) {
      return null;
    }

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
      },
      properties: {
        Type: {
          select: {
            name: eventData.type,
          },
        },
        Description: {
          rich_text: [
            {
              text: {
                content: eventData.description,
              },
            },
          ],
        },
        Timestamp: {
          date: {
            start: eventData.timestamp,
          },
        },
        UserIp: {
          rich_text: [
            {
              text: {
                content: eventData.userIp,
              },
            },
          ],
        },
        Page: {
          title: [
            {
              text: {
                content: eventData.page,
              },
            },
          ],
        },
        UserAgent: {
          rich_text: [
            {
              text: {
                content: eventData.userAgent,
              },
            },
          ],
        },
        Referrer: {
          rich_text: [
            {
              text: {
                content: eventData.referrer,
              },
            },
          ],
        },
      },
    });

    const eventObj = response as unknown as EventResponse;

    return {
      id: eventObj.id,
      type: eventObj.properties.Type.select.name,
      description: eventObj.properties.Description.rich_text[0]?.plain_text || '',
      timestamp: eventObj.properties.Timestamp.date?.start || '',
      userIp: eventObj.properties.UserIp.rich_text[0]?.plain_text || '',
      page: eventObj.properties.Page.title[0]?.plain_text || '',
      userAgent: eventObj.properties.UserAgent.rich_text[0]?.plain_text || '',
      referrer: eventObj.properties.Referrer.rich_text[0]?.plain_text || '',
    };
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
}

export async function getRecentEvents(limit: number = 50): Promise<Event[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
      sorts: [
        {
          property: 'Timestamp',
          direction: 'descending',
        },
      ],
    });

    const events = response.results.slice(0, limit).map((event: unknown) => {
      const eventObj = event as EventResponse;
      return {
        id: eventObj.id,
        type: eventObj.properties.Type.select.name,
        description: eventObj.properties.Description.rich_text[0]?.plain_text || '',
        timestamp: eventObj.properties.Timestamp.date?.start || '',
        userIp: eventObj.properties.UserIp.rich_text[0]?.plain_text || '',
        page: eventObj.properties.Page.title[0]?.plain_text || '',
        userAgent: eventObj.properties.UserAgent.rich_text[0]?.plain_text || '',
        referrer: eventObj.properties.Referrer.rich_text[0]?.plain_text || '',
      };
    });

    return events;
  } catch (error) {
    console.error('Error fetching recent events:', error);
    return [];
  }
}

// 관리자용 포스트 관리 함수들
export async function getAllPostsForAdmin(): Promise<NotionPage[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    });

    const pages = await Promise.all(
      response.results.map(async (page: unknown) => {
        const pageData = await getPageContent((page as { id: string }).id);
        const pageObj = page as {
          id: string;
          properties: {
            Name: { title: { plain_text: string }[] };
            Description: { rich_text: { plain_text: string }[] };
            Published: { date: { start: string } | null };
            Tags: { multi_select: { name: string }[] };
            Created: { date: { start: string } };
            Hidden?: { checkbox: boolean };
          };
          last_edited_time: string;
        };

        return {
          id: pageObj.id,
          title: pageObj.properties.Name.title[0]?.plain_text || '',
          description: pageObj.properties.Description.rich_text[0]?.plain_text || '',
          published: !!pageObj.properties.Published.date?.start,
          publishedDate: pageObj.properties.Published.date?.start || '',
          lastUpdated: pageObj.last_edited_time || '',
          tags: pageObj.properties.Tags.multi_select.map((tag) => tag.name),
          created: pageObj.properties.Created.date?.start || '',
          content: pageData,
          hidden: pageObj.properties.Hidden?.checkbox || false,
        };
      })
    );

    return pages;
  } catch (error) {
    console.error('Error fetching all posts for admin:', error);
    return [];
  }
}

export async function updatePostStatus(
  pageId: string,
  updates: {
    published?: boolean;
    hidden?: boolean;
    allowComments?: boolean;
  }
): Promise<boolean> {
  try {
    const properties: {
      Published?: { date: { start: string } | null };
      Hidden?: { checkbox: boolean };
      AllowComments?: { checkbox: boolean };
    } = {};

    if (updates.published !== undefined) {
      properties.Published = updates.published
        ? { date: { start: new Date().toISOString() } }
        : { date: null };
    }

    if (updates.hidden !== undefined) {
      properties.Hidden = { checkbox: updates.hidden };
    }

    if (updates.allowComments !== undefined) {
      properties.AllowComments = { checkbox: updates.allowComments };
    }

    await notion.pages.update({
      page_id: pageId,
      properties,
    });

    return true;
  } catch (error) {
    console.error('Error updating post status:', error);
    return false;
  }
}

export async function updatePost(
  pageId: string,
  updates: {
    title?: string;
    description?: string;
    tags?: string[];
    published?: boolean;
    hidden?: boolean;
    content?: string; // 마크다운 형태의 내용
    allowComments?: boolean; // 댓글 허용 여부
  }
): Promise<boolean> {
  try {
    const properties: {
      Name?: { title: Array<{ text: { content: string } }> };
      Description?: { rich_text: Array<{ text: { content: string } }> };
      Tags?: { multi_select: Array<{ name: string }> };
      Published?: { date: { start: string } | null };
      Hidden?: { checkbox: boolean };
      AllowComments?: { checkbox: boolean };
    } = {};

    if (updates.title !== undefined) {
      properties.Name = {
        title: [{ text: { content: updates.title } }]
      };
    }

    if (updates.description !== undefined) {
      properties.Description = {
        rich_text: [{ text: { content: updates.description } }]
      };
    }

    if (updates.tags !== undefined) {
      properties.Tags = {
        multi_select: updates.tags.map(tag => ({ name: tag }))
      };
    }

    if (updates.published !== undefined) {
      properties.Published = updates.published
        ? { date: { start: new Date().toISOString() } }
        : { date: null };
    }

    if (updates.hidden !== undefined) {
      properties.Hidden = { checkbox: updates.hidden };
    }

    if (updates.allowComments !== undefined) {
      properties.AllowComments = { checkbox: updates.allowComments };
    }

    // 페이지 속성 업데이트
    await notion.pages.update({
      page_id: pageId,
      properties,
    });

    // 내용이 있으면 페이지의 블록들도 업데이트
    if (updates.content !== undefined) {
      await updatePageContent(pageId, updates.content);
    }

    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

// 페이지 내용을 업데이트하는 함수
async function updatePageContent(pageId: string, markdownContent: string): Promise<void> {
  try {
    // 먼저 기존 블록들을 가져와서 삭제
    const existingBlocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    // 모든 기존 블록 삭제 (페이지 제목은 속성이므로 블록이 아님)
    for (const block of existingBlocks.results) {
      try {
        await notion.blocks.delete({
          block_id: block.id,
        });
      } catch (deleteError) {
        console.warn('Failed to delete block:', block.id, deleteError);
        // 삭제 실패해도 계속 진행
      }
    }

    // 마크다운을 Notion 블록으로 변환하여 추가
    const blocks = markdownToNotionBlocks(markdownContent);

    if (blocks.length > 0) {
      await notion.blocks.children.append({
        block_id: pageId,
        children: blocks as unknown as Parameters<typeof notion.blocks.children.append>[0]['children'], // Notion API 타입 호환성
      });
    }
  } catch (error) {
    console.error('Error updating page content:', error);
    throw error;
  }
}

interface NotionBlockForCreation {
  type: string;
  paragraph?: { rich_text: Array<{ type: string; text: { content: string }; annotations?: { bold?: boolean; italic?: boolean; code?: boolean } }> };
  heading_1?: { rich_text: Array<{ type: string; text: { content: string } }> };
  heading_2?: { rich_text: Array<{ type: string; text: { content: string } }> };
  heading_3?: { rich_text: Array<{ type: string; text: { content: string } }> };
  bulleted_list_item?: { rich_text: Array<{ type: string; text: { content: string } }> };
  numbered_list_item?: { rich_text: Array<{ type: string; text: { content: string } }> };
  code?: { language: string; rich_text: Array<{ type: string; text: { content: string } }> };
  quote?: { rich_text: Array<{ type: string; text: { content: string } }> };
  divider?: Record<string, never>;
}

// 마크다운을 Notion 블록으로 변환하는 함수
function markdownToNotionBlocks(markdown: string): NotionBlockForCreation[] {
  if (!markdown || markdown.trim() === '') {
    return [];
  }

  const lines = markdown.split('\n');
  const blocks: NotionBlockForCreation[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 코드 블록 처리
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        // 코드 블록 종료
        blocks.push({
          type: 'code',
          code: {
            language: codeLanguage,
            rich_text: [{ type: 'text', text: { content: codeBlockContent.join('\n') } }]
          }
        });
        inCodeBlock = false;
        codeBlockContent = [];
        codeLanguage = '';
      } else {
        // 코드 블록 시작
        inCodeBlock = true;
        codeLanguage = trimmedLine.substring(3).trim() || 'plain text';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // 빈 줄 처리
    if (!trimmedLine) {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: '' } }]
        }
      });
      continue;
    }

    // 헤딩 처리
    if (trimmedLine.startsWith('### ')) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: trimmedLine.substring(4) } }]
        }
      });
    } else if (trimmedLine.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: trimmedLine.substring(3) } }]
        }
      });
    } else if (trimmedLine.startsWith('# ')) {
      blocks.push({
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: trimmedLine.substring(2) } }]
        }
      });
    }
    // 리스트 처리
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: trimmedLine.substring(2) } }]
        }
      });
    }
    else if (/^\d+\.\s/.test(trimmedLine)) {
      blocks.push({
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: trimmedLine.replace(/^\d+\.\s/, '') } }]
        }
      });
    }
    // 인용문 처리
    else if (trimmedLine.startsWith('> ')) {
      blocks.push({
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: trimmedLine.substring(2) } }]
        }
      });
    }
    // 구분선 처리
    else if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
      blocks.push({
        type: 'divider',
        divider: {}
      });
    }
    // 일반 문단
    else {
      // 마크다운 문법을 파싱하여 rich_text로 변환
      const richText = parseMarkdownToRichText(trimmedLine);
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: richText
        }
      });
    }
  }

  // 마지막에 코드 블록이 열려있으면 닫기
  if (inCodeBlock) {
    blocks.push({
      type: 'code',
      code: {
        language: codeLanguage,
        rich_text: [{ type: 'text', text: { content: codeBlockContent.join('\n') } }]
      }
    });
  }

  return blocks;
}

interface RichTextElement {
  type: string;
  text: { content: string };
  annotations?: { bold?: boolean; italic?: boolean; code?: boolean };
}

// 마크다운 텍스트를 Notion rich_text로 변환하는 함수
function parseMarkdownToRichText(text: string): RichTextElement[] {
  const richText: RichTextElement[] = [];
  const currentText = text;
  let position = 0;

  while (position < currentText.length) {
    // 굵은 글씨 **text** 또는 __text__
    const boldMatch = currentText.slice(position).match(/\*\*(.*?)\*\*|__(.*?)__/);
    if (boldMatch) {
      // 이전 텍스트 추가
      if (position < boldMatch.index! + position) {
        richText.push({
          type: 'text',
          text: { content: currentText.slice(position, boldMatch.index! + position) }
        });
      }
      // 굵은 글씨 텍스트 추가
      richText.push({
        type: 'text',
        text: { content: boldMatch[1] || boldMatch[2] },
        annotations: { bold: true }
      });
      position = boldMatch.index! + boldMatch[0].length + position;
      continue;
    }

    // 기울임 *text* 또는 _text_
    const italicMatch = currentText.slice(position).match(/\*(.*?)\*|_(.*?)_/);
    if (italicMatch) {
      // 이전 텍스트 추가
      if (position < italicMatch.index! + position) {
        richText.push({
          type: 'text',
          text: { content: currentText.slice(position, italicMatch.index! + position) }
        });
      }
      // 기울임 텍스트 추가
      richText.push({
        type: 'text',
        text: { content: italicMatch[1] || italicMatch[2] },
        annotations: { italic: true }
      });
      position = italicMatch.index! + italicMatch[0].length + position;
      continue;
    }

    // 인라인 코드 `code`
    const codeMatch = currentText.slice(position).match(/`(.*?)`/);
    if (codeMatch) {
      // 이전 텍스트 추가
      if (position < codeMatch.index! + position) {
        richText.push({
          type: 'text',
          text: { content: currentText.slice(position, codeMatch.index! + position) }
        });
      }
      // 인라인 코드 텍스트 추가
      richText.push({
        type: 'text',
        text: { content: codeMatch[1] },
        annotations: { code: true }
      });
      position = codeMatch.index! + codeMatch[0].length + position;
      continue;
    }

    // 일반 텍스트
    richText.push({
      type: 'text',
      text: { content: currentText[position] }
    });
    position++;
  }

  // 빈 rich_text 배열인 경우 기본 텍스트 추가
  if (richText.length === 0) {
    richText.push({
      type: 'text',
      text: { content: text }
    });
  }

  return richText;
}

interface NotionPageResponse {
  id: string;
  archived: boolean;
  last_edited_time: string;
  created_time: string;
  properties: {
    Name?: { title: Array<{ plain_text: string }> };
    Description?: { rich_text: Array<{ plain_text: string }> };
    Published?: { date: { start: string } | null };
    Tags?: { multi_select: Array<{ name: string }> };
    Created?: { date: { start: string } };
    Hidden?: { checkbox: boolean };
    AllowComments?: { checkbox: boolean };
  };
}

export async function getPostById(pageId: string): Promise<NotionPage | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId }) as NotionPageResponse;

    if (!page || page.archived) {
      return null;
    }

    // 페이지의 블록들을 가져오기
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    const properties = page.properties;

    return {
      id: page.id,
      title: properties.Name?.title?.[0]?.plain_text || '',
      description: properties.Description?.rich_text?.[0]?.plain_text || '',
      published: !!properties.Published?.date?.start,
      publishedDate: properties.Published?.date?.start || '',
      lastUpdated: page.last_edited_time,
      tags: properties.Tags?.multi_select?.map((tag: { name: string }) => tag.name) || [],
      created: properties.Created?.date?.start || page.created_time,
      content: blocks.results as unknown as NotionBlock[],
      hidden: properties.Hidden?.checkbox || false,
      allowComments: properties.AllowComments?.checkbox ?? true, // 기본값은 true
    };
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}

export async function deletePost(pageId: string): Promise<boolean> {
  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });

    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

export async function getEventStats(startDate?: string | null, endDate?: string | null): Promise<{
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}> {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 날짜 필터가 있는 경우 해당 범위의 통계만 계산
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(23, 59, 59, 999);

      const filteredResponse = await notion.databases.query({
        database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
        filter: {
          and: [
            {
              property: 'Timestamp',
              date: {
                on_or_after: startDateObj.toISOString(),
              },
            },
            {
              property: 'Timestamp',
              date: {
                on_or_before: endDateObj.toISOString(),
              },
            },
          ],
        },
      });

      return {
        today: filteredResponse.results.length,
        thisWeek: filteredResponse.results.length,
        thisMonth: filteredResponse.results.length,
        total: filteredResponse.results.length,
      };
    }

    // 기본 통계 (날짜 필터 없음)
    // 오늘 이벤트 수
    const todayResponse = await notion.databases.query({
      database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
      filter: {
        property: 'Timestamp',
        date: {
          on_or_after: today.toISOString(),
        },
      },
    });

    // 이번 주 이벤트 수
    const weekResponse = await notion.databases.query({
      database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
      filter: {
        property: 'Timestamp',
        date: {
          on_or_after: weekAgo.toISOString(),
        },
      },
    });

    // 이번 달 이벤트 수
    const monthResponse = await notion.databases.query({
      database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
      filter: {
        property: 'Timestamp',
        date: {
          on_or_after: monthAgo.toISOString(),
        },
      },
    });

    // 전체 이벤트 수 (모든 데이터 조회)
    const totalResponse = await notion.databases.query({
      database_id: process.env.NOTION_EVENTS_DATABASE_ID!,
      page_size: 100, // 페이지 크기 제한
    });

    return {
      today: todayResponse.results.length,
      thisWeek: weekResponse.results.length,
      thisMonth: monthResponse.results.length,
      total: totalResponse.results.length,
    };
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      total: 0,
    };
  }
}

// ===== 사용자 관리 함수들 =====

// 사용자 인터페이스 정의
export interface NotionUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastActive: string;
  loginCount: number;
  preferences: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

export interface NotionUserResponse {
  id: string;
  properties: {
    ID: { title: Array<{ plain_text: string }> };
    Name: { rich_text: Array<{ plain_text: string }> };
    Email: { rich_text: Array<{ plain_text: string }> };
    Password: { rich_text: Array<{ plain_text: string }> };
    Role: { select: { name: string } };
    Status: { select: { name: string } };
    Avatar: { url?: string };
    CreatedAt: { date: { start: string } };
    LastActive: { date: { start: string } };
    LoginCount: { number: number };
    Preferences: { rich_text: Array<{ plain_text: string }> };
  };
}

// ===== 사용자 댓글 인터페이스 =====

export interface NotionUserComment {
  id: string;
  userId: string;
  commentId: string;
  postId: string;
  content: string;
  authorName?: string;
  parentId?: string;
  createdAt: string;
  isActive: boolean;
}

export interface NotionUserCommentResponse {
  id: string;
  properties: {
    UserId: { relation: Array<{ id: string }> };
    ID: { title: Array<{ plain_text: string }> };
    CommentId: { rich_text: Array<{ plain_text: string }> };
    PostId: { rich_text: Array<{ plain_text: string }> };
    Content?: { rich_text: Array<{ plain_text: string }> };
    AuthorName?: { rich_text: Array<{ plain_text: string }> };
    ParentId?: { rich_text: Array<{ plain_text: string }> };
    CreatedAt: { date: { start: string } };
    UpdatedAt: { date: { start: string } };
    IsEdited: { checkbox: boolean };
  };
}

// ===== 사용자 반응 인터페이스 =====

export interface NotionUserReaction {
  id: string;
  userId: string;
  reactionId: string;
  postId: string;
  reactionType: string;
  createdAt: string;
  isActive: boolean;
}

export interface NotionUserReactionResponse {
  id: string;
  properties: {
    ID: { title: Array<{ plain_text: string }> };
    UserId: { relation: Array<{ id: string }> };
    ReactionId: { rich_text: Array<{ plain_text: string }> };
    PostId: { rich_text: Array<{ plain_text: string }> };
    ReactionType: { select: { name: string } };
    CreatedAt: { date: { start: string } };
    UpdatedAt: { date: { start: string } };
    IsActive: { checkbox: boolean };
  };
}

// ===== 사용자 권한 인터페이스 =====

export interface NotionUserPermission {
  id: string;
  userId: string;
  permissions: string[];
  grantedAt: string;
  grantedBy: string;
  isActive: boolean;
}

export interface NotionUserPermissionResponse {
  id: string;
  properties: {
    UserId: { relation: Array<{ id: string }> };
    Permission: { multi_select: Array<{ name: string }> };
    GrantedAt: { date: { start: string } };
    GrantedBy: { relation: Array<{ id: string }> };
    IsActive: { checkbox: boolean };
  };
}

// ===== 세션 관리 인터페이스 =====

export interface NotionSession {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface NotionSessionResponse {
  id: string;
  properties: {
    ID: { title: Array<{ plain_text: string }> };
    UserId: { relation: Array<{ id: string }> };
    SessionToken: { rich_text: Array<{ plain_text: string }> };
    IpAddress: { rich_text: Array<{ plain_text: string }> };
    UserAgent: { rich_text: Array<{ plain_text: string }> };
    CreatedAt: { date: { start: string } };
    ExpiresAt: { date: { start: string } };
    IsActive: { checkbox: boolean };
  };
}

// ===== 사용자 활동 로그 인터페이스 =====

export interface NotionActivityLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'comment' | 'reaction' | 'view_post' | 'update_profile' | 'register' | 'password_change' | 'upload_avatar' | 'delete_avatar';
  description: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface NotionActivityLogResponse {
  id: string;
  properties: {
    ID: { title: Array<{ plain_text: string }> };
    UserId: { relation: Array<{ id: string }> };
    Action: { select: { name: string } };
    Description: { rich_text: Array<{ plain_text: string }> };
    Details: { rich_text: Array<{ plain_text: string }> };
    IpAddress: { rich_text: Array<{ plain_text: string }> };
    UserAgent: { rich_text: Array<{ plain_text: string }> };
    Timestamp: { date: { start: string } };
  };
}

// 사용자 생성
export async function createUser(userData: {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user' | 'guest';
  avatar?: string;
}): Promise<NotionUser | null> {
  try {
    if (!process.env.NOTION_USERS_DATABASE_ID) {
      console.error('NOTION_USERS_DATABASE_ID is not set');
      return null;
    }

    // 비밀번호 해시화
    const hashedPassword = await hashPassword(userData.password);

    // 사용자 ID는 입력받은 값 사용
    const userId = userData.id;

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_USERS_DATABASE_ID,
      },
      properties: {
        ID: {
          title: [
            {
              text: {
                content: userId,
              },
            },
          ],
        },
        Name: {
          rich_text: [
            {
              text: {
                content: userData.name,
              },
            },
          ],
        },
        Email: {
          rich_text: [
            {
              text: {
                content: userData.email,
              },
            },
          ],
        },
        Password: {
          rich_text: [
            {
              text: {
                content: hashedPassword, // 해시화된 비밀번호 저장
              },
            },
          ],
        },
        Role: {
          select: {
            name: userData.role || 'user',
          },
        },
        Status: {
          select: {
            name: 'active',
          },
        },
        ...(userData.avatar && {
          Avatar: {
            url: userData.avatar
          }
        }),
        CreatedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
        LastActive: {
          date: {
            start: new Date().toISOString(),
          },
        },
        LoginCount: {
          number: 0,
        },
        Preferences: {
          rich_text: [
            {
              text: {
                content: JSON.stringify({
                  theme: 'light',
                  language: 'ko',
                  notifications: {
                    email: true,
                    push: false,
                  },
                }),
              },
            },
          ],
        },
      },
    });

    const userObj = response as unknown as NotionUserResponse;

    return {
      id: userObj.properties.ID.title[0]?.plain_text || userObj.id,
      name: userObj.properties.Name.rich_text[0]?.plain_text || '',
      email: userObj.properties.Email.rich_text[0]?.plain_text || '',
      password: userObj.properties.Password.rich_text[0]?.plain_text || '',
      avatar: userObj.properties.Avatar?.url,
      role: userObj.properties.Role.select.name as 'admin' | 'user' | 'guest',
      status: userObj.properties.Status.select.name as 'active' | 'inactive' | 'banned',
      createdAt: userObj.properties.CreatedAt.date?.start || '',
      lastActive: userObj.properties.LastActive.date?.start || '',
      loginCount: userObj.properties.LoginCount.number || 0,
      preferences: JSON.parse(userObj.properties.Preferences.rich_text[0]?.plain_text || '{}'),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// 이메일로 사용자 찾기
export async function getUserByEmail(email: string): Promise<NotionUser | null> {
  try {
    if (!process.env.NOTION_USERS_DATABASE_ID) {
      console.error('NOTION_USERS_DATABASE_ID is not set');
      return null;
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID,
      filter: {
        property: 'Email',
        rich_text: {
          equals: email,
        },
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const userObj = response.results[0] as unknown as NotionUserResponse;

    return {
      id: userObj.properties.ID.title[0]?.plain_text || userObj.id,
      name: userObj.properties.Name.rich_text[0]?.plain_text || '',
      email: userObj.properties.Email.rich_text[0]?.plain_text || '',
      password: userObj.properties.Password.rich_text[0]?.plain_text || '',
      avatar: userObj.properties.Avatar?.url,
      role: userObj.properties.Role.select.name as 'admin' | 'user' | 'guest',
      status: userObj.properties.Status.select.name as 'active' | 'inactive' | 'banned',
      createdAt: userObj.properties.CreatedAt.date?.start || '',
      lastActive: userObj.properties.LastActive.date?.start || '',
      loginCount: userObj.properties.LoginCount.number || 0,
      preferences: JSON.parse(userObj.properties.Preferences.rich_text[0]?.plain_text || '{}'),
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// ID로 사용자 찾기
export async function getUserById(id: string): Promise<NotionUser | null> {
  try {
    if (!process.env.NOTION_USERS_DATABASE_ID) {
      console.error('NOTION_USERS_DATABASE_ID is not set');
      return null;
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID,
      filter: {
        property: 'ID',
        title: {
          equals: id,
        },
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const userObj = response.results[0] as unknown as NotionUserResponse;

    return {
      id: userObj.properties.ID.title[0]?.plain_text || userObj.id,
      name: userObj.properties.Name.rich_text[0]?.plain_text || '',
      email: userObj.properties.Email.rich_text[0]?.plain_text || '',
      password: userObj.properties.Password.rich_text[0]?.plain_text || '',
      avatar: userObj.properties.Avatar?.url,
      role: userObj.properties.Role.select.name as 'admin' | 'user' | 'guest',
      status: userObj.properties.Status.select.name as 'active' | 'inactive' | 'banned',
      createdAt: userObj.properties.CreatedAt.date?.start || '',
      lastActive: userObj.properties.LastActive.date?.start || '',
      loginCount: userObj.properties.LoginCount.number || 0,
      preferences: JSON.parse(userObj.properties.Preferences.rich_text[0]?.plain_text || '{}'),
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// 사용자 정보 업데이트
export async function updateUser(userId: string, updates: {
  name?: string;
  email?: string;
  password?: string; // 새 비밀번호 (해시화됨)
  avatar?: string;
  role?: 'admin' | 'user' | 'guest';
  status?: 'active' | 'inactive' | 'banned';
  lastActive?: string;
  loginCount?: number;
  preferences?: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}): Promise<boolean> {
  try {
    if (!process.env.NOTION_USERS_DATABASE_ID) {
      console.error('NOTION_USERS_DATABASE_ID is not set');
      return false;
    }

    // 먼저 사용자 페이지 ID를 찾기
    const response = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID,
      filter: {
        property: 'ID',
        title: {
          equals: userId,
        },
      },
    });

    if (response.results.length === 0) {
      return false;
    }

    const pageId = response.results[0].id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: Record<string, any> = {};

    if (updates.name !== undefined) {
      properties.Name = {
        rich_text: [{ text: { content: updates.name } }]
      };
    }

    if (updates.email !== undefined) {
      properties.Email = {
        rich_text: [{ text: { content: updates.email } }]
      };
    }

    if (updates.password !== undefined) {
      // 비밀번호가 제공된 경우 해시화
      const hashedPassword = await hashPassword(updates.password);
      properties.Password = {
        rich_text: [{ text: { content: hashedPassword } }]
      };
    }

    if (updates.avatar !== undefined) {
      if (updates.avatar) {
        properties.Avatar = {
          url: updates.avatar
        };
      } else {
        properties.Avatar = {
          url: null
        };
      }
    }

    if (updates.role !== undefined) {
      properties.Role = {
        select: { name: updates.role }
      };
    }

    if (updates.status !== undefined) {
      properties.Status = {
        select: { name: updates.status }
      };
    }

    if (updates.lastActive !== undefined) {
      properties.LastActive = {
        date: { start: updates.lastActive }
      };
    }

    if (updates.loginCount !== undefined) {
      properties.LoginCount = {
        number: updates.loginCount
      };
    }

    if (updates.preferences !== undefined) {
      properties.Preferences = {
        rich_text: [{ text: { content: JSON.stringify(updates.preferences) } }]
      };
    }

    await notion.pages.update({
      page_id: pageId,
      properties,
    });

    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}

// 모든 사용자 조회 (관리자용)
export async function getAllUsers(): Promise<NotionUser[]> {
  try {
    if (!process.env.NOTION_USERS_DATABASE_ID) {
      console.error('NOTION_USERS_DATABASE_ID is not set');
      return [];
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID,
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((user: unknown) => {
      const userObj = user as NotionUserResponse;
      return {
        id: userObj.properties.ID.title[0]?.plain_text || userObj.id,
        name: userObj.properties.Name.rich_text[0]?.plain_text || '',
        email: userObj.properties.Email.rich_text[0]?.plain_text || '',
        password: userObj.properties.Password.rich_text[0]?.plain_text || '',
        avatar: userObj.properties.Avatar?.url,
        role: userObj.properties.Role.select.name as 'admin' | 'user' | 'guest',
        status: userObj.properties.Status.select.name as 'active' | 'inactive' | 'banned',
        createdAt: userObj.properties.CreatedAt.date?.start || '',
        lastActive: userObj.properties.LastActive.date?.start || '',
        loginCount: userObj.properties.LoginCount.number || 0,
        preferences: (() => {
          try {
            const prefsText = userObj.properties.Preferences.rich_text[0]?.plain_text || '{}';
            return JSON.parse(prefsText);
          } catch (error) {
            console.error('Error parsing preferences:', error);
            return {
              theme: 'light',
              language: 'ko',
              notifications: {
                email: true,
                push: false
              }
            };
          }
        })(),
      };
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// ===== 세션 관리 함수들 =====

// 세션 생성
export async function createSession(sessionData: {
  userId: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: string;
}): Promise<NotionSession | null> {
  try {
    if (!process.env.NOTION_USER_SESSIONS_DATABASE_ID) {
      console.error('NOTION_USER_SESSIONS_DATABASE_ID is not set');
      return null;
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID!,
      filter: {
        property: 'ID',
        title: {
          equals: sessionData.userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      console.error('User not found for session creation');
      return null;
    }

    const userPageId = userResponse.results[0]?.id;
    if (!userPageId) {
      console.error('User page ID not found');
      return null;
    }
    const sessionId = `session_${Date.now()}`;

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_USER_SESSIONS_DATABASE_ID!,
      },
      properties: {
        ID: {
          title: [
            {
              text: {
                content: sessionId,
              },
            },
          ],
        },
        UserId: {
          relation: [
            {
              id: userPageId,
            },
          ],
        },
        SessionToken: {
          rich_text: [
            {
              text: {
                content: sessionData.sessionToken,
              },
            },
          ],
        },
        IpAddress: {
          rich_text: [
            {
              text: {
                content: sessionData.ipAddress,
              },
            },
          ],
        },
        UserAgent: {
          rich_text: [
            {
              text: {
                content: sessionData.userAgent,
              },
            },
          ],
        },
        CreatedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
        ExpiresAt: {
          date: {
            start: sessionData.expiresAt,
          },
        },
        IsActive: {
          checkbox: true,
        },
      },
    });

    const sessionObj = response as unknown as NotionSessionResponse;

    return {
      id: sessionObj.properties.ID.title[0]?.plain_text || sessionObj.id,
      userId: sessionData.userId,
      sessionToken: sessionObj.properties.SessionToken.rich_text[0]?.plain_text || '',
      ipAddress: sessionObj.properties.IpAddress.rich_text[0]?.plain_text || '',
      userAgent: sessionObj.properties.UserAgent.rich_text[0]?.plain_text || '',
      createdAt: sessionObj.properties.CreatedAt.date?.start || '',
      expiresAt: sessionObj.properties.ExpiresAt.date?.start || '',
      isActive: sessionObj.properties.IsActive.checkbox || false,
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
}

// 세션 조회 (토큰으로)
export async function getSessionByToken(sessionToken: string): Promise<NotionSession | null> {
  try {
    if (!process.env.NOTION_USER_SESSIONS_DATABASE_ID) {
      console.error('NOTION_USER_SESSIONS_DATABASE_ID is not set');
      return null;
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_SESSIONS_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'SessionToken',
            rich_text: {
              equals: sessionToken,
            },
          },
          {
            property: 'IsActive',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const sessionObj = response.results[0] as unknown as NotionSessionResponse;

    // 사용자 ID 가져오기
    const userId = sessionObj.properties.UserId.relation[0]?.id;
    if (!userId) {
      return null;
    }

    // 사용자 정보 가져오기
    const userResponse = await notion.pages.retrieve({ page_id: userId });
    const userObj = userResponse as unknown as NotionUserResponse;
    const userIdString = userObj.properties.ID.title[0]?.plain_text || userObj.id;

    return {
      id: sessionObj.properties.ID.title[0]?.plain_text || sessionObj.id,
      userId: userIdString,
      sessionToken: sessionObj.properties.SessionToken.rich_text[0]?.plain_text || '',
      ipAddress: sessionObj.properties.IpAddress.rich_text[0]?.plain_text || '',
      userAgent: sessionObj.properties.UserAgent.rich_text[0]?.plain_text || '',
      createdAt: sessionObj.properties.CreatedAt.date?.start || '',
      expiresAt: sessionObj.properties.ExpiresAt.date?.start || '',
      isActive: sessionObj.properties.IsActive.checkbox || false,
    };
  } catch (error) {
    console.error('Error getting session by token:', error);
    return null;
  }
}

// 세션 비활성화
export async function deactivateSession(sessionToken: string): Promise<boolean> {
  try {
    if (!process.env.NOTION_USER_SESSIONS_DATABASE_ID) {
      console.error('NOTION_USER_SESSIONS_DATABASE_ID is not set');
      return false;
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_SESSIONS_DATABASE_ID,
      filter: {
        property: 'SessionToken',
        rich_text: {
          equals: sessionToken,
        },
      },
    });

    if (response.results.length === 0) {
      return false;
    }

    const pageId = response.results[0].id;

    await notion.pages.update({
      page_id: pageId,
      properties: {
        IsActive: {
          checkbox: false,
        },
      },
    });

    return true;
  } catch (error) {
    console.error('Error deactivating session:', error);
    return false;
  }
}

// 사용자의 모든 세션 비활성화
export async function deactivateAllUserSessions(userId: string): Promise<boolean> {
  try {
    if (!process.env.NOTION_USER_SESSIONS_DATABASE_ID || !process.env.NOTION_USERS_DATABASE_ID) {
      console.error('Required database IDs are not set');
      return false;
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID,
      filter: {
        property: 'ID',
        title: {
          equals: userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      return false;
    }

    const userPageId = userResponse.results[0].id;

    // 사용자의 모든 활성 세션 찾기
    const sessionsResponse = await notion.databases.query({
      database_id: process.env.NOTION_USER_SESSIONS_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'UserId',
            relation: {
              contains: userPageId,
            },
          },
          {
            property: 'IsActive',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    // 모든 세션 비활성화
    for (const session of sessionsResponse.results) {
      await notion.pages.update({
        page_id: session.id,
        properties: {
          IsActive: {
            checkbox: false,
          },
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error deactivating all user sessions:', error);
    return false;
  }
}

// 만료된 세션 정리
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    if (!process.env.NOTION_USER_SESSIONS_DATABASE_ID) {
      console.error('NOTION_USER_SESSIONS_DATABASE_ID is not set');
      return 0;
    }

    const now = new Date().toISOString();

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_SESSIONS_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'ExpiresAt',
            date: {
              before: now,
            },
          },
          {
            property: 'IsActive',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    let cleanedCount = 0;
    for (const session of response.results) {
      await notion.pages.update({
        page_id: session.id,
        properties: {
          IsActive: {
            checkbox: false,
          },
        },
      });
      cleanedCount++;
    }

    return cleanedCount;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
}

// ===== 사용자 댓글 함수들 =====

// 사용자 댓글 생성
export async function createUserComment(commentData: {
  userId: string;
  commentId?: string; // 선택적 매개변수로 변경
  postId: string;
  content: string;
  authorName?: string;
  parentId?: string;
}): Promise<NotionUserComment | null> {
  try {
    if (!process.env.NOTION_USER_COMMENTS_DATABASE_ID) {
      console.error('NOTION_USER_COMMENTS_DATABASE_ID is not set');
      return null;
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID!,
      filter: {
        property: 'ID',
        title: {
          equals: commentData.userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      console.error('User not found for comment creation');
      return null;
    }

    const userPageId = userResponse.results[0]?.id;
    if (!userPageId) {
      console.error('User page ID not found');
      return null;
    }

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_USER_COMMENTS_DATABASE_ID!,
      },
      properties: {
        UserId: {
          relation: [
            {
              id: userPageId,
            },
          ],
        },
        ID: {
          title: [
            {
              text: {
                content: commentData.commentId || `ucomment_${Date.now()}`,
              },
            },
          ],
        },
        CommentId: {
          rich_text: [
            {
              text: {
                content: commentData.commentId || `user_comment_${Date.now()}`,
              },
            },
          ],
        },
        PostId: {
          rich_text: [
            {
              text: {
                content: commentData.postId,
              },
            },
          ],
        },
        Content: {
          rich_text: [
            {
              text: {
                content: commentData.content,
              },
            },
          ],
        },
        AuthorName: {
          rich_text: commentData.authorName
            ? [
              {
                text: {
                  content: commentData.authorName,
                },
              },
            ]
            : [],
        },
        ParentId: {
          rich_text: commentData.parentId
            ? [
              {
                text: {
                  content: commentData.parentId,
                },
              },
            ]
            : [],
        },
        CreatedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
        UpdatedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
        IsEdited: {
          checkbox: false,
        },
      },
    });

    const commentObj = response as unknown as NotionUserCommentResponse;

    return {
      id: commentObj.id,
      userId: commentData.userId,
      commentId: commentData.commentId || `user_comment_${Date.now()}`,
      postId: commentData.postId,
      content: commentData.content,
      authorName: commentData.authorName,
      parentId: commentData.parentId,
      createdAt: commentObj.properties.CreatedAt.date?.start || '',
      isActive: true, // User Comments는 항상 활성 상태
    };
  } catch (error) {
    console.error('Error creating user comment:', error);
    return null;
  }
}

// 사용자 반응 생성
export async function createUserReaction(reactionData: {
  userId: string;
  reactionId?: string; // 선택적 매개변수로 변경
  postId: string;
  reactionType: string;
}): Promise<NotionUserReaction | null> {
  try {
    if (!process.env.NOTION_USER_REACTIONS_DATABASE_ID) {
      console.error('NOTION_USER_REACTIONS_DATABASE_ID is not set');
      return null;
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID!,
      filter: {
        property: 'ID',
        title: {
          equals: reactionData.userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      console.error('User not found for reaction creation');
      return null;
    }

    const userPageId = userResponse.results[0]?.id;
    if (!userPageId) {
      console.error('User page ID not found');
      return null;
    }

    // 고유 ID 생성
    const reactionId = `react_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_USER_REACTIONS_DATABASE_ID!,
      },
      properties: {
        ID: {
          title: [
            {
              text: {
                content: reactionId,
              },
            },
          ],
        },
        UserId: {
          relation: [
            {
              id: userPageId,
            },
          ],
        },
        ReactionId: {
          rich_text: [
            {
              text: {
                content: reactionData.reactionId || `user_reaction_${Date.now()}`,
              },
            },
          ],
        },
        PostId: {
          rich_text: [
            {
              text: {
                content: reactionData.postId,
              },
            },
          ],
        },
        ReactionType: {
          select: {
            name: reactionData.reactionType,
          },
        },
        CreatedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
        UpdatedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
        IsActive: {
          checkbox: true,
        },
      },
    });

    const reactionObj = response as unknown as NotionUserReactionResponse;

    return {
      id: reactionObj.properties.ID.title[0]?.plain_text || reactionObj.id,
      userId: reactionData.userId,
      reactionId: reactionData.reactionId || `user_reaction_${Date.now()}`,
      postId: reactionData.postId,
      reactionType: reactionData.reactionType,
      createdAt: reactionObj.properties.CreatedAt.date?.start || '',
      isActive: reactionObj.properties.IsActive.checkbox,
    };
  } catch (error) {
    console.error('Error creating user reaction:', error);
    return null;
  }
}

// ===== 사용자 권한 함수들 =====

// 사용자에게 기본 권한들을 한 번에 부여
export async function grantDefaultPermissions(userId: string, grantedBy: string = 'system'): Promise<NotionUserPermission | null> {
  const permissions = ['comment', 'reaction'];

  try {
    // 첫 번째 권한으로 권한 행 생성
    const result = await grantUserPermission({
      userId,
      permission: permissions[0],
      grantedBy,
    });

    if (!result) {
      console.error('Failed to create initial permission row');
      return null;
    }

    // 나머지 권한들을 기존 행에 추가
    for (let i = 1; i < permissions.length; i++) {
      try {
        await grantUserPermission({
          userId,
          permission: permissions[i],
          grantedBy,
        });
      } catch (error) {
        console.error(`Error adding ${permissions[i]} permission:`, error);
      }
    }

    return result;
  } catch (error) {
    console.error('Error granting default permissions:', error);
    return null;
  }
}

// 사용자 권한 확인
export async function checkUserPermission(userId: string, permission: string): Promise<boolean> {
  try {
    if (!process.env.NOTION_USER_PERMISSIONS_DATABASE_ID) {
      console.error('NOTION_USER_PERMISSIONS_DATABASE_ID is not set');
      return false;
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID!,
      filter: {
        property: 'ID',
        title: {
          equals: userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      console.error('User not found for permission check');
      return false;
    }

    const userPageId = userResponse.results[0]?.id;
    if (!userPageId) {
      console.error('User page ID not found');
      return false;
    }

    // 권한 확인
    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_PERMISSIONS_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'UserId',
            relation: {
              contains: userPageId,
            },
          },
          {
            property: 'Permission',
            multi_select: {
              contains: permission,
            },
          },
          {
            property: 'IsActive',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    return response.results.length > 0;
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
}

// 사용자 권한 부여
export async function grantUserPermission(permissionData: {
  userId: string;
  permission: string;
  grantedBy: string;
}): Promise<NotionUserPermission | null> {
  try {

    if (!process.env.NOTION_USER_PERMISSIONS_DATABASE_ID) {
      console.error('NOTION_USER_PERMISSIONS_DATABASE_ID is not set');
      return null;
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID!,
      filter: {
        property: 'ID',
        title: {
          equals: permissionData.userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      console.error('User not found for permission grant');
      return null;
    }

    const userPageId = userResponse.results[0]?.id;
    if (!userPageId) {
      console.error('User page ID not found');
      return null;
    }


    // 사용자의 기존 권한 행 확인
    const existingPermission = await notion.databases.query({
      database_id: process.env.NOTION_USER_PERMISSIONS_DATABASE_ID!,
      filter: {
        property: 'UserId',
        relation: {
          contains: userPageId,
        },
      },
    });

    if (existingPermission.results.length > 0) {
      // 기존 권한 행이 있으면 권한 추가
      const existingPage = existingPermission.results[0] as unknown as NotionUserPermissionResponse;
      const currentPermissions = existingPage.properties.Permission?.multi_select || [];

      // 이미 해당 권한이 있는지 확인
      const hasPermission = currentPermissions.some((p: { name: string }) => p.name === permissionData.permission);
      if (hasPermission) {
        return existingPage as unknown as NotionUserPermission;
      }

      // 권한 추가
      const updatedPermissions = [
        ...currentPermissions,
        { name: permissionData.permission }
      ];

      const updatedPage = await notion.pages.update({
        page_id: existingPage.id,
        properties: {
          Permission: {
            multi_select: updatedPermissions,
          },
        },
      });

      return updatedPage as unknown as NotionUserPermission;
    }

    // 고유 ID 생성
    const permissionId = `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_USER_PERMISSIONS_DATABASE_ID!,
      },
      properties: {
        ID: {
          title: [
            {
              text: {
                content: permissionId,
              },
            },
          ],
        },
        UserId: {
          relation: [
            {
              id: userPageId,
            },
          ],
        },
        Permission: {
          multi_select: [
            {
              name: permissionData.permission,
            },
          ],
        },
        GrantedAt: {
          date: {
            start: new Date().toISOString(),
          },
        },
        GrantedBy: {
          relation: permissionData.grantedBy === 'system' ? [] : [
            {
              id: permissionData.grantedBy,
            },
          ],
        },
        IsActive: {
          checkbox: true,
        },
      },
    });

    const permissionObj = response as unknown as NotionUserPermissionResponse;

    return {
      id: permissionObj.id,
      userId: permissionData.userId,
      permissions: permissionObj.properties.Permission?.multi_select?.map(p => p.name) || [permissionData.permission],
      grantedAt: permissionObj.properties.GrantedAt.date?.start || '',
      grantedBy: permissionData.grantedBy,
      isActive: permissionObj.properties.IsActive.checkbox,
    };
  } catch (error) {
    console.error('Error granting user permission:', error);
    return null;
  }
}

// ===== 사용자 활동 로그 함수들 =====

// 활동 로그 생성
export async function createActivityLog(activityData: {
  userId: string;
  action: 'login' | 'logout' | 'comment' | 'reaction' | 'view_post' | 'update_profile' | 'register' | 'password_change' | 'upload_avatar' | 'delete_avatar';
  description: string;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}): Promise<NotionActivityLog | null> {
  try {
    if (!process.env.NOTION_USER_ACTIVITY_LOGS_DATABASE_ID) {
      console.error('NOTION_USER_ACTIVITY_LOGS_DATABASE_ID is not set');
      return null;
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID!,
      filter: {
        property: 'ID',
        title: {
          equals: activityData.userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      console.error('User not found for activity log creation');
      return null;
    }

    const userPageId = userResponse.results[0]?.id;
    if (!userPageId) {
      console.error('User page ID not found');
      return null;
    }
    const logId = `log_${Date.now()}`;

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_USER_ACTIVITY_LOGS_DATABASE_ID!,
      },
      properties: {
        ID: {
          title: [
            {
              text: {
                content: logId,
              },
            },
          ],
        },
        UserId: {
          relation: [
            {
              id: userPageId,
            },
          ],
        },
        Action: {
          select: {
            name: activityData.action,
          },
        },
        Description: {
          rich_text: [
            {
              text: {
                content: activityData.description,
              },
            },
          ],
        },
        Details: {
          rich_text: [
            {
              text: {
                content: JSON.stringify(activityData.details || {}),
              },
            },
          ],
        },
        IpAddress: {
          rich_text: [
            {
              text: {
                content: activityData.ipAddress,
              },
            },
          ],
        },
        UserAgent: {
          rich_text: [
            {
              text: {
                content: activityData.userAgent,
              },
            },
          ],
        },
        Timestamp: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    const logObj = response as unknown as NotionActivityLogResponse;

    return {
      id: logObj.properties.ID.title[0]?.plain_text || logObj.id,
      userId: activityData.userId,
      action: logObj.properties.Action.select.name as 'login' | 'logout' | 'comment' | 'reaction' | 'view_post' | 'update_profile' | 'register' | 'password_change' | 'upload_avatar' | 'delete_avatar',
      description: logObj.properties.Description.rich_text[0]?.plain_text || '',
      details: JSON.parse(logObj.properties.Details.rich_text[0]?.plain_text || '{}'),
      ipAddress: logObj.properties.IpAddress.rich_text[0]?.plain_text || '',
      userAgent: logObj.properties.UserAgent.rich_text[0]?.plain_text || '',
      timestamp: logObj.properties.Timestamp.date?.start || '',
    };
  } catch (error) {
    console.error('Error creating activity log:', error);
    return null;
  }
}

// 사용자 활동 로그 조회
export async function getUserActivityLogs(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<NotionActivityLog[]> {
  try {
    if (!process.env.NOTION_USER_ACTIVITY_LOGS_DATABASE_ID) {
      console.error('NOTION_USER_ACTIVITY_LOGS_DATABASE_ID is not set');
      return [];
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID!,
      filter: {
        property: 'ID',
        title: {
          equals: userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      return [];
    }

    const userPageId = userResponse.results[0]?.id;
    if (!userPageId) {
      return [];
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_ACTIVITY_LOGS_DATABASE_ID!,
      filter: {
        property: 'UserId',
        relation: {
          contains: userPageId,
        },
      },
      sorts: [
        {
          property: 'Timestamp',
          direction: 'descending',
        },
      ],
      page_size: limit,
      start_cursor: offset > 0 ? undefined : undefined, // 간단한 구현을 위해 offset은 무시
    });

    return response.results.map((log: unknown) => {
      const logObj = log as NotionActivityLogResponse;
      return {
        id: logObj.properties.ID.title[0]?.plain_text || logObj.id,
        userId: userId,
        action: logObj.properties.Action.select.name as 'login' | 'logout' | 'comment' | 'reaction' | 'view_post' | 'update_profile' | 'register' | 'password_change' | 'upload_avatar' | 'delete_avatar',
        description: logObj.properties.Description.rich_text[0]?.plain_text || '',
        details: JSON.parse(logObj.properties.Details.rich_text[0]?.plain_text || '{}'),
        ipAddress: logObj.properties.IpAddress.rich_text[0]?.plain_text || '',
        userAgent: logObj.properties.UserAgent.rich_text[0]?.plain_text || '',
        timestamp: logObj.properties.Timestamp.date?.start || '',
      };
    });
  } catch (error) {
    console.error('Error getting user activity logs:', error);
    return [];
  }
}

// 특정 액션의 활동 로그 조회
export async function getUserActivityLogsByAction(
  userId: string,
  action: string,
  limit: number = 50
): Promise<NotionActivityLog[]> {
  try {
    if (!process.env.NOTION_USER_ACTIVITY_LOGS_DATABASE_ID) {
      console.error('NOTION_USER_ACTIVITY_LOGS_DATABASE_ID is not set');
      return [];
    }

    // 먼저 사용자 페이지 ID를 찾기
    const userResponse = await notion.databases.query({
      database_id: process.env.NOTION_USERS_DATABASE_ID!,
      filter: {
        property: 'ID',
        title: {
          equals: userId,
        },
      },
    });

    if (userResponse.results.length === 0) {
      return [];
    }

    const userPageId = userResponse.results[0]?.id;
    if (!userPageId) {
      return [];
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_ACTIVITY_LOGS_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'UserId',
            relation: {
              contains: userPageId,
            },
          },
          {
            property: 'Action',
            select: {
              equals: action,
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Timestamp',
          direction: 'descending',
        },
      ],
      page_size: limit,
    });

    return response.results.map((log: unknown) => {
      const logObj = log as NotionActivityLogResponse;
      return {
        id: logObj.properties.ID.title[0]?.plain_text || logObj.id,
        userId: userId,
        action: logObj.properties.Action.select.name as 'login' | 'logout' | 'comment' | 'reaction' | 'view_post' | 'update_profile' | 'register' | 'password_change' | 'upload_avatar' | 'delete_avatar',
        description: logObj.properties.Description.rich_text[0]?.plain_text || '',
        details: JSON.parse(logObj.properties.Details.rich_text[0]?.plain_text || '{}'),
        ipAddress: logObj.properties.IpAddress.rich_text[0]?.plain_text || '',
        userAgent: logObj.properties.UserAgent.rich_text[0]?.plain_text || '',
        timestamp: logObj.properties.Timestamp.date?.start || '',
      };
    });
  } catch (error) {
    console.error('Error getting user activity logs by action:', error);
    return [];
  }
}

// 최근 활동 로그 조회 (모든 사용자)
export async function getRecentActivityLogs(limit: number = 100): Promise<NotionActivityLog[]> {
  try {
    if (!process.env.NOTION_USER_ACTIVITY_LOGS_DATABASE_ID) {
      console.error('NOTION_USER_ACTIVITY_LOGS_DATABASE_ID is not set');
      return [];
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_ACTIVITY_LOGS_DATABASE_ID,
      sorts: [
        {
          property: 'Timestamp',
          direction: 'descending',
        },
      ],
      page_size: limit,
    });

    return response.results.map((log: unknown) => {
      const logObj = log as NotionActivityLogResponse;

      // 사용자 ID 가져오기
      const userId = logObj.properties.UserId.relation[0]?.id;
      let userIdString = '';

      if (userId) {
        // 사용자 정보 가져오기 (간단한 구현을 위해 캐싱 없이)
        // 실제로는 캐싱을 사용하는 것이 좋습니다
        userIdString = userId; // 간단한 구현
      }

      return {
        id: logObj.properties.ID.title[0]?.plain_text || logObj.id,
        userId: userIdString,
        action: logObj.properties.Action.select.name as 'login' | 'logout' | 'comment' | 'reaction' | 'view_post' | 'update_profile' | 'register' | 'password_change' | 'upload_avatar' | 'delete_avatar',
        description: logObj.properties.Description.rich_text[0]?.plain_text || '',
        details: JSON.parse(logObj.properties.Details.rich_text[0]?.plain_text || '{}'),
        ipAddress: logObj.properties.IpAddress.rich_text[0]?.plain_text || '',
        userAgent: logObj.properties.UserAgent.rich_text[0]?.plain_text || '',
        timestamp: logObj.properties.Timestamp.date?.start || '',
      };
    });
  } catch (error) {
    console.error('Error getting recent activity logs:', error);
    return [];
  }
}

// 사용자 활동 통계 계산
export async function getUserActivityStats(userId: string): Promise<{
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
}> {
  try {
    // 먼저 사용자 페이지 ID를 찾기
    let userPageId: string | null = null;
    if (process.env.NOTION_USERS_DATABASE_ID) {
      try {
        const userResponse = await notion.databases.query({
          database_id: process.env.NOTION_USERS_DATABASE_ID,
          filter: {
            property: 'ID',
            title: {
              equals: userId,
            },
          },
        });
        
        if (userResponse.results.length > 0) {
          userPageId = userResponse.results[0]?.id;
        }
      } catch {
        // 사용자를 찾을 수 없는 경우 무시
      }
    }

    // 포스트 수 계산
    let totalPosts = 0;
    if (process.env.NOTION_BLOG_DATABASE_ID && userPageId) {
      try {
        const postsResponse = await notion.databases.query({
          database_id: process.env.NOTION_BLOG_DATABASE_ID,
          filter: {
            property: 'Author',
            relation: {
              contains: userPageId
            }
          },
          page_size: 100 // 충분한 크기로 설정
        });
        totalPosts = postsResponse.results.length;
      } catch {
        // 포스트 수 조회 실패 시 무시
      }
    }

    // 댓글 수 계산 - 해당 사용자가 작성한 댓글만 계산
    let totalComments = 0;
    
    // User Comments 데이터베이스 (회원용 - 해당 사용자 댓글만)
    if (process.env.NOTION_USER_COMMENTS_DATABASE_ID && userPageId) {
      try {
        const userCommentsResponse = await notion.databases.query({
          database_id: process.env.NOTION_USER_COMMENTS_DATABASE_ID,
          filter: {
            property: 'UserId',
            relation: {
              contains: userPageId
            }
          },
          page_size: 100
        });
        totalComments += userCommentsResponse.results.length;
      } catch {
        // 댓글 수 조회 실패 시 무시
      }
    }

    // 반응 수 계산 - 해당 사용자가 작성한 반응만 계산
    let totalReactions = 0;
    
    // User Reactions 데이터베이스 (회원용 - 해당 사용자 반응만)
    if (process.env.NOTION_USER_REACTIONS_DATABASE_ID && userPageId) {
      try {
        const userReactionsResponse = await notion.databases.query({
          database_id: process.env.NOTION_USER_REACTIONS_DATABASE_ID,
          filter: {
            property: 'UserId',
            relation: {
              contains: userPageId
            }
          },
          page_size: 100
        });
        totalReactions += userReactionsResponse.results.length;
      } catch {
        // 반응 수 조회 실패 시 무시
      }
    }

    return {
      totalPosts,
      totalComments,
      totalReactions
    };
  } catch (error) {
    console.error('Error getting user activity stats:', error);
    return {
      totalPosts: 0,
      totalComments: 0,
      totalReactions: 0
    };
  }
}
