import { topNode, councils, committees } from "@/src/config/structure";

// 節點樣式
function TopNode({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-linear-to-br from-primary to-primary-deep px-8 py-4 text-center font-serif text-lg font-bold text-primary-foreground shadow-warm-lg">
      {children}
    </div>
  );
}

function CouncilNode({
  name,
  members,
}: {
  name: string;
  members: string[];
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl border border-border bg-card px-6 py-3 text-center font-serif text-base font-bold text-primary-deep shadow-warm">
        {name}
      </div>
      <ul className="rounded-lg border border-border bg-secondary/40 px-4 py-2 text-center text-xs leading-relaxed text-muted-foreground">
        {members.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

export function OrgChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-warm md:p-10">
      {/* 會員大會 */}
      <div className="flex justify-center">
        <TopNode>{topNode}</TopNode>
      </div>

      {/* 連接線（會員大會 → 理事會/監事會）*/}
      <div className="mx-auto h-8 w-px bg-border" aria-hidden="true" />

      {/* 理事會 + 監事會 */}
      <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-start md:gap-20">
        {councils.map((c) => (
          <CouncilNode key={c.name} name={c.name} members={c.members} />
        ))}
      </div>

      {/* 連接線（理事會 → 委員會）*/}
      <div className="mx-auto mt-2 h-8 w-px bg-border" aria-hidden="true" />
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        理事會所屬委員會
      </p>

      {/* 六個委員會 */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {committees.map((com, i) => (
          <div
            key={com.name}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-warm transition hover:shadow-warm-lg"
          >
            <div className="bg-linear-to-r from-accent/40 to-secondary px-5 py-3 text-center">
              <span className="grid place-items-center">
                <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-base font-bold leading-snug text-primary-deep">
                  {com.name}
                </h3>
              </span>
            </div>
            <div className="flex-1 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                委員會任務
              </p>
              <ol className="space-y-1.5">
                {com.tasks.map((t, j) => (
                  <li key={t} className="flex gap-2 text-sm text-foreground">
                    <span className="font-medium tabular-nums text-primary">
                      {j + 1}.
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
