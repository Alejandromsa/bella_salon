"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
    const [footerData, setFooterData] = useState({
        businessName: 'Bella Salon E.I.R.L.',
        ruc: '20123456789',
        fiscalAddress: 'Av. Las Gardenias 456, Santiago de Surco, Lima',
        complaintsBookUrl: '/libro-de-reclamaciones',
        privacyPolicyUrl: '/privacidad',
        termsUrl: '/terminos',
        whatsapp: '+51 999 999 999',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    setFooterData({
                        businessName: data.business_name || 'Bella Salon E.I.R.L.',
                        ruc: data.ruc || '20123456789',
                        fiscalAddress: data.fiscal_address || 'Av. Las Gardenias 456, Santiago de Surco, Lima',
                        complaintsBookUrl: data.complaints_book_url || '/libro-de-reclamaciones',
                        privacyPolicyUrl: data.privacy_policy_url || '/privacidad',
                        termsUrl: data.terms_url || '/terminos',
                        whatsapp: data.whatsapp || '+51 999 999 999',
                    });
                }
            } catch (e) {
                console.error("Error loading footer data", e);
            }
        };
        fetchSettings();
    }, []);

    const whatsappUrl = `https://wa.me/${footerData.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola, quisiera más información sobre sus servicios')}`;

    return (
        <footer className="bg-secondary/30 mt-auto pt-16 pb-8 border-t border-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand & Peru Identity */}
                    <div className="text-center md:text-left">
                        <Link href="/" className="text-2xl font-serif text-primary font-bold mb-4 inline-block">
                            BellaSalón
                        </Link>
                        <div className="space-y-2">
                            <p className="text-foreground/70 text-sm font-bold uppercase tracking-tighter">
                                {footerData.businessName}
                            </p>
                            <p className="text-foreground/50 text-xs">
                                RUC: {footerData.ruc}
                            </p>
                            <p className="text-foreground/50 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
                                {footerData.fiscalAddress}
                            </p>
                            <p className="text-foreground/70 text-sm mt-4 italic">
                                "Donde la belleza se encuentra con el bienestar."
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-lg text-foreground mb-6">Información</h4>
                        <ul className="space-y-3 text-sm text-foreground/70">
                            <li><Link href="/servicios" className="hover:text-primary transition-colors">Nuestros Servicios</Link></li>
                            <li><Link href="/nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                            <li><Link href="/galeria" className="hover:text-primary transition-colors">Galería</Link></li>
                            <li><Link href="/reservar" className="hover:text-primary transition-colors font-semibold text-primary">Reservar Cita</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Customer Service */}
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-lg text-foreground mb-6">Contacto y Atención</h4>
                        <div className="space-y-4 text-sm text-foreground/70">
                            <div>
                                <p className="text-xs text-foreground/50 mb-2">¿Necesitas ayuda?</p>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#20bd5a] transition-all text-sm font-medium shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                    Escríbenos
                                </a>
                            </div>
                            <div>
                                <p className="text-xs text-foreground/50 mb-1">Horario de atención:</p>
                                <p className="font-medium">Lun - Sáb: 9:00 - 20:00</p>
                            </div>
                            <div>
                                <Link href="/contacto" className="text-primary hover:underline font-medium">
                                    Ver más opciones de contacto →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Legal & Compliance */}
                    <div className="text-center md:text-left">
                        <h4 className="font-serif text-lg text-foreground mb-6">Legal y Cumplimiento</h4>
                        <ul className="space-y-3 text-sm text-foreground/70">
                            <li>
                                <Link href={footerData.privacyPolicyUrl} className="hover:text-primary transition-colors">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link href={footerData.termsUrl} className="hover:text-primary transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li className="pt-2">
                                <Link
                                    href={footerData.complaintsBookUrl}
                                    className="inline-flex items-center gap-2 text-xs hover:text-primary transition-colors border border-secondary/20 px-3 py-2 rounded-lg bg-white/50"
                                >
                                    <span>📘</span>
                                    <span className="font-medium">Libro de Reclamaciones</span>
                                </Link>
                                <p className="text-[10px] text-foreground/40 mt-2 italic">
                                    Conforme a la Ley N° 29571
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-foreground/40 uppercase tracking-widest font-bold">
                    <p>© {new Date().getFullYear()} BellaSalón. Operado en Perú. Todos los derechos reservados.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span>Belleza con Propósito</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
