
// Next.js 에서 제공하는 서버 관련 기능 모듈 import
import { NextResponse } from 'next/server';

// GET 요청을 처리하는 함수 생성
export async function GET() {
    //외부 서버에서 데이터를 가져오는 작업 시작
    // fetch는 웹이서 데이터를 가져오는 기본 방법
    const response = await fetch('https://crawl-target-server.vercel.app/api/products?category=living&page=1&pageSize=3');

    //서버에서 가져온 데이터를 JSON 형태로 변환
    const data = await response.json();

    // 성공적인 데이터 response 일경우 응답
    return NextResponse.json({
        success: true,
        data: {
            response: data,
            category: 'living',
            page: 1,
            pageSize: 3
        }
    });


}