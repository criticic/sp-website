import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'Digital ID - IIT BHU',
  description: 'Digital ID system for IIT (BHU) Varanasi students - Secure, dynamic QR code-based identification.',
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
        <div className="min-h-screen">
          {children}
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
