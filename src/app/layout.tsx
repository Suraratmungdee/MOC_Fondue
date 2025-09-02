import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { DateRangeProvider } from "@/contexts/DateRangeContext";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AI Social Listening on MOC Fondue",
  description: "AI Social Listening on MOC Fondue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSansThai.variable}>
        <DateRangeProvider>
          {children}
          <Toaster />
        </DateRangeProvider>
      </body>
    </html>
  );
}
