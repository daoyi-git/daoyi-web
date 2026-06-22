import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { ImageDoc } from "@/src/components/common/image-doc";

export const metadata: Metadata = {
  title: "協會章程",
  description: "社團法人新北市道一關懷協會 協會章程。",
};

const images = [
  "/images/a1.jpg",
  "/images/a2.jpg",
  "/images/a3.jpg",
  "/images/a4.jpg",
  "/images/a5.jpg",
];

export default function AssociationArticlesPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          關於我們
        </p>
        <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
          <ScrollText className="size-8 text-primary" aria-hidden="true" />
          協會章程
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          社團法人新北市道一關懷協會章程，點擊可放大檢視。
        </p>
      </header>

      <ImageDoc images={images} alt="協會章程" />
    </main>
  );
}
