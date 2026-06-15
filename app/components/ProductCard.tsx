/**
 * props 타입 정의
 * ? 기호를 사용하여 props를 선택적으로 만들 수 있음
 */
interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        category: string;
    };
}

/**
 * product card jsx 정의
 * ProductProps 의 타입을 product 변수에 대입 -> ({ product }: ProductCardProps)
 * @param param0
 * @param param0.product
 * @constructor
 */
export default function ProductCard({ product }: ProductCardProps) {
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