import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import DevToolsBlocker from "@/components/DevToolsBlocker";
import ClientLayout from "@/components/ClientLayout";
import ConditionalLayout from "@/components/ConditionalLayout";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BellaSalón - Tu Belleza, Nuestra Arte",
  description: "Reserva tu cita en el mejor salón de belleza. Servicios de primera clase y ambiente relajante.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col font-sans overflow-x-hidden`}>
        <DevToolsBlocker />
        <ConditionalLayout>
          <ClientLayout>{children}</ClientLayout>
        </ConditionalLayout>
      </body>
    </html>
  );
}
