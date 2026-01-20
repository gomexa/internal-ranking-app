import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ranking Field Target",
  description: "Sistema de ranking interno de Field Target",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
