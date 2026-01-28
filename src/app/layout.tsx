import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Repurposing Agent | Turn 1 Blog Into 21+ Posts",
  description:
    "AI-powered content repurposing tool. Transform any blog article into 21+ platform-optimized social media posts, threads, and newsletters in under 2 minutes. 100% free.",
  keywords: [
    "content repurposing",
    "AI content generator",
    "social media automation",
    "blog to social media",
    "content marketing",
    "LinkedIn posts",
    "Twitter threads",
    "Instagram content",
  ],
  authors: [{ name: "Hatim Johar" }],
  creator: "Hatim Johar",
  openGraph: {
    title: "Content Repurposing Agent | Turn 1 Blog Into 21+ Posts",
    description:
      "AI-powered content repurposing. Transform any blog into 21+ platform-ready posts in under 2 minutes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Repurposing Agent",
    description:
      "Turn 1 blog into 21+ platform-ready posts with AI. Free tool for marketers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
