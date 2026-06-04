import { NextResponse } from 'next/server'

export async function GET() {
    console.log('스크래핑 시작 .....');

    const response = await fetch('https://invalid-domain-that-does-not-exist.com/api/test');
    const data = await response.json();
    return NextResponse.json({
        success: true,
        data: data
    })
}