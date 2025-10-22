import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog App",
  description: "A simple blog app with comments functionality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-blue-600 text-white py-4">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold">My Blog</h1>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-100 py-6 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
            <p>© {new Date().getFullYear()} My Blog App</p>
          </div>
        </footer>
      </body>
    </html>
  );
}