This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing the page by modifying `app/pagepage.tsx`. The page auto-updates as you edit the file.
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 사용 라이브러리
puppeteer@21.5.2 -> 동적 사이트 스크래핑 node.js 라이브러리 버전은 21.5.2 버전 사용
## puppeteer 주요기능
- 웹 페이지 스크린 캡쳐
- PDF 생성
- 단일 페이지 크롤링
- 성능 테스트
- 자동화된 폼 제출
- javascript가 실행된 후의 최종 HTML 추출
## scv-writer
- 적절한 처리와 다양한 인코딩 지원하는 라이브러리 사용이 실제 프로젝트에서는 안정적임
## supabase 사용
npm install supabase/supabase-js -> 인스톨 명령
## Elasticsearch -> nori 한국어 특화 애널라이저 설정 (Elasticsearch Cloud)
- Elasticsearch 는 역인덱스와 애널라이저를 활용한 NoSQL 데이터 베이스
- 빠른검색과 실시간 분석 특화
- 
## lib 폴더는 모듈화 기본 폴더

## recharts -> react에 최적화된 간단하고 직관적인 차트 라이브러리
npm install recharts -> 인스톨

## 데이터의 흐름 시작
- app/products/page.tsx -> 로 웹이 시작됨
- getProducts() 함수로 데이터 베이스와 연결하여 데이터를 가져옴
- 
