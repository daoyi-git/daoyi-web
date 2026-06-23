import type { Metadata } from "next";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/src/components/layout/navbar";
import { Footer } from "@/src/components/layout/footer";
import { BackToTop } from "@/src/components/layout/back-to-top";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "社團法人新北市道一關懷協會",
    template: "%s | 道一關懷協會",
  },
  description: "道一關懷協會官方網站，提供協會資訊、班會報導與道務活動分享。",
  metadataBase: new URL("https://www.daoyi.org.tw"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-Hant"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <BackToTop />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
