import type { Metadata } from "next";
import { Network } from "lucide-react";
import { OrgChart } from "@/src/components/structure/org-chart";

export const metadata: Metadata = {
  title: "組織架構",
  description: "社團法人新北市道一關懷協會 組織架構。",
};

export default function StructurePage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          關於我們
        </p>
        <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
          <Network className="size-8 text-primary" aria-hidden="true" />
          組織架構
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          本會以會員大會為最高權力機構，下設理事會、監事會及六大委員會，分工推動道務與公益關懷。
        </p>
      </header>

      <OrgChart />
    </main>
  );
}
