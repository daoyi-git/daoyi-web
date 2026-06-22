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
    if (!res.ok) return [];

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
      };
    });

    return videos.filter((v) => v.id).slice(0, limit);
  } catch {
    return [];
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
  }));

  const latest = await getLatestVideos(15);

  // 以 id 去重，RSS 最新的排前面
  const seen = new Set<string>();
  const merged: Video[] = [];
  for (const v of [...latest, ...fromList]) {
    if (!seen.has(v.id)) {
      seen.add(v.id);
      merged.push(v);
    }
  }
  return merged;
}
