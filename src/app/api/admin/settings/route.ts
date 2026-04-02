import { NextRequest, NextResponse } from 'next/server';
import { getNotionSettings, convertToNotionSettings } from '@/lib/notion-settings-manager';
import { updateMultipleSiteSettings } from '@/lib/notion-settings';
import { initializeNotionSettings } from '@/lib/initialize-notion-settings';
import { SiteSettings } from '@/types/settings';

// GET: 설정 조회
export async function GET() {
  try {
    const settings = await getNotionSettings();
    
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    
    // 환경 변수 오류인 경우 400 상태 코드 반환
    if (error instanceof Error && (
      error.message.includes('NOTION_API_KEY is not set') ||
      error.message.includes('NOTION_SITE_SETTINGS_DATABASE_ID is not set')
    )) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Notion 설정이 필요합니다. 환경 변수를 확인해주세요.',
          error: error.message
        },
        { status: 400 }
      );
    }
    
    // Notion 연결은 되지만 데이터가 없는 경우 초기화 시도
    if (error instanceof Error && error.message.includes('Failed to fetch site settings')) {
      try {
        const initialized = await initializeNotionSettings();
        
        if (initialized) {
          // 초기화 성공 후 다시 시도
          const settings = await getNotionSettings();
          return NextResponse.json({
            success: true,
            settings,
            message: 'Notion 데이터베이스가 초기화되었습니다.',
          });
        }
      } catch (initError) {
        console.error('Error initializing settings:', initError);
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: '설정을 불러오는데 실패했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST: 설정 업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings }: { settings: SiteSettings } = body;

    if (!settings) {
      return NextResponse.json(
        { 
          success: false, 
          message: '설정 데이터가 필요합니다.' 
        },
        { status: 400 }
      );
    }

    // SiteSettings를 Notion 형태로 변환
    const notionSettings = convertToNotionSettings(settings);
    
    // Notion에 저장
    await updateMultipleSiteSettings(notionSettings);

    return NextResponse.json({
      success: true,
      message: '설정이 성공적으로 저장되었습니다.',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '설정 저장에 실패했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
