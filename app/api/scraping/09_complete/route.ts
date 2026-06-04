import {NextResponse} from 'next/server'

const BASE_URL = 'https://crawl-target-server.vercel.app';
const API_ENDPOINT = '/api/products';
const TIMEOUT = 5000;                                       // 5초 타임아웃

interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviewCount: number;
    specialOffer: string;
}

interface ApiResponse {
    products: Product[];
    pagination: {
        hasNextPage: boolean;
    }
}

interface ProcessedProduct {
    id: number;
    name: string;
    price: number;
    priceNumber: number;
    category: string;
    rating: number;
    description: string;
    image: string;
}

interface CategoryGroups {
    [category: string]: ProcessedProduct[];
}

interface CompleteProgramResult {
    products: ProcessedProduct[];
    categories: CategoryGroups;
    statistics: {
        total: number;
        avgPrice: number;
        avgRating: number;
        categoryCount: number;
    };
    processing: {
        totalItems: number;
        validItems: number;
        invalidItems: number;
    };
}

async function getProductData(page: number = 1, category: string = 'all'):

    Promise<Product[]> {
    try {
        const apiUrl = `${BASE_URL}${API_ENDPOINT}?page=${page}&category=${category}&pageSize=10`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
        const response = await fetch(apiUrl, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScrapingBot/1.0)',
                'Accept': 'application/json',
            }
        });

        clearTimeout(timeoutId);

        if(!response.ok) {
            throw new Error(`HTTP ${response.status} : ${response.statusText}`);
        }

        // api로 호출한 데이터를 product interface로 객테 리턴
        const data: ApiResponse = await response.json();
        console.log('API 호출 완료');
        return data.products;

    } catch (error: unknown) {
        if(error instanceof Error) {
            if(error.name === 'AbortError') {
                throw new Error(`API 호출 시간 초과 (${TIMEOUT}ms)`);
            }
            throw new Error(`API 호출 실패 : ${error.message}`);
        }else {
            throw new Error(`API 호출 중 알 수 없는 오류 발생`);
        }
    }
}

