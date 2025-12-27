"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          const featured = data.filter((s: any) => s.featured).slice(0, 3);
          setFeaturedServices(featured.length > 0 ? featured : data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching featured services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-[#faf7f2]">
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/gold-background.jpg"
            alt="Gold Wall Background"
            fill
            className="object-cover opacity-60 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-primary/70 uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">Bienvenido a BellaSalón</span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-primary font-bold mb-8 tracking-tighter leading-[0.9] drop-shadow-sm">
              Tu Belleza, <br /> <span className="italic font-normal">Nuestra Arte.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Un escape exclusivo donde la elegancia y el bienestar se encuentran para crear una experiencia transformadora.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <MagneticButton>
              <Link href="/reservar" className="group relative bg-primary text-white overflow-hidden px-10 py-5 rounded-full text-lg font-medium transition-all shadow-xl hover:shadow-2xl hover:shadow-primary/30 block">
                <span className="relative z-10">Reservar Cita Ahora</span>
                <motion.div
                  className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link href="/servicios" className="group bg-white/80 backdrop-blur-md text-primary border border-primary/20 hover:border-primary px-10 py-5 rounded-full text-lg font-medium transition-all duration-300 block">
                Explorar Servicios
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/30"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Featured Services Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold mb-4 block underline underline-offset-8 decoration-accent/30">Rituales de Lujo</span>
            <h2 className="text-5xl md:text-6xl font-serif text-foreground mb-4">Experiencias Destacadas</h2>
            <p className="text-foreground/50 max-w-xl mx-auto text-lg">Cuidadosamente seleccionados para revitalizar tu cuerpo y espíritu.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-20 h-[2px] bg-primary/10 relative overflow-hidden">
                <motion.div
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-primary w-1/2"
                />
              </div>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
            >
              {featuredServices.map((svc, idx) => (
                <motion.div
                  key={svc.id || idx}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                  }}
                  className="group"
                >
                  <div className="relative h-[500px] w-full mb-8 overflow-hidden rounded-[2rem] shadow-sm">
                    <Image
                      src={(svc.image?.startsWith('http') || svc.image?.startsWith('/')) ? svc.image : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"}
                      alt={svc.name}
                      fill
                      className="object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                      <p className="text-white/90 text-sm mb-2 font-medium">Desde S/ {svc.price}</p>
                      <Link href="/reservar" className="text-white font-serif text-xl underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">
                        Reservar este ritual
                      </Link>
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors duration-300">{svc.name}</h3>
                  <p className="text-foreground/60 leading-relaxed font-light line-clamp-2">{svc.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-20"
          >
            <Link href="/servicios" className="inline-flex items-center gap-4 text-primary font-medium group text-xl">
              <span className="border-b border-primary/20 group-hover:border-primary transition-colors">Ver todos los servicios</span>
              <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-[#faf7f2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="relative aspect-[4/5] w-full rounded-[3rem] overflow-hidden shadow-2xl z-10">
              <Image
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80"
                alt="Salon Interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="absolute top-10 -left-10 w-40 h-40 border border-primary/20 rounded-full z-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <span className="text-accent tracking-widest text-xs font-bold mb-4 block">NUESTRO MANIFIESTO</span>
            <h2 className="text-5xl font-serif text-primary mb-8 leading-tight">Donde el Bienestar se Encuentra con la Sofisticación</h2>
            <p className="text-foreground/70 text-lg mb-8 leading-relaxed">
              En BellaSalón, creemos que la belleza no es solo una apariencia, sino un estado de ser. Nuestro equipo de artesanos de la belleza combina técnicas tradicionales con las innovaciones más puras para revelar tu mejor versión.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <span className="text-3xl font-serif text-primary block mb-2">100%</span>
                <span className="text-xs text-foreground/50 uppercase tracking-widest">Productos Orgánicos</span>
              </div>
              <div>
                <span className="text-3xl font-serif text-primary block mb-2">15+</span>
                <span className="text-xs text-foreground/50 uppercase tracking-widest">Años de Maestría</span>
              </div>
            </div>
            <Link href="/nosotros" className="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-colors pb-1 inline-block">
              Nuestra Historia
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Wall of Love */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Testimonios</span>
            <h2 className="text-5xl font-serif text-primary">Voces de <span className="italic font-normal">Belleza</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Valeria Mendoza",
                role: "Cliente Frecuente",
                text: "La atención al detalle es incomparable. El Balayage superó todas mis expectativas, mi cabello nunca se sintió tan saludable.",
                service: "Balayage",
                stars: 5
              },
              {
                name: "Ricardo Silva",
                role: "Visitante",
                text: "Un ambiente de paz absoluta. El tratamiento facial me dejó renovado. Definitivamente el mejor spa de la ciudad.",
                service: "Tratamiento Facial",
                stars: 5
              },
              {
                name: "Elena Torres",
                role: "VIP Member",
                text: "Amo el sistema de puntos. Pero más allá de eso, el talento de las especialistas es lo que me hace volver cada mes.",
                service: "Manicura Gel",
                stars: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#faf7f2] p-10 rounded-[2.5rem] relative group hover:bg-primary transition-colors duration-500"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.stars)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-accent group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground/70 text-lg italic mb-8 group-hover:text-white/80 transition-colors leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-bold text-primary group-hover:text-white transition-colors uppercase tracking-widest text-sm">{testimonial.name}</h4>
                  <p className="text-accent text-xs group-hover:text-white/60 transition-colors">{testimonial.service}</p>
                </div>
                <div className="absolute top-8 right-10 text-primary/5 group-hover:text-white/5 transition-colors">
                  <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 09V12C15.017 12.5523 14.5693 13 14.017 13H11.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.56929 13 5.017 13H2.017V21H5.017Z" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <svg className="w-16 h-16 text-primary/10 mx-auto mb-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 09V12C15.017 12.5523 14.5693 13 14.017 13H11.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.56929 13 5.017 13H2.017V21H5.017Z" />
            </svg>
            <blockquote className="text-4xl md:text-5xl font-serif italic text-foreground/90 leading-tight mb-12">
              "La belleza comienza en el momento en que decides ser tú misma."
            </blockquote>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              className="h-[1px] bg-primary/30 mx-auto mb-6"
            />
            <cite className="block text-primary font-bold not-italic tracking-[0.2em] text-sm uppercase">— Coco Chanel</cite>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
