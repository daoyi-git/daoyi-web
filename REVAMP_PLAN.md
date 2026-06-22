# 道一關懷協會官網 — 改版藍圖 (REVAMP PLAN)

> 制定日期：2026-06-22
> 目標：Next.js 新技術 (App Router) + 全新 UIUX + Vercel 部署 + Supabase 內容管理

---

## 一、現況盤點 (As-Is)

| 項目 | 現況 | 問題 |
|------|------|------|
| 框架 | Next.js 14 **Pages Router** | 舊式路由，無 Server Components |
| 部署模式 | `output: "export"` 純靜態 | 無法跑 API route / 動態內容 / Supabase SSR |
| 內容 | **74 篇**文章寫死在 `BLOG_CONSTANTS/_ARTICLES_LIST.tsx` | 改內容要改 code + 重新 deploy |
| 圖片 | Cloudinary (`unoptimized: true`) | 可保留，Cloudinary 沒問題 |
| 樣式 | Tailwind 3 + SCSS modules | 升 Tailwind 4 + 重新設計 |
| 後端/DB | **無** | 要新增 Supabase |
| 部署平台 | Azure Static Web App (舊) | 改 Vercel |
| 資料結構 | `iArticle` interface 已型別化、乾淨 | **利於遷移** |

**關鍵發現**：文章只有 74 篇（非先前文件寫的 1600），資料結構乾淨，遷移風險遠低於預期。

---

## 二、目標架構 (To-Be)

```
Next.js 15 App Router (SSR/ISR, 非 static export)
├── 部署：Vercel
├── 內容：
│   ├── 舊文章 (74篇) → 第一階段保留靜態 TSX（你的決定，降風險）
│   └── 新文章        → Supabase Postgres + 後台 CMS
├── 圖片：Cloudinary（保留，加 next/image 最佳化）
├── 樣式：Tailwind 4 + 全新 UIUX 設計系統
└── 資料層：統一 Article adapter（靜態 + Supabase 合併讀取）
```

### 內容策略（混合模式，符合你的決定）

採用 **adapter 抽象層**，讓頁面不在乎文章來自靜態檔還是 Supabase：

```ts
// getArticles() 同時讀靜態 + Supabase，依日期合併排序
const staticArticles = ARTICLES_LIST;        // 舊 74 篇
const dbArticles     = await supabase...;     // 新文章
return merge(staticArticles, dbArticles);
```

好處：舊文章零遷移風險；新文章走資料庫；未來想把舊文章批次匯入 Supabase，因為結構相同，一支 script 即可，隨時可做。

---

## 二之二、遷移策略：並行重寫（Parallel Rewrite，已確認）

**原則**：外觀層（頁面/元件）重寫新版；資料層（內容/工具/圖）原樣保留。
**方式**：同專案雙資料夾 —— 舊 code 改名保留當參考，新 code 從零建乾淨架構，舊的不編譯進新版。

### 檔案歸類：重寫 / 保留 / 參考

| 處置 | 對象 | 說明 |
|------|------|------|
| **保留沿用**（直接搬到新結構） | `BLOG_CONSTANTS/`（74篇文章）、`src/utils/`（Cloudinary 邏輯 `transformThumbnailPath` 等）、`src/shared/interfaces.ts`（`iArticle` 型別）、`public/images/` | 資料與工具是資產，零改動 |
| **重寫新版** | 所有頁面（首頁、文章列表/內頁、關於、行事曆、捐款…）、所有 UI 元件、layout、樣式 | 配合溫暖關懷 UIUX + App Router |
| **改名保留當參考** | 舊 `pages/`、舊 `src/components`、舊 `src/layouts`、舊 SCSS | 移到 `legacy/`，從 tsconfig 排除，不編譯，純對照用 |

### 目錄落地方式（同專案雙資料夾）

```
daoyi-web/
├── legacy/                ← 舊 code 整包搬進來（pages/、舊 src components 等）
│                            從 tsconfig exclude，不編譯，只當參考
├── app/                   ← 新：App Router 頁面（全新重寫）
├── src/                   ← 新：乾淨重建
│   ├── components/        ← 新 UI 元件（溫暖關懷設計系統）
│   ├── lib/              ← Supabase client、Article adapter
│   ├── utils/           ← 從舊 src/utils 保留沿用（Cloudinary）
│   └── shared/          ← 保留 interfaces.ts
├── BLOG_CONSTANTS/        ← 保留（74 篇靜態文章）
└── public/               ← 保留（圖檔）
```

- tsconfig `paths` 維持 `@/src/*`，新 code 一律從 `src/` import
- `legacy/` 加入 tsconfig `exclude`，舊 code 不參與型別檢查與打包
- 好處：舊版隨時可查閱對照、資產免跨資料夾複製、新版乾淨無包袱

