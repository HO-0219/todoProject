import { useRef } from 'react';

type CalendarNavProps = {
  date: Date;
  label: string;
  onChange: (date: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  todayLabel: string;
};

const toInputValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function CalendarNav({ date, label, onChange, onPrevious, onNext, onToday, todayLabel }: CalendarNavProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  function openPicker() { inputRef.current?.showPicker?.(); inputRef.current?.focus(); }
  return <div className="calendar-nav">
    <button type="button" onClick={onPrevious} aria-label="이전">‹</button>
    <button className="calendar-picker-trigger" type="button" onClick={openPicker}>{label}<input ref={inputRef} type="date" value={toInputValue(date)} onChange={(event) => onChange(new Date(`${event.target.value}T00:00:00`))} /></button>
    <button type="button" onClick={onNext} aria-label="다음">›</button>
    <button className="calendar-today" type="button" onClick={onToday}>{todayLabel}</button>
  </div>;
}
