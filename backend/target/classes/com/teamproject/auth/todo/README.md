# TODO 백엔드 작업 위치

기존 `auth` 기능은 유지하고 TODO 기능만 이 패키지 아래에 작성합니다.

- `domain`: Todo 엔티티, 값 객체, Repository
- `application`: 등록·조회·수정·완료·삭제 유스케이스
- `presentation`: REST Controller와 Request/Response DTO

구현 권장 순서:

1. Todo 엔티티와 Repository
2. 날짜 범위 조회 서비스
3. 등록·수정·완료·삭제 서비스
4. Controller와 DTO
5. 사용자 소유권 및 API 테스트

월간·주간·일간 데이터를 따로 저장하지 않습니다. 하나의 Todo 데이터를
`from`, `to` 날짜 범위로 조회하고 각 프런트 화면에서 다르게 표시합니다.
