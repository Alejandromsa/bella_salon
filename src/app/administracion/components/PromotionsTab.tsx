"use client";

import { LoyaltyConfig, Promotion, Service } from './types';

interface PromotionsTabProps {
    loyaltyConfig: LoyaltyConfig;
    updateLoyaltySettings: (field: string, value: number) => void;
    newPromotion: {
        name: string;
        type: 'discount' | 'free_service';
        trigger: 'visits' | 'points';
        threshold: number;
        period: 'month' | 'total';
        reward: number | string;
        description: string;
    };
    handlePromotionChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    addPromotion: (e: React.FormEvent) => void;
    togglePromotionStatus: (id: number) => void;
    deletePromotion: (id: number) => void;
    services: Service[];
    editPromotion: (promo: any) => void;
    clonePromotion: (promo: any) => void;
    isEditing: boolean;
    cancelEdit: () => void;
}

export default function PromotionsTab({
    loyaltyConfig,
    updateLoyaltySettings,
    newPromotion,
    handlePromotionChange,
    addPromotion,
    togglePromotionStatus,
    deletePromotion,
    services,
    editPromotion,
    clonePromotion,
    isEditing,
    cancelEdit
}: PromotionsTabProps) {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-3xl font-serif text-foreground">Gestión de Promociones y Fidelización</h2>
                <p className="text-sm text-foreground/60 mt-2">Configura el programa de puntos y crea promociones automáticas basadas en la frecuencia de visitas o puntos acumulados.</p>
            </div>

            {/* Loyalty Program Configuration */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <span>⭐</span> Configuración del Programa de Fidelización
                </h3>
                <p className="text-sm text-foreground/60 mb-6">Define cómo se acumulan puntos y cuándo un cliente alcanza el estatus VIP.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <label className="block text-sm font-bold text-foreground/70 mb-2">Puntos por Sol Gastado</label>
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={loyaltyConfig.pointsPerSole}
                            onChange={(e) => updateLoyaltySettings('pointsPerSole', parseFloat(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none text-lg font-bold"
                        />
                        <p className="text-xs text-foreground/50 mt-2">Ejemplo: Si pones 1, el cliente gana 1 punto por cada S/ 1 que gaste.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <label className="block text-sm font-bold text-foreground/70 mb-2">Gasto Mínimo para VIP (S/)</label>
                        <input
                            type="number"
                            min="0"
                            value={loyaltyConfig.vipThreshold}
                            onChange={(e) => updateLoyaltySettings('vipThreshold', parseFloat(e.target.value))}
                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none text-lg font-bold"
                        />
                        <p className="text-xs text-foreground/50 mt-2">Monto total que debe gastar un cliente para convertirse en VIP.</p>
                    </div>
                </div>
            </div>

            {/* Promotions Management */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                <h3 className="text-lg font-bold text-foreground mb-2">Promociones Automáticas y Canjes</h3>
                <p className="text-sm text-foreground/60 mb-6">Crea promociones activadas por visitas o puntos canjeables.</p>

                {/* Add/Edit Promotion Form */}
                <form onSubmit={addPromotion} className="mb-6 p-6 bg-secondary/5 rounded-xl border border-secondary/20">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-foreground text-primary">
                            {isEditing ? '✏️ Editar Promoción' : '➕ Crear Nueva Promoción'}
                        </h4>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="text-sm text-foreground/60 hover:text-foreground px-4 py-2 rounded-lg border border-secondary/20 hover:bg-secondary/10 transition-colors"
                            >
                                ✕ Cancelar
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Nombre de la Promoción *</label>
                            <input
                                name="name"
                                placeholder="Ej. Cliente Frecuente"
                                value={newPromotion.name}
                                onChange={handlePromotionChange}
                                className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Tipo de Recompensa *</label>
                            <select
                                name="type"
                                value={newPromotion.type}
                                onChange={handlePromotionChange}
                                className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none bg-white font-medium"
                            >
                                <option value="discount">Descuento (%)</option>
                                <option value="free_service">Servicio Gratis</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Activador (Disparador) *</label>
                            <select
                                name="trigger"
                                value={newPromotion.trigger}
                                onChange={handlePromotionChange}
                                className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none bg-white font-medium"
                            >
                                <option value="visits">Por Visitas</option>
                                <option value="points">Por Puntos Canjeables</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">
                                {newPromotion.trigger === 'visits' ? 'Visitas Requeridas *' : 'Puntos Requeridos (Costo) *'}
                            </label>
                            <input
                                name="threshold"
                                type="number"
                                min="1"
                                placeholder={newPromotion.trigger === 'visits' ? "Ej. 5" : "Ej. 100"}
                                value={newPromotion.threshold}
                                onChange={handlePromotionChange}
                                className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Recompensa *</label>
                            {newPromotion.type === 'discount' ? (
                                <input
                                    name="reward"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={newPromotion.reward}
                                    onChange={handlePromotionChange}
                                    className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                                    required
                                />
                            ) : (
                                <select
                                    name="reward"
                                    value={newPromotion.reward}
                                    onChange={handlePromotionChange}
                                    className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none bg-white font-medium"
                                >
                                    <option value="">Seleccione un servicio...</option>
                                    {services.filter(s => s.active).map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Descripción</label>
                            <input
                                name="description"
                                placeholder="Ej. Descuento al alcanzar 5 visitas"
                                value={newPromotion.description}
                                onChange={handlePromotionChange}
                                className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 font-bold shadow-lg transition-all transform hover:-translate-y-1">
                            {isEditing ? '💾 Guardar Cambios' : '🚀 Agregar Promoción'}
                        </button>
                    </div>
                </form>

                {/* Promotions List */}
                <div className="space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Promociones Activas e Inactivas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loyaltyConfig.promotions.map(promo => (
                            <div key={promo.id} className={`p-5 rounded-2xl border-2 transition-all hover:shadow-sm ${promo.active ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-70 grayscale'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-bold text-foreground">
                                                {promo.name}
                                            </h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${promo.active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                                {promo.active ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-foreground/70 mb-4 italic">"{promo.description}"</p>
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-1.5">
                                                <span>{promo.trigger === 'visits' ? '📊' : '⭐'}</span>
                                                <span className="text-xs font-bold">
                                                    {promo.threshold} {promo.trigger === 'visits' ? 'visitas' : 'puntos'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span>🎁</span>
                                                <span className="text-xs font-bold text-primary">{promo.type === 'discount' ? `${promo.reward}% DCTO` : `${promo.reward} GRATIS`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => editPromotion(promo)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 transition-colors"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => clonePromotion(promo)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 shadow-sm hover:bg-purple-100 transition-colors"
                                            title="Clonar"
                                        >
                                            📋
                                        </button>
                                        <button
                                            onClick={() => togglePromotionStatus(promo.id)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors"
                                            title={promo.active ? 'Pausar' : 'Activar'}
                                        >
                                            {promo.active ? '⏸️' : '▶️'}
                                        </button>
                                        <button
                                            onClick={() => deletePromotion(promo.id)}
                                            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl shadow-sm hover:bg-red-100 transition-colors"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
