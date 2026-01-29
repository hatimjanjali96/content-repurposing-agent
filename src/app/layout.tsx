import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Marketing Content Team | Turn 1 Blog Into 21+ Posts",
  description:
    "Your AI-powered social marketing content team. Transform any blog article into 21+ platform-optimized social media posts, threads, and newsletters in under 2 minutes. 100% free.",
  keywords: [
    "social marketing",
    "AI content generator",
    "social media automation",
    "blog to social media",
    "content marketing",
    "LinkedIn posts",
    "Twitter threads",
    "Instagram content",
  ],
  authors: [{ name: "Hatim Janjali" }],
  creator: "Hatim Janjali",
  openGraph: {
    title: "Social Marketing Content Team | Turn 1 Blog Into 21+ Posts",
    description:
      "Your AI-powered social marketing content team. Transform any blog into 21+ platform-ready posts in under 2 minutes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Marketing Content Team",
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
