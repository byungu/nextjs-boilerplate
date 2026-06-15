import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/styled/products/ProductCard";

export default function ProductsGridPage() {
    /* 데이터 하드 코딩 */
    const products = [
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

                {/* Grid 레이아웃 : 모바일 1열, 태블릿 2열, 데스크톱 3열 */}
                <div className="grid grid-cols-1 md:grid-dols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}