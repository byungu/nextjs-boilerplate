import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/styled/products/ProductCard";

export default function ProductsStyledPage() {
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
                    총 { products.length } 개의 상품
                </p>
                <div>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}