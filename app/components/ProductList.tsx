'use client'; // useState와 useRouter를 사용하므로 클라이언트 컴포넌트 필요
import { useState } from 'react';  // 실제 사용자가 행하는 상태값을 저장하여 관리
import { useRouter } from 'next/navigation'; // 서버 컴포넌트를 관리
import ProductCard from '@/app/components/styled/products/ProductCard';

// 상품 타입 정의
type Product = {
    id: string;
    name: string;
    price: number;
    category: string;
};

// Props 타입 정의: 서버 컴포넌트에서 받은 필터링된 상품 목록과 검색어
type Props = {
    products: Product[];
    searchQuery: string;
};

export default function ProductList({ products, searchQuery: initialQuery }: Props) {
    // useState: 검색어 상태 (입력창용)
    // [상태값, 상태를 변경하는 함수] = useState(초기값)
    const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
    // useRouter: URL을 업데이트하기 위한 훅
    const router = useRouter();

    // 검색어 입력 시 URL 업데이트
    const handleSearch = (query: string) => {
        if (query.trim() === '') {
            // 검색어가 비어있으면 파라미터 제거
            router.push('/products');
        } else {
            // 검색어가 있으면 URL에 추가
            router.push(`/products?q=${encodeURIComponent(query)}`);
        }
    };

    // Enter 키 입력 시 검색 실행
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(searchQuery);
        }
    };

    return (
        <>
            {/* 검색 입력창 */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="상품명을 입력하세요..."
                    // value: 입력창의 값(상태와 연결)
                    // onChange: 입력값이 변경될 때마다 setSearchQuery 호출
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full md:w-96 px-4 py-2 border border-gray-300
          rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => handleSearch(searchQuery)}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg
          hover:bg-blue-700 transition-colors"
                >
                    검색
                </button>
            </div>

            {/* 검색 결과 개수 */}
            <p className="text-gray-600 mb-4">
                {products.length}개의 상품을 찾았습니다.
            </p>

            {/* 상품 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
      md:gap-6">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            {/* 검색 결과가 없을 때 */}
            {products.length === 0 && initialQuery.trim() !== '' && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {`"${initialQuery}"에 대한 검색 결과가 없습니다.`}
                    </p>
                </div>
            )}
        </>
    );
}