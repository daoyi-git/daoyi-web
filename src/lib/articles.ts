/**
 * 文章資料 Adapter（App Router server-safe）
 *
 * 統一介面 UnifiedArticle，讓頁面不在乎文章來自：
 *  - 舊 74 篇靜態資料（BLOG_CONSTANTS，第一階段保留）
 *  - 未來的 Supabase（新文章，第二階段接上）
 *
 * 用法：const articles = await getAllArticles();
 */

import { SORTED_ARTICLES_BY_DATE } from "../../BLOG_CONSTANTS/_ARTICLES_LIST";
import { getCloudinaryUrl } from "../utils/cloudinary";
import type { iArticle } from "../shared/interfaces";

export interface UnifiedArticle {
  /** 網址識別：舊文章用原 id，新文章用 Supabase slug */
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  /** 長文內文，新文章用；舊文章為 null（走「摘要 + 相簿」模式） */
  body: string | null;
  /** 封面圖（已轉成完整 Cloudinary URL 或本地路徑） */
  coverImage: string;
  /** 相簿圖（已轉成完整 URL） */
  images: string[];
  authorName: string;
  tags: string[];
  date: string;
  isFeatured: boolean;
  /** 來源，方便除錯與日後遷移 */
  source: "legacy" | "supabase";
}

/** Cloudinary public id 或本地/外部路徑 → 可顯示的完整 URL */
function resolveImage(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/public")) return path.replace("/public", "");
  if (path.startsWith("/")) return path;
  // 不含副檔名且非絕對路徑 → 視為 Cloudinary public id
  return getCloudinaryUrl(path);
}

/** 舊靜態 iArticle → UnifiedArticle */
function mapLegacy(article: iArticle): UnifiedArticle {
  const p = article.preview;
  return {
    slug: article.id,
    title: p.articleTitle,
    category: p.category ?? "道一",
    excerpt: p.shortIntro,
    body: null,
    coverImage: resolveImage(p.thumbnail),
    images: (article.images ?? []).map(resolveImage),
    authorName: p.author?.name ?? "道一關懷協會",
    tags: p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    date: p.date,
    isFeatured: Boolean(article.featureArticle),
    source: "legacy",
  };
}

const legacyArticles: UnifiedArticle[] = SORTED_ARTICLES_BY_DATE.map(mapLegacy);

function byDateDesc(a: UnifiedArticle, b: UnifiedArticle): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/**
 * 取得所有文章（合併靜態 + Supabase，依日期排序）。
 * Supabase 來源在 Phase 2 接上；目前僅回傳舊靜態文章。
 */
export async function getAllArticles(): Promise<UnifiedArticle[]> {
  const supabaseArticles: UnifiedArticle[] = []; // TODO Phase 2: 從 Supabase 讀取已發布文章
  return [...legacyArticles, ...supabaseArticles].sort(byDateDesc);
}

/** 依 slug 取單篇文章 */
export async function getArticleBySlug(
  slug: string
): Promise<UnifiedArticle | null> {
  const all = await getAllArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

/** 取得所有分類（用於分類 Tabs） */
export async function getCategories(): Promise<string[]> {
  const all = await getAllArticles();
  return Array.from(new Set(all.map((a) => a.category)));
}

/**
 * 取得隨機活動照片（首頁 hero 照片輪播用）。
 * 從各篇文章圖庫蒐集照片，洗牌後取前 count 張，並附帶來源文章連結。
 */
export async function getRandomActivityPhotos(
  count = 10,
): Promise<{ src: string; href: string; title: string }[]> {
  const all = await getAllArticles();
  const pool: { src: string; href: string; title: string }[] = [];

  for (const article of all) {
    const cover = article.coverImage || article.images[0];
    if (cover) {
      pool.push({
        src: cover,
        href: `/blog/${article.slug}`,
        title: article.title,
      });
    }
  }

  // 以日期為種子的穩定洗牌，避免每次 SSR/build 結果跳動造成 hydration 不一致
  const seed = all.length;
  const shuffled = [...pool].sort((a, b) => {
    const ha = (a.src.length * 31 + seed) % 97;
    const hb = (b.src.length * 31 + seed) % 97;
    return ha - hb || a.src.localeCompare(b.src);
  });

  return shuffled.slice(0, count);
}
