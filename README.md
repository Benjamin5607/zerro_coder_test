# Zerro AI 5-Stage Project

### 🎯 사령관 지시사항
> 테트리스 게임 만들어줘

### 🏗️ Architecture
- 게임 시작
  - 게임 보드 생성
    - 크기: 10x20
  - 테트로미노 블록 생성
    - 다양한 모양
    - 무작위 생성
- 플레이어 조작
  - 좌우 이동
  - 회전
  - 아래로 떨어뜨리기
- 테트로미노 블록 고정
  - 게임 보드 아래쪽에 닿을 때
  - 다른 블록과 충돌할 때
- 줄 삭제
  - 한 줄 완성 시
  - 점수 증가
- 게임 종료
  - 게임 보드 꽉 찼을 때
- 게임 정보 표시
  - 현재 점수
  - 삭제된 줄 수
- 게임 결과 표시
  - 최종 점수
  - 삭제된 줄 수

### 🛡️ QA Report
{
  "isValidUI": true,
  "hasNoGhostFunctions": true,
  "matchesGoal": true,
  "hasNullDefenses": true,
  "feedback": "PASS"
}