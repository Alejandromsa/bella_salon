"use client";

import { Client, Promotion } from './types';

interface ClientsTabProps {
    clients: Client[];
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    newClient: {
        name: string;
        phone: string;
        email: string;
        docType: string;
        docNumber: string;
        birthDate: string;
        address: string;
    };
    handleNewClientChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    addClient: (e: React.FormEvent) => void;
    updateClient: (id: number, data: any) => void;
    deleteClient: (id: number) => void;
    calculateMonthlyVisits: (clientId: number) => number;
    getApplicablePromotions: (clientId: number) => Promotion[];
    openClientProfile: (id: number) => void;
    redeemPromotion: (clientId: number, promotionId: number) => void;
}

export default function ClientsTab({
    clients,
    searchTerm,
    setSearchTerm,
    newClient,
    handleNewClientChange,
    addClient,
    updateClient,
    deleteClient,
    calculateMonthlyVisits,
    getApplicablePromotions,
    openClientProfile,
    redeemPromotion
}: ClientsTabProps) {
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-serif text-foreground">Gestión de Clientes</h2>
                    <p className="text-sm text-foreground/60 mt-2">Administra la base de datos de tus clientes, visualiza su historial y gestiona su información personal.</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none w-80"
                    />
                </div>
            </div>

            {/* Add Client Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                <h3 className="text-lg font-bold text-foreground mb-2">Registrar Nuevo Cliente</h3>
                <p className="text-sm text-foreground/60 mb-6">Complete los datos del cliente. Los campos marcados con * son obligatorios.</p>
                <form onSubmit={addClient} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Nombre Completo *</label>
                            <input name="name" placeholder="Ej. María Pérez García" value={newClient.name} onChange={handleNewClientChange} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" required />
                            <p className="text-xs text-foreground/50 mt-1">Nombre y apellidos del cliente</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Teléfono *</label>
                            <input name="phone" placeholder="+51 999 999 999" value={newClient.phone} onChange={handleNewClientChange} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" required />
                            <p className="text-xs text-foreground/50 mt-1">Número de contacto principal</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Email</label>
                            <input name="email" type="email" placeholder="cliente@ejemplo.com" value={newClient.email} onChange={handleNewClientChange} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                            <p className="text-xs text-foreground/50 mt-1">Correo electrónico (opcional)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Tipo de Documento</label>
                            <select name="docType" value={newClient.docType} onChange={handleNewClientChange} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none bg-white">
                                <option value="DNI">DNI</option>
                                <option value="CE">CE</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </select>
                            <p className="text-xs text-foreground/50 mt-1">Documento de identidad</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Número de Documento</label>
                            <input name="docNumber" placeholder="12345678" value={newClient.docNumber} onChange={handleNewClientChange} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                            <p className="text-xs text-foreground/50 mt-1">Número del documento seleccionado</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Fecha de Nacimiento</label>
                            <input name="birthDate" type="date" value={newClient.birthDate} onChange={handleNewClientChange} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                            <p className="text-xs text-foreground/50 mt-1">Para enviar saludos de cumpleaños</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-2">Dirección</label>
                        <input name="address" placeholder="Av. Principal 123, Lima" value={newClient.address} onChange={handleNewClientChange} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                        <p className="text-xs text-foreground/50 mt-1">Dirección completa del cliente (opcional)</p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-secondary/20">
                        <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 font-medium shadow-lg">
                            Registrar Cliente
                        </button>
                    </div>
                </form>
            </div>

            {/* Clients List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredClients.map((client) => {
                    const monthlyVisits = calculateMonthlyVisits(client.id);
                    const applicablePromos = getApplicablePromotions(client.id);

                    return (
                        <div key={client.id} className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all hover:shadow-md ${client.vipStatus ? 'border-yellow-200 bg-yellow-50/10' : 'border-secondary/20'}`}>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif font-bold">
                                        {client.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                                                {client.name}
                                                {client.vipStatus && <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">👑 VIP</span>}
                                            </h4>
                                            <div className="flex gap-4 mt-1 text-sm text-foreground/60">
                                                <span>📱 {client.phone}</span>
                                                <span>📧 {client.email}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => openClientProfile(client.id)} className="px-4 py-2 bg-secondary/20 hover:bg-secondary/40 rounded-lg text-sm font-medium transition-colors">
                                            Ver Perfil
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div className="bg-white p-3 rounded-xl border border-secondary/10">
                                            <p className="text-xs text-foreground/40 font-medium mb-1 uppercase">Visitas Totales</p>
                                            <p className="text-lg font-bold text-foreground">{client.totalVisits}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-secondary/10">
                                            <p className="text-xs text-foreground/40 font-medium mb-1 uppercase">Este Mes</p>
                                            <p className="text-lg font-bold text-primary">{monthlyVisits}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-secondary/10">
                                            <p className="text-xs text-foreground/40 font-medium mb-1 uppercase">Gasto Total</p>
                                            <p className="text-lg font-bold text-foreground">S/ {client.totalSpent}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-secondary/10">
                                            <p className="text-xs text-foreground/40 font-medium mb-1 uppercase">Puntos</p>
                                            <p className="text-lg font-bold text-foreground">{client.loyaltyPoints} ⭐</p>
                                        </div>
                                    </div>

                                    {applicablePromos.length > 0 && (
                                        <div className="mt-4 p-4 bg-green-50/50 border border-green-200 rounded-xl">
                                            <p className="text-xs text-green-700 font-bold flex items-center gap-1 mb-2 italic">🎉 PROMOCIONES ALCANZADAS:</p>
                                            <div className="flex flex-wrap gap-3">
                                                {applicablePromos.map(promo => (
                                                    <div key={promo.id} className="flex items-center gap-2 bg-white border border-green-100 p-1.5 pr-2 rounded-lg shadow-sm">
                                                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-md font-bold">
                                                            🎁 {promo.name}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-foreground/60 italic">
                                                            {promo.type === 'discount' ? `${promo.reward}% Desc.` : `${promo.reward} Gratis`}
                                                        </span>
                                                        {promo.trigger === 'points' && (
                                                            <button
                                                                onClick={() => redeemPromotion(client.id, promo.id)}
                                                                className="ml-2 text-[10px] bg-primary text-white px-2 py-1 rounded hover:bg-primary/90 transition-colors font-bold uppercase"
                                                            >
                                                                Canjear (-{promo.threshold} ⭐)
                                                            </button>
                                                        )}
                                                        {promo.trigger === 'visits' && (
                                                            <span className="ml-2 text-[8px] bg-secondary/20 text-foreground/40 px-1 py-0.5 rounded font-black uppercase">Automática</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {client.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-secondary/30 px-2 py-0.5 rounded-full text-foreground/70 font-bold uppercase tracking-wide">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {client.notes && <p className="mt-2 text-xs text-foreground/50 border-t border-secondary/10 pt-2 italic">"{client.notes}"</p>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
