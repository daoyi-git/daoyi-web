"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { CalendarEvent } from "@/src/lib/calendar";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTH_NAMES = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based

  // 依日期分組
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [events]);

  const monthEvents = useMemo(
    () =>
      events
        .filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .sort((a, b) => a.date.localeCompare(b.date)),
    [events, year, month],
  );

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const dateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* 月曆 */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-warm md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground md:text-2xl">
            {year} 年 {MONTH_NAMES[month]}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={goToday} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary">
              今天
            </button>
            <button onClick={prevMonth} aria-label="上個月" className="grid size-9 place-items-center rounded-full border border-border text-foreground transition hover:bg-secondary">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button onClick={nextMonth} aria-label="下個月" className="grid size-9 place-items-center rounded-full border border-border text-foreground transition hover:bg-secondary">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 月曆網格（外框 + 內部格線）*/}
        <div className="overflow-hidden rounded-xl border border-border">
          {/* 星期列 */}
          <div className="grid grid-cols-7 border-b border-border bg-secondary/50 text-center text-xs font-semibold text-muted-foreground">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-2">
                {w}
              </div>
            ))}
          </div>

          {/* 日期格：用 gap + 底色做出格線 */}
          <div className="grid grid-cols-7 gap-px bg-border">
            {cells.map((day, i) => {
              if (day === null)
                return <div key={`e${i}`} className="aspect-square bg-card" />;
              const dayEvents = eventsByDate.get(dateKey(day)) ?? [];
              return (
                <div
                  key={day}
                  className={cn(
                    "flex aspect-square flex-col p-1 text-left",
                    isToday(day) ? "bg-primary/10" : "bg-card hover:bg-secondary/60",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isToday(day)
                        ? "grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"
                        : "text-foreground",
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-0.5 flex flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((e, j) => (
                      <span
                        key={j}
                        className="truncate rounded bg-accent/30 px-1 text-[10px] leading-tight text-primary-deep"
                        title={e.title}
                      >
                        {e.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="px-1 text-[10px] text-muted-foreground">
                        +{dayEvents.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 本月活動列表 */}
      <aside>
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" aria-hidden="true" />
          <h3 className="font-serif text-lg font-bold text-foreground">
            本月活動
          </h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {monthEvents.length} 項
          </span>
        </div>
        {monthEvents.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            本月暫無活動
          </p>
        ) : (
          <ul className="flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
            {monthEvents.map((e, i) => {
              const d = new Date(e.date);
              return (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-warm"
                >
                  <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary text-center">
                    <span className="font-serif text-base font-bold leading-none text-primary-deep">
                      {d.getDate()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {WEEKDAYS[d.getDay()]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {e.title}
                    </p>
                    {e.location && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {e.location}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
}