---

## 三、分階段執行 (Phases)

### Phase 0 — 版本控制基礎（先做，安全第一）
- [ ] 確認 `.gitignore` 涵蓋 `node_modules`、`.next`、`.env.local`、各家 AI 工具資料夾
- [ ] 首次 commit 現有 code 並 push 到 `github.com/daoyi-git/daoyi-web`（目前遠端是空的）
- [ ] 建立 `main`（穩定）與開發分支策略

### Phase 1 — 框架遷移 Pages Router → App Router
- [ ] 移除 `output: "export"`，改成標準 Next.js（支援 SSR/ISR）
- [ ] `pages/` 17 個頁面逐一搬到 `app/` 目錄
- [ ] `_app.tsx` / `_document.tsx` → `app/layout.tsx`
- [ ] 路由動態頁 `blog/[id].tsx` → `app/blog/[id]/page.tsx`
- [ ] 升級 Next 14 → 15、React 18 → 19
- [ ] 修掉舊套件 API（swiper modules、prism-react-renderer v2）

### Phase 2 — Supabase 整合
- [ ] 建立 Supabase 專案、設定 env
- [ ] 設計 `articles` schema（對應 `iArticle` 結構）
- [ ] 建立 Article adapter（靜態 + DB 合併讀取）
- [ ] （選配）建立簡單後台 CMS 頁面新增/編輯文章
- [ ] Auth（若 CMS 需登入）：Supabase Auth

### Phase 3 — 全新 UIUX 設計

**設計調性：溫暖關懷感**（已確認）
- 配色：暖色基調（米白 / 暖灰背景，主色偏暖橘、暖棕或柔和大地色系），避免冷硬的純黑白與高飽和藍
- 形狀：圓潤圓角（卡片、按鈕 rounded）、柔和陰影，不用銳利邊角
- 字體：親和易讀的中文字體 + 適度行距，標題溫潤不死板
- 質感：留白舒適、視覺溫柔，突顯「關懷協會」的人情味與親近感
- 仍遵守 CLAUDE.md：**無 emoji**、**無 left-border accent**、Tailwind 優先

- [ ] 定義設計系統：上述溫暖配色 token、字體、間距、元件規範
- [ ] 重新設計首頁、文章列表、文章內頁、關於我們、行事曆、捐款頁
- [ ] 暗色模式維持 `dark:` variant（暗色也走溫暖調，避免冷藍）
- [ ] 響應式 + 無障礙 (a11y)
- [ ] 升 Tailwind 4

### Phase 4 — Vercel 部署
- [ ] 連接 Vercel ↔ GitHub repo
- [ ] 設定環境變數（Supabase、Cloudinary）
- [ ] 設定自訂網域 `www.daoyi.org`
- [ ] ISR / 快取策略

---

## 四、決策點（已定案 2026-06-22）

1. **後台 CMS = B（可視化編輯後台，含登入 + 圖片上傳 + 所見即所得）**，但維護者只有使用者一人 → 不做多人權限角色，以「單人自己順手」為設計原則，但要好用（能打字排版、上傳圖、預覽）。
2. **UIUX 調性 = 溫暖關懷感，主色暖橘 / 暖棕**（色票由 Claude 定，見第六節）。
3. **舊 74 篇先保留靜態，之後再考慮匯入** → adapter 設計成可擴充，第一階段不碰舊資料。
4. **網域 `www.daoyi.org.tw`**（注意是 .org.tw）已就緒，由使用者後續自行掛到 Vercel；部署先用 Vercel 預設網址。
5. **Supabase schema 與舊 TSX 分開設計**（不硬套巢狀結構，走正規化 Postgres，由 Claude 定，見第七節）。
6. **行事曆、捐款、PDF 翻頁等特殊功能：保留並改版**。
7. **維護者只有使用者一人** → 全系統以「單人維護、自己看得懂」為最高原則。

### 重要發現：舊文章沒有獨立「內文 body」
舊文章內頁顯示的「內容」其實就是 `shortIntro`（長摘要）+ 圖片相簿，屬於「**圖文相簿型貼文**」，非長篇 HTML 內文。
→ 新 schema 設計成**同時支援**：(a) 真正的長文內文（新文章可寫 rich content），(b) 舊的「摘要 + 相簿」模式（向後相容）。

---

## 五、風險與備註

- `output: "export"` 移除後，部署平台**必須**換掉（Azure Static 不支援 SSR）→ 改 Vercel ✓
- Cloudinary 圖片路徑邏輯（`transformThumbnailPath`）保留，不動
- `BLOG_CONSTANTS/` 與 `public/images/` 列為唯讀（CLAUDE.md 規範）
- 遵守既有 Coding Style：禁 emoji、禁 left-border accent、Tailwind 優先

