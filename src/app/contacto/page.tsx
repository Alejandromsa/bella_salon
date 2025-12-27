
export default function Contacto() {
    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Header */}
            <section className="bg-primary text-white py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-serif mb-4">Contáctanos</h1>
                <p className="text-white/80 max-w-2xl mx-auto px-4 text-lg">
                    Estamos aquí para responder tus dudas y agendar tu próxima experiencia de belleza.
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-secondary/20">
                        <h2 className="text-2xl font-serif text-foreground mb-8">Envíanos un mensaje</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-2">Nombre</label>
                                    <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Tu nombre" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-2">Email</label>
                                    <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="tucorreo@ejemplo.com" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-foreground/70 mb-2">Asunto</label>
                                <input type="text" id="subject" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Consulta sobre servicios" />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground/70 mb-2">Mensaje</label>
                                <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
                            </div>

                            <button type="button" className="w-full bg-primary text-white font-medium py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-serif text-foreground mb-8">Información de Contacto</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-secondary/30 p-3 rounded-full mr-4 text-primary">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Dirección</h3>
                                        <p className="text-foreground/70">Av. Principal 123, Colonia Centro<br />Ciudad de México, CP 12345</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-secondary/30 p-3 rounded-full mr-4 text-primary">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Teléfono</h3>
                                        <p className="text-foreground/70">+52 (55) 1234-5678</p>
                                        <p className="text-foreground/70 text-sm">Lunes a Sábado, 9:00 - 20:00</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-secondary/30 p-3 rounded-full mr-4 text-primary">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Email</h3>
                                        <p className="text-foreground/70">contacto@bellasalon.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-200 h-64 rounded-2xl w-full flex items-center justify-center relative overflow-hidden shadow-inner">
                            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=800x400&key=YOUR_API_KEY')] bg-cover bg-center opacity-50 grayscale" />
                            <span className="relative z-10 font-medium text-gray-500 bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">Mapa de Ubicación</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
