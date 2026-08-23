import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Import the sleek, modern font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'] 
});

export const metadata: Metadata = {
  title: "TrueTag | AI Used Car Valuation",
  description: "Algorithmic pricing for daily commuter vehicles, powered by AI insights and real-time market data."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} bg-slate-950`}>
        {children}
      </body>
    </html>
  );
}