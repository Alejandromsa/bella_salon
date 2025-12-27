"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/administracion");

    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <WhatsAppButton />
            <Footer />
        </>
    );
}
