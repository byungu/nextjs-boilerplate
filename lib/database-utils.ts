/* 스크래핑 데이터 데이터베이스 저장 모듈 */
/**
 * 사용 라이브러리 주입
 */
import { supabase } from './supabase';
import {Product, productToDB} from "@/lib/types/product";

/**
 * 상품 데이터 저장 함수
 */
export async function saveProducts(products: Product[]): Promise<{
    success: boolean;
    savedCount: number;
    errors: string[];
}> {
    const errors: string[] = [];
    let savedCount = 0;
    try{
        // 모든 상품 데이터 베이스 저장
         for (const product of products) {
             const productDB = productToDB(product);
             const { error: insertError } = await supabase
                 .from("products")
                 .insert([productDB]);
             if(insertError) {
                 errors.push(`저장 실패 (${product.name}): ${insertError.message}`);
             } else {
                 savedCount++;
             }
         }
         return {
             success: true,
             savedCount,
             errors
         };
    }catch (error) {
        const errorMessage = error instanceof Error ? error.message : '상품 저장 실패';
        errors.push(errorMessage);
        return {
            success: false,
            savedCount,
            errors
        }
    }
}