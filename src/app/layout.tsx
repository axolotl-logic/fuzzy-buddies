import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fuzzie Buddies",
  description:
    "e2e monkey testing with replayable sessions and automated accessibility testing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
