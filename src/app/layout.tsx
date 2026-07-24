import type { Metadata } from "next";
import { DM_Serif_Display, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Students' Parliament IIT BHU",
  description: 'The official website of Students\' Parliament IIT BHU - Representing the voice of students and fostering democratic governance within the institution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased font-body">
        {children}
      </body>
    </html>
  );
}
