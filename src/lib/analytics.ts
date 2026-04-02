// Notion 이벤트 수집 (POST /api/events/collect)

export const collectEvent = async (eventData: {
  type: 'page_view' | 'comment' | 'reaction' | 'click' | 'user_visit';
  description: string;
  page?: string;
  userAgent?: string;
  referrer?: string;
}) => {
  try {
    const response = await fetch('/api/events/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      return false;
    }

    await response.json();
    return true;
  } catch (error) {
    console.error('❌ 이벤트 수집 실패:', error);
    return false;
  }
};

export const collectCommentEvent = (postTitle: string, action: 'create' | 'reply') => {
  if (typeof window === 'undefined') return;
  collectEvent({
    type: 'comment',
    description: `새로운 ${action === 'create' ? '댓글' : '대댓글'} 작성`,
    page: window.location.pathname,
  });
};

export const collectReactionEvent = (reactionType: string) => {
  if (typeof window === 'undefined') return;
  collectEvent({
    type: 'reaction',
    description: `포스트에 ${reactionType} 추가`,
    page: window.location.pathname,
  });
};

export const collectClickEvent = (elementName: string) => {
  if (typeof window === 'undefined') return;
  collectEvent({
    type: 'click',
    description: `${elementName} 클릭`,
    page: window.location.pathname,
  });
};

export const trackSocialShare = (platform: string, contentTitle: string) => {
  if (typeof window === 'undefined') return;
  collectEvent({
    type: 'click',
    description: `공유: ${platform} - ${contentTitle}`,
    page: window.location.pathname,
  });
};
