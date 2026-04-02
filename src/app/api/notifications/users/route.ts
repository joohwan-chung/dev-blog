import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export async function GET() {
  try {
    const databaseId = process.env.NOTION_USER_NOTIFICATIONS_DATABASE_ID;
    if (!databaseId) {
      return NextResponse.json(
        { error: '사용자 알림 설정 데이터베이스 ID가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 모든 사용자 알림 설정 조회
    const users = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'descending'
        }
      ]
    });

    const userList = users.results
      .filter((user): user is PageObjectResponse => 'properties' in user)
      .map(user => ({
        id: user.id,
        userId: (user.properties.UserID as { title?: Array<{ text?: { content?: string } }> })?.title?.[0]?.text?.content || '',
        fcmToken: (user.properties.FCMToken as { rich_text?: Array<{ text?: { content?: string } }> })?.rich_text?.[0]?.text?.content || '',
        newCommentNotifications: (user.properties.NewCommentNotifications as { checkbox?: boolean })?.checkbox || false,
        newUserRegistrationNotifications: (user.properties.NewUserRegistrationNotifications as { checkbox?: boolean })?.checkbox || false,
        webNotificationsEnabled: (user.properties.WebNotificationsEnabled as { checkbox?: boolean })?.checkbox || false,
        createdAt: (user.properties.CreatedAt as { date?: { start?: string } })?.date?.start || '',
        updatedAt: (user.properties.UpdatedAt as { date?: { start?: string } })?.date?.start || ''
      }));

    return NextResponse.json({ users: userList });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '사용자 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, settings } = await request.json();

    if (!userId || !settings) {
      return NextResponse.json(
        { error: '사용자 ID와 설정이 필요합니다.' },
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

    // 사용자 찾기
    const existingUser = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'UserID',
        title: {
          equals: userId
        }
      }
    });

    if (existingUser.results.length === 0) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 설정 업데이트
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateProperties: Record<string, any> = {
      UpdatedAt: {
        date: {
          start: new Date().toISOString()
        }
      }
    };

    if (settings.newCommentNotifications !== undefined) {
      updateProperties.NewCommentNotifications = {
        checkbox: settings.newCommentNotifications
      };
    }

    if (settings.newUserRegistrationNotifications !== undefined) {
      updateProperties.NewUserRegistrationNotifications = {
        checkbox: settings.newUserRegistrationNotifications
      };
    }

    if (settings.webNotificationsEnabled !== undefined) {
      updateProperties.WebNotificationsEnabled = {
        checkbox: settings.webNotificationsEnabled
      };
    }

    await notion.pages.update({
      page_id: existingUser.results[0].id,
      properties: updateProperties
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('사용자 설정 업데이트 오류:', error);
    return NextResponse.json(
      { error: '사용자 설정 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}
