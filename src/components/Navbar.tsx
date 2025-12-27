"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Galería', href: '/galeria' },
        { name: 'Contacto', href: '/contacto' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-primary/10 py-2 shadow-sm' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0"
                    >
                        <Link href="/" className="text-3xl font-serif text-primary font-bold tracking-tight">
                            BellaSalón
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative group px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    {link.name}
                                    <motion.span
                                        className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                                        layoutId="underline"
                                    />
                                </Link>
                            ))}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href="/reservar" className="ml-4 bg-primary text-white hover:bg-primary/90 transition-all px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20">
                                    Reservar
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-primary p-2 focus:outline-none"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between items-end">
                                <motion.span
                                    animate={isOpen ? { rotate: 45, y: 8, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                                    className="w-full h-0.5 bg-current rounded-full"
                                />
                                <motion.span
                                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="w-2/3 h-0.5 bg-current rounded-full"
                                />
                                <motion.span
                                    animate={isOpen ? { rotate: -45, y: -10, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                                    className="w-full h-0.5 bg-current rounded-full"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: '100vh', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden bg-white fixed inset-0 z-40 flex flex-col items-center justify-center space-y-8 overflow-hidden"
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-primary p-2 hover:bg-primary/10 rounded-full transition-colors"
                            aria-label="Cerrar menú"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        {navLinks.map((link, idx) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-4xl font-serif text-foreground hover:text-primary transition-colors block"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 pt-8 border-t border-primary/10 w-2/3 text-center"
                        >
                            <Link
                                href="/reservar"
                                onClick={() => setIsOpen(false)}
                                className="bg-primary text-white px-12 py-5 rounded-full text-xl font-bold inline-block shadow-2xl"
                            >
                                Reservar Cita
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
