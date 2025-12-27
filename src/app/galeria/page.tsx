"use client";
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80", category: "Cabello", title: "Corte Bob Texturizado" },
    { id: 2, src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80", category: "Uñas", title: "Manicura Gel Nude" },
    { id: 3, src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80", category: "Facial", title: "Tratamiento Hidratante" },
    { id: 4, src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80", category: "Maquillaje", title: "Look Novia Natural" },
    { id: 5, src: "https://images.unsplash.com/photo-1595476103518-3c8addac5ee9?auto=format&fit=crop&q=80", category: "Cabello", title: "Balayage Rubio Ceniza" },
    { id: 6, src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80", category: "Maquillaje", title: "Peinado de Gala" },
    { id: 7, src: "https://images.unsplash.com/photo-1632345031435-8727f68979a6?auto=format&fit=crop&q=80", category: "Cabello", title: "Corrección de Color" },
    { id: 8, src: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80", category: "Cabello", title: "Tratamiento Keratina" },
    { id: 9, src: "https://images.unsplash.com/photo-1487412947132-26c244971054?auto=format&fit=crop&q=80", category: "Facial", title: "Masaje Relajante" },
    { id: 10, src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80", category: "Uñas", title: "Diseño Artístico" },
    { id: 11, src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80", category: "Facial", title: "Spa Day Experiencia" },
    { id: 12, src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80", category: "Maquillaje", title: "Editorial Look" },
];

const categories = ["Todos", "Cabello", "Uñas", "Facial", "Maquillaje"];

export default function Galeria() {
    const [activeFilter, setActiveFilter] = useState("Todos");

    const filteredImages = activeFilter === "Todos"
        ? images
        : images.filter(img => img.category === activeFilter);

    return (
        <div className="bg-[#faf7f2] min-h-screen pb-32">
            {/* Header */}
            <section className="pt-40 pb-20 text-center px-4 max-w-4xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-secondary uppercase tracking-[0.3em] text-xs font-bold mb-4 block"
                >
                    Inspiración & Resultados
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-7xl font-serif text-primary mb-8"
                >
                    Galería de <span className="italic font-normal">Belleza</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-foreground/60 leading-relaxed font-light"
                >
                    Explora nuestra colección de transformaciones y rituales diseñados para elevar tu esencia natural.
                </motion.p>
            </section>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {categories.map((cat, idx) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`relative px-6 py-2 text-sm uppercase tracking-widest font-medium transition-colors duration-300 ${activeFilter === cat ? 'text-primary' : 'text-foreground/40 hover:text-foreground'
                                }`}
                        >
                            {cat}
                            {activeFilter === cat && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    layout
                    className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((img) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="relative break-inside-avoid overflow-hidden rounded-3xl group cursor-pointer shadow-xl shadow-primary/5 luxury-card"
                            >
                                <div className="relative aspect-[3/4]">
                                    <Image
                                        src={img.src}
                                        alt={img.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 text-white">
                                        <span className="text-secondary text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                                            {img.category}
                                        </span>
                                        <h3 className="text-2xl font-serif leading-tight">
                                            {img.title}
                                        </h3>
                                        <div className="mt-4 w-12 h-[1px] bg-white/50" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
