import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export async function POST(request: NextRequest) {
  try {
    const { title, body, type = 'general', targetUserId, targetUserIds, data = {} } = await request.json();

    if (!title || !body) {
      console.error('필수 필드 누락:', { title: !!title, body: !!body });
      return NextResponse.json(
        { error: '제목과 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    const databaseId = process.env.NOTION_USER_NOTIFICATIONS_DATABASE_ID;
    if (!databaseId) {
      return NextResponse.json(
        { error: '사용자 알림 설정 데이터베이스 ID가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // PC 알림 페이로드 생성
    const payload = {
      title,
      body,
      icon: '/favicon.ico',
      url: data.url || '/',
      tag: type,
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: '열기',
          icon: '/favicon.ico'
        },
        {
          action: 'close',
          title: '닫기',
          icon: '/favicon.ico'
        }
      ]
    };

    let result;

    if (targetUserId) {
      // 특정 사용자에게 PC 알림 전송
      
      const userTokens = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'UserID',
          title: {
            equals: targetUserId
          }
        }
      });

      if (userTokens.results.length === 0) {
        console.error('사용자를 찾을 수 없음:', targetUserId);
        return NextResponse.json(
          { error: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const fcmToken = 'properties' in userTokens.results[0] 
        ? (userTokens.results[0].properties.FCMToken as { rich_text?: Array<{ text?: { content?: string } }> })?.rich_text?.[0]?.text?.content 
        : undefined;
      
      if (!fcmToken) {
        console.error('FCM 토큰이 없음:', targetUserId);
        return NextResponse.json(
          { error: '사용자의 FCM 토큰을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // Firebase를 통한 PC 푸시 알림 전송
      
      // Firebase Admin SDK를 사용한 PC 푸시 알림
      const { sendNotificationToUser } = await import('@/lib/firebase-admin');
      
      result = await sendNotificationToUser(fcmToken, {
        title: payload.title,
        body: payload.body,
        icon: payload.icon,
        data: {
          url: payload.url,
          type: type,
          pcNotification: 'true' // PC 알림임을 표시
        }
      });
      
      
      if (result.success) {
      } else {
        console.error('❌ PC 푸시 알림 전송 실패:', result.error);
      }
    } else if (targetUserIds && Array.isArray(targetUserIds)) {
      // 여러 사용자에게 PC 알림 전송
      const userTokens = await notion.databases.query({
        database_id: databaseId,
        filter: {
          or: targetUserIds.map(userId => ({
            property: 'UserID',
            title: {
              equals: userId
            }
          }))
        }
      });

      const fcmTokens = userTokens.results
        .filter((result): result is PageObjectResponse => 'properties' in result)
        .map(result => (result.properties.FCMToken as { rich_text?: Array<{ text?: { content?: string } }> })?.rich_text?.[0]?.text?.content)
        .filter((token): token is string => Boolean(token));

      if (fcmTokens.length === 0) {
        return NextResponse.json(
          { error: '유효한 FCM 토큰을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const { sendNotificationToMultipleUsers } = await import('@/lib/firebase-admin');
      
      result = await sendNotificationToMultipleUsers(fcmTokens, {
        title: payload.title,
        body: payload.body,
        icon: payload.icon,
        data: {
          url: payload.url,
          type: type,
          pcNotification: 'true'
        }
      });
    } else {
      // 모든 사용자에게 PC 알림 전송
      const allUserTokens = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'WebNotificationsEnabled',
          checkbox: {
            equals: true
          }
        }
      });

      const fcmTokens = allUserTokens.results
        .filter((result): result is PageObjectResponse => 'properties' in result)
        .map(result => (result.properties.FCMToken as { rich_text?: Array<{ text?: { content?: string } }> })?.rich_text?.[0]?.text?.content)
        .filter((token): token is string => Boolean(token));

      if (fcmTokens.length === 0) {
        return NextResponse.json(
          { error: '알림을 받을 수 있는 사용자가 없습니다.' },
          { status: 404 }
        );
      }

      const { sendNotificationToMultipleUsers } = await import('@/lib/firebase-admin');
      
      result = await sendNotificationToMultipleUsers(fcmTokens, {
        title: payload.title,
        body: payload.body,
        icon: payload.icon,
        data: {
          url: payload.url,
          type: type,
          pcNotification: 'true'
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('PC 알림 전송 오류:', error);
    return NextResponse.json(
      { error: 'PC 알림 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}
