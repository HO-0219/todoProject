import { useState } from "react";
import { todoApi } from "../api/todoApi";

export function CalendarExportButton() {
  const [exporting, setExporting] = useState(false);

  async function exportCalendar() {
    setExporting(true);
    try {
      const calendar = await todoApi.exportCalendar();
      const url = URL.createObjectURL(calendar);
      const link = document.createElement("a");
      link.href = url;
      link.download = "gearviame-calendar.ics";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("캘린더 내보내기 실패:", error);
      window.alert("캘린더 파일을 내려받지 못했습니다.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      className="calendar-export-button"
      type="button"
      onClick={exportCalendar}
      disabled={exporting}
    >
      {exporting ? "내보내는 중..." : "캘린더 공유(.ics)"}
    </button>
  );
}
