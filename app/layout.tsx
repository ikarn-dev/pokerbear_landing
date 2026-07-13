import type { Metadata } from "next";
import {
  Space_Grotesk,
  Geist_Mono,
  Bricolage_Grotesque,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import CustomCursor from "@/components/custom-cursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PokerBear — Play sharper, win smarter",
  description:
    "PokerBear is the modern poker companion. Real-time odds, hand history, and buttery-smooth analytics built for players who take the game seriously.",
  metadataBase: new URL("https://pokerbear.example"),
  openGraph: {
    title: "PokerBear — Play sharper, win smarter",
    description:
      "The modern poker companion. Real-time odds, hand history, and buttery-smooth analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/*
        suppressHydrationWarning: browser extensions (e.g. Bitdefender's
        anti-tracker) inject attributes like `bis_register` / `__processed_*`
        onto <html>/<body> before React hydrates, causing a benign attribute
        mismatch. This flag suppresses the warning for these nodes only — it
        does not affect hydration of any child content.
      */}
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
