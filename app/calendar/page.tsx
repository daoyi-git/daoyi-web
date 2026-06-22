import type { Metadata } from "next";
import { getCalendarEvents } from "@/src/lib/calendar";
import { CalendarView } from "@/src/components/calendar/calendar-view";

export const metadata: Metadata = {
  title: "行事曆",
  description: "道一關懷協會的班會、活動行事曆。",
};

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          活動行事曆
        </p>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          行事曆
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          協會班會、道務活動與重要節日一覽。
        </p>
      </header>

      {events.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          目前無法載入行事曆資料，請稍後再試。
        </p>
      ) : (
        <CalendarView events={events} />
      )}
    </main>
  );
}
