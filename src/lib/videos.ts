/**
 * YouTube 影片資料層（server-side）
 *
 * 從協會 YouTube 頻道的公開 RSS feed 抓取最新影片，
 * 免 API key、免申請，自動取得最新 15 支。
 * 用 Next.js fetch 快取（revalidate 每 6 小時）。
 */

const CHANNEL_ID = "UCJU1rUTPFsD4cuQqRwHU26g";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@shingyidaoyi";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  category: "activity" | "general";
}

/** 活動影片即使離開 YouTube RSS 的最新 15 支，影音頁仍會顯示。 */
const ACTIVITY_VIDEOS: Video[] = [
  {
    id: "orrBPwqlpe0",
    title: "2026年九皇斋",
    thumbnail: "https://i.ytimg.com/vi/orrBPwqlpe0/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=orrBPwqlpe0",
    publishedAt: "2026-10-22T10:40:27+00:00",
    category: "activity",
  },
];
const ACTIVITY_VIDEO_IDS = new Set(ACTIVITY_VIDEOS.map((video) => video.id));

function uniqueVideos(videos: Video[]): Video[] {
  const seen = new Set<string>();
  return videos.filter((video) => {
    if (seen.has(video.id)) return false;
    seen.add(video.id);
    return true;
  });
}

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** 取得頻道最新影片（解析 YouTube RSS feed） */
export async function getLatestVideos(limit = 5): Promise<Video[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 60 * 60 * 6 }, // 6 小時更新一次
    });
    if (!res.ok) return ACTIVITY_VIDEOS.slice(0, limit);

    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);

    const videos: Video[] = entries.map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title = decodeXml(
        entry.match(/<media:title>([^<]+)<\/media:title>/)?.[1] ?? "",
      );
      const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
      return {
        id,
        title,
        // maxresdefault 有時不存在，hqdefault 一定有，較穩
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${id}`,
        publishedAt,
        category: ACTIVITY_VIDEO_IDS.has(id) ? "activity" : "general",
      };
    });

    return uniqueVideos([
      ...videos.filter((v) => v.id),
      ...ACTIVITY_VIDEOS,
    ]).slice(0, limit);
  } catch {
    return ACTIVITY_VIDEOS.slice(0, limit);
  }
}

/**
 * 取得完整影片庫（聖樂影音頁用）。
 * 以舊版 _VIDEOS_LIST 完整清單為基底（數十支），合併 RSS 最新影片去重後回傳，
 * 確保影音頁同時有「完整清單」與「最新」。
 */
export async function getAllVideos(): Promise<Video[]> {
  const { VIDEOS } = await import("../../BLOG_CONSTANTS/_VIDEOS_LIST");

  const fromList: Video[] = VIDEOS.map((v) => ({
    id: v.id,
    title: v.title,
    thumbnail: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${v.id}`,
    publishedAt: "",
    category: "general",
  }));

  const latest = await getLatestVideos(15);

  // 以 id 去重，RSS 最新的排前面，活動影片則永久保留在影音頁。
  return uniqueVideos([...latest, ...ACTIVITY_VIDEOS, ...fromList]);
}
