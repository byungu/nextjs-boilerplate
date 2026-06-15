'use client';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

type PriceHistory = {
    price: number;
    collected_at: string;
};

type Props = {
    history: PriceHistory[];
};

/**
 * 커스텀 툴팁 - 차트의 데이터 포인트에 마우스를 올렸을 때 표시
 */
type TooltipProps = {
    active?: boolean;
    payload?: Array<{
        payload: {
            date: string;
            price: number;
        };
    }>;
};

function CustomTooltip({ active, payload }: TooltipProps) {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-sm text-gray-600 mb-1">{data.date}</p>
            <p className="text-lg font-bold text-blue-600">
                {data.price.toLocaleString()}원
            </p>
        </div>
    );
}

export default function PriceChart({ history }: Props) {
    // 1. 빈 데이터 처리 - 데이터가 없으면 안내 메시지 표시
    if (history.length === 0) {
        return (
            <div className="w-full bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">가격 변동 추이</h2>
                <div className="h-80 flex items-center justify-center text-gray-500">
                    수집된 가격 데이터가 없습니다.
                </div>
            </div>
        );
    }

    // 2. Recharts용 데이터 변환
    // ISO 날짜 문자열을 읽기 쉬운 형식으로 변환 ("2024-01-01T09:00:00.000Z" -> "1/1 09:00")
    const chartData = history.map(item => {
        const date = new Date(item.collected_at);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return {
            date: `${month}/${day} ${hours}:${minutes}`,
            price: item.price
        };
    });

    // 3. 통계 계산 - 가격 히스토리로부터 주요 통계 추출
    const prices = history.map(h => h.price);
    const stats = {
        current: prices[prices.length - 1], // 배열의 마지막 = 최신 가격
        lowest: Math.min(...prices),        // 기간 내 최저가
        highest: Math.max(...prices),       // 기간 내 최고가
        average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) // 평균
    };

    // 4. 가격 변동률 계산
    const firstPrice = prices[0];
    const changeAmount = stats.current - firstPrice;
    const changePercent = ((changeAmount / firstPrice) * 100).toFixed(2);
    const isIncreased = changeAmount >= 0; // 상승인지 하락인지

    return (
        <div className="w-full bg-white rounded-lg shadow p-6">
            {/* 제목 + 변동률 표시 */}
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold">가격 변동 추이</h2>
                {/* 상승은 빨간색 ▲, 하락은 파란색 ▼ */}
                <span className={`text-sm font-semibold ${isIncreased ? 'text-red-600' : 'text-blue-600'}`}>
          {isIncreased ? '▲' : '▼'} {Math.abs(Number(changePercent))}%
        </span>
            </div>

            {/* 통계 정보 그리드 - 모바일에서는 2열, 데스크톱에서는 4열 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">현재 가격</p>
                    <p className="text-lg font-bold text-blue-600">
                        {stats.current.toLocaleString()}원
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">최저가</p>
                    <p className="text-lg font-bold text-green-600">
                        {stats.lowest.toLocaleString()}원
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">최고가</p>
                    <p className="text-lg font-bold text-red-600">
                        {stats.highest.toLocaleString()}원
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">평균가</p>
                    <p className="text-lg font-bold text-gray-700">
                        {stats.average.toLocaleString()}원
                    </p>
                </div>
            </div>

            {/* 차트 영역 - 모바일 256px, 데스크톱 320px 높이 */}
            <div className="h-64 md:h-80">
                {/* ResponsiveContainer: 부모 요소의 크기에 맞춰 자동으로 차트 크기 조절 */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        {/* SVG 그라데이션 정의 - 위쪽은 진하게, 아래쪽은 연하게 */}
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        {/* 격자선 - 점선 스타일 */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        {/* X축 - 날짜와 시간 표시 */}
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        {/* Y축 - 가격 표시, 만원 단위로 변환(30000 → 3만원) */}
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                            tickFormatter={(value) => {
                                if (value >= 10000) {
                                    return `${(value / 10000).toFixed(0)}만원`;
                                }
                                return `${(value / 1000).toFixed(0)}천원`;
                            }}
                        />
                        {/* 커스텀 툴팁 적용 */}
                        <Tooltip content={<CustomTooltip />} />
                        {/* 영역 차트 그리기 */}
                        <Area
                            type="monotone" // 부드러운 곡선
                            dataKey="price" // 데이터의 price 필드 사용
                            stroke="#2563eb" // 선 색상
                            strokeWidth={2} // 선 두께
                            fillOpacity={1} // 채우기 투명도
                            fill="url(#colorPrice)" // 위에서 정의한 그라데이션 적용
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}