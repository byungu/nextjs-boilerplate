import { NextResponse } from 'next/server'

export async function GET() {
    try {
        console.log('스크래핑 시작 ....');
        const response = await fetch('https://invalid-domain-that-does-not-exist.com/api/test');
        const data = await response.json();
        return NextResponse.json({
            success: true,
            data: data
        })
    } catch(error: unknown) {
        console.log('네트워크 오류 발생:', error instanceof Error ? error.message : '알 수 없는 오류');
        return NextResponse.json({
            success: false,
            error: '네트워크 연결 오류',
            message: 'API 서버에 연결할 수 없습니다. 인터넷 연결을 확인하세요',
            handled: true,
            timestamp: new Date().toISOString()
        });
    }
}