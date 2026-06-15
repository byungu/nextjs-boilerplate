import ProductCard from "@/app/components/ProductCard";

export default function ProductsWithPropsPage() {
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

    /* 이 부분이 랜더링되어 화면에 표출되는 부분 */
    return (
        <div style={{ padding: '20px '}}>
            <h1>상품 목록</h1>
            <p> 총 {products.length}개의 상품</p>
            <div>
                {/* product={ product } -> 이것이 props 의 전달 형태  */}
                {/* product.map 으로 순회하며 ProductCard에 값을 전달  */}
                {/* key -> product 의 고유값을 판별하기 위한 식별자 */}
                {products.map((product) => (
                    <ProductCard key={ product.id } product={ product } />
                ))}
            </div>
        </div>
    );
}