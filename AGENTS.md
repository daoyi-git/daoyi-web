# AGENTS.md — 道一關懷協會 daoyi-web

## 專案架構
- **框架**: Next.js 14 static export (`output: "export"`)
- **語言**: TypeScript 5.9 + React 18
- **樣式**: Tailwind CSS + SCSS modules（無 styled-components）
- **圖片**: Cloudinary（公開 cloud name）+ `next/image` with `unoptimized: true`
- **內容**: `BLOG_CONSTANTS/_ARTICLES_LIST.tsx` 靜態資料，1600+ 文章

## Coding Style 規則
- **禁止 emoji**：任何程式碼、JSX、UI 文字一律不使用（視為 AI slop）
- **禁止 left-border accent**（`border-l-4`）作為裝飾，視為 AI slop
- Tailwind 優先，非必要不寫 CSS
- 暗色模式：一律加 `dark:` variant
- 圖片使用 `transformThumbnailPath()` 取得 Cloudinary URL

## 不能碰的東西
- `BLOG_CONSTANTS/` 內容資料（只讀）
- `public/images/` 靜態圖檔
- `next.config.js` 中的 `output: "export"` 和 `images: { unoptimized: true }`
- 任何已部署的 Azure static web app 設定

## 重要 Utils
- `transformPath(path)` — 移除 /pages 前綴
- `transformThumbnailPath(path, 'compact'|'regular')` — Cloudinary 縮圖
- `transformImagePaths(path)` — 通用圖片路徑
- `getCategories()` — 從文章列表取得所有分類
- `combineClasses(...classes)` — classname 合併

## 文章分類（目前）
- 道一、經典班會、道務活動

## 新文章照片來源
- 使用者提供 `YYYYMMDD` 日期時，照片固定從 `D:\Code\道一上傳區\YYYYMMDD` 讀取，不必再次索取完整路徑。
- 只使用照片，排除影片與重複照片。
- 使用者提供日期或照片資料夾路徑，即同意將其中選出的照片上傳至道一網站既有 Cloudinary 路徑供網站顯示，不必每次再次詢問。
- 先完成 Cloudinary 上傳並確認照片網址可讀取，再把 public ID 寫進文章資料；不可預先填入未上傳的照片網址。

## 元件路徑
- `src/components/BlogIndexPage/index.tsx` — 部落格首頁
- `src/components/ArticleCards/ArticleCardCompact.tsx` — 小卡片
- `src/components/Misc/ArticleMoreFromAuthor.tsx` — 側欄相關文章
- `src/layouts/PageLayouts/index.tsx` — 頁面 layout
