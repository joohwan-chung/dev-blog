import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const { fcmToken, userId } = await request.json();

    if (!fcmToken || !userId) {
      console.error('필수 파라미터 누락:', { fcmToken: !!fcmToken, userId: !!userId });
      return NextResponse.json(
        { error: 'FCM 토큰과 사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자 알림 설정 데이터베이스에 FCM 토큰 저장/업데이트
    const databaseId = process.env.NOTION_USER_NOTIFICATIONS_DATABASE_ID;
    if (!databaseId) {
      console.error('NOTION_USER_NOTIFICATIONS_DATABASE_ID 환경변수가 설정되지 않음');
      return NextResponse.json(
        { error: '사용자 알림 설정 데이터베이스 ID가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 기존 토큰이 있는지 확인
    const existingTokens = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'UserID',
        title: {
          equals: userId
        }
      }
    });

    let isNewRegistration = false;

    if (existingTokens.results.length > 0) {
      // 기존 토큰이 있는지 확인하고, 같은 토큰인지 체크
      const existingToken = 'properties' in existingTokens.results[0] 
        ? (existingTokens.results[0].properties.FCMToken as { rich_text?: Array<{ text?: { content?: string } }> })?.rich_text?.[0]?.text?.content 
        : undefined;
      
      if (existingToken === fcmToken) {
        // 같은 토큰이면 업데이트하지 않고 성공 응답만 반환
        return NextResponse.json({ success: true, isNewRegistration: false });
      }

      // 기존 토큰 업데이트
      await notion.pages.update({
        page_id: existingTokens.results[0].id,
        properties: {
          FCMToken: {
            rich_text: [
              {
                text: {
                  content: fcmToken
                }
              }
            ]
          },
          UpdatedAt: {
            date: {
              start: new Date().toISOString()
            }
          }
        }
      });
    } else {
      // 새 토큰 생성
      await notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          UserID: {
            title: [
              {
                text: {
                  content: userId
                }
              }
            ]
          },
          FCMToken: {
            rich_text: [
              {
                text: {
                  content: fcmToken
                }
              }
            ]
          },
          NewCommentNotifications: {
            checkbox: true
          },
          NewUserRegistrationNotifications: {
            checkbox: true
          },
          WebNotificationsEnabled: {
            checkbox: true
          },
          CreatedAt: {
            date: {
              start: new Date().toISOString()
            }
          },
          UpdatedAt: {
            date: {
              start: new Date().toISOString()
            }
          }
        }
      });
      isNewRegistration = true;
    }

    return NextResponse.json({ success: true, isNewRegistration });
  } catch (error) {
    console.error('FCM 토큰 등록 오류:', error);
    return NextResponse.json(
      { error: 'FCM 토큰 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
}
