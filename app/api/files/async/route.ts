import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join }  from 'path';

export async function GET() {
    try {
        //파일의 위치정보를 만드는 것
        // process.cwd() -> 프로젝트 루트 디렉토리 가져오는 함수
        const filePath = join(process.cwd(), 'data.txt');

        // 파일 작업을 비동기로 시작 (await 없이)
        processFileAsync(filePath);

        // 파일 작업이 완료되기를 기다리지 않고 즉시 응답.
        // 파일 작업은 백그라운드에서 독립적으로 처리 되기 때문에 응답은 바로 줄 수 있다.
        return NextResponse.json({
            success: true,
            message: '파일 처리 요청이 시작되었습니다.',
            status: 'processing'
        });
    } catch (error: unknown) {
        console.error('파일 처리 오류 : ', error);
        return NextResponse.json(
            {
            success: false, error: '파일 처리 중 오류 발생'
            },
            {
                status: 500
            }
        );
    }
}

// 백그라운드에서 파일을 처리하는 함수
async function processFileAsync(filePath: string) {
    try {
        // 파일 쓰기 (비동기 방식)
        await writeFile(filePath, 'Hello World!');
        console.log('파일 쓰기 완료');

        // 파일 읽기 (비동기 방식)
        const content = await readFile(filePath, 'utf8');
        console.log('파일 읽기 완료 : ', content);
    } catch (error: unknown) {
        console.error('백그라운드 파일 처리 오류 : ', error);
    }
}