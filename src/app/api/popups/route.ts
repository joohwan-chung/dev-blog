import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';
import { Popup } from '@/types/notion';

const POPUP_DATABASE_ID = process.env.NOTION_POPUP_DATABASE_ID;

if (!POPUP_DATABASE_ID) {
  throw new Error('NOTION_POPUP_DATABASE_ID 환경변수가 설정되지 않았습니다.');
}

// 활성 팝업 조회 (사용자 페이지용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'home';
    const userType = searchParams.get('userType') || 'guest'; // guest, logged-in, admin

    const now = new Date().toISOString().split('T')[0];

    const response = await notion.databases.query({
      database_id: POPUP_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'IsActive',
            checkbox: { equals: true },
          },
          {
            or: [
              {
                property: 'DisplayLocation',
                select: { equals: location },
              },
              {
                property: 'DisplayLocation',
                select: { equals: 'all' },
              },
            ],
          },
          {
            property: 'StartDate',
            date: { on_or_before: now },
          },
          {
            property: 'EndDate',
            date: { on_or_after: now },
          },
          {
            or: [
              {
                property: 'TargetUsers',
                select: { equals: 'all' },
              },
              {
                property: 'TargetUsers',
                select: { equals: userType },
              },
            ],
          },
        ],
      },
      sorts: [
        { property: 'Priority', direction: 'descending' },
        { property: 'Order', direction: 'ascending' },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const popups: Popup[] = response.results.map((item: any) => {
      const props = item.properties;
      return {
        title: props.Title?.title?.[0]?.plain_text || '',
        content: props.Content?.rich_text?.[0]?.plain_text || '',
        imageUrl: props.ImageUrl?.url || undefined,
        displayLocation: props.DisplayLocation?.select?.name || 'home',
        pageSpecific: props.PageSpecific?.rich_text?.[0]?.plain_text || undefined,
        isActive: props.IsActive?.checkbox || false,
        startDate: props.StartDate?.date?.start || '',
        endDate: props.EndDate?.date?.start || '',
        popupType: props.PopupType?.select?.name || 'modal',
        theme: props.Theme?.select?.name || 'default',
        position: props.Position?.select?.name || 'center',
        autoClose: props.AutoClose?.number || 0,
        showCloseButton: props.ShowCloseButton?.checkbox || true,
        allowOutsideClick: props.AllowOutsideClick?.checkbox || true,
        priority: props.Priority?.number || 1,
        order: props.Order?.number || 1,
        targetUsers: props.TargetUsers?.select?.name || 'all',
        showOnce: props.ShowOnce?.checkbox || false,
        createdAt: props.CreatedAt?.created_time || '',
        updatedAt: props.UpdatedAt?.last_edited_time || '',
        createdBy: props.CreatedBy?.created_by?.name || '',
      };
    });

    return NextResponse.json(popups);
  } catch (error) {
    console.error('활성 팝업 조회 실패:', error);
    return NextResponse.json(
      { error: '팝업을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
