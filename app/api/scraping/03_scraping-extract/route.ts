import { NextResponse } from 'next/server'

// typeScript  인터페이스(데이터 구조) 정의 interface는 객체의 구조를 정의하는 방법
// java의 vo
interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviewCount: number;
}

// API 응답 데이터의 인터페이스(구조) 정의
// java의 vo
interface ApiResponse {
    products: Product[];
    pagination: {
        hasNextPage: boolean;
    };
}

// 스크랩 데이터 인터페이스(구조) 정의
// java의 vo
interface ScrapedData {
    scrapedAt: string;
    category: string;
    totalProducts: number;
    products: Product[];
}

//상수 정의(전역변수) 변경되지 않는 고정 변수
const BASE_URL = "https://crawl-target-server.vercel.app";
const API_ENDPOINT = '/api/products';

export async function GET( request : Request)  {

    // URL 에서 쿼리 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    // 변수 정의 반복문에서 값이 변경되는 변수들
    const allProducts: Product[] = [];              // 추출된 상품 저장 배열
    let currentPage = 1;                    // 현재 처리중인 페이지
    let hasMorePages = true;                // 이후에 페이지가 더 있는지 확인 하는 변수
    console.log(`카테고리 "${category}" 의 상품 데이터 추출 시작...`);

    // 반복문
    while (hasMorePages) {
        // 변수로 동적 URL 생성
        const apiUrl = `${BASE_URL}${API_ENDPOINT}?page=${currentPage}&category=${category}&pageSize=10`;
        console.log(` 페이지 ${currentPage} 처리 중....`);

        // 실제 API 호출
        const response = await fetch(apiUrl);

        // JSON 데이터 JavaScript 객체로 변환
        const data: ApiResponse = await response.json();
        if(data.products && data.products.length > 0) {

            // 필요한 데이터만 추출하여 새로운 객체 생성
            const extractedProducts: Product[] = data.products.map((product: Product) => {
                return{
                    id: product.id,
                    name:product.name,
                    price:product.price,
                    rating:product.rating,
                    reviewCount:product.reviewCount
                };
            });

            // 추출된 상품들을 전체 목록에 추가
            allProducts.push(...extractedProducts);
            console.log(` 페이지 ${currentPage}: ${extractedProducts.length} 개 상품 추출 완료`);

            // pagination(다음 페이지 유무 변수) 사용하여 다음 페이지 존재 확인
            // ture 이면 다음페이지 이동
            if (data.pagination.hasNextPage) {
                currentPage += 1;                       // or currentPage++;
            } else {
                hasMorePages = false;                   // 페이지가 없으므로 페이지 반복문 종료
                console.log(`페이지 ${currentPage}에서 ${extractedProducts.length} 개 상품 발견 - 마지막 페이지`);
            }
        } else {
            // 데이터가 없을 시 반복문 종료
            hasMorePages = false;
            console.log(`페이지 ${currentPage}에서 데이터 없음 - 추출 완료`);
        }
    }
    // 스크래핑 시간 기록
    const scrapedAt = new Date().toISOString();     // 현재 시간을 ISO형식으로 변환

    // 최종 응답 결과 데이터 구성
    const ScrapedData: ScrapedData = {
        scrapedAt: scrapedAt,
        category: category,
        totalProducts: allProducts.length,
        products: allProducts
    };

    console.log(`총 ${allProducts.length}개 상품 추출 완료 - ${scrapedAt}`);

    // 클라이언트에 응답 데이터 전송
    return NextResponse.json({
        success: true,
        data: ScrapedData
    });
}