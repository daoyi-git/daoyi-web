"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize,
  Minimize,
} from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

interface PdfReaderProps {
  url: string;
  title: string;
  backHref?: string;
}

// ---- IndexedDB 快取（轉好的頁面圖片，避免重複轉換，沿用舊版做法）----
const DB_NAME = "pdf_cache_db";
const STORE = "pdf_pages";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 天

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "url" });
      }
    };
  });
}

async function getCache(url: string): Promise<string[] | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve) => {
      const r = db.transaction(STORE, "readonly").objectStore(STORE).get(url);
      r.onsuccess = () => {
        const v = r.result;
        if (v && Date.now() - v.timestamp < MAX_AGE) resolve(v.pages);
        else resolve(null);
      };
      r.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function setCache(url: string, pages: string[]) {
  try {
    const db = await openDB();
    db.transaction(STORE, "readwrite")
      .objectStore(STORE)
      .put({ url, pages, timestamp: Date.now() });
  } catch {
    /* 忽略快取失敗 */
  }
}

export function PdfReader({ url, title, backHref = "/" }: PdfReaderProps) {
  const [pages, setPages] = useState<string[]>([]); // 每頁轉好的圖片 dataURL
  const [current, setCurrent] = useState(0); // 0-based
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("正在載入…");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPageInput, setShowPageInput] = useState(false);
  const [pageInput, setPageInput] = useState("");
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 載入並一次把所有頁轉成圖片（含 IndexedDB 快取）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = await getCache(url);
        if (cached && !cancelled) {
          setPages(cached);
          setProgress(100);
          setLoading(false);
          return;
        }

        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        setStatus("正在下載 PDF…");
        const task = pdfjs.getDocument({ url });
        task.onProgress = (p: { loaded: number; total: number }) => {
          if (p.total > 0) setProgress(Math.round((p.loaded / p.total) * 30));
        };
        const pdf = await task.promise;
        if (cancelled) return;

        const numPages = pdf.numPages;
        const images: string[] = [];
        for (let i = 1; i <= numPages; i++) {
          if (cancelled) return;
          setStatus(`轉換頁面 ${i} / ${numPages}`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          images.push(canvas.toDataURL("image/jpeg", 0.9));
          setProgress(30 + Math.round((i / numPages) * 65));
        }
        if (cancelled) return;

        setPages(images);
        setProgress(100);
        setLoading(false);
        setCache(url, images);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError("無法載入 PDF 檔案，請稍後再試。");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  const total = pages.length;

  const goToPage = (oneBased: number) => {
    const idx = oneBased - 1;
    if (idx >= 0 && idx < total) {
      setCurrent(idx);
      transformRef.current?.resetTransform();
    }
    setShowPageInput(false);
    setPageInput("");
  };
  const prev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      transformRef.current?.resetTransform();
    }
  };
  const next = () => {
    if (current < total - 1) {
      setCurrent((c) => c + 1);
      transformRef.current?.resetTransform();
    }
  };

  // 全螢幕
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // 鍵盤翻頁
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showPageInput) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total, showPageInput]);

  const ctrlBtn =
    "grid size-9 md:size-10 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div
      ref={containerRef}
      className={`flex min-h-dvh flex-col bg-[#241f1c] ${isFullscreen ? "h-screen" : ""}`}
    >
      {/* 頂部標題列 */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-3 py-2.5 text-white backdrop-blur-md md:px-4">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <Link
            href={backHref}
            className="grid size-9 shrink-0 place-items-center rounded-full transition hover:bg-white/10"
            aria-label="返回"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </Link>
          <h1 className="truncate font-serif text-base font-medium md:text-lg">
            {title}
          </h1>
        </div>
        <a
          href={url}
          download={`${title}.pdf`}
          className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 md:px-4"
        >
          <Download className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">下載 PDF</span>
        </a>
      </div>

      {/* 控制列（左：翻頁/跳頁，右：縮放/全螢幕）RWD */}
      {!loading && !error && total > 0 && (
        <div className="flex items-center justify-between gap-2 bg-linear-to-r from-[#3a2a1c] to-[#2e2018] px-3 py-2 text-white md:px-4 md:py-3">
          {/* 左：翻頁 */}
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={prev} disabled={current === 0} className={ctrlBtn} aria-label="上一頁">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>

            {!showPageInput ? (
              <button
                onClick={() => {
                  setShowPageInput(true);
                  setPageInput(String(current + 1));
                }}
                className="min-w-[60px] cursor-pointer rounded-md bg-white/10 px-2 py-1 text-center text-sm font-medium tabular-nums transition hover:bg-white/20 md:min-w-[80px]"
                title="點擊輸入頁碼"
              >
                {current + 1} / {total}
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const n = parseInt(pageInput, 10);
                  if (!isNaN(n)) goToPage(n);
                }}
                className="flex items-center gap-1"
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={pageInput}
                  autoFocus
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || /^\d+$/.test(v)) setPageInput(v);
                  }}
                  onBlur={() => {
                    const n = parseInt(pageInput, 10);
                    if (!isNaN(n)) goToPage(n);
                    else {
                      setShowPageInput(false);
                      setPageInput("");
                    }
                  }}
                  className="w-12 rounded px-1 py-1 text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary md:w-14"
                  placeholder={`1-${total}`}
                />
                <span className="text-sm font-medium">/ {total}</span>
              </form>
            )}

            <button onClick={next} disabled={current >= total - 1} className={ctrlBtn} aria-label="下一頁">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* 右：縮放 + 全螢幕 */}
          <div className="flex items-center gap-1">
            <button onClick={() => transformRef.current?.zoomOut()} className={ctrlBtn} aria-label="縮小">
              <ZoomOut className="size-5" aria-hidden="true" />
            </button>
            <span className="hidden min-w-[44px] text-center text-xs font-medium tabular-nums md:inline">
              {Math.round(scale * 100)}%
            </span>
            <button onClick={() => transformRef.current?.zoomIn()} className={ctrlBtn} aria-label="放大">
              <ZoomIn className="size-5" aria-hidden="true" />
            </button>
            {scale !== 1 && (
              <button onClick={() => transformRef.current?.resetTransform()} className={ctrlBtn} aria-label="重置">
                <RotateCcw className="size-5" aria-hidden="true" />
              </button>
            )}
            <button onClick={toggleFullscreen} className={`${ctrlBtn} ml-1`} aria-label={isFullscreen ? "退出全螢幕" : "全螢幕"}>
              {isFullscreen ? (
                <Minimize className="size-5" aria-hidden="true" />
              ) : (
                <Maximize className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 閱讀區 */}
      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="grid h-full place-items-center px-6 text-center text-white/70">
            {error}
          </div>
        ) : loading ? (
          <div className="grid h-full place-items-center px-6">
            <div className="flex w-full max-w-sm flex-col items-center gap-4">
              <div className="size-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              <p className="text-sm font-medium text-white/70">{status}</p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress < 30 && (
                <p className="text-xs text-white/40">首次載入可能需要一些時間</p>
              )}
            </div>
          </div>
        ) : (
          <TransformWrapper
            ref={transformRef}
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            doubleClick={{ mode: "reset" }}
            wheel={{ step: 0.1 }}
            onTransform={(ref) => setScale(ref.state.scale)}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{
                width: "100%",
                display: "grid",
                placeItems: "center",
                padding: "1.5rem 0",
              }}
            >
              {/* 翻頁只換已轉好的圖片，不即時 render canvas（沿用舊版做法，避免空白頁） */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pages[current]}
                alt={`${title} 第 ${current + 1} 頁`}
                className="max-h-[82vh] w-auto max-w-[92vw] rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
              />
            </TransformComponent>
          </TransformWrapper>
        )}
      </div>
    </div>
  );
}
