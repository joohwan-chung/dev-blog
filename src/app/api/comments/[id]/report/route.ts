import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

// Notion 페이지 프로퍼티 타입 정의
interface NotionPageProperties {
  ReportCount?: { number: number };
  ReportedBy?: { rich_text: { plain_text: string }[] };
  LastReportReason?: { rich_text: { plain_text: string }[] };
  LastReportedAt?: { date: { start: string } };
  ReportReasons?: { rich_text: { plain_text: string }[] };
}

interface NotionPage {
  properties: NotionPageProperties;
}

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 댓글 신고
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;
    const body = await request.json();
    const { reason } = body;
    
    // 신고자 식별 정보 수집
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const acceptLanguage = request.headers.get('accept-language') || 'Unknown';
    
    // IP 주소 결정 (우선순위: x-forwarded-for > x-real-ip > request.ip)
    const clientIp = forwarded?.split(',')[0]?.trim() || realIp || 'Unknown';
    
    // 브라우저 정보 추출
    const browserInfo = userAgent.includes('Chrome') ? 'Chrome' :
                       userAgent.includes('Firefox') ? 'Firefox' :
                       userAgent.includes('Safari') ? 'Safari' :
                       userAgent.includes('Edge') ? 'Edge' : 'Other';
    
    // 언어 정보 추출
    const language = acceptLanguage.split(',')[0]?.split('-')[0] || 'Unknown';
    
    // 신고자 고유 식별자 생성 (IP + 브라우저 + 언어 + 시간대)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const reporterIdentifier = `${clientIp}_${browserInfo}_${language}_${timezone.slice(0, 3)}`;

    if (!commentId) {
      return NextResponse.json(
        { error: '댓글 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: '신고 사유를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 환경 변수 확인
    if (!process.env.NOTION_COMMENTS_DATABASE_ID) {
      return NextResponse.json(
        { error: '댓글 데이터베이스 설정이 필요합니다.' },
        { status: 500 }
      );
    }

    // 먼저 현재 댓글 정보를 가져와서 기존 신고 정보 확인
    const currentComment = await notion.pages.retrieve({ page_id: commentId }) as NotionPage;
    const properties = currentComment.properties;
    
    // 기존 신고 횟수 가져오기 (없으면 0)
    const currentReportCount = properties.ReportCount?.number || 0;
    
    // 기존 신고자 목록 가져오기
    let existingReporters: string[] = [];
    if (properties.ReportedBy?.rich_text && properties.ReportedBy.rich_text.length > 0) {
      existingReporters = properties.ReportedBy.rich_text.map((text) => text.plain_text);
    }
    
    // 기존 신고 사유 목록 가져오기
    let existingReportReasons: string[] = [];
    if (properties.ReportReasons?.rich_text && properties.ReportReasons.rich_text.length > 0) {
      existingReportReasons = properties.ReportReasons.rich_text.map((text) => text.plain_text);
    }
    
    // 중복 신고 방지 (같은 식별자가 이미 신고했는지 확인)
    if (existingReporters.includes(reporterIdentifier)) {
      return NextResponse.json(
        { error: '이미 신고하신 댓글입니다.' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // 새로운 신고자 추가
    existingReporters.push(reporterIdentifier);
    
    // 새로운 신고 사유 추가 (시간과 함께)
    const reportWithTimestamp = `${new Date().toISOString()} - ${reason.trim()}`;
    existingReportReasons.push(reportWithTimestamp);
    
    // 댓글 신고 정보를 댓글 데이터베이스에 업데이트
    const updateProperties: Record<string, unknown> = {
      LastReportReason: {
        rich_text: [
          {
            text: {
              content: reason.trim(),
            },
          },
        ],
      },
      LastReportedAt: {
        date: {
          start: new Date().toISOString(),
        },
      },
    };

    // ReportCount 필드가 존재하는 경우에만 업데이트
    if (properties.ReportCount) {
      updateProperties.ReportCount = {
        number: currentReportCount + 1,
      };
    }

    // ReportedBy 필드가 존재하는 경우에만 업데이트
    if (properties.ReportedBy) {
      updateProperties.ReportedBy = {
        rich_text: existingReporters.map((reporter: string) => ({
          text: {
            content: reporter,
          },
        })),
      };
    }

    // ReportReasons 필드가 존재하는 경우에만 업데이트
    if (properties.ReportReasons) {
      updateProperties.ReportReasons = {
        rich_text: existingReportReasons.map((reason: string) => ({
          text: {
            content: reason,
          },
        })),
      };
    }

    await notion.pages.update({
      page_id: commentId,
      properties: updateProperties as Parameters<typeof notion.pages.update>[0]['properties'],
    });

    return NextResponse.json(
      { message: '댓글이 신고되었습니다.' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error reporting comment:', error);
    return NextResponse.json(
      { error: '댓글 신고에 실패했습니다.' },
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
