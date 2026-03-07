import { AppProvider } from "@/contexts/AppContext";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rewardo",
  description: "行動経済学に基づくご褒美ガチャ型 Todo アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased bg-zinc-950 text-white`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
