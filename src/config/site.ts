/** 全站設定與導覽結構（單一來源，Navbar / Footer / 行動選單共用） */

export const siteConfig = {
  name: "道一關懷協會",
  fullName: "社團法人新北市道一關懷協會",
  nameEn: "DAOYI Care Association",
  description: "道一關懷協會官方網站，提供協會資訊、班會報導與道務活動分享。",
  url: "https://www.daoyi.org.tw",
  logo: "/images/cropped-LOGO.png",
  facebook: "https://www.facebook.com/groups/1418391155044562",
};

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: "首頁", href: "/" },
  { label: "班會報導", href: "/blog" },
  { label: "聖樂影音", href: "/video" },
  { label: "行事曆", href: "/calendar" },
  { label: "何前人專輯", href: "/he-qian-ren" },
  {
    label: "文章",
    href: "#",
    children: [
      { label: "道親手冊", href: "/dao-qin-handbook" },
      { label: "道學心德", href: "/daomind" },
    ],
  },
  {
    label: "關於我們",
    href: "#",
    children: [
      { label: "協會章程", href: "/association-articles" },
      { label: "組織架構", href: "/structure" },
    ],
  },
  { label: "贊助本會", href: "/contact-us" },
];
