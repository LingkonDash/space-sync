import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpaceSync — Book Co-working & Event Spaces",
  description:
    "Discover and book co-working desks, meeting rooms, event halls, and studios near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.className} ${spaceGrotesk.className}`}
    >
      <body className="min-h-full flex flex-col font-sans bg-neutral-bg">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}