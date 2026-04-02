import { NextResponse } from 'next/server';

export async function GET() {
  // 개발 환경에서만 동작
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  const envStatus = {
    NOTION_API_KEY: process.env.NOTION_API_KEY ? '✅ Set' : '❌ Not set',
    NOTION_SITE_SETTINGS_DATABASE_ID: process.env.NOTION_SITE_SETTINGS_DATABASE_ID ? '✅ Set' : '❌ Not set',
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID ? '✅ Set' : '❌ Not set',
    NOTION_COMMENTS_DATABASE_ID: process.env.NOTION_COMMENTS_DATABASE_ID ? '✅ Set' : '❌ Not set',
  };

  return NextResponse.json({
    message: 'Environment variables status',
    status: envStatus,
    timestamp: new Date().toISOString(),
  });
}
