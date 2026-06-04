
// Next.js 에서 제공하는 서버 관련 기능 모듈 import
import { NextResponse } from 'next/server';

// 상수 정의
const BASE_URL = 'https://crawl-target-server.vercel.app';
const API_ENDPOINT = '/api/products';

// GET 요청을 처리하는 함수 생성
export async function GET(request : Request) {
    // URL에서 쿼리 파라미터 가져오기
    // 사용자가 브라우저에서 ?category=living&page=1&pageSize=3 같은 파라미터 입력했을때
    const { searchParams } = new URL(request.url);

    // URL 파라미터를 직접 가져와서 기본값 설정
    // || 연산자로 기본값 제공 : 파라미터가 없으면 기본값 사용
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category') || 'living';
    const pageSize = parseInt(searchParams.get('pageSize') || '3');

    // 상수와 파라미터를 조합하여 API URL 생성
    // 템플릿 리터럴 (백틱 `)을 사용하여 문자열을 동적으로 만듦
    const apiUrl = `${BASE_URL}${API_ENDPOINT}?category=${category}&page=${page}&pageSize=${pageSize}`;

    // 콘솔에 현재 요청 정보 출력
    console.log(`page = ${page}, 카테고리 = ${category}, 크기 = ${pageSize}`);

    // 실제 API 호출
    const response = await fetch(apiUrl);

    // JSON 데이터를 javascript 객체로 변환
    const data = await response.json();

    // 상품 개수 계산
    const productCount = data ? data.length : 0;

    // 결과를 콘솔에 출력
    console.log(`페이지 ${page} 에서 ${productCount}개 상품 발견`);

    // Client에 데이터 전달
    // 성공적인 데이터 response 일경우 응답
    return NextResponse.json({
        success: true,
        data: {
            page: page,
            category: category,
            pageSize: pageSize,
            productCount: productCount,
            response: data || []
        }
    });


}