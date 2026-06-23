"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, X, Download } from "lucide-react";

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/dklwgtmj2/image/upload/f_auto,q_auto";

export function GleaningsViewer() {
  const searchParams = useSearchParams();
  const img = searchParams.get("img");
  const title = searchParams.get("title") ?? "拾穗集";
  const [loading, setLoading] = useState(true);
  if (!img) {
    return (
      <main className="container mx-auto grid min-h-[60vh] place-items-center px-4">
        <p className="text-muted-foreground">未指定要檢視的圖冊。</p>
      </main>
    );
  }

  const imageUrl = `${CLOUDINARY_BASE}/${img}`;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#241f1c]">
      {/* 頂部控制列 */}
      <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/50 px-4 py-3 text-white backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/he-qian-ren"
            className="grid size-10 place-items-center rounded-full transition hover:bg-white/10"
            aria-label="關閉檢視"
          >
            <X className="size-5" aria-hidden="true" />
          </Link>
          <h1 className="max-w-[200px] truncate font-serif text-lg font-medium md:max-w-md">
            {title || "拾穗集"}
          </h1>
        </div>
        <a
          href={imageUrl}
          download={`${title || "gleaning"}.jpg`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 md:flex"
        >
          <Download className="size-4" aria-hidden="true" />
          下載原圖
        </a>
      </div>

      {/* 載入狀態 */}
      {loading && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-[#241f1c]">
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            <p className="animate-pulse text-sm font-medium text-white/60">
              精采事蹟載入中…
            </p>
          </div>
        </div>
      )}

      {/* 縮放檢視區 */}
      <div className="relative flex-1 cursor-grab overflow-hidden active:cursor-grabbing">
        <TransformWrapper
          initialScale={0.8}
          minScale={0.1}
          maxScale={4}
          centerOnInit={false}
          centerZoomedOut
          limitToBounds={false}
          wheel={{ step: 0.1 }}
          doubleClick={{ mode: "reset" }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="fixed bottom-10 right-6 z-50 flex flex-col gap-3 md:right-10">
                <button
                  onClick={() => zoomIn()}
                  className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white shadow-warm-lg backdrop-blur-xl transition hover:bg-white/20"
                  aria-label="放大"
                >
                  <ZoomIn className="size-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white shadow-warm-lg backdrop-blur-xl transition hover:bg-white/20"
                  aria-label="縮小"
                >
                  <ZoomOut className="size-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-warm-lg transition hover:opacity-90"
                  aria-label="重置比例"
                >
                  <RotateCcw className="size-5" aria-hidden="true" />
                </button>
              </div>

              <TransformComponent
                wrapperStyle={{
                  width: "100vw",
                  height: "calc(100vh - 64px)",
                  marginTop: "64px",
                }}
                contentStyle={{
                  width: "100%",
                  minHeight: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "40px 0",
                }}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={imageUrl}
                    alt={title}
                    onLoad={() => setLoading(false)}
                    className="block rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
                    style={{ maxWidth: "90vw", height: "auto" }}
                  />
                  <div className="h-20 w-full" />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* 手機提示 */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 md:hidden">
        <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
          <p className="text-xs text-white/60">雙指縮放或單指移動</p>
        </div>
      </div>
    </div>
  );
}
