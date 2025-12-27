"use client";

import { useState } from 'react';
import { Client } from './types';

interface PointsVisitsTabProps {
    clients: Client[];
    updateClient: (id: number, data: any) => void;
}

export default function PointsVisitsTab({ clients, updateClient }: PointsVisitsTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
    const [adjustmentReason, setAdjustmentReason] = useState('');

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    );

    const handleAdjustPoints = (clientId: number, currentPoints: number, amount: number) => {
        if (amount === 0) return;
        const newPoints = Math.max(0, currentPoints + amount);
        updateClient(clientId, { loyaltyPoints: newPoints });
        setAdjustmentAmount(0);
        alert(`Puntos actualizados: ${newPoints} ⭐`);
    };

    const handleAdjustVisits = (clientId: number, currentVisits: number, amount: number) => {
        if (amount === 0) return;
        const newVisits = Math.max(0, currentVisits + amount);
        updateClient(clientId, { totalVisits: newVisits });
        setAdjustmentAmount(0);
        alert(`Visitas totales actualizadas: ${newVisits}`);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-3xl font-serif text-foreground">Gestión de Puntos y Visitas</h2>
                <p className="text-sm text-foreground/60 mt-2">Ajusta manualmente los puntos de fidelidad y el contador de visitas de tus clientes para correcciones o premios especiales.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 text-xl text-primary font-bold">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-secondary focus:border-primary outline-none text-lg font-medium"
                    />
                </div>
            </div>

            {/* Adjustment Form & List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground px-2">Listado de Clientes para Ajuste</h3>
                {filteredClients.length > 0 ? (
                    filteredClients.slice(0, 10).map(client => (
                        <div key={client.id} className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">{client.name}</h4>
                                    <div className="flex gap-3 text-xs text-foreground/50">
                                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-black">⭐ {client.loyaltyPoints} pts</span>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-black">📅 {client.totalVisits} visitas</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                                <div className="flex items-center gap-2 bg-secondary/5 p-2 rounded-xl border border-secondary/10">
                                    <input
                                        type="number"
                                        placeholder="Monto (+/-)"
                                        className="w-24 px-3 py-2 rounded-lg border border-secondary/20 focus:border-primary outline-none text-sm font-bold"
                                        onChange={(e) => setAdjustmentAmount(parseFloat(e.target.value))}
                                    />
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleAdjustPoints(client.id, client.loyaltyPoints, adjustmentAmount)}
                                            className="bg-purple-500 text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-purple-600 transition-colors"
                                        >
                                            Puntos
                                        </button>
                                        <button
                                            onClick={() => handleAdjustVisits(client.id, client.totalVisits, adjustmentAmount)}
                                            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 transition-colors"
                                        >
                                            Visitas
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-secondary/40">
                        <p className="text-foreground/40 italic">No se encontraron clientes con esos datos.</p>
                    </div>
                )}
                {filteredClients.length > 10 && (
                    <p className="text-center text-xs text-foreground/40 mt-4">Mostrando los primeros 10 resultados. Refina tu búsqueda si no encuentras al cliente.</p>
                )}
            </div>

            {/* Quick Summary / Info */}
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <span>💡</span> Guía de Uso
                </h4>
                <ul className="text-xs text-foreground/70 space-y-2 list-disc pl-4">
                    <li>Usa valores **positivos** (ej: 10) para añadir puntos o visitas.</li>
                    <li>Usa valores **negativos** (ej: -5) para restar puntos o visitas por error o devolución.</li>
                    <li>Los puntos y visitas afectan directamente el acceso a promociones automáticas y de canje.</li>
                    <li>Los cambios son instantáneos y se reflejan en el perfil del cliente.</li>
                </ul>
            </div>
        </div>
    );
}
