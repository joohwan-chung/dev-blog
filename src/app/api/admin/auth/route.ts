import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authCode } = body;

    if (!authCode) {
      return NextResponse.json(
        { error: '인증코드가 필요합니다.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 환경 변수에서 관리자 인증코드 확인
    const adminAuthCode = process.env.ADMIN_AUTH_CODE;
    
    if (!adminAuthCode) {
      return NextResponse.json(
        { error: '관리자 인증코드가 설정되지 않았습니다.' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (authCode !== adminAuthCode) {
      return NextResponse.json(
        { error: '잘못된 인증코드입니다.' },
        { status: 401, headers: corsHeaders }
      );
    }

    // 인증 성공 시 쿠키에 세션 설정 (24시간 유효)
    const cookieStore = await cookies();
    cookieStore.set('admin-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24시간
    });

    return NextResponse.json(
      { success: true, message: '인증이 완료되었습니다.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in admin auth:', error);
    return NextResponse.json(
      { error: '인증 처리 중 오류가 발생했습니다.' },
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
