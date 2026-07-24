import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Students\' Parliament IIT BHU',
  description: 'The official website of Students\' Parliament IIT BHU - Representing the voice of students and fostering democratic governance within the institution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
