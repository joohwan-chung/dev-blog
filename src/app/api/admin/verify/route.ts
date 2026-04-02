import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin-auth');

    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.json(
        { authenticated: false },
        { status: 401, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { authenticated: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return NextResponse.json(
      { authenticated: false },
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
