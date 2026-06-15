const products  = [
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

function ProductCard() {
    const product = products[0];
    return (
        <div style={{
            border:'1px solid #ddd',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '8px',
            boxShadow:'0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent:'space-between',
                alignItems:'start'
            }}>
                <h2 style={{ margin: 0, fontSize: '1.5em' }}>{product.name}</h2>
                <span style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8em'
                }}>
                    추적 중
                </span>
            </div>
            <div style={{ marginTop: '10px'}}>
                <p style={{
                    fontSize: '1.3em',
                    fontWeight: 'bold',
                    color: '#2196F3',
                    margin: '8px 0'
                }}>
                    {product.price.toLocaleString()}원
                </p>
                <p style={{
                    fontSize: '0.9em',
                    color: '#666',
                    margin: '8px 0'
                }}>
                    카테고리: {product.category}
                </p>
            </div>
            <div style={{
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
            }}>
                <button style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    color: '#2196F3',
                    border: '1px solid #2196F3',
                    borderRadius: '4px',
                    cursor:'pointer'
                }}>
                    상세보기
                </button>
            </div>
        </div>
    );
}

export default function ProductsComponentPage() {
    return (
        <div style={{ padding: '20px '}}>
            <h1>상품 목록</h1>
            <p> 총 {products.length}개의 상품</p>
            <div>
                {/* product 컴포넌트를 세번 사용합니다.  */}
                <ProductCard />
                <ProductCard />
                <ProductCard />
            </div>
        </div>
    );
}