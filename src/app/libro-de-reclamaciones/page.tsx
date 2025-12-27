"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LibroReclamacionesPage() {
    const [salonData, setSalonData] = useState({
        businessName: 'Bella Salon E.I.R.L.',
        ruc: '20123456789',
        fiscalAddress: 'Av. Las Gardenias 456, Santiago de Surco, Lima',
    });

    const [formData, setFormData] = useState({
        // Consumidor
        fullName: '',
        documentType: 'DNI',
        documentNumber: '',
        address: '',
        phone: '',
        email: '',
        guardianName: '', // For minors
        // Producto/Servicio
        type: 'Servicio',
        amountClaimed: '',
        description: '',
        // Detalle
        complaintType: 'Reclamación', // Reclamación o Queja
        detail: '',
        request: '',
        consent: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedId, setSubmittedId] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('salon_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSalonData({
                    businessName: parsed.businessName || salonData.businessName,
                    ruc: parsed.ruc || salonData.ruc,
                    fiscalAddress: parsed.fiscalAddress || salonData.fiscalAddress,
                });
            } catch (e) { }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    salon: salonData,
                    ...formData
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSubmittedId(data.id);
                window.scrollTo(0, 0);
            } else {
                alert('Hubo un error al enviar su reclamación. Por favor, intente nuevamente.');
            }
        } catch (error) {
            alert('Error de conexión. Intente más tarde.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submittedId) {
        return (
            <div className="min-h-screen bg-nude-light flex items-center justify-center p-6 pt-32">
                <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center border border-secondary/20">
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-3xl font-serif text-primary font-bold mb-4">¡Reclamación Registrada!</h1>
                    <p className="text-foreground/70 mb-8 leading-relaxed">
                        Su Hoja de Reclamación ha sido enviada con éxito. El número de registro es: <br />
                        <span className="text-2xl font-black text-primary tracking-widest">#{submittedId}</span>
                    </p>
                    <p className="text-sm text-foreground/50 mb-12">
                        De acuerdo a ley, daremos respuesta a su requerimiento en un plazo no mayor a quince (15) días hábiles. Una copia de esta reclamación ha sido archivada en nuestro sistema.
                    </p>
                    <Link href="/" className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-nude-light flex flex-col pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-3xl shadow-xl border border-secondary/20 overflow-hidden">
                    {/* Header INDECOPI Style */}
                    <div className="bg-primary text-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter">Libro de Reclamaciones</h1>
                            <p className="text-white/80 text-xs font-bold mt-2 uppercase tracking-widest">Hoja de Reclamación Virtual</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center">
                            <p className="text-[10px] uppercase font-bold text-white/60">Razón Social</p>
                            <p className="text-sm font-bold">{salonData.businessName}</p>
                            <p className="text-[10px] text-white/60 mt-2 italic">RUC: {salonData.ruc}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        {/* 1. Datos del Consumidor */}
                        <section className="space-y-6">
                            <h2 className="text-lg font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                                Identificación del Consumidor Reclamante
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Nombre Completo *</label>
                                    <input name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Tipo de Documento *</label>
                                    <select name="documentType" value={formData.documentType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none bg-white">
                                        <option value="DNI">DNI</option>
                                        <option value="CE">C.E.</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Número de Documento *</label>
                                    <input name="documentNumber" required value={formData.documentNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Domicilio *</label>
                                    <input name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Teléfono *</label>
                                    <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Email *</label>
                                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* 2. Detalle del Producto/Servicio */}
                        <section className="space-y-6">
                            <h2 className="text-lg font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">2</span>
                                Identificación del Bien Contratado
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Tipo de Bien</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="radio" name="type" value="Producto" checked={formData.type === 'Producto'} onChange={handleChange} /> Producto
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="radio" name="type" value="Servicio" checked={formData.type === 'Servicio'} onChange={handleChange} /> Servicio
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Monto Reclamado (S/) *</label>
                                    <input name="amountClaimed" type="number" required placeholder="0.00" value={formData.amountClaimed} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Descripción del Bien (Ej: Corte de Cabello)</label>
                                    <input name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* 3. Detalle de la Reclamación */}
                        <section className="space-y-6">
                            <h2 className="text-lg font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">3</span>
                                Detalle de la Reclamación y Pedido del Consumidor
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Tipo de Incidencia</label>
                                    <div className="flex gap-6">
                                        <label className="flex items-start gap-2 text-sm cursor-pointer group">
                                            <input type="radio" name="complaintType" value="Reclamación" checked={formData.complaintType === 'Reclamación'} onChange={handleChange} className="mt-1" />
                                            <div>
                                                <span className="font-bold group-hover:text-primary transition-colors">Reclamación</span>
                                                <p className="text-[10px] text-foreground/40 leading-tight mt-1">Disconformidad relacionada a los productos o servicios.</p>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer group">
                                            <input type="radio" name="complaintType" value="Queja" checked={formData.complaintType === 'Queja'} onChange={handleChange} className="mt-1" />
                                            <div>
                                                <span className="font-bold group-hover:text-primary transition-colors">Queja</span>
                                                <p className="text-[10px] text-foreground/40 leading-tight mt-1">Disconformidad no relacionada directamente a los productos o servicios (ej: mala atención).</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Detalle de la Queja/Reclamación *</label>
                                    <textarea name="detail" required rows={5} value={formData.detail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none transition-all resize-none" placeholder="Explique lo sucedido con el mayor detalle posible..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-2">Pedido del Consumidor *</label>
                                    <textarea name="request" required rows={3} value={formData.request} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary outline-none transition-all resize-none" placeholder="¿Qué solución solicita?"></textarea>
                                </div>
                            </div>
                        </section>

                        {/* Consent & Submit */}
                        <div className="bg-secondary/5 p-6 md:p-10 rounded-3xl border border-secondary/20 space-y-6">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <input name="consent" type="checkbox" required checked={formData.consent} onChange={handleChange} className="mt-1.5 w-5 h-5 accent-primary" />
                                <span className="text-xs text-foreground/70 leading-relaxed font-medium group-hover:text-foreground transition-colors">
                                    Declaro que los datos consignados en el presente formulario son verdaderos y que el salon podrá utilizar mi correo electrónico y teléfono para enviarme la respuesta a la presente reclamación dentro del plazo legal. Autorizo el tratamiento de mis datos personales para este fin.
                                </span>
                            </label>

                            <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-t border-secondary/20 pt-8">
                                <p className="text-[10px] text-foreground/40 italic max-w-xs">
                                    * Todos los campos marcados son obligatorios para procesar su requerimiento conforme a la normativa vigente de INDECOPI.
                                </p>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Reclamación'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em]">Cuidamos tu experiencia • Bella Salon</p>
                </div>
            </div>
        </div>
    );
}
