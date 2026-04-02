import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // 관리자 인증 쿠키 삭제
    cookieStore.delete('admin-auth');

    return NextResponse.json(
      { success: true, message: '로그아웃되었습니다.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in admin logout:', error);
    return NextResponse.json(
      { error: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
