/* 상품 관련 데이터의 구조를 정의한 모듈 */

/**
 * product(상품) 데이터의 구조를 정의
 * export를 밖으 로 내보낼 수 있도록 선언하는 것
 */
export interface Product {
    id: string;                                 // 상품  ID
    name: string;                               // 상품명
    price: number;                              // 상품 현재 가격
    originalPrice: number;                      // 상품 원래 가격
    category: string;                           // 카테고리
    rating: number;                             // 평점
    reviewCount: number;                        // 리뷰 갯수
    specialOffer: string | boolean;             // 특가 여부 (원시 Y/N, 정제 후 true/false)
    sellerName: string;                         // 판매자 이름
    sellerEmail: string;                        // 판매자 메일
    collectedAt?: string;                       // 데이터 수집 시간
}

/**
 * 데이터베이스 저장용 인터페이스
 */
export interface ProductDB {
    id?: string;
    product_id: string;
    name: string;
    price: number;
    original_price: number;
    category: string;
    description?: string;
    rating: number;
    review_count: number;
    special_offer: string;
    seller_name: string;
    seller_email: string;
    collected_at?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * json 형식을 데이터베이스용 데이터 변환 함수
 */
export function productToDB(product: Product): ProductDB {
    return {
        product_id: product.id,
        name: product.name,
        price: product.price,
        original_price: product.originalPrice,
        category:product.category,
        rating:product.rating,
        review_count:product.reviewCount,
        special_offer: typeof product.specialOffer === 'boolean'
            ? (product.specialOffer ? 'Y' : 'N')
            : product.specialOffer.toString(),
        seller_name: product.sellerName,
        seller_email: product.sellerEmail,
        collected_at: product.collectedAt || new Date().toISOString()
    };
}

/**
 * DB 데이터를 json 형식으로 데이터 변환 함수
 */
export function dbToProduct(dbProduct: ProductDB): Product {
    return {
        id: dbProduct.product_id,
        name: dbProduct.name,
        price: dbProduct.price,
        originalPrice: dbProduct.original_price,
        category: dbProduct.category,
        rating: dbProduct.rating,
        reviewCount: dbProduct.review_count,
        specialOffer: dbProduct.special_offer === 'Y' ? true : dbProduct.special_offer === 'N' ? false : dbProduct.special_offer,
        sellerName: dbProduct.seller_name,
        sellerEmail: dbProduct.seller_email,
        collectedAt: dbProduct.collected_at
    };
}



/**
 * API 관련 데이터 구조 정의
 */
export interface ApiResponse {
    products: Product[];
    // 다음 페이지 존재 여부
    pagination: {
        hasNextPage: boolean;
    }
}

/**
 * 스크래핑 관련 데이터 정의
 */
export interface ScrapingConfig {
    baseUrl: string;
    timeout: number;
    userAgent: string;
}