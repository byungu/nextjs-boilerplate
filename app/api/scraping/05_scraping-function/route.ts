import {NextResponse} from "next/server";

// 상품 vo
interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviewCount: number;
}

// api vo
interface ApiResponse {
    products: Product[];
    pagination: {
        hasNextPage: boolean;
    }
}

// 스크랩 데이터 vo
interface ScrapedData {
    scrapedAt: string;
    category: string;
    totalProducts: number;
    products: Product[];
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
            reviewCount: product.reviewCount
        };
    });
}

// 최종 응답 데이터를 구성하는 함수
function createScrapedData(Products: Product[], category: string): ScrapedData {
    const scrapedAt = new Date().toISOString();
    return {
        scrapedAt: scrapedAt,
        category: category,
        totalProducts: Products.length,
        products: Products
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    const allProducts: Product[] = [];
    let currentPage = 1;
    let hasMorePage = true;
    console.log(`카테고리 "${category}" 의 상품 데이터 추출 시작...`);

    // 반복문으로 순차 처리
    while (hasMorePage) {
        // 페이지 정보 데이터 호출 함수
        const pageData = await fetchPageData(currentPage, category);

        // 현재 페이지의 상품들이 있을 경우 처리(if 조건)
        if (pageData.products && pageData.products.length > 0) {

            // 함수를 사용해 상품 데이터 추출
            const extractedProducts = await extractProductData(pageData.products);

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
    const scrapedData = createScrapedData(allProducts, category);

    console.log(`총 ${allProducts.length}개 상품 추출 완료 - ${scrapedData}`);

    return NextResponse.json({
        success: true,
        data: scrapedData
    })
}

