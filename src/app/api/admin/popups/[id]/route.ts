import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';
import { Popup } from '@/types/notion';

const POPUP_DATABASE_ID = process.env.NOTION_POPUP_DATABASE_ID;

if (!POPUP_DATABASE_ID) {
  throw new Error('NOTION_POPUP_DATABASE_ID 환경변수가 설정되지 않았습니다.');
}

// 특정 팝업 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await notion.pages.retrieve({ page_id: id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (response as any).properties;

    const popup: Popup = {
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

    return NextResponse.json(popup);
  } catch (error) {
    console.error('팝업 조회 실패:', error);
    return NextResponse.json(
      { error: '팝업을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 팝업 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const response = await notion.pages.update({
      page_id: id,
      properties: {
        Title: {
          rich_text: [{ text: { content: title } }],
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
      message: '팝업이 성공적으로 수정되었습니다.',
      id: response.id 
    });
  } catch (error) {
    console.error('팝업 수정 실패:', error);
    return NextResponse.json(
      { error: '팝업 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 팝업 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await notion.pages.update({
      page_id: id,
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
