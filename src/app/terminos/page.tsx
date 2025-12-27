"use client";

import Link from 'next/link';

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-nude-light flex flex-col pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <nav className="mb-12">
                    <Link href="/" className="text-primary font-bold flex items-center gap-2 hover:opacity-70 transition-all">
                        <span>←</span> Regresar al Inicio
                    </Link>
                </nav>

                <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-secondary/20">
                    <h1 className="text-4xl md:text-5xl font-serif text-primary font-bold mb-8">Términos y Condiciones</h1>
                    <p className="text-foreground/50 text-sm mb-12 italic border-l-4 border-primary/20 pl-4">
                        Última actualización: 23 de diciembre de 2025
                    </p>

                    <div className="prose prose-stone max-w-none space-y-8 text-foreground/80 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">1. Generalidades</h2>
                            <p>
                                El acceso y uso de este sitio web se rige por los presentes Términos y Condiciones, así como por la legislación vigente en la República del Perú. Al utilizar nuestra plataforma para reservar citas o consultar servicios, usted acepta plenamente estos términos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">2. De las Reservas y Citas</h2>
                            <p>Las reservas realizadas a través de la web están sujetas a disponibilidad:</p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>El cliente debe presentarse 10 minutos antes de su cita programada.</li>
                                <li>Se otorgará una tolerancia máxima de 10 minutos de retraso. Pasado este tiempo, la cita podrá ser reprogramada o cancelada para no afectar la agenda.</li>
                                <li>Las cancelaciones o reprogramaciones deben realizarse con al menos 24 horas de anticipación vía WhatsApp.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">3. Precios y Pagos</h2>
                            <p>
                                Los precios mostrados en la web son referenciales y pueden variar según el largo del cabello, complejidad del servicio o productos adicionales solicitados en el salón. Todos los pagos se realizan directamente en el establecimiento físico mediante efectivo, tarjeta de débito/crédito o Yape/Plin.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">4. Programa de Puntos y Fidelización</h2>
                            <p>
                                Los puntos acumulados en el programa <strong>BellaAdmin</strong> son personales e intransferibles. Tienen una vigencia de 12 meses desde su última acumulación. Bella Salon se reserva el derecho de modificar los beneficios del programa previo aviso a través de sus canales oficiales.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">5. Libro de Reclamaciones</h2>
                            <p>
                                Conforme al Código de Protección al Consumidor, contamos con un <strong>Libro de Reclamaciones Virtual</strong> disponible en nuestro sitio web para cualquier queja o reclamo sobre nuestros servicios.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">6. Propiedad Intelectual</h2>
                            <p>
                                Todas las imágenes, logotipos y contenidos de este sitio son propiedad exclusiva de Bella Salon y están protegidos por las leyes de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">7. Modificaciones</h2>
                            <p>
                                Reservamos el derecho de actualizar estos Términos y Condiciones en cualquier momento para adaptarlos a cambios legales o mejoras operativas.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
