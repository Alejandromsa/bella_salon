import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BellaAdmin - Panel de Administración",
  description: "Panel de administración de BellaSalón",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
