import { TodoPagePlaceholder } from './TodoPagePlaceholder';

export function WeeklyPage() {
  return <TodoPagePlaceholder
    title="주간 TODO"
    description="일요일부터 토요일까지 7일의 TODO를 확인합니다."
    items={['선택 날짜가 포함된 주간 범위 계산', '일요일~토요일 7개 영역 구성', '조회 결과의 날짜별 분류', '모바일 가로 스크롤 또는 카드 UI']}
  />;
}
