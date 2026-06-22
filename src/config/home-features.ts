/** 首頁特色區塊資料：人物分享、好書閱讀、拾穗集（單一來源，日後易維護） */

export interface FeaturedPerson {
  badge: string;
  title: string;
  date: string;
  author: string;
  image: string;
  href: string;
}

export interface Book {
  title: string;
  href: string;
  /** 書封漸層（Tailwind class） */
  cover: string;
  /** 書背深色（Tailwind class，立體書背用） */
  spine: string;
  /** 書名文字色 */
  ink: string;
}

export interface Gleaning {
  name: string;
  subtitle: string;
  /** Cloudinary public id */
  image: string;
  href: string;
}

/** 人物分享（種籽人物志） */
export const featuredPerson: FeaturedPerson = {
  badge: "種籽人物志",
  title: "好學不倦，筆耕不輟 — 何紹棠前人",
  date: "2024-12-15",
  author: "編輯室",
  image: "/images/he-qian-ren/index.jpg",
  href: "/he-qian-ren",
};

/** 好書閱讀 */
export const books: Book[] = [
  {
    title: "道親手冊",
    href: "/dao-qin-handbook",
    // 暖棕（深木色書封）
    cover: "from-[#8a5a32] to-[#5e3a1d]",
    spine: "from-[#4d2f17] to-[#3a2310]",
    ink: "text-amber-50",
  },
  {
    title: "道學心德",
    href: "/daomind",
    // 暖陶土橘
    cover: "from-[#c47a45] to-[#9a5328]",
    spine: "from-[#7d3f1c] to-[#5e2f14]",
    ink: "text-amber-50",
  },
];

/** 拾穗集（Gleaning Collection） */
export const gleanings: Gleaning[] = [
  {
    name: "何紹棠 前人",
    subtitle: "生平事蹟",
    image: "daoyi-web/gleanings/ho",
    href: "/gleanings-viewer?img=daoyi-web/gleanings/ho&title=何紹棠 前人 生平事蹟",
  },
  {
    name: "林月珠 壇主",
    subtitle: "生平事蹟",
    image: "daoyi-web/gleanings/lin",
    href: "/gleanings-viewer?img=daoyi-web/gleanings/lin&title=林月珠 壇主 生平事蹟",
  },
];
