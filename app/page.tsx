import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
    return (
        <div>
            {/* header는 props를 전달 받지 못하는 정적컴포넌트 */}
            <Header />
            <main style={{ padding: '20px', minHeight: '60vh' }}>
                <h1> 회사 소개 </h1>
                <p> 우리는 상품 가격을 추적하는 서비스를 제공합니다. </p>
            </main>
            {/* footer는 props를 전달 받지 못하는 정적컴포넌트 */}
            <Footer />
        </div>
    );
}