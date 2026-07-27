import { TodoPagePlaceholder } from './TodoPagePlaceholder';

export function DailyPage() {
  return <TodoPagePlaceholder
    title="오늘의 TODO"
    description="오늘 또는 선택한 날짜의 할 일을 관리합니다."
    items={['선택 날짜의 TODO 목록 조회', 'TODO 등록 및 수정 폼', '완료 상태 변경', '삭제 확인 및 처리']}
  />;
}