---

## 六、設計系統草案 — 溫暖關懷（暖橘 / 暖棕）

> 以下為提案，Phase 3 動工前可再微調。

### 配色 token（淺色模式）
| 用途 | 色名 | Hex | 說明 |
|------|------|-----|------|
| 主色 Primary | 暖橘 | `#E08A4B` | 按鈕、連結、強調 |
| 主色深 | 暖棕 | `#A65A2E` | hover、標題重點 |
| 輔色 Accent | 柔陶土 | `#D9A77C` | 標籤、次要點綴 |
| 背景 Base | 米白 | `#FAF6F0` | 頁面底色，溫潤不刺眼 |
| 卡片 Surface | 暖白 | `#FFFFFF` / `#FDFBF7` | 卡片、區塊 |
| 文字主 | 暖墨 | `#3A3330` | 內文（非純黑，偏暖） |
| 文字次 | 暖灰 | `#7A716B` | 輔助文字、日期 |
| 邊框 | 淺暖灰 | `#E8E0D8` | 分隔線、卡片邊 |

### 配色 token（暗色模式，仍走暖調避免冷藍）
| 用途 | Hex |
|------|-----|
| 背景 Base | `#241F1C`（暖深棕黑） |
| 卡片 Surface | `#2E2825` |
| 主色 Primary | `#E89A5E`（暗色下提亮的暖橘） |
| 文字主 | `#F0E8E0` |
| 文字次 | `#B5A89E` |

### 字體
- 中文標題：思源宋體 / Noto Serif TC（莊重溫潤）或 思源黑體較親和 → 建議標題用 **Noto Serif TC**、內文用 **Noto Sans TC**，宋黑搭配兼顧莊重與易讀
- 數字/英文：Inter 或系統 sans

### 形狀與質感
- 圓角：卡片 `rounded-2xl`、按鈕 `rounded-full` 或 `rounded-xl`
- 陰影：柔和低對比 `shadow-sm` / `shadow-md`，暖色微染
- 大量留白、舒適行距，視覺溫柔親近

---

## 七、Supabase Schema 草案（新文章用，與舊 TSX 分開）

> 正規化設計，向後相容「摘要+相簿」模式，也支援新文章的長文內文。

```sql
-- 文章主表
create table articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,           -- 網址用，取代舊的數字 id
  title        text not null,
  category     text not null,                  -- 道一 / 經典班會 / 道務活動（可日後拆 categories 表）
  excerpt      text,                           -- 短摘要（對應舊 shortIntro 的精簡版）
  body         text,                           -- 長文內文（rich text / markdown / html），新文章用；舊式可留空
  cover_image  text,                           -- Cloudinary public id 或 URL（對應舊 thumbnail）
  author_name  text default '道一關懷協會',
  tags         text[],                         -- 標籤陣列
  is_featured  boolean default false,          -- 對應舊 featureArticle
  is_published boolean default false,          -- 草稿 / 發布
  published_at timestamptz,                    -- 發布日期（排序用，對應舊 date）
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 文章圖片（相簿，一對多）
create table article_images (
  id          uuid primary key default gen_random_uuid(),
  article_id  uuid references articles(id) on delete cascade,
  image_url   text not null,                   -- Cloudinary public id 或 URL
  sort_order  int default 0,                   -- 相簿排序
  caption     text
);

-- SEO（選配，也可直接放 articles 欄位）
-- 簡化起見第一版先把 seo 併進 articles：seo_keywords text, og_image text
```

### Adapter 統一讀取（讓頁面不在乎來源）
```ts
// src/lib/articles.ts
type UnifiedArticle = { /* 統一介面：slug,title,category,excerpt,body,cover,images,date,featured */ };

async function getAllArticles(): Promise<UnifiedArticle[]> {
  const legacy = mapLegacy(ARTICLES_LIST);          // 舊 74 篇靜態 → 轉成 UnifiedArticle
  const db     = mapDb(await supabase.from('articles').select('*, article_images(*)'));
  return [...legacy, ...db].sort(byDateDesc);        // 合併、依日期排序
}
```

### RLS（Row Level Security）
- `articles` / `article_images`：公開讀「已發布」(`is_published = true`)
- 寫入：僅限登入的 admin（你本人）→ Supabase Auth + policy

### 後台 CMS（B 方案，單人用）
- `/admin` 路由，Supabase Auth 登入（只開你的帳號）
- 文章列表 / 新增 / 編輯 / 刪除
- 內文編輯器：rich text（建議 Tiptap）或先用 Markdown
- 圖片上傳：直傳 Cloudinary（沿用現有 cloud name）→ 存回 `article_images`
- 預覽：發布前看實際版面
