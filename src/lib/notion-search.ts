import type { NotionBlock, NotionPage } from '@/types/notion';

const SNIPPET_MAX_LENGTH = 160;
const SNIPPET_PADDING = 40;

/**
 * NotionBlock[]에서 검색 가능한 평문 텍스트를 추출합니다.
 * rich_text, caption의 plain_text를 공백으로 이어 붙여 반환합니다.
 */
export function blocksToSearchableText(blocks: NotionBlock[]): string {
  const parts: string[] = [];

  function collect(blockList: NotionBlock[]) {
    for (const block of blockList) {
      const content = block.content;
      if (content.rich_text?.length) {
        const text = content.rich_text.map((rt) => rt.plain_text).join('');
        if (text.trim()) parts.push(text);
      }
      if (content.caption?.length) {
        const caption = content.caption.map((rt) => rt.plain_text).join('');
        if (caption.trim()) parts.push(caption);
      }
      if (content.children?.length) {
        collect(content.children);
      }
    }
  }

  collect(blocks);
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * fullText에서 query가 등장하는 구간 주변을 잘라 스니펫을 만듭니다.
 * 대소문자 무시로 검색하며, maxLength 이내로 자릅니다.
 */
export function getSnippet(
  fullText: string,
  query: string,
  maxLength: number = SNIPPET_MAX_LENGTH
): string {
  if (!fullText.trim()) return '';
  const lower = fullText.toLowerCase();
  const q = query.trim().toLowerCase();
  if (!q) return fullText.slice(0, maxLength).trim();

  const idx = lower.indexOf(q);
  if (idx === -1) {
    return fullText.slice(0, maxLength).trim();
  }

  const start = Math.max(0, idx - SNIPPET_PADDING);
  const end = Math.min(fullText.length, idx + q.length + SNIPPET_PADDING);
  let snippet = fullText.slice(start, end).trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < fullText.length) snippet = snippet + '...';
  return snippet.slice(0, maxLength);
}

/**
 * 검색어 문자열을 토큰 배열로 분리합니다 (공백, 쉼표 등 기준).
 */
export function tokenizeQuery(query: string): string[] {
  return query
    .split(/[\s,]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * 텍스트가 모든 토큰을 포함하는지 확인합니다 (대소문자 무시).
 */
export function matchesQuery(text: string, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const lower = text.toLowerCase();
  return tokens.every((t) => lower.includes(t));
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  snippet: string;
  url: string;
  tags?: string[];
}

/**
 * NotionPage 배열과 검색어로 키워드 검색 후 SearchResultItem[] 반환.
 */
export function searchPosts(
  pages: NotionPage[],
  query: string
): SearchResultItem[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return pages.slice(0, 10).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      snippet: p.description?.slice(0, SNIPPET_MAX_LENGTH) || '',
      url: `/blog/${p.id}`,
      tags: p.tags,
    }));
  }

  const results: SearchResultItem[] = [];
  const fullTextByPage = new Map<string, string>();

  for (const page of pages) {
    const titleDesc = [page.title, page.description].filter(Boolean).join(' ');
    const bodyText = blocksToSearchableText(page.content);
    const fullText = [titleDesc, bodyText].join(' ').replace(/\s+/g, ' ');
    fullTextByPage.set(page.id, fullText);

    if (!matchesQuery(fullText, tokens)) continue;

    const snippet = getSnippet(fullText, tokens[0]);
    results.push({
      id: page.id,
      title: page.title,
      description: page.description,
      snippet: snippet || page.description?.slice(0, SNIPPET_MAX_LENGTH) || '',
      url: `/blog/${page.id}`,
      tags: page.tags,
    });
  }

  return results;
}
