"use client";

import { Client } from './types';

interface RedemptionsTabProps {
    clients: Client[];
}

export default function RedemptionsTab({ clients }: RedemptionsTabProps) {
    // Flatten all redemptions from all clients
    const allRedemptions = clients.flatMap(client =>
        (client.redeemedPromotions || []).map(redemption => ({
            ...redemption,
            clientName: client.name,
            clientPhone: client.phone
        }))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-3xl font-serif text-foreground">Gestión de Canjes</h2>
                <p className="text-sm text-foreground/60 mt-2">Historial centralizado de todas las promociones y premios canjeados por los clientes mediante sus puntos acumulados.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/5 border-b border-secondary/10">
                                <th className="px-6 py-4 text-xs font-black uppercase text-foreground/40 tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-xs font-black uppercase text-foreground/40 tracking-wider">Cliente</th>
                                <th className="px-6 py-4 text-xs font-black uppercase text-foreground/40 tracking-wider">Promoción / Premio</th>
                                <th className="px-6 py-4 text-xs font-black uppercase text-foreground/40 tracking-wider text-right">Puntos Usados</th>
                                <th className="px-6 py-4 text-xs font-black uppercase text-foreground/40 tracking-wider text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/10">
                            {allRedemptions.length > 0 ? (
                                allRedemptions.map((redemption, idx) => (
                                    <tr key={`${redemption.id}-${idx}`} className="hover:bg-secondary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-foreground/60">{redemption.date}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground">{redemption.clientName}</span>
                                                <span className="text-[10px] text-foreground/40">{redemption.clientPhone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">🎁</span>
                                                <span className="text-sm font-bold text-primary">{redemption.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black text-purple-600">-{redemption.pointsUsed} ⭐</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-tighter">Entregado</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl mb-4">🎫</span>
                                            <p className="text-foreground/40 italic">No hay registros de canjes realizados hasta el momento.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-100">
                    <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-2">Total Canjes</p>
                    <p className="text-3xl font-black text-purple-700">{allRedemptions.length}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100">
                    <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-2">Puntos Circulantes</p>
                    <p className="text-3xl font-black text-orange-700">
                        {clients.reduce((acc, c) => acc + c.loyaltyPoints, 0)} ⭐
                    </p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100">
                    <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">Puntos Canjeados (Ahorro)</p>
                    <p className="text-3xl font-black text-green-700">
                        {allRedemptions.reduce((acc, r) => acc + r.pointsUsed, 0)} ⭐
                    </p>
                </div>
            </div>
        </div>
    );
}
