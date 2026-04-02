import { NextRequest } from 'next/server';
import { getRecentEvents } from '@/lib/notion';

// 이벤트 스트림을 위한 SSE (Server-Sent Events) 엔드포인트
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // 연결 확인 메시지
      const connectionData = JSON.stringify({
        id: Date.now().toString(),
        type: 'connection',
        description: '실시간 이벤트 스트림에 연결되었습니다',
        timestamp: new Date().toISOString(),
        userIp: 'system'
      });
      
      controller.enqueue(
        encoder.encode(`data: ${connectionData}\n\n`)
      );

      // 주기적으로 노션에서 최신 이벤트 조회
      const interval = setInterval(async () => {
        try {
          const recentEvents = await getRecentEvents(10); // 최근 10개 이벤트 조회
          
          for (const event of recentEvents) {
            const data = JSON.stringify(event);
            controller.enqueue(
              encoder.encode(`data: ${data}\n\n`)
            );
          }
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }, 10000); // 10초마다 노션에서 이벤트 조회

      // 클라이언트 연결 해제 시 정리
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
