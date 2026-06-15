import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";

/**
 * header와 footer를 삽입한 화면 출력
 * @constructor
 */
export default function ProductsCombinedPage() {
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
        <div>
            {/* header는 props를 전달 받지 못하는 정적컴포넌트 */}
            <Header />
            <main style={{ padding: '20px', minHeight: '60vh' }}>
                <h2> 상품 목록 </h2>
                <p> 총 {products.length}</p>
                <div>
                    {products.map((product) => (
                        <ProductCard key={ product.id } product={product} />
                    ))}
                </div>
            </main>
            {/* footer는 props를 전달 받지 못하는 정적컴포넌트 */}
            <Footer />
        </div>
    );
}