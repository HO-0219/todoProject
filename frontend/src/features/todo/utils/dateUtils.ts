export const createDate = (year: number, month: number, day: number) =>
  new Date(year, month, day);

export const addDays = (date: Date, amount: number) =>
  createDate(date.getFullYear(), date.getMonth(), date.getDate() + amount);

export const startOfWeek = (date: Date) => addDays(date, -date.getDay());

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const sameDay = (left: Date, right: Date) =>
  toDateKey(left) === toDateKey(right);

export const isPastDateKey = (dateKey: string) =>
  dateKey < toDateKey(new Date());

export const getMonthRange = (date: Date) => ({
  from: toDateKey(createDate(date.getFullYear(), date.getMonth(), 1)),
  to: toDateKey(createDate(date.getFullYear(), date.getMonth() + 1, 0)),
});

export const getWeekDates = (date: Date) => {
  const firstDate = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(firstDate, index));
};

export const getCalendarDates = (date: Date) => {
  const firstDay = createDate(date.getFullYear(), date.getMonth(), 1);
  const firstVisible = createDate(
    date.getFullYear(),
    date.getMonth(),
    1 - firstDay.getDay(),
  );
  return Array.from({ length: 42 }, (_, index) => addDays(firstVisible, index));
};
