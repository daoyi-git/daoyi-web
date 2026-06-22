import type { Metadata } from "next";
import { PdfReader } from "@/src/components/pdf/pdf-reader";

export const metadata: Metadata = {
  title: "道親手冊",
  description: "道一關懷協會 道親手冊 線上翻閱。",
};

export default function DaoQinHandbookPage() {
  return <PdfReader url="/pdf/dao-qin-handbook.pdf" title="道親手冊" />;
}
