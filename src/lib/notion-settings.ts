import { Client } from '@notionhq/client';
import { SiteSetting } from '@/types/site-settings';

// Notion 페이지 타입 정의
interface NotionPage {
  id: string;
  properties: {
    Key?: {
      title: Array<{ text: { content: string } }>;
    };
    Value?: {
      rich_text: Array<{ text: { content: string } }>;
    };
    Category?: {
      select: { name: string } | null;
    };
    Type?: {
      select: { name: string } | null;
    };
    Description?: {
      rich_text: Array<{ text: { content: string } }>;
    };
    IsActive?: {
      checkbox: boolean;
    };
    UpdatedAt?: {
      date: { start: string } | null;
    };
  };
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const SITE_SETTINGS_DATABASE_ID = process.env.NOTION_SITE_SETTINGS_DATABASE_ID;

export async function getSiteSettings(): Promise<SiteSetting[]> {
  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY is not set');
  }
  
  if (!SITE_SETTINGS_DATABASE_ID) {
    throw new Error('NOTION_SITE_SETTINGS_DATABASE_ID is not set');
  }

  try {
    const response = await notion.databases.query({
      database_id: SITE_SETTINGS_DATABASE_ID,
      filter: {
        property: 'IsActive',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Category',
          direction: 'ascending',
        },
        {
          property: 'Key',
          direction: 'ascending',
        },
      ],
    });

    return response.results.map((page) => {
      const pageData = page as NotionPage;
      return {
        id: pageData.id,
        key: pageData.properties.Key?.title?.[0]?.text?.content || '',
        value: pageData.properties.Value?.rich_text?.[0]?.text?.content || '',
        category: (pageData.properties.Category?.select?.name || 'general') as 'general' | 'blog' | 'security' | 'notifications' | 'seo' | 'images',
        type: (pageData.properties.Type?.select?.name || 'string') as 'string' | 'number' | 'boolean' | 'array',
        description: pageData.properties.Description?.rich_text?.[0]?.text?.content || '',
        isActive: pageData.properties.IsActive?.checkbox || false,
        updatedAt: pageData.properties.UpdatedAt?.date?.start || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching site settings from Notion:', error);
    throw new Error('Failed to fetch site settings');
  }
}

export async function updateSiteSetting(
  key: string,
  value: string,
  category: string,
  type: string,
  description: string,
  isActive: boolean = true,
  retryCount = 0
): Promise<boolean> {
  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY is not set');
  }
  
  if (!SITE_SETTINGS_DATABASE_ID) {
    throw new Error('NOTION_SITE_SETTINGS_DATABASE_ID is not set');
  }

  const maxRetries = 3;
  const retryDelay = 1000; // 1초

  try {
    // 먼저 해당 키의 기존 페이지를 찾습니다
    const existingPages = await notion.databases.query({
      database_id: SITE_SETTINGS_DATABASE_ID,
      filter: {
        property: 'Key',
        title: {
          equals: key,
        },
      },
    });

    const now = new Date().toISOString();

    if (existingPages.results.length > 0) {
      // 기존 페이지 업데이트
      const pageId = existingPages.results[0].id;
      await notion.pages.update({
        page_id: pageId,
        properties: {
          Value: {
            rich_text: [
              {
                text: {
                  content: value,
                },
              },
            ],
          },
          Category: {
            select: {
              name: category,
            },
          },
          Type: {
            select: {
              name: type,
            },
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: description,
                },
              },
            ],
          },
          IsActive: {
            checkbox: isActive,
          },
          UpdatedAt: {
            date: {
              start: now,
            },
          },
        },
      });
    } else {
      // 새 페이지 생성
      await notion.pages.create({
        parent: {
          database_id: SITE_SETTINGS_DATABASE_ID,
        },
        properties: {
          Key: {
            title: [
              {
                text: {
                  content: key,
                },
              },
            ],
          },
          Value: {
            rich_text: [
              {
                text: {
                  content: value,
                },
              },
            ],
          },
          Category: {
            select: {
              name: category,
            },
          },
          Type: {
            select: {
              name: type,
            },
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: description,
                },
              },
            ],
          },
          IsActive: {
            checkbox: isActive,
          },
          UpdatedAt: {
            date: {
              start: now,
            },
          },
        },
      });
    }

    return true;
  } catch (error: unknown) {
    // 충돌 오류인 경우 재시도
    if (error && typeof error === 'object' && 'code' in error && error.code === 'conflict_error' && retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
      return updateSiteSetting(key, value, category, type, description, isActive, retryCount + 1);
    }
    
    console.error('Error updating site setting in Notion:', error);
    const errorMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Unknown error';
    throw new Error(`Failed to update site setting: ${errorMessage}`);
  }
}

export async function updateMultipleSiteSettings(settings: {
  key: string;
  value: string;
  category: string;
  type: string;
  description: string;
  isActive: boolean;
}[]): Promise<boolean> {
  try {
    // 순차적으로 처리하여 충돌 방지
    for (const setting of settings) {
      await updateSiteSetting(
        setting.key,
        setting.value,
        setting.category,
        setting.type,
        setting.description,
        setting.isActive
      );
      // 각 설정 사이에 작은 지연 추가
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return true;
  } catch (error) {
    console.error('Error updating multiple site settings:', error);
    throw new Error('Failed to update site settings');
  }
}

// 설정값을 적절한 타입으로 변환하는 헬퍼 함수
export function parseSettingValue(value: string, type: string): string | number | boolean | string[] {
  switch (type) {
    case 'boolean':
      return value.toLowerCase() === 'true';
    case 'number':
      return parseInt(value, 10);
    case 'array':
      return value.split(',').map(item => item.trim());
    default:
      return value;
  }
}

// 설정값을 문자열로 변환하는 헬퍼 함수
export function stringifySettingValue(value: string | number | boolean | string[], type: string): string {
  switch (type) {
    case 'boolean':
      return value ? 'true' : 'false';
    case 'number':
      return value.toString();
    case 'array':
      return Array.isArray(value) ? value.join(', ') : String(value);
    default:
      return value.toString();
  }
}
