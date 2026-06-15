export default function CSSBasicsPage() {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>CSS 기본 개념 실습</h1>
            {/* 1. Margin과 Padding의 차이 */}
            <section style={{ marginTop: '40px' }}>
                <h2> 1. Margin과 Padding의 차이 </h2>
                <p style={{ color: '#666' }}>
                    margin은 요소 바깥의 공간이고, padding은 요소 안쪽의 공간이다.
                </p>
                <div style={{ margin:'30px', padding: '20px', border: '3px solid #2196F3', backgroundColor: '#E3F2FD' }}>
                    <p style={{ margin: 0}}>
                        이 박스는 margin 30px, padding 20px 입니다.
                        <br />
                        파란색 테두리와 배경색으로 영역을 확인할 수 있습니다.
                    </p>
                </div>
                <div style={{ margin:'10px', padding: '40px', border: '3px solid #4CAF50', backgroundColor: '#E8F5E9' }}>
                    <p style={{ margin: 0 }}>
                        이 박스는 margin 10px, padding 40px입니다.
                        <br />
                        padding이 크면 내용 주변 공간이 넓어집니다.
                    </p>
                </div>
            </section>

            <section style={{ marginTop: '60px' }}>
                <h2> 2. 색상과 크기 </h2>
                <div style={{ color: '#2196F3', fontSize: '24px', fontWeight: 'bold', marginTop: '20px'}}>
                    파란색, 24px, 굵은 텍스트
                </div>
                <div style={{ color: '#ff5722', fontSize: '18px', fontWeight: 'normal', marginTop: '10px'}}>
                    주황색, 18px, 일반 텍스트
                </div>
                <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '15px', marginTop: '20px', borderRadius: '8px' }}>
                    배경색과 텍스트 색상, 둥근 모서리
                </div>
            </section>

            {/* 3. Flexbox 레이아웃 */}
            <section style={{ marginTop: '60px' }}>
                <h2> 3. Flexbox 레이아웃 </h2>
                <p style={{ color: '#666' }}>
                    display: flex를 사용하면 요소들을 가로나 세로로 배치할 수 있습니다.
                </p>

                <div style={{
                    display: 'flex',       // Flexbox 활성화
                    gap: '10px',          // 요소 사이 간격
                    marginTop: '20px'
                }}>
                    <div style={{
                        flex: 1,            // 남은 공간을 균등하게 차지
                        padding: '20px',
                        backgroundColor: '#FFE0B2',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        박스 1
                    </div>

                    <div style={{
                        flex: 1,
                        padding: '20px',
                        backgroundColor: '#C5E1A5',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        박스 2
                    </div>

                    <div style={{
                        flex: 1,
                        padding: '20px',
                        backgroundColor: '#BBDEFB',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        박스 3
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',  // 세로 방향 배치
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#F8BBD0',
                        borderRadius: '8px'
                    }}>
                        세로 배치 1
                    </div>

                    <div style={{
                        padding: '15px',
                        backgroundColor: '#CE93D8',
                        borderRadius: '8px'
                    }}>
                        세로 배치 2
                    </div>
                </div>
            </section>
            {/* 4. 테두리와 그림자 */}
            <section style={{ marginTop: '60px' }}>
                <h2>4. 테두리와 그림자</h2>

                <div style={{
                    border: '2px solid #2196F3',  // 테두리: 두께, 스타일, 색상
                    borderRadius: '12px',          // 둥근 모서리
                    padding: '20px',
                    marginTop: '20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'  // 그림자 효과
                }}>
                    테두리와 둥근 모서리, 그림자가 있는 박스
                </div>

                <div style={{
                    border: '1px dashed #ff5722',  // 점선 테두리
                    borderRadius: '0px',           // 직각 모서리
                    padding: '20px',
                    marginTop: '20px'
                }}>
                    점선 테두리, 직각 모서리
                </div>
            </section>
            {/* 5. 텍스트 정렬 */}
            <section style={{ marginTop: '60px' }}>
                <h2>5. 텍스트 정렬</h2>

                <div style={{
                    textAlign: 'left',  // 왼쪽 정렬
                    padding: '15px',
                    backgroundColor: '#F5F5F5',
                    marginTop: '20px'
                }}>
                    왼쪽 정렬된 텍스트
                </div>

                <div style={{
                    textAlign: 'center',  // 가운데 정렬
                    padding: '15px',
                    backgroundColor: '#F5F5F5',
                    marginTop: '10px'
                }}>
                    가운데 정렬된 텍스트
                </div>

                <div style={{
                    textAlign: 'right',  // 오른쪽 정렬
                    padding: '15px',
                    backgroundColor: '#F5F5F5',
                    marginTop: '10px'
                }}>
                    오른쪽 정렬된 텍스트
                </div>
            </section>
        </div>
    )
}



