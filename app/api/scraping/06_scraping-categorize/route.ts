import {NextResponse} from "next/server";

// 상품 vo
interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviewCount: number;
    specialOffer: string;
}

// api vo
interface ApiResponse {
    products: Product[];
    pagination: {
        hasNextPage: boolean;
    }
}

interface CategorizedData {
    scrapedAt: string;              // 자료수집시간 : 자료형
    category: string;               // 카테고리 : 자료형
    totalProducts: number;          // 전체 상품 : 자료형
    priceCategories: {
        budget: Product[];          // 5만원 미만 가격 카테고리
        midRange: Product[];        // 5만원 ~ 20만원 미만 가격 카테고리
        premium: Product[];         // 20만원 이상 가격 카테고리
    };
    specialOffers: Product[];       // 특별 할인 상품
    topRated: Product[];            // 평점 4.5 이상 상품 카테고리
}

// 상수
const BASE_URL = 'https://crawl-target-server.vercel.app';
const API_ENDPOINT = '/api/products';

// API 에서 페이지 정보를 가져오는 함수
async function fetchPageData(page: number, category: string) : Promise<ApiResponse> {
    const apiUrl = `${BASE_URL}${API_ENDPOINT}?page=${page}&category=${category}&pageSize=10`;
    console.log(`페이지 ${page} 데이터 가져오는 중....`);

    const response = await fetch(apiUrl);
    return await response.json();
}

// 필요한 필드만 추출하여 새로운 객체를 만드는 함수
function extractProductData(rawProducts: Product[]): Product[] {
    return rawProducts.map((product: Product) => {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            rating: product.rating,
            reviewCount: product.reviewCount,
            specialOffer: product.specialOffer
        };
    });
}

function categorizeProducts(products: Product[]) : CategorizedData {
    const budget: Product[] = [];               // 5만원 미만
    const midRange: Product[] = [];             // 5만원 이상 ~ 20만원 이하
    const premium: Product[] = [];              // 20만원 이상
    const specialOffers: Product[] = [];        // 특별 할인 상품
    const topRated: Product[] = [];             // 평점 4.5 이상

    products.forEach(product => {

        if(product.price < 50000) {
            budget.push(product);
            console.log(`예산 상품 : ${product.name} - ${product.price.toLocaleString()} 원`);
        } else if (product.price <= 200000) {
            midRange.push(product);
            console.log(`중간값 상품 : ${product.name} - ${product.price.toLocaleString()} 원`);
        } else {
            premium.push(product);
            console.log(`프리미엄 상품 : ${product.name} - ${product.price.toLocaleString()} 원`);
        }

        if(product.specialOffer === 'Y') {
            specialOffers.push(product);
            console.log(`특별 할인 상품 : ${product.name} - ${product.price.toLocaleString()} 원`);
        }

        if(product.reviewCount >= 4.5) {
            topRated.push(product);
            console.log(`고평점 상품 : ${product.name} - 평점 ${product.rating}`);
        }
    });

    return {
        scrapedAt: new Date().toISOString(),
        category: 'all',
        totalProducts: products.length,
        priceCategories: {
            budget,
            midRange,
            premium
        },
        specialOffers,
        topRated
    };
}

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category')||'all';
    const allProducts: Product[] = [];
    let currentPage = 1;
    let hasMorePage = true;
    console.log(`카테고리 "${category}" 의 상품 데이터 추출 시작...`);

    while(hasMorePage) {
        const pageData = await fetchPageData(currentPage, category);
        if(pageData.products && pageData.products.length > 0) {

            const extractedProducts = extractProductData(pageData.products);

            allProducts.push(...extractedProducts);
            console.log(` 페이지 ${currentPage}: ${extractedProducts.length} 개 상품 추출 완료`);

            if (pageData.pagination.hasNextPage) {
                currentPage += 1;
            } else {
                hasMorePage = false;
                console.log(`페이지 ${currentPage}에서 ${extractedProducts.length} 개 상품 발견 - 마지막 페이지`);
            }

        }else {
            hasMorePage = false;
            console.log(`페이지 ${currentPage}에서 데이터 없음 - 추출 완료`);
        }
    }
    // 조건문을 사용하여 상품 분류
    const categorizedData = categorizeProducts(allProducts);
    console.log(`총 ${allProducts.length} 개 상품 추출 완료`);
    console.log(`예산 상품 ${categorizedData.priceCategories.budget.length} 개`);
    console.log(`중간가 상품 ${categorizedData.priceCategories.midRange.length} 개`);
    console.log(`프리미엄 상품 ${categorizedData.priceCategories.premium.length} 개`);
    console.log(`특별 할인 상품 ${categorizedData.specialOffers.length} 개`);
    console.log(`고평점 상품 ${categorizedData.topRated.length} 개`);

    return NextResponse.json({
        success: true,
        data: categorizedData
    });
}