export default function ProductsConditionalPage() {
    const currentMinute = new Date().getMinutes();

    const isEven = currentMinute % 2 === 0;
    const digitalProducts = [
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

    const fashionProducts = [
        {
            id: '4',
            name: '면 티셔츠',
            price: 19900,
            category: 'fashion'
        },
        {
            id: '5',
            name: '청바지',
            price: 59900,
            category: 'fashion'
        },
        {
            id: '6',
            name: '운동화',
            price: 89000,
            category: 'fashion'
        },
    ];
    const products = isEven ? digitalProducts : fashionProducts;
    const categoryName = isEven ? '디지털' : '패션';

    return (
        <div style={{padding:'20px'}}>
            <h1> 상품 목록 - {categoryName}</h1>
            <p>총 : { products.length } 개의 상품</p>
            <p style={{ color: 'gray', fontSize: '0.9em'}}>
                (현재 시각 : {currentMinute}분 = {isEven ? '짝수' : '홀수'} 분)
            </p>
            <p style={{ color: 'blue', fontSize: '0.9em'}}>
                페이지를 새로고침하면 시간에 따라 다른 카테고리가 표시됩니다.
            </p>
            <div>
                {products.map(product => (
                    <div key={product.id}>
                        <h2>{ product.name } </h2>
                        <p> 현재 가격: { product.price.toLocaleString() } 원 </p>
                        <p> 카테고리: { product.category } </p>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}