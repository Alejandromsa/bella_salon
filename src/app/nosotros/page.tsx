"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Nosotros() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch('/api/staff');
                if (res.ok) {
                    const data = await res.json();
                    setStaff(data.filter((s: any) => s.active !== false) || []);
                }
            } catch (error) {
                console.error("Error fetching staff:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    if (loading) {
        return (
            <div className="bg-[#faf7f2] min-h-screen">
                <div className="relative py-40 bg-secondary/10 animate-pulse">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <div className="h-16 w-80 bg-secondary/20 mx-auto rounded-lg mb-6"></div>
                        <div className="h-6 w-3/4 bg-secondary/20 mx-auto rounded-lg"></div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-8 py-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-secondary/10 animate-pulse">
                                <div className="h-[450px] bg-secondary/5"></div>
                                <div className="p-10 space-y-6">
                                    <div className="h-8 w-3/4 bg-secondary/10 mx-auto rounded-md"></div>
                                    <div className="h-4 w-1/2 bg-secondary/10 mx-auto rounded-md"></div>
                                    <div className="space-y-3">
                                        <div className="h-3 w-full bg-secondary/5 rounded-md"></div>
                                        <div className="h-3 w-full bg-secondary/5 rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#faf7f2] min-h-screen pb-40 overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-48 bg-white overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80"
                        alt="Background"
                        fill
                        className="object-cover opacity-[0.02]"
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-primary tracking-[0.4em] font-bold text-xs uppercase mb-8 block"
                    >
                        Nuestra Esencia
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-serif text-primary mb-10 leading-tight"
                    >
                        El Arte de Ser <br /><span className="italic font-normal">Uno Mismo.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="text-xl md:text-2xl text-foreground/50 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Desde 2018, BellaSalón ha sido un santuario dedicado a la sofisticación y el bienestar, donde cada detalle está diseñado para revelar tu luz interior.
                    </motion.p>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 relative"
                        >
                            <div className="relative h-[700px] rounded-[4rem] overflow-hidden shadow-2xl z-10">
                                <Image
                                    src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80"
                                    alt="Filosofía"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-primary/5" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 border-2 border-primary/10 rounded-full -z-0" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1"
                        >
                            <h2 className="text-5xl font-serif text-primary mb-10">Nuestra Filosofía</h2>
                            <p className="text-foreground/60 text-xl mb-12 leading-relaxed font-light">
                                Creemos en una belleza consciente. No se trata solo de transformar tu apariencia, sino de nutrir tu espíritu a través de rituales que honran tu individualidad.
                            </p>
                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-2">Sostenibilidad</h3>
                                        <p className="text-foreground/50 font-light leading-relaxed">Solo utilizamos productos orgánicos certificados y cruelty-free.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-2">Artesanía</h3>
                                        <p className="text-foreground/50 font-light leading-relaxed">Nuestro equipo combina años de experiencia con las técnicas más innovadoras.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-40 bg-white/50 relative">
                <div className="max-w-7xl mx-auto px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <span className="text-secondary tracking-[0.3em] font-bold text-xs uppercase mb-4 block">Maestros del Estilo</span>
                        <h2 className="text-5xl md:text-6xl font-serif text-primary">Conoce a tus Artesanos</h2>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-16"
                    >
                        {staff.length > 0 ? staff.map((member, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group"
                            >
                                <div className="relative h-[550px] rounded-[3rem] overflow-hidden shadow-xl mb-10">
                                    <Image
                                        src={member.image || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80"}
                                        alt={member.name}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-3xl font-serif text-primary mb-2 transition-colors duration-300 group-hover:text-secondary">{member.name}</h3>
                                    <p className="text-primary/40 text-xs font-bold uppercase tracking-[0.2em] mb-6">{member.role}</p>
                                    <p className="text-foreground/50 font-light leading-relaxed px-4 line-clamp-3">
                                        {member.bio || "Especialista dedicado a brindar la mejor experiencia en BellaSalón."}
                                    </p>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-2xl text-foreground/30 font-serif italic">Nuestro equipo se está expandiendo...</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
