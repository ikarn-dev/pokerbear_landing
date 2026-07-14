import type { Metadata } from "next";
import {
  Space_Grotesk,
  Geist_Mono,
  Bricolage_Grotesque,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import ContentGuard from "@/components/content-guard";

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
  title: "PokerBear — Predict privately. Win bigger.",
  description:
    "PokerBear is a private, on-chain football prediction market powered by Arcium. Predict privately and win bigger — your positions stay encrypted, end to end.",
  metadataBase: new URL("https://pokerbear.example"),
  openGraph: {
    title: "PokerBear — Predict privately. Win bigger.",
    description:
      "A private, on-chain football prediction market powered by Arcium. Your positions stay encrypted, end to end.",
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
        {/* Prioritize the hero video so it starts fetching immediately.
            React hoists this <link> into <head>. */}
        <link
          rel="preload"
          as="video"
          href="/assets/hero.webm"
          type="video/webm"
        />
        <ContentGuard />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
