/**
 * 行事曆資料層（server-side）
 *
 * 沿用舊版做法：從 Google Sheets 公開 CSV export 抓取活動，免 API key。
 * 用 Next.js fetch 快取（revalidate 每小時）。
 */

import {
  fetchCalendarFromGoogleSheets,
  type CalendarEvent,
} from "@/src/utils/googleSheets";

export type { CalendarEvent };

// 從 _CALENDAR_DATA 取設定（spreadsheet id / gid / 顏色）
export async function getCalendarConfig() {
  const mod = await import("@/BLOG_CONSTANTS/_CALENDAR_DATA");
  return {
    spreadsheetId: mod.CALENDAR_SPREADSHEET_ID,
    gid: mod.CALENDAR_SHEET_GID,
    getEventTypeColor: mod.getEventTypeColor,
  };
}

/** 取得所有行事曆活動（Google Sheets，失敗時讓 build 明確失敗） */
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const { spreadsheetId, gid } = await getCalendarConfig();
  return fetchCalendarFromGoogleSheets(spreadsheetId, gid);
}
