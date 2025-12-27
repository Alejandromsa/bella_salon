"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Servicios() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/services');
                if (res.ok) {
                    const data = await res.json();
                    setServices(data || []);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const categories = services.reduce((acc: any[], service: any) => {
        const category = acc.find(c => c.title === service.category);
        if (category) {
            category.items.push(service);
        } else {
            let categoryImage = "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80";
            if (service.category.toLowerCase().includes('uñas') || service.category.toLowerCase().includes('manos')) {
                categoryImage = "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80";
            } else if (service.category.toLowerCase().includes('facial') || service.category.toLowerCase().includes('piel')) {
                categoryImage = "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80";
            }

            acc.push({
                title: service.category,
                image: service.categoryImage || categoryImage,
                items: [service]
            });
        }
        return acc;
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (loading) {
        return (
            <div className="bg-[#faf7f2] min-h-screen">
                <div className="relative py-40 overflow-hidden bg-secondary/10 animate-pulse">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <div className="h-16 w-80 bg-secondary/20 mx-auto rounded-lg mb-6"></div>
                        <div className="h-6 w-96 bg-secondary/20 mx-auto rounded-lg"></div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-20 space-y-32">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-20 items-start">
                            <div className="w-full md:w-1/3 h-[500px] rounded-[3rem] bg-secondary/10 animate-pulse"></div>
                            <div className="w-full md:w-2/3 space-y-12">
                                <div className="h-12 w-64 bg-secondary/10 rounded-lg"></div>
                                <div className="space-y-8">
                                    {[1, 2, 3].map((j) => (
                                        <div key={j} className="h-32 w-full bg-secondary/5 rounded-2xl animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#faf7f2] min-h-screen pb-40 overflow-hidden">
            {/* Header */}
            <section className="relative py-48 overflow-hidden bg-white">
                <div className="absolute inset-x-0 top-0 h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
                        alt="Services"
                        fill
                        className="object-cover opacity-[0.03]"
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-primary tracking-[0.3em] font-bold text-xs uppercase mb-6 block"
                    >
                        Nuestra Colección
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-serif text-primary mb-8"
                    >
                        Menú de <span className="italic">Rituales</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Una curaduría de experiencias diseñadas para restaurar el equilibrio, realzar la belleza y elevar el espíritu.
                    </motion.p>
                </div>
            </section>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-6 mt-20 space-y-40">
                {categories.length > 0 ? categories.map((category, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="scroll-mt-32"
                        id={category.title.toLowerCase().replace(/\s+/g, '-')}
                    >
                        <div className="flex flex-col md:flex-row gap-20 items-start">
                            {/* Category Image */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="w-full md:w-1/3 relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl z-10"
                            >
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                            </motion.div>

                            {/* Category List */}
                            <div className="w-full md:w-2/3">
                                <div className="flex items-center gap-8 mb-12">
                                    <h2 className="text-4xl md:text-5xl font-serif text-primary">{category.title}</h2>
                                    <div className="h-[1px] bg-primary/20 flex-grow"></div>
                                </div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    className="grid grid-cols-1 gap-8"
                                >
                                    {category.items.map((item: any, itemIdx: number) => (
                                        <motion.div
                                            key={itemIdx}
                                            variants={itemVariants}
                                            className="flex justify-between items-start border-b border-primary/5 pb-10 group hover:bg-white/40 p-8 rounded-3xl transition-all duration-500"
                                        >
                                            <div className="max-w-[75%]">
                                                <h3 className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors duration-300">{item.name}</h3>
                                                <p className="text-foreground/50 mt-4 text-base leading-relaxed font-light">{item.description}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <span className="text-2xl font-medium text-primary block mb-4">S/ {item.price}</span>
                                                <Link
                                                    href="/reservar"
                                                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                                                >
                                                    Reservar <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="text-center py-40">
                        <p className="text-2xl text-foreground/30 font-serif italic">Nuestra colección se está actualizando...</p>
                    </div>
                )}
            </div>

            {/* Final CTA */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-40 text-center"
            >
                <Link href="/reservar" className="group relative inline-flex items-center gap-6 bg-primary text-white py-6 px-16 rounded-full text-xl font-bold transition-all shadow-2xl hover:shadow-primary/40 overflow-hidden">
                    <span className="relative z-10">Agenda tu Experiencia</span>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform relative z-10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <motion.div
                        className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                    />
                </Link>
            </motion.div>
        </div>
    );
}
