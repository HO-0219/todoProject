type TodoPagePlaceholderProps = {
  title: string;
  description: string;
  items: string[];
};

export function TodoPagePlaceholder({ title, description, items }: TodoPagePlaceholderProps) {
  return <section className="todo-page">
    <header className="todo-page-header">
      <div><p>TODO CALENDAR</p><h1>{title}</h1><span>{description}</span></div>
      <button className="primary" type="button" disabled>TODO 추가</button>
    </header>
    <div className="todo-placeholder">
      <strong>구현 예정 영역</strong>
      <p>화면 구조만 준비되어 있습니다. 아래 기능을 순서대로 구현해 주세요.</p>
      <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
    </div>
  </section>;
}
