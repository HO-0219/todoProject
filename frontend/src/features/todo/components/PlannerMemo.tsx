import { useEffect, useState } from "react";

type PlannerMemoProps = {
  storageKey: string;
  label: string;
};

export function PlannerMemo({ storageKey, label }: PlannerMemoProps) {
  const key = `gearviame:memo:${storageKey}`;
  const [memo, setMemo] = useState(() => localStorage.getItem(key) ?? "");

  useEffect(() => {
    setMemo(localStorage.getItem(key) ?? "");
  }, [key]);

  function changeMemo(value: string) {
    setMemo(value);
    localStorage.setItem(key, value);
  }

  return (
    <section className="planner-memo-card">
      <header>
        <div>
          <p>MEMO</p>
          <h2>{label}</h2>
        </div>
        <span>자동 저장</span>
      </header>
      <textarea
        value={memo}
        onChange={(event) => changeMemo(event.target.value)}
        placeholder="기억할 내용이나 계획을 자유롭게 적어보세요."
        aria-label={label}
      />
    </section>
  );
}
