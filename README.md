# Zerro AI 5-Stage Project

### 🎯 사령관 지시사항
> 프리뷰 화면에서 다음 런타임 에러가 발생했다:
Cannot read properties of null (reading 'length')
원인: 게임 루프에서 currentTetromino가 null일 때 길이를 읽으려고 했기 때문이다.
조치: canMoveTetrominoDown 및 기타 관련 함수 최상단에 if (!currentTetromino) return; 같은 방어(Null check) 로직을 추가하여 에러를 막고 풀코드를 다시 작성하라.

### 🏗️ Architecture
* canMoveTetrominoDown
	+ if (!currentTetromino) return;
	+ ...
* canMoveTetrominoLeft
	+ if (!currentTetromino) return;
	+ ...
* canMoveTetrominoRight
	+ if (!currentTetromino) return;
	+ ...
* canMoveTetrominoUp
	+ if (!currentTetromino) return;
	+ ...
* canRotateTetromino
	+ if (!currentTetromino) return;
	+ ...
* removeFullLines
	+ if (!currentTetromino) return;
	+ ...
* updateGrid
	+ if (!currentTetromino) return;
	+ ...
* drawTetromino
	+ if (!currentTetromino) return;
	+ ...
* gameLoop
	+ if (!currentTetromino) 
		- currentTetromino 생성
	+ ...
	+ gameLoop 재귀 호출

### 🛡️ QA Report
* [렌더링 태업]: 코드는 상태와 로직을 가지고 있지만, 화면에 그리드와 블록을 렌더링하는 코드가 존재한다.
* [유령 함수/패키지]: 코드 내부에 없는 함수를 호출하거나, 존재하지 않는 패키지를 import 하는 코드는 없다.
* [무한 루프]: useEffect 의존성 에러는 없지만, gameLoop 함수에서 setTimeout을 사용하여 무한 루프를 생성하고 있다. 이는 의도적인 동작이므로 문제는 없다.
* [코드 짤림]: 코드가 끝까지 작성되어 있고, 닫히는 괄호로 완벽하게 끝나고 있다. 

PASS