/**
 * Google Sheets 資料讀取工具
 * 
 * 使用 Google Sheets 公開 CSV API 讀取試算表資料
 * 不需要 API Key,只需將試算表設為「知道連結的人可以檢視」
 */

export interface CalendarEvent {
  date: string;        // 格式: YYYY-MM-DD
  title: string;       // 活動名稱
  type?: string;       // 活動類型 (用於分類和顏色標記)
  description?: string; // 活動描述
  location?: string;   // 地點
  time?: string;       // 時間
}

/**
 * 從 Google Sheets 讀取行事曆資料 (使用 CSV 格式)
 * 
 * @param spreadsheetId - Google Sheets ID
 * @param gid - 工作表 GID (從網址中取得)
 * @returns 行事曆事件陣列
 */
export async function fetchCalendarFromGoogleSheets(
  spreadsheetId: string,
  gid: string = '1575785136' // 新的行事曆分頁 GID
): Promise<CalendarEvent[]> {
  // 使用 Google Sheets CSV Export API
  // 格式: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv&gid={GID}
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheets data: ${response.status}`);
  }

  const csvText = await response.text();
  const events = parseCalendarCSV(csvText);

  if (events.length === 0) {
    throw new Error("Google Sheets calendar data parsed to zero events");
  }

  return events;
}

/**
 * 解析行事曆 CSV 資料
 * 
 * 根據試算表的實際結構解析:
 * 第一列: 國曆 (標題)
 * 第二列: 日期 (2/16, 2/17, ...)
 * 第三列: 星期 (一, 二, 三, ...)
 * 第四列: 農曆 (除夕, 初一, ...)
 * 第五列: 工作 (守壇, 拜年, ...)
 * 第六列: 地點
 * 第七列: 時間
 */
/**
 * 解析行事曆 CSV 資料 (新格式)
 * 
 * 新格式結構:
 * - 第1行: 日期 (2026/1/17 或 1/17)
 * - 第2行: 星期
 * - 第3行: 農曆
 * - 第4行: 中心班會
 * - 第5行: 講師
 * - 第6行: 工作
 * - 第7行: 地點
 * 
 * 活動標題優先順序: 中心班會 > 工作
 */
function parseCalendarCSV(csvText: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  
  try {
    const rows = parseCSV(csvText);

    // 找到各個欄位的索引
    let dateRowIndex = -1;      // 日期/國曆
    let weekdayRowIndex = -1;   // 星期
    let lunarRowIndex = -1;     // 農曆
    let centerClassRowIndex = -1; // 中心班會
    let teacherRowIndex = -1;   // 講師
    let workRowIndex = -1;      // 工作
    let locationRowIndex = -1;  // 地點
    
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
      const firstCell = rows[i][0]?.trim() || '';
      
      if (firstCell === '日期' || firstCell === '國曆' || firstCell.includes('日期') || firstCell.includes('國曆')) {
        dateRowIndex = i;
      } else if (firstCell === '星期' || firstCell.includes('星期')) {
        weekdayRowIndex = i;
      } else if (firstCell === '農曆' || firstCell.includes('農曆')) {
        lunarRowIndex = i;
      } else if (firstCell === '中心班會' || firstCell.includes('中心班會')) {
        centerClassRowIndex = i;
      } else if (firstCell === '講師' || firstCell.includes('講師')) {
        teacherRowIndex = i;
      } else if (firstCell === '工作') {
        workRowIndex = i;
      } else if (firstCell === '地點' || firstCell.includes('地點')) {
        locationRowIndex = i;
      }
    }
    
    if (dateRowIndex === -1) {
      return events;
    }
    
    const dateRow = rows[dateRowIndex] || [];
    const centerClassRow = centerClassRowIndex >= 0 ? rows[centerClassRowIndex] : [];
    const teacherRow = teacherRowIndex >= 0 ? rows[teacherRowIndex] : [];
    const workRow = workRowIndex >= 0 ? rows[workRowIndex] : [];
    const locationRow = locationRowIndex >= 0 ? rows[locationRowIndex] : [];
    const lunarRow = lunarRowIndex >= 0 ? rows[lunarRowIndex] : [];
    
    // 處理每一欄 (每一個日期)
    // 注意: 同一天可能有多欄 (例如 1/18 有兩欄)
    for (let col = 1; col < dateRow.length; col++) {
      const dateStr = dateRow[col]?.trim();
      if (!dateStr) continue;
      
      // 解析日期 (支援兩種格式: "2026/1/17" 或 "1/17")
      let year = 2026;
      let month = 0;
      let day = 0;
      
      const dateParts = dateStr.split('/');
      if (dateParts.length === 3) {
        // 格式: 2026/1/17
        year = parseInt(dateParts[0]);
        month = parseInt(dateParts[1]);
        day = parseInt(dateParts[2]);
      } else if (dateParts.length === 2) {
        // 格式: 1/17
        month = parseInt(dateParts[0]);
        day = parseInt(dateParts[1]);
      } else {
        continue;
      }
      
      if (!month || !day || isNaN(month) || isNaN(day)) continue;
      
      // 取得活動標題 (優先: 中心班會 > 工作)
      let title = '';
      let type = '其他';
      
      const centerClass = centerClassRow[col]?.trim() || '';
      const work = workRow[col]?.trim() || '';
      
      if (centerClass) {
        title = centerClass;
        // 優先檢查特定班會名稱
        if (centerClass.includes('古坑')) type = '古坑';
        else if (centerClass.includes('玄懋')) type = '玄懋';
        else if (centerClass.includes('道一')) type = '道一';
        else if (centerClass.includes('青世代')) type = '青世代';
        else type = '班會';
      } else if (work) {
        title = work;
        // 根據工作內容判斷類型
        if (work.includes('守壇')) type = '守壇';
        else if (work.includes('拜年')) type = '拜年';
        else if (work.includes('辭歲') || work.includes('迎歲')) type = '傳統節日';
        else if (work.includes('總壇輪值') || work.includes('輪值')) type = '總壇輪值';
        else if (work.includes('班會')) type = '班會';
      }
      
      // 如果沒有標題,跳過
      if (!title) continue;
      
      // 取得其他資訊
      const teacher = teacherRow[col]?.trim() || '';
      const location = locationRow[col]?.trim() || '';
      const lunar = lunarRow[col]?.trim() || '';
      
      // 建立描述
      let description = '';
      const details = [];
      if (lunar) details.push(`農曆: ${lunar}`);
      if (teacher) details.push(`講師: ${teacher}`);
      if (location) details.push(`地點: ${location}`);
      if (details.length > 0) {
        description = details.join('\n');
      }
      
      // 建立事件
      const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      events.push({
        date: isoDate,
        title,
        type,
        description: description || undefined,
        location: location || undefined,
      });
    }
    
  } catch (error) {
    console.error("Error parsing calendar CSV:", error);
  }
  
  return events;
}

/**
 * 解析 CSV 文本為二維陣列
 * 正確處理引號、跨行和逗號
 */
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // 雙引號轉義
        currentCell += '"';
        i++;
      } else {
        // 切換引號狀態
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // 欄位結束
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // 行結束
      if (char === '\r' && nextChar === '\n') {
        i++; // 跳過 \r\n 中的 \n
      }
      currentRow.push(currentCell);
      if (currentRow.some(cell => cell.trim())) {
        // 只加入非空行
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  
  // 加入最後一行
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some(cell => cell.trim())) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

/**
 * CSV 行解析器 - 正確處理引號和跨行
 * 
 * 注意: Google Sheets 的 CSV 可能包含跨行的引號欄位
 * 例如: "辭歲\n迎歲" 會被當成一個欄位
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      // 處理雙引號轉義 ("")
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // 跳過下一個引號
      } else {
        // 切換引號狀態
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // 在引號外遇到逗號,表示欄位結束
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // 加入最後一個欄位
  result.push(current);
  
  return result;
}

/**
 * 取得指定月份的活動
 * 
 * @param events - 所有活動
 * @param year - 年份
 * @param month - 月份 (1-12)
 * @returns 該月份的活動
 */
export function getEventsForMonth(
  events: CalendarEvent[],
  year: number,
  month: number
): CalendarEvent[] {
  return events.filter(event => {
    try {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() + 1 === month;
    } catch {
      return false;
    }
  });
}

/**
 * 取得當前月份的活動
 * 
 * @param events - 所有活動
 * @returns 當前月份的活動
 */
export function getCurrentMonthEvents(events: CalendarEvent[]): CalendarEvent[] {
  const now = new Date();
  return getEventsForMonth(events, now.getFullYear(), now.getMonth() + 1);
}
