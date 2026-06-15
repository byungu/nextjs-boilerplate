import Link from "next/link";

/**
 * props 타입 정의
 * ? 기호를 사용하여 props를 선택적으로 만들 수 있음
 */
interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        category: string;
    };
}

/**
 * product card jsx 정의
 * ProductProps 의 타입을 product 변수에 대입 -> ({ product }: ProductCardProps)
 * @param param0
 * @param param0.product
 * @constructor
 */
export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover: shadow-md transition-shadow p-5 mb-5">
            {/* 헤더: 상품명과 추적중 태그 */}
            <div className="flex justify-between items-start mb-3">
                <h2 className="font-bold text-xl text-gray-900 m-0 flex-1">
                    {product.name}
                </h2>
                <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded ml-3 whitespace-nowrap">
                    추적중
                </span>
            </div>

            {/* 가격과 카테고리 */}
            <div className="mt-2">
                <p className="text-2xl font-semibold text-blue-600 mb-2">
                    { product.price.toLocaleString() } 원
                </p>
                <p className="text-sm text-gray-500">
                    카테고리 : { product.category }
                </p>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href={`/products/${product.id}`}
                      className="block w-full py-2 px-4 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" aria-label={`${product.name} 상세 보기`}>
                    상세보기
                </Link>
            </div>
        </div>
    );
}