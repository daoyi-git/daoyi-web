import type { Metadata } from "next";
import { PdfReader } from "@/src/components/pdf/pdf-reader";

export const metadata: Metadata = {
  title: "道學心德",
  description: "道一關懷協會 道學心德 線上翻閱。",
};

export default function DaomindPage() {
  return <PdfReader url="/pdf/daomind.pdf" title="道學心德" />;
}
