import type { NotionBlock } from '@/types/notion';
import { blocksToSearchableText } from './notion-search';

const WORDS_PER_MINUTE = 220;

/**
 * Notion 블록 배열에서 텍스트를 추출해 예상 읽기 시간(분)을 반환합니다.
 * 최소 1분으로 반환합니다.
 */
export function getReadingTimeMinutes(blocks: NotionBlock[]): number {
  const text = blocksToSearchableText(blocks);
  const wordCount = text.trim() ? text.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return minutes;
}
