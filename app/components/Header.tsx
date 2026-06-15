import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header style={{
            borderBottom: '1px solid #ddd',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        }}>
            <Image
                src="/next.svg"
                alt="Next.js 로고"
                width={120}
                height={24}
            />
            <div style={{ flex: 1 }}>
                <h1 style={{ margin:0 }}> 상품 추적 시스템 </h1>
                <nav style={{ marginTop: '10px' }}>
                    <Link href="/products-combined"> 상품 목록 </Link>
                </nav>
            </div>
        </header>
    );
}