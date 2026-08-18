import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type TodoCreateModalProps = {
  open: boolean;
  initialDate: Date;
  pending?: boolean;
  onClose: () => void;
  onSubmit: (title: string, date: Date) => Promise<void> | void;
};

type DatePickerProps = {
  label: string;
  value: number;
  values: number[];
  suffix: string;
  open: boolean;
  disabled: boolean;
  onToggle: () => void;
  onChange: (value: number) => void;
};

function DatePicker({
  label,
  value,
  values,
  suffix,
  open,
  disabled,
  onToggle,
  onChange,
}: DatePickerProps) {
  return (
    <div className="todo-date-field">
      <span>{label}</span>
      <div className={`todo-date-picker ${open ? "is-open" : ""}`}>
        <button
          type="button"
          className="todo-date-picker-trigger"
          onClick={onToggle}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span>
            {value}
            {suffix}
          </span>
          <i aria-hidden="true">⌄</i>
        </button>
        {open && (
          <div className="todo-date-picker-list" role="listbox">
            {values.map((item) => (
              <button
                type="button"
                role="option"
                aria-selected={item === value}
                className={item === value ? "is-selected" : ""}
                onClick={() => onChange(item)}
                key={item}
              >
                {item}
                {suffix}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function TodoCreateModal({
  open,
  initialDate,
  pending = false,
  onClose,
  onSubmit,
}: TodoCreateModalProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const selectableInitialDate = useMemo(() => {
    const candidate = startOfDay(initialDate);
    return candidate < today ? today : candidate;
  }, [initialDate, today]);
  const [month, setMonth] = useState(selectableInitialDate.getMonth() + 1);
  const [day, setDay] = useState(selectableInitialDate.getDate());
  const [title, setTitle] = useState("");
  const [openPicker, setOpenPicker] = useState<"month" | "day" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const year = selectableInitialDate.getFullYear();
  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [month, year]);
  const monthValues = useMemo(() => {
    const firstMonth = year === today.getFullYear() ? today.getMonth() + 1 : 1;
    return Array.from(
      { length: 13 - firstMonth },
      (_, index) => firstMonth + index,
    );
  }, [today, year]);
  const dayValues = useMemo(() => {
    const firstDay =
      year === today.getFullYear() && month === today.getMonth() + 1
        ? today.getDate()
        : 1;
    return Array.from(
      { length: daysInMonth - firstDay + 1 },
      (_, index) => firstDay + index,
    );
  }, [daysInMonth, month, today, year]);

  useEffect(() => {
    if (!open) return;
    setMonth(selectableInitialDate.getMonth() + 1);
    setDay(selectableInitialDate.getDate());
    setTitle("");
    setOpenPicker(null);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open, selectableInitialDate]);

  useEffect(() => {
    if (!dayValues.includes(day)) setDay(dayValues[0]);
  }, [day, dayValues]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || pending) return;
      if (openPicker) setOpenPicker(null);
      else onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open, openPicker, pending]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || pending) return;
    await onSubmit(trimmedTitle, new Date(year, month - 1, day));
  }

  return (
    <div
      className="todo-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) onClose();
      }}
    >
      <section
        className="todo-create-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-create-modal-title"
        onMouseDown={(event) => {
          const target = event.target as Element;
          if (!target.closest(".todo-date-picker")) setOpenPicker(null);
        }}
      >
        <header className="todo-modal-header">
          <div>
            <p>NEW SCHEDULE</p>
            <h2 id="todo-create-modal-title">일정 추가</h2>
          </div>
          <button
            className="todo-modal-close"
            type="button"
            onClick={onClose}
            disabled={pending}
            aria-label="일정 추가 창 닫기"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="todo-modal-date-fields">
            <div className="todo-date-field">
              <span>연도</span>
              <output>{year}년</output>
            </div>
            <DatePicker
              label="월"
              value={month}
              values={monthValues}
              suffix="월"
              open={openPicker === "month"}
              disabled={pending}
              onToggle={() =>
                setOpenPicker((current) =>
                  current === "month" ? null : "month",
                )
              }
              onChange={(value) => {
                setMonth(value);
                setOpenPicker(null);
              }}
            />
            <DatePicker
              label="일"
              value={day}
              values={dayValues}
              suffix="일"
              open={openPicker === "day"}
              disabled={pending}
              onToggle={() =>
                setOpenPicker((current) => (current === "day" ? null : "day"))
              }
              onChange={(value) => {
                setDay(value);
                setOpenPicker(null);
              }}
            />
          </div>

          <label className="todo-modal-content-field">
            <span>일정 내용</span>
            <input
              ref={inputRef}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="새로운 일정을 입력하세요"
              maxLength={100}
              disabled={pending}
              required
            />
          </label>

          <div className="todo-modal-actions">
            <button type="button" onClick={onClose} disabled={pending}>
              취소
            </button>
            <button type="submit" disabled={!title.trim() || pending}>
              {pending ? "추가 중..." : "일정 추가"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
