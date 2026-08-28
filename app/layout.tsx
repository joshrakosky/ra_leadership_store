import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Republic Airways Leadership",
  description: "Product ordering for Republic Airways Leadership",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
