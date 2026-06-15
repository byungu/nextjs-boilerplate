export default function TailwindBasicsPage() {
    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-10">Tailwind CSS 실습</h1>

            <section className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">1. Margin과 Padding</h2>
                <p className="text-gray-600 mb-6">
                    margin은 요소 바깥의 공간이고, padding은 요소 안쪽의 공간이다.
                </p>
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">인라인 스타일 : </h3>
                    <div style={{ margin:'30px', padding: '20px', border: '3px solid #2196F3', backgroundColor: '#E3F2FD' }}>
                        <p style={{ margin: 0}}>
                            이 박스는 margin 30px, padding 20px 입니다.
                            <br />
                            파란색 테두리와 배경색으로 영역을 확인할 수 있습니다.
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">tailwind CSS : </h3>
                    <div className="mb-8 p-5 border-4 border-blue-500 bg-blue-50">
                        <p className="m-0">
                            m-8 (margin 32px = 4*8(m) argin), p-5 (padding 20px = 4*5 (p) adding)
                            <br />
                            파란색 테두리와 배경색으로 영역을 확인할 수 있습니다.
                        </p>
                    </div>
                </div>
                {/* mt = marginTop, m = margin, p = padding */}
                <div className="mt-4">
                    {/* border-4 = 테두리 두께 4px, border-green-500 = 가장자리-초록-밝기 (50 - 950범위), bg-green-50 = 배경-초록-밝기(50 - 950범위) */}
                    <div className="m-2 p-10 border-4 border-green-500 bg-green-50"></div>
                </div>
            </section>
        </div>
    )
}



