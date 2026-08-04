type TodoPagePlaceholderProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'empty' | 'error';
};

/**
 * 이름은 기존 파일을 유지하지만, 더 이상 "구현 예정" 화면이 아닙니다.
 * API 연결 후에도 빈 목록과 오류 상태에서 공통으로 사용합니다.
 */
export function TodoPagePlaceholder({
  title = '아직 등록한 할 일이 없어요.',
  description = '작은 일부터 하나씩 추가해 오늘의 흐름을 만들어 보세요.',
  actionLabel = '새 할 일 추가',
  onAction,
  variant = 'empty',
}: TodoPagePlaceholderProps) {
  const isError = variant === 'error';
  return <section className={`todo-empty-state ${isError ? 'is-error' : ''}`} role={isError ? 'alert' : undefined}>
    <span className="todo-empty-icon" aria-hidden="true">{isError ? '!' : '✓'}</span>
    <strong>{isError ? '할 일을 불러오지 못했어요.' : title}</strong>
    <p>{isError ? '네트워크 상태를 확인한 후 다시 시도해 주세요.' : description}</p>
    {onAction && <button className="todo-empty-action" type="button" onClick={onAction}>{isError ? '다시 시도하기' : actionLabel}</button>}
  </section>;
}
