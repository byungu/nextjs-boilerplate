
// Next.js 에서 제공하는 서버 관련 기능 모듈 import
import {NextResponse} from 'next/server'

// 상수 정의 (전역변수)
const BASE_URL = 'https://crawl-target-server.vercel.app';  // 기본 대상 서버 주소
const API_ENDPOINT = '/api/products';                       // API 경로

// GET 요청 처리 함수 정의
export async function GET( request : Request) {
    // URL 쿼리 파라미터 가져오기
    // 사용자가 브라우저에서 ?이후로 입력된 파라미터 가져오기
    const { searchParams } = new URL( request.url );                        // url에서 parameter 추출
    const category = searchParams.get('category') || 'all';    // 카테고리 파라미터 추출 없으면 all

    // 변수 정의 : 반복문에서 값이 변경되는 변수
    const allProducts : any[] = [];     // 모든 상수를 저장할 배열
    let currentPage = 1;
    let hashMorePages = true;

    // 콘솔로 메세지 출력
    console.log(`카테고리 "${category}" 의 모든 상품 수집 시작 .....`);

    // 반복문으로 순차적 처리
    while (hashMorePages) {
        const apiUrl = `${BASE_URL}${API_ENDPOINT}?page=${currentPage}&category=${category}&pageSize=10`;
        console.log(` 페이지 ${currentPage} 처리 중 .....`);

        // API 호출
        const response = await fetch(apiUrl);
        // JSON 데이터 Javascript 객체로 변환
        const data = await response.json();
        // 서버 부하 방지를 위해 대기 시간 설정
        await new Promise(resolve => setTimeout(resolve, 100));

        if(data.products && data.products.length > 0) {
            // 스프레드 연산자(...)를 사용하여 배열의 모든 요소를 배열에 추가
            allProducts.push(...data.products);
            console.log(` 페이지 ${currentPage} : ${data.products.length} 개 상품 추가`);

            // pagination 정보를 사용하여 다음 페이지 존재여부 확인
            if(data.pagination.hasNextPage) {
                currentPage++;              // 페이지 숫자 증가
            } else {
                hashMorePages = false;      // 더 이상 페이지가 없어서 반복문 종료
                console.log(`페이지 ${currentPage} 에서 ${data.products.length} 개 상품 발견 - 마지막 페이지`);
            }
        } else {
            // 데이터 없을 시 반복문 종료
            hashMorePages = false;
            console.log(`페이지 ${currentPage} 에서 데이터 없음 - 수집 완료`);
        }
    }

    // 수집된 상품들을 콘솔에 출력
    allProducts.forEach((product, index:number) => {
        console.log(`${index + 1} 번째 상품 : `, product.name, `${product.price.toLocaleString()} 원`);
    });
    // 최종결과를 출력
    console.log(` 총 ${allProducts.length} 개 상품 정보 수집 완료`);

    // Client 에게 응답데이터 전송

    return NextResponse.json({

        success: true,
        data: allProducts,
        total: allProducts.length,
        category: category,
        pagesProcessed: currentPage
    });
}