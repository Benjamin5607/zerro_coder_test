/**
 * @fileoverview API 통신 계층을 담당하는 유틸리티 파일입니다.
 * 데이터의 신뢰성 확보를 위해 스키마 검증(Schema Validation)을 도입합니다.
 */

import { z, ZodError } from 'zod';

// =============================================================================
// 1. 스키마 정의 (Schema Definition)
// =============================================================================

/**
 * API 요청 및 응답 데이터의 구조를 정의합니다.
 * Zod를 사용하여 강력한 타입 체크와 런타임 스키마 검증을 수행합니다.
 */

// 예시: 게임 상태 업데이트 요청 스키마
export const GameStateUpdateSchema = z.object({
  boardId: z.string().uuid('유효하지 않은 보드 ID 형식입니다.'),
  playerId: z.string().min(1, '플레이어 ID는 필수입니다.'),
  action: z.enum(['MOVE', 'PLACE', 'REMOVE']).describe('수행할 액션 타입'),
  payload: z.record(z.any()).optional().describe('액션에 필요한 추가 데이터 (예: 좌표, 블록 ID)'),
});

// 예시: 블록 정보 스키마
export const BlockInfoSchema = z.object({
  blockId: z.string().uuid('유효하지 않은 블록 ID 형식입니다.'),
  type: 'A' | 'B' | 'C',
  position: z.object({
    x: z.number().int().min(0).max(100).describe('X 좌표'),
    y: z.number().int().min(0).max(100).describe('Y 좌표'),
  }).describe('블록의 위치'),
  ownerId: z.string().uuid('유효하지 않은 소유자 ID 형식입니다.'),
});

// =============================================================================
// 2. 데이터 검증 유틸리티 (Validation Utility)
// =============================================================================

/**
 * 주어진 데이터가 특정 스키마를 준수하는지 검증합니다.
 * @param data 검증할 데이터 객체.
 * @param schema 사용할 Zod 스키마.
 * @returns 검증된 데이터 객체 (스키마에 맞게 타입이 보장됨).
 * @throws {Error} 스키마 검증에 실패한 경우 ZodError를 기반으로 에러를 발생시킵니다.
 */
export function validateData<T>(data: unknown, schema: z.ZodType<T>): T {
  try {
    // .parse()를 사용하여 런타임에 스키마를 강제합니다. 실패 시 즉시 에러 발생.
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // ZodError를 사용자 친화적인 에러 메시지로 변환하여 던집니다.
      const errorMessages = error.errors.map(e => `[${e.path.join('.')}] ${e.message}`).join('; ');
      throw new Error(`[Schema Validation Failed] 데이터 구조가 유효하지 않습니다. 오류: ${errorMessages}`);
    } 
    // 기타 예상치 못한 에러 처리
    throw new Error(`데이터 검증 중 알 수 없는 오류가 발생했습니다: ${error}`);
  }
}

// =============================================================================
// 3. API 통신 시뮬레이션 함수 (API Simulation Functions)
// =============================================================================

/**
 * (시뮬레이션) 게임 상태 업데이트 API 호출을 안전하게 처리합니다.
 * @param rawData 클라이언트로부터 받은 원시 데이터.
 * @returns 검증된 게임 상태 업데이트 객체.
 * @throws {Error} 데이터 검증 실패 또는 API 통신 오류 발생 시.
 */
export function callUpdateGameStateApi(rawData: unknown): { boardId: string; playerId: string; action: 'MOVE' | 'PLACE' | 'REMOVE'; payload: any } {
  // 원본 코드의 문맥을 고려하여 함수 시그니처를 완성하고, 에러를 방지하기 위해 임시 로직을 추가합니다.
  // 실제 API 호출 대신, 유효성 검증 로직을 포함한 시뮬레이션만 유지합니다.
  try {
    const validatedData = validateData(rawData, GameStateUpdateSchema);
    // 성공적으로 검증된 데이터를 반환한다고 가정합니다.
    return { 
      boardId: validatedData.boardId, 
      playerId: validatedData.playerId, 
      action: validatedData.action, 
      payload: validatedData.payload || {} 
    };
  } catch (e) {
    console.error("API Call Failed:", e);
    throw new Error(`API 통신 실패: ${e.message}`);
  }
}

// export default는 이 파일의 목적에 맞지 않으므로 제거합니다.