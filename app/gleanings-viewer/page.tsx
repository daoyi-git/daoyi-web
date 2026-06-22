import type { Metadata } from "next";
import { GleaningsViewer } from "@/src/components/gleanings/gleanings-viewer";

export const metadata: Metadata = {
  title: "拾穗集",
  description: "道一關懷協會 拾穗集 — 生平事蹟。",
};

export default async function GleaningsViewerPage({
  searchParams,
}: {
  searchParams: Promise<{ img?: string; title?: string }>;
}) {
  const { img, title } = await searchParams;

  if (!img) {
    return (
      <main className="container mx-auto grid min-h-[60vh] place-items-center px-4">
        <p className="text-muted-foreground">未指定要檢視的圖冊。</p>
      </main>
    );
  }

  return <GleaningsViewer img={img} title={title ?? "拾穗集"} />;
}
