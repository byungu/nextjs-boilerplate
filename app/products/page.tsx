import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/styled/products/ProductCard';
import supabase from "@/lib/supabase";

async function getProducts() {
    try {
        // Supabase 쿼리 실행
        // from('products'): products 테이블 선택
        // select(): 필요한 칼럼만 선택하여 네트워크 비용 절약
        // product_id: 상품 고유 ID ( 그룹화 기준이자 상세 페이지 링크용 )
        // collected_at: 수집 시간 ( 최신 레코드 판별용 )
        // order(): collected_at 기준 내립차순 정렬(최신 데이터가 먼저)

        const {data, error} = await supabase
            .from("products")
            .select(`
            product_id,
            name,
            price,
            category,
            collected_at
            `)
            .order('collected_at', {ascending: false});

        if (error) {
            throw new Error(`Supabase 쿼리 실패: ${error.message}`);
        }

        if (!data) {
            return []
        }

        // product_id별로 그룹화하여 각 상품의 최신 레코드만 선택
        // Map을 사용하여 각 product_id별로 첫 번째(최신) 레코드만 유지
        // collected_at 기준으로 이미 내림차순 정렬되어 있으므로, 첫 번째 레코드가 최신
        const productMap = new Map<string, typeof data[0]>();
        data.forEach(item => {
            // 이미 해당 product_id의 레코드가 없으면 추가(최신 레코드만 유지)
            // 정렬 순서상 첫 번째로 만나는 product_id가 항상 최신이므로 추가만 하면 됨
            if (!productMap.has(item.product_id)) {
                productMap.set(item.product_id, item);
            }
        });

        // Map의 값들을 배열로 변환하고 프론트엔드 구조로 변환
        // id: product_id를 그대로 사용 (상세 페이지에서도 product_id 사용)
        // DECIMAL 타입의 price를 number로 변환
        return Array.from(productMap.values()).map(item => ({
            id: item.product_id,
            name: item.name,
            price: Number(item.price),
            category: item.category
        }));

    } catch (error) {
        // 에러 발생 시 콘솔에 로그 출력
        // product_id를 id로 사용
        // DECIMAL → number 변환
        // 프로덕션에서는 에러 로깅 서비스에 전송하는 것이 좋습니다
        console.error('상품 목록 가져오기 실패:', error);
        // 빈 배열을 반환하여 앱이 계속 작동하도록 합니다
        return [];
    }
}

// 서버 컴포넌트: async 함수로 선언하여 데이터를 가져옵니다
export default async function ProductsPage() {
    // await로 데이터 가져오기
    const products = await getProducts();

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
                            등록된 상품이 없습니다.
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Supabase 대시보드에서 데이터를 추가하세요.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-8">
                            총 {products.length}개의 상품
                        </p>
                        {/* Grid 레이아웃: 모바일 1열, 태블릿 2열, 데스크톱 3열 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* map 함수로 products 배열을 반복하여 ProductCard를 렌더링합니다 */}
                            {/* key는 product_id를 사용 (상세 페이지에서도 product_id 사용) */}
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}