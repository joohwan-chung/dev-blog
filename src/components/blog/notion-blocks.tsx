'use client';

import { NotionBlock, NotionRichText } from '@/types/notion';
import Image from 'next/image';
import { useScrollSpyContext } from '@/lib/scroll-spy-context';

interface NotionBlocksProps {
  blocks: NotionBlock[];
}

function getPlainText(richText: NotionRichText[] | undefined): string {
  if (!richText?.length) return '';
  return richText.map((r) => r.plain_text).join('').trim();
}

function slugifyForId(text: string): string {
  const s = text.replace(/\s+/g, '-').replace(/[^\w\uAC00-\uD7A3-]/g, '');
  return s || '';
}

export interface HeadingEntry {
  level: 1 | 2 | 3;
  text: string;
  id: string;
  blockId: string;
}

export function getHeadingsFromBlocks(blocks: NotionBlock[]): HeadingEntry[] {
  const used = new Set<string>();
  const out: HeadingEntry[] = [];
  const levelMap = { heading_1: 1 as const, heading_2: 2 as const, heading_3: 3 as const };
  for (const block of blocks) {
    const level = levelMap[block.type as keyof typeof levelMap];
    if (!level) continue;
    const text = getPlainText(block.content.rich_text);
    let id = slugifyForId(text) || block.id.slice(-8);
    if (used.has(id)) id = `${id}-${block.id.slice(-8)}`;
    used.add(id);
    out.push({ level, text, id, blockId: block.id });
  }
  return out;
}

