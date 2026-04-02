import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';
import { Popup } from '@/types/notion';

const POPUP_DATABASE_ID = process.env.NOTION_POPUP_DATABASE_ID;

if (!POPUP_DATABASE_ID) {
  throw new Error('NOTION_POPUP_DATABASE_ID 환경변수가 설정되지 않았습니다.');
}

// 팝업 목록 조회
export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: POPUP_DATABASE_ID!,
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
    console.error('팝업 목록 조회 실패:', error);
    return NextResponse.json(
      { error: '팝업 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}


// 팝업 업데이트 (제목으로 찾기)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, ...updateData } = body;

    if (!title) {
      return NextResponse.json(
        { error: '제목은 필수입니다.' },
        { status: 400 }
      );
    }

    // 제목으로 팝업 찾기
    const response = await notion.databases.query({
      database_id: POPUP_DATABASE_ID!,
      filter: {
        property: 'Title',
        rich_text: { contains: title }
      }
    });

    if (response.results.length === 0) {
      return NextResponse.json(
        { error: '팝업을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const pageId = response.results[0].id;

    // 팝업 업데이트
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Title: {
          title: [{ text: { content: updateData.title || title } }],
        },
        Content: {
          rich_text: [{ text: { content: updateData.content } }],
        },
        ...(updateData.imageUrl && { ImageUrl: { url: updateData.imageUrl } }),
        DisplayLocation: {
          select: { name: updateData.displayLocation || 'home' },
        },
        ...(updateData.pageSpecific && { PageSpecific: { rich_text: [{ text: { content: updateData.pageSpecific } }] } }),
        IsActive: {
          checkbox: updateData.isActive !== undefined ? updateData.isActive : true,
        },
        StartDate: {
          date: { start: updateData.startDate || new Date().toISOString().split('T')[0] },
        },
        EndDate: {
          date: { start: updateData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        },
        PopupType: {
          select: { name: updateData.popupType || 'modal' },
        },
        Theme: {
          select: { name: updateData.theme || 'default' },
        },
        Position: {
          select: { name: updateData.position || 'center' },
        },
        AutoClose: {
          number: updateData.autoClose !== undefined ? updateData.autoClose : 0,
        },
        ShowCloseButton: {
          checkbox: updateData.showCloseButton !== undefined ? updateData.showCloseButton : true,
        },
        AllowOutsideClick: {
          checkbox: updateData.allowOutsideClick !== undefined ? updateData.allowOutsideClick : true,
        },
        Priority: {
          number: updateData.priority !== undefined ? updateData.priority : 1,
        },
        Order: {
          number: updateData.order !== undefined ? updateData.order : 1,
        },
        TargetUsers: {
          select: { name: updateData.targetUsers || 'all' },
        },
        ShowOnce: {
          checkbox: updateData.showOnce !== undefined ? updateData.showOnce : false,
        },
      },
    });

    return NextResponse.json({ 
      message: '팝업이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('팝업 수정 실패:', error);
    return NextResponse.json(
      { error: '팝업 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 팝업 삭제 (제목으로 찾기)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: '제목은 필수입니다.' },
        { status: 400 }
      );
    }

    // 제목으로 팝업 찾기
    const response = await notion.databases.query({
      database_id: POPUP_DATABASE_ID!,
      filter: {
        property: 'Title',
        rich_text: { contains: title }
      }
    });

    if (response.results.length === 0) {
      return NextResponse.json(
        { error: '팝업을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const pageId = response.results[0].id;

    // 팝업 삭제 (아카이브)
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });

    return NextResponse.json({ 
      message: '팝업이 성공적으로 삭제되었습니다.' 
    });
  } catch (error) {
    console.error('팝업 삭제 실패:', error);
    return NextResponse.json(
      { error: '팝업 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 새 팝업 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      imageUrl,
      displayLocation,
      pageSpecific,
      isActive,
      startDate,
      endDate,
      popupType,
      theme,
      position,
      autoClose,
      showCloseButton,
      allowOutsideClick,
      priority,
      order,
      targetUsers,
      showOnce,
    } = body;

    // 필수 필드 검증
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const response = await notion.pages.create({
      parent: { database_id: POPUP_DATABASE_ID! },
      properties: {
        Title: {
          title: [{ text: { content: title } }],
        },
        Content: {
          rich_text: [{ text: { content: content } }],
        },
        ...(imageUrl && { ImageUrl: { url: imageUrl } }),
        DisplayLocation: {
          select: { name: displayLocation || 'home' },
        },
        ...(pageSpecific && { PageSpecific: { rich_text: [{ text: { content: pageSpecific } }] } }),
        IsActive: {
          checkbox: isActive !== undefined ? isActive : true,
        },
        StartDate: {
          date: { start: startDate || new Date().toISOString().split('T')[0] },
        },
        EndDate: {
          date: { start: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        },
        PopupType: {
          select: { name: popupType || 'modal' },
        },
        Theme: {
          select: { name: theme || 'default' },
        },
        Position: {
          select: { name: position || 'center' },
        },
        AutoClose: {
          number: autoClose !== undefined ? autoClose : 0,
        },
        ShowCloseButton: {
          checkbox: showCloseButton !== undefined ? showCloseButton : true,
        },
        AllowOutsideClick: {
          checkbox: allowOutsideClick !== undefined ? allowOutsideClick : true,
        },
        Priority: {
          number: priority !== undefined ? priority : 1,
        },
        Order: {
          number: order !== undefined ? order : 1,
        },
        TargetUsers: {
          select: { name: targetUsers || 'all' },
        },
        ShowOnce: {
          checkbox: showOnce !== undefined ? showOnce : false,
        },
      },
    });

    return NextResponse.json({ 
      message: '팝업이 성공적으로 생성되었습니다.',
      id: response.id 
    });
  } catch (error) {
    console.error('팝업 생성 실패:', error);
    return NextResponse.json(
      { error: '팝업 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
