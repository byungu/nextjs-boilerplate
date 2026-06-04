import { client } from "./elasticsearch";
import { Product, productToDB } from "@/lib/types/product";
const INDEX_NAME = process.env.ELASTICS_IDEX_NAME || 'products';

interface BulkResponseItem {
    index?: {
        error?: {
            reason: string;
        };
    };
}

interface BulkResponse {
    errors?: boolean;
    items: BulkResponseItem[];
}

/**
 * 인덱스가 존재하지 않는 경우 인덱스 생성
 */
export async function createIndexIfNotExists(): Promise<void> {
    try {
        const exists = await client.indices.exists({ index: INDEX_NAME });
        if (!exists) {
            console.log(`인덱스 ${INDEX_NAME} 생성 중.....`);
            await client.indices.create({
                index: INDEX_NAME,
                mappings: {
                    properties: {
                        id: {
                            type: 'keyword'
                        },
                        name: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword',
                                    ignore_above: 256
                                }
                            }
                        },
                        price: {
                            type: 'float'
                        },
                        originalProce: {
                            type: 'float'
                        },
                        discountRate: {
                            type: 'float'
                        },
                        cetegory: {
                            type: 'keyword'
                        },
                        brand: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword',
                                    ignore_above: 256
                                }
                            }
                        },
                        rating:{
                            type: 'float'
                        },
                        reviewCount: {
                            type: 'integer'
                        },
                        imageUrl: {
                            type: 'keyword'
                        },
                        productUrl: {
                            type: 'keyword'
                        },
                        scrapedAt: {
                            type: 'date'
                        },
                        createdAt: {
                            type: 'date'
                        },
                        description: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword',
                                    ignore_above: 256
                                }
                            }
                        }
                    }

                }
            });
            console.log(`인덱스 ${INDEX_NAME} 생성 완료`);
        } else {
            console.log(`인덱스 ${INDEX_NAME} 이미 존재함`);
        }
    }catch(error) {
        console.log('인덱스 생성 오류: ', error);
        throw error;
    }
}

/**
 * 상품 데이터를 엘라스틱 클라우드에 벌크 저장
 * @param products
 */
export async function saveProductsToElasticsearch(products: Product[]): Promise<{
    success: boolean;
    savedCount: number;
    errors: string[];
}> {
    const errors: string[] = [];
    let savedCount = 0;
    try {
        // 인덱스가 없으면 생성
        await createIndexIfNotExists();

        // 벌크 삽입을 위한 데이터 준비
        const bulkBody = [];
        for (const product of products) {
            const productDB = productToDB(product);

            // 벌크 삽입을 위한 메타데이터와 문서 데이터 추가
            bulkBody.push({
                index: {
                    _index: INDEX_NAME,
                }
            });
            bulkBody.push({productDB});
        }

        // 벌크 삽입 실행
        const response = await client.bulk({
            body: bulkBody,
        }) as BulkResponse;

        // 벌크 응답에서 성공/실패 개수 확인
        if(response.errors) {
            response.items.forEach((item: BulkResponseItem, index: number) => {
                if(item.index?.error) {
                    const product = products[index];
                    errors.push(`저장 실패 (${product.name}): ${item.index.error.reason}`);
                } else {
                    savedCount++;
                }
            });
        }else {
            savedCount = products.length;
        }
        return { success: true, savedCount, errors}
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : '엘라스틱 클라우드 저장 실패';
        errors.push(errorMessage);
        return { success: false, savedCount, errors };
    }
}