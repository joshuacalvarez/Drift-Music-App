import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import SessionWrapper from "./SessionWrapper";
import NavBar from "@/components/NavBar";
import { DeleteConfirmationProvider } from "./deleteconfirmationprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drift Music App",
  description: "Web App for managing albums",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionWrapper>
          <DeleteConfirmationProvider>
            <NavBar />
            <main className="p-4" style={{ marginLeft: "220px" }}>
              {children}
            </main>
          </DeleteConfirmationProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
