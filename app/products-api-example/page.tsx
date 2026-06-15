import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/styled/products/ProductCard';

async function getProducts() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 나중에 supabase로 대체될 데이터
    return [
        {
            id: '1',
            name: '무선 블루투스 이어폰',
            price: 29900,
            category: 'digital'
        },
        {
            id: '2',
            name: '스마트워치 프로',
            price: 199000,
            category: 'digital'
        },
        {
            id: '3',
            name: '노트북 울트라',
            price: 1299000,
            category: 'digital'
        },
        {
            id: '4',
            name: '태블릿 프로',
            price: 899000,
            category: 'digital'
        },
        {
            id: '5',
            name: '무선 마우스',
            price: 39000,
            category: 'digital'
        },
        {
            id: '6',
            name: '기계식 키보드',
            price: 129000,
            category: 'digital'
        }
    ];
}

// 서버 컴포넌트는 async 함수로 선언이 불가능함
// 일반 react 컴포넌트는 async가 될 수 없지만, Next.js 서버 컴포넌트는 가능함
export default async function ProductsApiExamplePage() {
    // await는 비동기 작업이 완료될 때까지 기다린다.
    // 이 줄은 getProducts()가 완료될 때까지 실행되지 않는다.
    // 따라서 products는 항상 데이터가 있는 상태

    const products = await getProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="p-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    상품 목록
                </h1>
                <p className="text-gray-600 mb-8">
                    총 { products.length }개의 상품
                </p>
                {/* Grid 레이아웃 : 모바일 1열, 태블릿 2열, 데스크톱 3열 " */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={ product.id } product={product} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}