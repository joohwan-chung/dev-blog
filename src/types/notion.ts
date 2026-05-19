export interface NotionPage {
  id: string;
  title: string;
  description: string;
  published: boolean;
  publishedDate: string;
  lastUpdated: string;
  tags: string[];
  created: string;
  content: NotionBlock[];
  hidden?: boolean; // 숨김 처리 여부
  allowComments?: boolean; // 댓글 허용 여부 (게시글별 설정)
  coverUrl?: string; // OG/썸네일용 커버 이미지 URL
}

export interface NotionBlock {
  type: string;
  content: NotionBlockContent;
  id: string;
}

export interface NotionBlockContent {
  rich_text?: NotionRichText[];
  external?: { url: string };
  file?: { url: string };
  caption?: NotionRichText[];
  language?: string;
  icon?: { emoji: string };
  children?: NotionBlock[];
  /** table_row: 셀별 rich_text 배열 */
  cells?: NotionRichText[][];
  /** table */
  table_width?: number;
  has_column_header?: boolean;
  has_row_header?: boolean;
}

export interface NotionRichText {
  plain_text: string;
  href?: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
  };
}

export interface NotionDatabaseResponse {
  results: NotionPageResponse[];
  has_more: boolean;
  next_cursor: string | null;
}

export interface NotionPageResponse {
  properties: {
    Name: { title: [{ plain_text: string }] };
    Description: { rich_text: [{ plain_text: string }] };
    Published: { date: { start: string } | null };
    Tags: { multi_select: { name: string }[] };
    Created: { date: { start: string } };
    Hidden?: { checkbox: boolean }; // 숨김 처리 여부
    AllowComments?: { checkbox: boolean }; // 댓글 허용 여부
  };
  id: string;
  url: string;
  last_edited_time: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  postTitle?: string; // 포스트 제목
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  authorName?: string;
  parentId?: string; // 대댓글의 경우 부모 댓글 ID
  depth: number; // 0: 댓글, 1: 대댓글, 2: 대대댓글
  hidden: boolean; // 숨김 여부 (관리자가 숨김 처리)
  reportCount?: number; // 신고 횟수
  lastReportReason?: string; // 마지막 신고 사유
  lastReportedAt?: string; // 마지막 신고 시간
  reportedBy?: string[]; // 신고자 목록 (IP_브라우저_언어_지역 형태)
  replies?: Comment[]; // 하위 댓글들
}

export interface CommentResponse {
  properties: {
    Content: { rich_text: { plain_text: string }[] };
    PostId: { title: { plain_text: string }[] };
    CreatedAt: { date: { start: string } };
    IsAnonymous: { checkbox: boolean };
    AuthorName: { rich_text: { plain_text: string }[] };
    ParentId: { rich_text: { plain_text: string }[] };
    Depth: { number: number };
    Hidden?: { checkbox: boolean };
    PostTitle?: { rich_text: { plain_text: string }[] };
    ReportCount?: { number: number };
    LastReportReason?: { rich_text: { plain_text: string }[] };
    LastReportedAt?: { date: { start: string } };
    ReportedBy?: { rich_text: { plain_text: string }[] };
  };
  id: string;
  last_edited_time: string;
}

export type ReactionType = 'like' | 'dislike' | 'recommend' | 'not_recommend';

export interface Reaction {
  id: string;
  postId: string;
  reactionType: ReactionType;
  userIp: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReactionResponse {
  properties: {
    PostId: { title: { plain_text: string }[] };
    ReactionType: { select: { name: ReactionType } };
    UserIp: { rich_text: { plain_text: string }[] };
    CreatedAt: { date: { start: string } };
  };
  id: string;
  last_edited_time: string;
}

export interface PostReactionCounts {
  like: number;
  dislike: number;
  recommend: number;
  notRecommend: number;
  userReaction?: ReactionType;
}

export type EventType = 'page_view' | 'comment' | 'reaction' | 'click' | 'user_visit';

export interface Event {
  id: string;
  type: EventType;
  description: string;
  timestamp: string;
  userIp: string;
  page: string;
  userAgent: string;
  referrer: string;
}

export interface EventResponse {
  properties: {
    Type: { select: { name: EventType } };
    Description: { rich_text: { plain_text: string }[] };
    Timestamp: { date: { start: string } };
    UserIp: { rich_text: { plain_text: string }[] };
    Page: { title: { plain_text: string }[] };
    UserAgent: { rich_text: { plain_text: string }[] };
    Referrer: { rich_text: { plain_text: string }[] };
  };
  id: string;
  last_edited_time: string;
}

// 팝업 관련 타입 정의
export type PopupType = 'modal' | 'banner' | 'toast' | 'slide';
export type PopupTheme = 'default' | 'dark' | 'light' | 'gradient';
export type PopupPosition = 'center' | 'top' | 'bottom' | 'top-right' | 'top-left';
export type PopupDisplayLocation = 'home' | 'blog' | 'about' | 'profile' | 'playground' | 'all';
export type PopupTargetUsers = 'all' | 'logged-in' | 'guest' | 'admin';

export interface Popup {
  title: string;
  content: string;
  imageUrl?: string;
  displayLocation: PopupDisplayLocation;
  pageSpecific?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  popupType: PopupType;
  theme: PopupTheme;
  position: PopupPosition;
  autoClose: number;
  showCloseButton: boolean;
  allowOutsideClick: boolean;
  priority: number;
  order: number;
  targetUsers: PopupTargetUsers;
  showOnce: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PopupResponse {
  properties: {
    Title: { title: { plain_text: string }[] };
    Content: { rich_text: { plain_text: string }[] };
    ImageUrl?: { url: string };
    DisplayLocation: { select: { name: PopupDisplayLocation } };
    PageSpecific?: { rich_text: { plain_text: string }[] };
    IsActive: { checkbox: boolean };
    StartDate: { date: { start: string } };
    EndDate: { date: { start: string } };
    PopupType: { select: { name: PopupType } };
    Theme: { select: { name: PopupTheme } };
    Position: { select: { name: PopupPosition } };
    AutoClose: { number: number };
    ShowCloseButton: { checkbox: boolean };
    AllowOutsideClick: { checkbox: boolean };
    Priority: { number: number };
    Order: { number: number };
    TargetUsers: { select: { name: PopupTargetUsers } };
    ShowOnce: { checkbox: boolean };
    CreatedAt: { created_time: string };
    UpdatedAt: { last_edited_time: string };
    CreatedBy: { created_by: { name: string } };
  };
  id: string;
  last_edited_time: string;
}
