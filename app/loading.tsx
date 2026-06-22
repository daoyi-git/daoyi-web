export default function HomeLoading() {
  return (
    <main className="container mx-auto px-4 pt-20 md:pt-28" aria-busy="true" aria-label="載入中">
      {/* Hero 骨架 */}
      <div className="max-w-2xl space-y-4">
        <div className="h-4 w-48 animate-pulse rounded-full bg-secondary" />
        <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-secondary" />
        <div className="h-12 w-2/3 animate-pulse rounded-2xl bg-secondary" />
        <div className="h-5 w-full animate-pulse rounded-full bg-secondary" />
        <div className="flex gap-3 pt-2">
          <div className="h-12 w-56 animate-pulse rounded-full bg-secondary" />
          <div className="h-12 w-36 animate-pulse rounded-full bg-secondary" />
        </div>
      </div>

      {/* 照片輪播骨架 */}
      <div className="mt-12 rounded-2xl bg-card/90 p-5 shadow-warm md:mt-16">
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] flex-1 animate-pulse rounded-xl bg-secondary"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
