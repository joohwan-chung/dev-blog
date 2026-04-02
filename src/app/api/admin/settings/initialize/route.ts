import { NextResponse } from 'next/server';
import { initializeNotionSettings } from '@/lib/initialize-notion-settings';

// POST: Notion 데이터베이스 초기화
export async function POST() {
  try {
    const success = await initializeNotionSettings();
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Notion 데이터베이스가 성공적으로 초기화되었습니다. 20개의 기본 설정이 생성되었습니다.',
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Notion 데이터베이스 초기화에 실패했습니다.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error initializing Notion settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Notion 데이터베이스 초기화 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
