import { TodoPagePlaceholder } from './TodoPagePlaceholder';

export function MonthlyPage() {
  return <TodoPagePlaceholder
    title="월간 TODO"
    description="한 달의 날짜별 TODO를 캘린더 형식으로 확인합니다."
    items={['달력 날짜 계산 및 이전 달·다음 달 이동', '날짜 범위 TODO 조회', '날짜 칸별 TODO 표시', '날짜 선택 시 일간 화면 이동']}
  />;
}
