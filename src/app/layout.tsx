import type React from "react";
import { ThemeProvider } from "~/components/theme-provider";
import { Mona_Sans as FontSans } from "next/font/google";
import { cn } from "~/lib/utils";
import "~/app/globals.css";
import { Sidebar } from "~/components/sidebar";
import { Header } from "~/components/header";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Fuzzy Buddies Web Fuzzer</title>
        <meta name="description" content="Let raccoons test your app!" />
      </head>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
