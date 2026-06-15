// Type 정의도 params가 Promise를 반환하도록 수정하는 것이 좋습니다.
import Link from "next/link";
import PriceChart from "@/app/components/PriceChart";
import supabase from "@/lib/supabase";

interface Props {
    params: {
        id: string; // params.id는 이제 product_id입니다 (3.5.3에서 변경됨)
    };
}

// 상품 정보를 가져오는 함수
// params.id는 이제 product_id입니다 (3.5.3에서 변경됨)
async function getProduct(productId: string) {
    try {
        // Supabase 쿼리: product_id로 특정 상품의 최신 레코드 조회
        // eq('product_id', productId): product_id 컬럼이 전달받은 productId와 일치하는 레코드
        // order('collected_at', { ascending: false }): 최신 레코드 먼저
        // limit(1): 최신 레코드 하나만
        // single(): 단일 레코드만 반환(배열이 아닌 객체)
        const { data, error } = await supabase
            .from('products')
            .select(`product_id,name,price,category`)
            .eq('product_id', productId)
            .order('collected_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            throw new Error(`상품 조회 실패: ${error.message}`);
        }

        if (!data) {
            return null;
        }

        // 데이터베이스 구조를 프론트엔드 구조로 변환
        return {
            id: data.product_id, // product_id를 id로 사용
            name: data.name,
            price: Number(data.price), // DECIMAL -> number 변환
            category: data.category
        };
    } catch (error) {
        console.error('상품 정보 가져오기 실패:', error);
        return null;
    }
}

// 가격 히스토리를 가져오는 함수
// 같은 product_id를 가진 모든 레코드를 collected_at 기준으로 정렬
async function getPriceHistory(productId: string) {
    try {
        // Supabase 쿼리: product_id로 필터링하여 가격 히스토리 조회
        // eq('product_id', productId): 같은 product_id를 가진 모든 레코드
        // order('collected_at', { ascending: true }): 수집 시간 순으로 정렬
        const { data, error } = await supabase
            .from('products')
            .select(`price, collected_at`)
            .eq('product_id', productId)
            .order('collected_at', { ascending: true });

        if (error) {
            throw new Error(`가격 히스토리 조회 실패: ${error.message}`);
        }

        if (!data) {
            return [];
        }

        // 데이터베이스 구조를 프론트엔드 구조로 변환
        return data.map(item => ({
            price: Number(item.price),
            collected_at: item.collected_at
        }));
    } catch (error) {
        console.error('가격 히스토리 가져오기 실패:', error);
        return [];
    }
}

// 서버 컴포넌트: async 함수로 선언하여 데이터를 가져옵니다
export default async function ProductDetailPage({ params }: Props) {
    // await로 상품 정보 가져오기
    // params.id는 이제 product_id입니다
    const product = await getProduct(params.id);

    // 상품 정보가 없으면 에러 페이지 표시
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">상품을 찾을 수 없습니다.</p>
                    <Link href="/products" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                    목록으로 돌아가기 11
                    </Link>
                </div>
            </div>
        );
    }

    // 상품 정보를 가져온 후 product_id로 히스토리 조회
    // params.id가 이미 product_id이므로 직접 사용
    const history = await getPriceHistory(params.id);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 최대 너비와 반응형 패딩 설정 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* 뒤로가기 버튼 - Link 컴포넌트로 클라이언트 사이드 네비게이션 */}
                <div className="mb-6">
                    <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    {/* SVG 아이콘 - 화살표 모양 */}
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    목록으로 돌아가기
                    </Link>
                </div>
                {/* 상품 기본 정보 카드 */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                    {/* 상품명과 카테고리 섹션 */}
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>
                        {/* 카테고리 배지 */}
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {product.category}
                        </span>
                    </div>
                    {/* 가격 표시 섹션 */}
                    <div className="p-6 bg-gray-50">
                        <div className="flex items-baseline gap-2">
                            <p className="text-5xl font-bold text-blue-600">
                                {product.price.toLocaleString()}
                            </p>
                            <span className="text-2xl text-gray-600">원</span>
                        </div>
                    </div>
                </div>

                {/* 가격 차트 섹션 - 3.4.2에서 만든 PriceChart 컴포넌트 사용 */}
                <div className="mb-6">
                    <PriceChart history={history} />
                </div>

                {/* 추가 정보 섹션 - 그리드 레이아웃으로 정보 표시 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">상품 정보</h2>
                    {/* 반응형 그리드: 모바일 1열, 데스크톱 3열 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 수집 데이터 개수 */}
                        <div className="border-l-4 border-blue-500 pl-4">
                            <p className="text-sm text-gray-600 mb-1">수집 데이터</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {history.length}개
                            </p>
                        </div>
                        {/* 최초 수집일 */}
                        <div className="border-l-4 border-green-500 pl-4">
                            <p className="text-sm text-gray-600 mb-1">최초 수집일</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {history.length > 0
                                    ? new Date(history[0].collected_at).toLocaleDateString('ko-KR')
                                    : '-'
                                }
                            </p>
                        </div>
                        {/* 최근 수집일 */}
                        <div className="border-l-4 border-purple-500 pl-4">
                            <p className="text-sm text-gray-600 mb-1">최근 수집일</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {history.length > 0
                                    ? new Date(history[history.length - 1].collected_at).toLocaleDateString('ko-KR')
                                    : '-'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}