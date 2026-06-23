import type { Metadata } from "next";
import { GleaningsViewer } from "@/src/components/gleanings/gleanings-viewer";

export const metadata: Metadata = {
  title: "拾穗集",
  description: "道一關懷協會 拾穗集 — 生平事蹟。",
};

export default function GleaningsViewerPage() {
  return <GleaningsViewer />;
}