// 상품 정보 처리 및 검증
function processProductInfo(products: Product[]): {
    processedProducts: ProcessedProduct[];
    processing: {
        totalItems: number;
        validItems: number;
        invalidItems: number;
    };
} {
    try {
        const processedProducts: ProcessedProduct[] = [];
        const totalItems = products.length;
        let validItems = 0;
        products.forEach((product, index) => {
            try {
                //데이터 유효성 검사
                 if(product.name && product.price && product.price > 0) {
                     validItems++;
                     processedProducts.push({
                         id: validItems,
                         name: product.name,
                         price: parseInt(product.price.toLocaleString()),
                         priceNumber: product.price,
                         category: 'all',
                         rating: product.rating || 0,
                         description: `평점: ${product.rating}/5, 리뷰: ${product.reviewCount}개 `,
                         image: product.specialOffer === 'Y' ? '특별할인' : '일반상품'
                     });
                 }
            } catch (elementError: unknown) {
                console.log(` 경고: ${index + 1} 번째 상품 처리 중 오류: ${elementError instanceof Error ? elementError.message : '알 수 없는 오류'}`);
            }
        });

        console.log(`처리 결과: 전체 ${totalItems}개 중 ${validItems} 개 추출 성공`);
        return {
            processedProducts,
            processing: {
                totalItems,
                validItems,
                invalidItems: totalItems - validItems
            }
        };
    } catch (error: unknown) {
        throw new Error(`데이터 처리 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
}

function groupByCategory(products: ProcessedProduct[]): CategoryGroups {
    const categories: CategoryGroups = {};
    products.forEach((product) => {
        const category = product.category;
        if(!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(product);
    });
    return categories;
}

//통계 계산
function calculateStatistics(products: ProcessedProduct[]): {
    total: number;
    avgPrice: number;
    avgRating: number;
    categoryCount: number;
} {
    if(products.length === 0) {
        return {total: 0, avgPrice: 0, avgRating: 0, categoryCount: 0};
    }

    const avgPrice = products.reduce((sum, p) => sum + p.priceNumber, 0) / products.length;
    const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    const categoryCount = new Set(products.map(p =>  p.category)).size;

    return {
        total: products.length,
        avgPrice: Math.round(avgPrice),
        avgRating: Number(avgRating.toFixed(1)),
        categoryCount
    };
}

// 결과 로깅(서버)
function logResult(result: CompleteProgramResult): void {
    console.log('\n' + '='.repeat(60));
    console.log('추출된 상품 목록');
    console.log('='.repeat(60));

    if(result.products.length === 0) {
        console.log('추출된 상품이 없습니다.');
        return;
    }

    // 카테고리별로 분류하여 출력
    Object.keys(result.categories).forEach(categoryName => {
        console.log(`\n카테고리: ${categoryName}`);
        console.log('-'.repeat(60));
        result.categories[categoryName].forEach(product => {
            console.log(`${product.id}. ${product.name}`);
            console.log(`   가격 : ${product.price}`);
            console.log(`   폄정 : ${product.rating}`);
            console.log(`   설명 : ${product.description.substring(0, Math.min(50, product.description.length))}...`);
            console.log('');
        });
    });

    console.log('='.repeat(60));
    console.log(`총 : ${result.statistics.total} 개의 상품을 추출했습니다.`);
    console.log(`평균 가격 : ${result.statistics.avgPrice.toLocaleString()} 원`);
    console.log(`평균 평점 : ${result.statistics.avgRating}/5`);
    console.log(`카테고리 수 : ${result.statistics.categoryCount} 개`);
}

//메인 함수
async function executeCompleteProgram(category: string = 'all'): Promise<CompleteProgramResult> {
    try {
        console.log('완성된 데이터 추출 프로그램 시작.....\n');

        const allProducts: Product[] = [];
        let currentPage = 1;
        let hasMorePages = true;
        console.log(`카테고리 "${category}" 의 상품 데이터 수집 시작...`);

        while(hasMorePages) {
            try{
                const pageData = await getProductData(currentPage, category);
                if(pageData && pageData.length > 0) {

                    allProducts.push(...pageData);
                    console.log(` 페이지 ${currentPage}: ${pageData.length} 개 상품 추출 완료`);

                    if (pageData.length >= 10) {
                        currentPage += 1;
                    } else {
                        hasMorePages = false;
                        console.log(`페이지 ${currentPage}에서 ${pageData.length} 개 상품 발견 - 마지막 페이지`);
                    }

                }else {
                    hasMorePages = false;
                    console.log(`페이지 ${currentPage}에서 데이터 없음 - 추출 완료`);
                }
            } catch (pageError: unknown) {
                console.log(`페이지 ${currentPage} 처리 중 오류 : ${pageError instanceof Error ? pageError.message :'알 수 없는 오류'}`);
                currentPage++;

                if(currentPage > 10 ) {
                    hasMorePages = false
                }
            }
        }

        const { processedProducts, processing } = processProductInfo(allProducts);
        const categories = groupByCategory(processedProducts);
        const statistics = calculateStatistics(processedProducts);
        const result: CompleteProgramResult = {
            products: processedProducts,
            categories,
            statistics,
            processing
        };

        logResult(result);
        console.log();
        return result;
    } catch (error: unknown) {
        console.log('\n 데이터 추출 실패 :', error instanceof Error ? error.message : '알 수 없는 오류');

        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        if(errorMessage.includes('ENOTFOUND')) {
            console.log('인터넷 연결을 확인하세요');
        } else if(errorMessage.includes('시간 초과')) {
            console.log('네트워크가 느립니다. 잠시후 다시 시도하세요');
        } else if(errorMessage.includes('404')) {
            console.log('API 주소를 확인하세요');
        } else if(errorMessage.includes('API 호출 실패')) {
            console.log('API 서버 상태를 확인하세요');
        }
        throw error;
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category')||'all';
        const result = await executeCompleteProgram(category);
        return NextResponse.json({
            status: 200,
            success: true,
            data: result,
            message: '완성된 프로그램 실행 성공'
        });
    }catch(error: unknown) {
        return NextResponse.json({
            success: false,
            error: '완성된 프로그램 실행 실패',
            details: error instanceof Error ? error.message : '알 수 없는 오류'
        },
            { status: 500}
        );
    }
}