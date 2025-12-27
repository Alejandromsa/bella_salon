"use client";

import Link from 'next/link';

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-nude-light flex flex-col pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <nav className="mb-12">
                    <Link href="/" className="text-primary font-bold flex items-center gap-2 hover:opacity-70 transition-all">
                        <span>←</span> Regresar al Inicio
                    </Link>
                </nav>

                <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-secondary/20">
                    <h1 className="text-4xl md:text-5xl font-serif text-primary font-bold mb-8">Política de Privacidad</h1>
                    <p className="text-foreground/50 text-sm mb-12 italic italic border-l-4 border-primary/20 pl-4">
                        Última actualización: 23 de diciembre de 2025
                    </p>

                    <div className="prose prose-stone max-w-none space-y-8 text-foreground/80 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">1. Introducción</h2>
                            <p>
                                En <strong>Bella Salon</strong>, nos tomamos muy en serio la privacidad de nuestros clientes. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal de acuerdo con la <strong>Ley N° 29733, Ley de Protección de Datos Personales</strong> de la República del Perú.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">2. Información Recopilada</h2>
                            <p>Para la prestación de nuestros servicios y la gestión de citas, podemos solicitarle los siguientes datos:</p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>Nombres y apellidos completos.</li>
                                <li>Número de documento de identidad (DNI/CE/Pasaporte).</li>
                                <li>Número de teléfono de contacto.</li>
                                <li>Correo electrónico.</li>
                                <li>Fecha de nacimiento (para promociones de fidelización).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">3. Finalidad del Tratamiento</h2>
                            <p>Los datos personales proporcionados serán utilizados exclusivamente para:</p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>Gestionar y confirmar sus reservas de servicios.</li>
                                <li>Contactarle vía WhatsApp o teléfono en caso de cambios en su cita.</li>
                                <li>Administrar su programa de puntos y beneficios VIP.</li>
                                <li>Enviar recordatorios de citas y encuestas de satisfacción.</li>
                                <li>Cumplir con las obligaciones fiscales y contables ante la SUNAT.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">4. Banco de Datos y Seguridad</h2>
                            <p>
                                Sus datos serán almacenados en el banco de datos denominado "Clientes" de titularidad de Bella Salon. Implementamos medidas de seguridad técnicas, organizativas y legales para evitar el acceso no autorizado o la pérdida de información.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">5. Derechos ARCO</h2>
                            <p>
                                Usted puede ejercer en cualquier momento sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong> enviando una solicitud a nuestro correo de atención al cliente o acudiendo físicamente a nuestro salón con su documento de identidad.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-foreground font-bold mb-4">6. Consentimiento</h2>
                            <p>
                                Al utilizar nuestro sitio web y registrar sus datos personales, usted otorga su consentimiento previo, informado, expreso e inequívoco para el tratamiento de sus datos conforme a los términos aquí descritos.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