export function NotionBlocks({ blocks }: NotionBlocksProps) {
  const headings = getHeadingsFromBlocks(blocks);
  const headingIdByBlockId = new Map(headings.map((h) => [h.blockId, h.id]));
  const activeHeadingId = useScrollSpyContext();

  const renderTextWithAnnotations = (richText: NotionRichText[]) => {
    if (!richText || richText.length === 0) return null;
    
    return richText.map((text: NotionRichText, index: number) => {
      let element: React.ReactNode = text.plain_text;
      
      if (text.annotations.bold) {
        element = <strong key={index} className="text-stone-900 dark:text-slate-100">{element}</strong>;
      }
      if (text.annotations.italic) {
        element = <em key={index} className="text-stone-700 dark:text-slate-300">{element}</em>;
      }
      if (text.annotations.strikethrough) {
        element = <del key={index} className="text-stone-500 dark:text-slate-400">{element}</del>;
      }
      if (text.annotations.underline) {
        element = <u key={index} className="text-stone-700 dark:text-slate-300">{element}</u>;
      }
      if (text.annotations.code) {
        element = <code key={index} className="bg-stone-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono text-stone-800 dark:text-slate-200 border border-stone-200 dark:border-slate-600">{element}</code>;
      }
      
      // 링크 처리
      if (text.href) {
        element = (
          <a 
            key={index} 
            href={text.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            {element}
          </a>
        );
      }
      
      return element;
    });
  };

  const renderBlock = (block: NotionBlock) => {
    switch (block.type) {
      case 'paragraph':
        const hasText = block.content.rich_text && block.content.rich_text.length > 0;
        if (!hasText) {
          return <div key={block.id} className="h-4" />; // 빈 단락은 여백으로 처리
        }
        
        return (
          <p key={block.id} className="mb-4 text-stone-700 dark:text-slate-200 leading-relaxed text-base">
            {renderTextWithAnnotations(block.content.rich_text!)}
          </p>
        );

      case 'heading_1': {
        const id = headingIdByBlockId.get(block.id);
        return (
          <h1 key={block.id} id={id} className="text-3xl font-bold mb-6 mt-8 text-stone-900 dark:text-slate-100 border-b border-stone-200 dark:border-slate-700 pb-2 scroll-mt-24">
            {renderTextWithAnnotations(block.content.rich_text!)}
          </h1>
        );
      }
      case 'heading_2': {
        const id = headingIdByBlockId.get(block.id);
        return (
          <h2 key={block.id} id={id} className="text-2xl font-semibold mb-4 mt-6 text-stone-900 dark:text-slate-100 scroll-mt-24">
            {renderTextWithAnnotations(block.content.rich_text!)}
          </h2>
        );
      }
      case 'heading_3': {
        const id = headingIdByBlockId.get(block.id);
        return (
          <h3 key={block.id} id={id} className="text-xl font-semibold mb-3 mt-5 text-stone-900 dark:text-slate-100 scroll-mt-24">
            {renderTextWithAnnotations(block.content.rich_text!)}
          </h3>
        );
      }

      case 'bulleted_list_item':
        return (
          <li key={block.id} className="mb-2 text-stone-700 dark:text-slate-200 leading-relaxed">
            {renderTextWithAnnotations(block.content.rich_text!)}
          </li>
        );

      case 'numbered_list_item':
        return (
          <li key={block.id} className="mb-2 text-stone-700 dark:text-slate-200 leading-relaxed">
            {renderTextWithAnnotations(block.content.rich_text!)}
          </li>
        );

      case 'image':
        const imageUrl = block.content.external?.url || block.content.file?.url;
        const caption = block.content.caption?.[0]?.plain_text || '';
        
        if (imageUrl) {
          return (
            <div key={block.id} className="my-8">
              <div className="relative w-full h-auto rounded-lg overflow-hidden border border-stone-200 dark:border-slate-700">
                <Image
                  src={imageUrl}
                  alt={caption || 'Blog image'}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                  onError={() => {
                    console.error('Image failed to load:', imageUrl);
                  }}
                />
              </div>
              {caption && (
                <p className="text-sm text-stone-500 dark:text-slate-300 text-center mt-3 italic">{caption}</p>
              )}
            </div>
          );
        }
        return null;

      case 'code':
        const language = block.content.language || 'text';
        return (
          <div key={block.id} className="my-6">
            <div className="bg-stone-900 dark:bg-slate-800 text-stone-100 dark:text-slate-200 rounded-lg overflow-hidden border border-stone-700 dark:border-slate-600">
              {language !== 'text' && (
                <div className="bg-stone-800 dark:bg-slate-700 px-4 py-2 text-sm text-stone-200 dark:text-slate-200 border-b border-stone-700 dark:border-slate-600 font-medium">
                  {language}
                </div>
              )}
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-stone-600 dark:scrollbar-thumb-slate-500 scrollbar-track-transparent">
                <pre className="p-4 bg-stone-900 dark:bg-slate-800 min-w-max">
                  <code className="text-sm font-mono text-stone-100 dark:text-slate-200 whitespace-pre">
                    {renderTextWithAnnotations(block.content.rich_text!)}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        );

      case 'quote':
        return (
          <blockquote key={block.id} className="border-l-4 border-stone-300 dark:border-slate-600 pl-6 my-6 italic text-stone-600 dark:text-slate-300 bg-stone-50 dark:bg-slate-800 py-4 rounded-r-lg">
            {renderTextWithAnnotations(block.content.rich_text!)}
          </blockquote>
        );

      case 'divider':
        return <hr key={block.id} className="my-8 border-stone-200 dark:border-slate-700" />;

      case 'callout':
        const icon = block.content.icon?.emoji || '💡';
        return (
          <div key={block.id} className="my-6 p-4 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg flex items-start gap-3">
            <div className="text-2xl">{icon}</div>
            <div className="text-stone-700 dark:text-slate-200">
              {renderTextWithAnnotations(block.content.rich_text!)}
            </div>
          </div>
        );

      case 'toggle':
        return (
          <details key={block.id} className="my-4">
            <summary className="cursor-pointer font-medium text-stone-900 dark:text-slate-100 mb-2 hover:text-stone-700 dark:hover:text-slate-300">
              {block.content.rich_text?.[0]?.plain_text || '토글 내용'}
            </summary>
            <div className="pl-4 text-stone-700 dark:text-slate-200">
              {block.content.children?.map((child: NotionBlock) => renderBlock(child))}
            </div>
          </details>
        );

      case 'table_of_contents': {
        return (
          <nav key={block.id} aria-label="목차" className="my-6 p-4 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg table-of-contents">
            <h4 className="font-medium text-stone-900 dark:text-slate-100 mb-2">목차</h4>
            <ul className="text-sm text-stone-600 dark:text-slate-300 space-y-1 list-none pl-0">
              {headings.map((h) => {
                const isActive = activeHeadingId === h.id;
                return (
                  <li key={h.blockId} style={{ paddingLeft: (h.level - 1) * 12 }}>
                    <a
                      href={`#${encodeURIComponent(h.id)}`}
                      className={`hover:text-stone-900 dark:hover:text-slate-100 underline underline-offset-2 ${isActive ? 'font-semibold text-stone-900 dark:text-slate-100 border-l-2 border-stone-900 dark:border-slate-100 pl-2 -ml-2' : ''}`}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      {h.text}
                    </a>
                  </li>
                );
              })}
            </ul>
            {headings.length === 0 && <p className="text-stone-500 dark:text-slate-400">목차가 없습니다.</p>}
          </nav>
        );
      }

      case 'column_list':
        return (
          <div key={block.id} className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {block.content.children?.map((child: NotionBlock) => renderBlock(child))}
          </div>
        );

      case 'column':
        return (
          <div key={block.id} className="space-y-4">
            {block.content.children?.map((child: NotionBlock) => renderBlock(child))}
          </div>
        );

      case 'table':
        return (
          <div key={block.id} className="my-6 overflow-x-auto scrollbar-thin scrollbar-thumb-stone-600 dark:scrollbar-thumb-slate-500 scrollbar-track-transparent">
            <table className="w-full min-w-max border-collapse border border-stone-200 dark:border-slate-700">
              <tbody>
                {block.content.children?.map((row: NotionBlock, rowIndex: number) => (
                  <tr key={row.id || rowIndex} className="border-b border-stone-200 dark:border-slate-700">
                    {row.content.children?.map((cell: NotionBlock, cellIndex: number) => (
                      <td key={cell.id || cellIndex} className="p-3 border-r border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-200 whitespace-nowrap">
                        {renderTextWithAnnotations(cell.content.rich_text!)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        // 알 수 없는 블록 타입은 개발자 도구에서 확인할 수 있도록 표시
        if (process.env.NODE_ENV === 'development') {
        }
        return null;
    }
  };

  const processBlocks = (blocks: NotionBlock[]) => {
    const processedBlocks: React.ReactElement[] = [];
    let currentListItems: NotionBlock[] = [];
    let currentListType: string | null = null;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      
      if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
        const listType = block.type === 'bulleted_list_item' ? 'bulleted' : 'numbered';
        
        // 새로운 리스트 시작 또는 기존 리스트와 다른 타입
        if (currentListType !== listType) {
          // 이전 리스트가 있으면 렌더링
          if (currentListItems.length > 0) {
            const listElement = renderList(currentListItems, currentListType);
            if (listElement) {
              processedBlocks.push(listElement);
            }
          }
          // 새 리스트 시작
          currentListItems = [block];
          currentListType = listType;
        } else {
          // 기존 리스트에 추가
          currentListItems.push(block);
        }
      } else {
        // 리스트가 아닌 블록이 나오면 이전 리스트 렌더링
        if (currentListItems.length > 0) {
          const listElement = renderList(currentListItems, currentListType);
          if (listElement) {
            processedBlocks.push(listElement);
          }
          currentListItems = [];
          currentListType = null;
        }
        // 현재 블록 렌더링
        const renderedBlock = renderBlock(block);
        if (renderedBlock) {
          processedBlocks.push(renderedBlock);
        }
      }
    }

    // 마지막에 남은 리스트 처리
    if (currentListItems.length > 0) {
      const listElement = renderList(currentListItems, currentListType);
      if (listElement) {
        processedBlocks.push(listElement);
      }
    }

    return processedBlocks;
  };

  const renderList = (listItems: NotionBlock[], type: string | null): React.ReactElement | null => {
    if (type === 'bulleted') {
      return (
        <ul key={`bulleted-${listItems[0].id}`} className="mb-6 text-stone-700 dark:text-slate-200">
          {listItems.map((item) => renderBlock(item))}
        </ul>
      );
    } else if (type === 'numbered') {
      return (
        <ol key={`numbered-${listItems[0].id}`} className="mb-6 text-stone-700 dark:text-slate-200">
          {listItems.map((item) => renderBlock(item))}
        </ol>
      );
    }
    
    // 기본적으로는 첫 번째 아이템만 렌더링
    return renderBlock(listItems[0]);
  };

  const processedBlocks = processBlocks(blocks);

  return (
    <div className="notion-content">
      {processedBlocks}
    </div>
  );
}
