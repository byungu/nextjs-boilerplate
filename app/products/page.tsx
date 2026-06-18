// 서버 컴포넌트: URL 파라미터에서 검색어를 읽어서 데이터 가져오기
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductList from '@/app/components/ProductList'; // 클라이언트 컴포넌트
import supabase from '@/lib/supabase';

// 상품 타입 정의
type Product = {
    id: string;
    name: string;
    price: number;
    category: string;
};

// Supabase에서 상품 목록을 가져오는 함수
// query: 검색어 (있으면 필터링, 없으면 전체)
async function getProducts(query?: string): Promise<Product[]> {
    try {
        // Supabase 쿼리 실행
        let supabaseQuery = supabase
            .from('products')
            .select(` 
        product_id, 
        name, 
        price, 
        category, 
        collected_at 
      `)
            .order('collected_at', { ascending: false });

        // 검색어가 있으면 필터링
        // ilike: 대소문자 구분 없이 부분 일치 검색
        if (query?.trim()) {
            supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
        }

        const { data, error } = await supabaseQuery;

        if (error) {
            throw new Error(`Supabase 쿼리 실패: ${error.message}`);
        }

        if (!data) {
            return [];
        }

        // product_id별로 그룹화하여 각 상품의 최신 레코드만 선택
        const productMap = new Map<string, typeof data[0]>();
        data.forEach(item => {
            if (!productMap.has(item.product_id)) {
                productMap.set(item.product_id, item);
            }
        });

        // 프론트엔드 구조로 변환
        return Array.from(productMap.values()).map(item => ({
            id: item.product_id,
            name: item.name,
            price: Number(item.price),
            category: item.category
        }));

    } catch (error) {
        console.error('상품 목록 가져오기 실패 :', error);
        return [];
    }
}

// 서버 컴포넌트: async 함수로 선언하여 데이터를 가져옵니다
// searchParams: URL 파라미터를 받는 props
export default async function ProductsPage({searchParams}: { searchParams: Promise<{ q?: string }>; }) {
    // URL 파라미터에서 검색어 가져오기
    // 💡 사용하기 전에 반드시 await을 해주어야 합니다.
    const resolvedSearchParams = await searchParams;
    // 예: /products?q=노트북
    const query = resolvedSearchParams.q || '';

    // 검색어에 따라 필터링된 상품 목록 가져오기
    const products = await getProducts(query);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="p-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    상품 목록
                </h1>

                {/* 데이터가 없을 때 빈 상태 표시 */}
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">
                            {query ? `"${query}"에 대한 검색 결과가 없습니다.` : '등록된 상품이 없습니다.'}
                        </p>
                        {!query && (
                            <p className="text-gray-500 text-sm mt-2">
                                Supabase 대시보드에서 데이터를 추가하세요.
                            </p>
                        )}
                    </div>
                ) : (
                    // 클라이언트 컴포넌트에 필터링된 상품 목록 전달
                    <ProductList products={products} searchQuery={query} />
                )}
            </main>
            <Footer />
        </div>
    );
}