import { getLatestVideos, YOUTUBE_CHANNEL_URL } from "@/src/lib/videos";
import { VideoSectionClient } from "@/src/components/home/video-section-client";

/** Server 元件：抓 YouTube 影片後交給 client 互動元件渲染 */
export async function VideoSection() {
  const videos = await getLatestVideos(5);
  if (videos.length === 0) return null;
  return <VideoSectionClient videos={videos} channelUrl={YOUTUBE_CHANNEL_URL} />;
}

/** Suspense fallback：影音區塊載入骨架 */
export function VideoSectionSkeleton() {
  return (
    <section className="container mx-auto px-4 py-8" aria-busy="true" aria-label="影音載入中">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-warm md:p-8">
        <div className="mb-6 h-8 w-40 animate-pulse rounded-xl bg-secondary" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-video animate-pulse rounded-xl bg-secondary" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
