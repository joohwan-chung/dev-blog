import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionByToken, getUserById, updateUser, createActivityLog } from '@/lib/notion';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    if (!sessionToken) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // Notion에서 세션 조회
    const session = await getSessionByToken(sessionToken.value);

    if (!session) {
      return NextResponse.json(
        { message: '유효하지 않은 세션입니다.' },
        { status: 401 }
      );
    }

    // 세션 만료 확인
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        { message: '세션이 만료되었습니다.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { message: '이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 확인 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { message: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 확인
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { message: '지원하지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 허용)' },
        { status: 400 }
      );
    }

    // 이미지 압축 및 리사이즈
    const arrayBuffer = await imageFile.arrayBuffer();
    let processedImage = sharp(arrayBuffer);
    let dataUrl: string;

    try {
      // 이미지 메타데이터 가져오기
      const metadata = await processedImage.metadata();

      // 이미지 리사이즈 (최대 128x128, 비율 유지)
      if (metadata.width && metadata.height) {
        const maxDimension = 128;
        if (metadata.width > maxDimension || metadata.height > maxDimension) {
          processedImage = processedImage.resize(maxDimension, maxDimension, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
      }
      
      // JPEG 품질 30%로 압축하여 크기 최대한 줄이기
      let compressedBuffer = await processedImage
        .jpeg({ quality: 30, progressive: true })
        .toBuffer();
      
      // Base64 크기 확인 (약 1800자 제한 - Notion URL 2000자 제한 고려)
      let base64 = compressedBuffer.toString('base64');
      const maxBase64Length = 1800; // Notion external URL 2000자 제한 고려
      
      // Base64가 너무 크면 품질을 더 낮춰서 재압축
      if (base64.length > maxBase64Length) {
        let quality = 20;
        while (base64.length > maxBase64Length && quality > 5) {
          compressedBuffer = await processedImage
            .jpeg({ quality, progressive: true })
            .toBuffer();
          base64 = compressedBuffer.toString('base64');
          quality -= 2;
        }
      }
      
      // 여전히 크기가 크면 이미지 크기를 더 줄임
      if (base64.length > maxBase64Length) {
        processedImage = sharp(arrayBuffer).resize(64, 64, {
          fit: 'inside',
          withoutEnlargement: true
        });
        compressedBuffer = await processedImage
          .jpeg({ quality: 15, progressive: true })
          .toBuffer();
        base64 = compressedBuffer.toString('base64');
      }

      dataUrl = `data:image/jpeg;base64,${base64}`;
      
      // 최종 크기 확인
      if (dataUrl.length > 2000) {
        console.warn(`Avatar data URL is still too large: ${dataUrl.length} characters`);
        return NextResponse.json(
          { message: '이미지가 너무 큽니다. 더 작은 이미지를 업로드해주세요.' },
          { status: 400 }
        );
      }
    } catch (sharpError) {
      console.error('Image processing error:', sharpError);
      return NextResponse.json(
        { message: '이미지 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 사용자 정보 업데이트
    const success = await updateUser(session.userId, {
      avatar: dataUrl,
      lastActive: new Date().toISOString(),
    });

    if (!success) {
      return NextResponse.json(
        { message: '아바타 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    // IP 주소와 User Agent 가져오기
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 활동 로그 생성
    await createActivityLog({
      userId: session.userId,
      action: 'upload_avatar',
      description: '사용자가 프로필 이미지를 업로드했습니다.',
      details: {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type,
      },
      ipAddress,
      userAgent,
    });

    // 업데이트된 사용자 정보 가져오기
    const updatedUser = await getUserById(session.userId);

    if (!updatedUser) {
      return NextResponse.json(
        { message: '업데이트된 사용자 정보를 가져올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 사용자 정보에서 비밀번호 제거
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: '아바타가 성공적으로 업로드되었습니다.',
      user: userWithoutPassword,
      avatar: dataUrl,
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
