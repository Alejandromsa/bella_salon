"use client";

import { useState } from 'react';
import { Client } from './types';

interface ClientProfileModalProps {
    show: boolean;
    onClose: () => void;
    client: Client | null;
    updateClient: (id: number, updates: any) => void;
}

export default function ClientProfileModal({
    show,
    onClose,
    client,
    updateClient
}: ClientProfileModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedClient, setEditedClient] = useState<Client | null>(null);

    if (!show || !client) return null;

    const handleEdit = () => {
        setEditedClient({ ...client });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedClient(null);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!editedClient) return;

        updateClient(client.id, {
            name: editedClient.name,
            email: editedClient.email,
            phone: editedClient.phone,
            docType: editedClient.docType,
            docNumber: editedClient.docNumber,
            birthDate: editedClient.birthDate,
            address: editedClient.address,
            notes: editedClient.notes,
            tags: editedClient.tags
        });

        setIsEditing(false);
        setEditedClient(null);
        alert('Cliente actualizado correctamente');
    };

    const handleChange = (field: string, value: any) => {
        if (!editedClient) return;
        setEditedClient({ ...editedClient, [field]: value });
    };

    const currentClient = isEditing && editedClient ? editedClient : client;

    // Format date from YYYY-MM-DD to DD/MM/YYYY for display
    const formatDateForDisplay = (dateStr: string | null) => {
        if (!dateStr) return 'No reg.';
        // Handle YYYY-MM-DD format
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-secondary/20 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-foreground">
                        {isEditing ? '✏️ Editar Cliente' : '👤 Perfil del Cliente'}
                    </h2>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                            >
                                ✏️ Editar
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-200 text-foreground px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                                >
                                    💾 Guardar
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="text-3xl text-foreground/40 hover:text-foreground">×</button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Header with Avatar */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white ${client.vipStatus ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-primary to-purple-600'}`}>
                            {currentClient.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={currentClient.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="text-3xl font-serif font-bold text-foreground mb-1 w-full px-3 py-1 rounded-lg border-2 border-primary focus:outline-none"
                                />
                            ) : (
                                <h3 className="text-3xl font-serif font-bold text-foreground mb-1">{currentClient.name}</h3>
                            )}
                            {client.vipStatus && <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold font-serif">👑 MIEMBRO VIP</span>}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs text-foreground/50 uppercase font-bold tracking-wider">📱 Teléfono</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={currentClient.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{currentClient.phone}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-foreground/50 uppercase font-bold tracking-wider">📧 Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={currentClient.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{currentClient.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Document Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs text-foreground/50 uppercase font-bold tracking-wider">Tipo Doc.</label>
                            {isEditing ? (
                                <select
                                    value={currentClient.docType}
                                    onChange={(e) => handleChange('docType', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none bg-white"
                                >
                                    <option value="DNI">DNI</option>
                                    <option value="CE">C.E.</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </select>
                            ) : (
                                <p className="text-foreground font-medium">{currentClient.docType}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-foreground/50 uppercase font-bold tracking-wider">Número</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={currentClient.docNumber}
                                    onChange={(e) => handleChange('docNumber', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{currentClient.docNumber || 'No reg.'}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-foreground/50 uppercase font-bold tracking-wider">🎂 Nacimiento</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={currentClient.birthDate || ''}
                                    onChange={(e) => handleChange('birthDate', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                />
                            ) : (
                                <p className="text-foreground font-medium">{formatDateForDisplay(currentClient.birthDate)}</p>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-secondary/10 p-4 rounded-xl">
                            <p className="text-xs text-foreground/50 uppercase font-bold tracking-wider mb-1">Gasto Total</p>
                            <p className="text-2xl font-bold text-foreground">S/ {client.totalSpent}</p>
                        </div>
                        <div className="bg-secondary/10 p-4 rounded-xl">
                            <p className="text-xs text-foreground/50 uppercase font-bold tracking-wider mb-1">Puntos</p>
                            <p className="text-2xl font-bold text-purple-600">{client.loyaltyPoints} ⭐</p>
                        </div>
                        <div className="bg-secondary/10 p-4 rounded-xl">
                            <p className="text-xs text-foreground/50 uppercase font-bold tracking-wider mb-1">Visitas</p>
                            <p className="text-2xl font-bold text-foreground">{client.totalVisits}</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mb-6">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <span>📍</span> Dirección
                        </h4>
                        {isEditing ? (
                            <input
                                type="text"
                                value={currentClient.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                placeholder="Dirección completa"
                            />
                        ) : (
                            <p className="text-foreground/70 bg-secondary/5 p-3 rounded-lg border border-secondary/10">
                                {currentClient.address || 'No proporcionada'}
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <span>🏷️</span> Etiquetas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {currentClient.tags && currentClient.tags.length > 0 ? (
                                currentClient.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        {tag}
                                        {isEditing && (
                                            <button
                                                onClick={() => handleChange('tags', currentClient.tags.filter((_, i) => i !== idx))}
                                                className="ml-1 text-purple-500 hover:text-purple-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-foreground/40 italic">Sin etiquetas</span>
                            )}
                        </div>
                    </div>

                    {/* Preferred Services */}
                    <div className="mb-6">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <span>💇</span> Servicios Preferidos
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {client.preferredServices && client.preferredServices.length > 0 ? (
                                client.preferredServices.map((s, idx) => (
                                    <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                        {s}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-foreground/40 italic">Sin historial de servicios preferidos</span>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <span>📝</span> Notas del Profesional
                        </h4>
                        {isEditing ? (
                            <textarea
                                value={currentClient.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                placeholder="Notas, preferencias, alergias, etc."
                            />
                        ) : (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-900 leading-relaxed italic">
                                "{currentClient.notes || 'No hay notas adicionales para este cliente.'}"
                            </div>
                        )}
                    </div>

                    {/* Redemption History */}
                    <div className="pt-4 mt-4 border-t border-secondary/10">
                        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2 text-purple-700">
                            <span>🎁</span> Historial de Canjes
                        </h4>
                        <div className="space-y-2">
                            {client.redeemedPromotions && client.redeemedPromotions.length > 0 ? (
                                client.redeemedPromotions.slice().reverse().map((redemption, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-100 shadow-sm">
                                        <div>
                                            <p className="font-bold text-purple-900 text-sm">{redemption.name}</p>
                                            <p className="text-[10px] text-purple-600/70 font-medium">{redemption.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-purple-700">-{redemption.pointsUsed} ⭐</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                    <p className="text-xs text-foreground/40 italic">Aún no ha canjeado sus puntos.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-secondary/20 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="bg-secondary text-foreground px-6 py-2 rounded-lg font-bold hover:bg-secondary/80"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
