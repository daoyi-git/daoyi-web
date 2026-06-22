import type { Metadata } from "next";
import { getAllVideos } from "@/src/lib/videos";
import { getCloudinaryUrl } from "@/src/utils/cloudinary";
import { VideoPageClient, type SheetMusicItem } from "@/src/components/video/video-page-client";

export const metadata: Metadata = {
  title: "聖樂影音",
  description: "道一關懷協會的影片紀實與聖樂歌譜。",
};

export default async function VideoPage() {
  const videos = await getAllVideos();

  // 聖樂歌譜（Cloudinary）
  const { SHEET_MUSIC_LIST } = await import("@/BLOG_CONSTANTS/_SHEET_MUSIC");
  const sheets: SheetMusicItem[] = SHEET_MUSIC_LIST.map((s) => ({
    url: getCloudinaryUrl(s.publicId, { quality: "auto", format: "auto" }),
    title: s.title,
  }));

  return <VideoPageClient videos={videos} sheets={sheets} />;
}
