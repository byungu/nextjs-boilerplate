/* supabase 클라이언트 설정 */

/**
 * supabase 클라이언트 라이브러리 주입
 */
import { createClient} from '@supabase/supabase-js';

/**
 * supabase 연결정보 불러오기
 * NEXT_PUBLIC 접두사를 통해 클라이언트에서도 접근 가능
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * 접두사가 없으면 서버에서만 접근 가능 (보안)
 */
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * supabase 클라이언트 생성
 * 생성한 클라이언트로 데이터베이스와 상호 작용 가능
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 다른 파일에서도 import 할 수 있도록 export 설정
 */
export default supabase;
