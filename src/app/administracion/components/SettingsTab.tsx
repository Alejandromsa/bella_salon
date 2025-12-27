"use client";

interface SettingsTabProps {
    settings: {
        businessName: string;
        ruc: string;
        fiscalAddress: string;
        whatsapp: string;
        complaintsBookUrl: string;
        privacyPolicyUrl: string;
        termsUrl: string;
        bookingEnabled: boolean;
        bookingWhatsapp: string;
        bookingWhatsappMessage: string;
        bookingRateLimitEnabled: boolean;
        bookingRateLimitMinutes: number;
        bookingRateLimitMaxBookings: number;
    };
    standardStaffSchedule: {
        [key: string]: {
            active: boolean;
            start: string;
            end: string;
            breaks: any[];
        };
    };
    daysOfWeek: string[];
    updateSettings: (field: string, value: string | boolean) => void;
    updateStandardSchedule: (day: string, field: string, value: any) => void;
    saveSettings: () => void;
}

export default function SettingsTab({
    settings,
    standardStaffSchedule,
    daysOfWeek,
    updateSettings,
    updateStandardSchedule,
    saveSettings
}: SettingsTabProps) {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-3xl font-serif text-foreground">Configuración Global</h2>
                <p className="text-sm text-foreground/60 mt-2">Gestiona la información legal de tu negocio y parámetros generales para cumplir con las normativas peruanas (INDECOPI).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Legal Information (INDECOPI/Sunat) */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/20 space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <span>⚖️</span> Información Legal y Fiscal
                    </h3>
                    <p className="text-xs text-foreground/50 mb-4">Datos obligatorios para comprobantes y visualización legal en la web.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Razón Social</label>
                            <input
                                type="text"
                                value={settings.businessName}
                                onChange={(e) => updateSettings('businessName', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all"
                                placeholder="Ej. Bella Salon E.I.R.L."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">RUC</label>
                            <input
                                type="text"
                                value={settings.ruc}
                                onChange={(e) => updateSettings('ruc', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all"
                                placeholder="20XXXXXXXXX"
                                maxLength={11}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Dirección Fiscal</label>
                            <input
                                type="text"
                                value={settings.fiscalAddress}
                                onChange={(e) => updateSettings('fiscalAddress', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all"
                                placeholder="Av. Ejemplo 123, Lima"
                            />
                        </div>
                    </div>
                </div>

                {/* Digital Compliance */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/20 space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <span>🛡️</span> Cumplimiento Digital
                    </h3>
                    <p className="text-xs text-foreground/50 mb-4">Enlaces obligatorios para evitar penalidades de protección al consumidor.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Libro de Reclamaciones (URL)</label>
                            <input
                                type="text"
                                value={settings.complaintsBookUrl}
                                onChange={(e) => updateSettings('complaintsBookUrl', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all"
                                placeholder="https://tusitio.com/libro-de-reclamaciones"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Políticas de Privacidad (URL)</label>
                            <input
                                type="text"
                                value={settings.privacyPolicyUrl}
                                onChange={(e) => updateSettings('privacyPolicyUrl', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all"
                                placeholder="https://tusitio.com/privacidad"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Términos y Condiciones (URL)</label>
                            <input
                                type="text"
                                value={settings.termsUrl}
                                onChange={(e) => updateSettings('termsUrl', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all"
                                placeholder="https://tusitio.com/terminos"
                            />
                        </div>
                    </div>
                </div>

                {/* Channels & Notifications */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/20 space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <span>💬</span> Canales de Contacto
                    </h3>
                    <p className="text-xs text-foreground/50 mb-4">Configura cómo interactúan los clientes contigo.</p>

                    <div>
                        <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">WhatsApp de Atención</label>
                        <input
                            type="text"
                            value={settings.whatsapp}
                            onChange={(e) => updateSettings('whatsapp', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all text-lg font-bold text-primary"
                            placeholder="+51 999 999 999"
                        />
                        <p className="text-[10px] text-foreground/40 mt-2 italic">Este número se usa para el botón flotante de WhatsApp en la web.</p>
                    </div>
                </div>

                {/* Booking Configuration */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/20 space-y-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <span>📅</span> Sistema de Reservas
                    </h3>
                    <p className="text-xs text-foreground/50 mb-4">Controla cómo funcionan las reservas de citas en tu web.</p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <input
                                type="checkbox"
                                checked={settings.bookingEnabled}
                                onChange={(e) => updateSettings('bookingEnabled', e.target.checked)}
                                className="w-5 h-5 accent-primary cursor-pointer"
                                id="bookingEnabled"
                            />
                            <label htmlFor="bookingEnabled" className="cursor-pointer flex-1">
                                <span className="font-bold text-foreground block">Habilitar reservas online</span>
                                <span className="text-xs text-foreground/60">
                                    {settings.bookingEnabled
                                        ? 'Los clientes pueden reservar directamente en la web'
                                        : 'Los clientes serán redirigidos a WhatsApp para reservar'}
                                </span>
                            </label>
                        </div>

                        {!settings.bookingEnabled && (
                            <div className="animate-fade-in space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-xs text-yellow-800 font-bold">
                                    📱 Configuración de redirección a WhatsApp
                                </p>

                                <div>
                                    <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">
                                        Número de WhatsApp para Reservas
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.bookingWhatsapp}
                                        onChange={(e) => updateSettings('bookingWhatsapp', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all text-lg font-bold text-primary"
                                        placeholder="+51 999 999 999"
                                    />
                                    <p className="text-[10px] text-foreground/40 mt-2 italic">
                                        Los clientes serán redirigidos a este número cuando intenten reservar.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">
                                        Mensaje Predefinido
                                    </label>
                                    <textarea
                                        value={settings.bookingWhatsappMessage}
                                        onChange={(e) => updateSettings('bookingWhatsappMessage', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all resize-none"
                                        placeholder="Hola, quisiera reservar una cita..."
                                        rows={3}
                                    />
                                    <p className="text-[10px] text-foreground/40 mt-2 italic">
                                        Este mensaje aparecerá automáticamente en WhatsApp.
                                    </p>
                                </div>
                            </div>
                        )}

                        {settings.bookingEnabled && (
                            <div className="animate-fade-in space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                <p className="text-xs text-purple-800 font-bold">
                                    🔒 Restricciones de Seguridad para Reservas
                                </p>

                                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
                                    <input
                                        type="checkbox"
                                        checked={settings.bookingRateLimitEnabled}
                                        onChange={(e) => updateSettings('bookingRateLimitEnabled', e.target.checked)}
                                        className="w-5 h-5 accent-primary cursor-pointer"
                                        id="bookingRateLimitEnabled"
                                    />
                                    <label htmlFor="bookingRateLimitEnabled" className="cursor-pointer flex-1">
                                        <span className="font-bold text-foreground block">Habilitar restricción de tiempo</span>
                                        <span className="text-xs text-foreground/60">
                                            {settings.bookingRateLimitEnabled
                                                ? 'Los dispositivos tendrán un límite de tiempo entre reservas'
                                                : 'Los dispositivos podrán reservar sin restricciones de tiempo'}
                                        </span>
                                    </label>
                                </div>

                                {settings.bookingRateLimitEnabled && (
                                    <div className="animate-fade-in space-y-4">
                                        <div>
                                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">
                                                Tiempo de espera entre reservas (minutos)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="1440"
                                                value={settings.bookingRateLimitMinutes}
                                                onChange={(e) => updateSettings('bookingRateLimitMinutes', parseInt(e.target.value) || 30)}
                                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all text-lg font-bold text-primary"
                                                placeholder="30"
                                            />
                                            <p className="text-[10px] text-foreground/40 mt-2 italic">
                                                Un dispositivo deberá esperar este tiempo antes de poder hacer otra reserva.
                                                Por defecto: 30 minutos.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">
                                                Máximo de reservas por dispositivo
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={settings.bookingRateLimitMaxBookings}
                                                onChange={(e) => updateSettings('bookingRateLimitMaxBookings', parseInt(e.target.value) || 3)}
                                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-all text-lg font-bold text-primary"
                                                placeholder="3"
                                            />
                                            <p className="text-[10px] text-foreground/40 mt-2 italic">
                                                Número máximo de reservas permitidas por dispositivo (para futuras funcionalidades).
                                                Por defecto: 3.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Standard Staff Schedule Configuration */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm border-2 border-blue-200">
                <div className="mb-6">
                    <h3 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                        <span>🕒</span> Horario Estándar de Especialistas
                    </h3>
                    <p className="text-sm text-foreground/60 mt-2">
                        Define el horario laboral predeterminado que se aplicará a los especialistas con "Horario Regular".
                        Esto te permite asignar rápidamente un horario estándar sin tener que configurarlo manualmente para cada persona.
                    </p>
                </div>

                <div className="space-y-3">
                    {daysOfWeek.map(day => {
                        const daySchedule = standardStaffSchedule[day];
                        return (
                            <div
                                key={day}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    daySchedule?.active
                                        ? 'bg-white border-primary/30 shadow-sm'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-3 min-w-[100px]">
                                        <input
                                            type="checkbox"
                                            checked={daySchedule?.active || false}
                                            onChange={(e) => updateStandardSchedule(day, 'active', e.target.checked)}
                                            className="w-5 h-5 accent-primary cursor-pointer"
                                        />
                                        <span className="font-bold text-foreground">{day}</span>
                                    </div>

                                    {daySchedule?.active && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm text-foreground/70 font-medium">Inicio:</label>
                                                <input
                                                    type="time"
                                                    value={daySchedule.start}
                                                    onChange={(e) => updateStandardSchedule(day, 'start', e.target.value)}
                                                    className="px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none text-sm font-mono"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm text-foreground/70 font-medium">Fin:</label>
                                                <input
                                                    type="time"
                                                    value={daySchedule.end}
                                                    onChange={(e) => updateStandardSchedule(day, 'end', e.target.value)}
                                                    className="px-3 py-2 rounded-lg border border-secondary focus:border-primary outline-none text-sm font-mono"
                                                />
                                            </div>
                                            <span className="text-xs text-primary font-bold ml-auto bg-primary/10 px-3 py-1 rounded-full">
                                                {(() => {
                                                    const start = new Date(`2000-01-01T${daySchedule.start}`);
                                                    const end = new Date(`2000-01-01T${daySchedule.end}`);
                                                    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                                                    return `${hours.toFixed(1)}h`;
                                                })()}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 p-4 bg-blue-100/50 border border-blue-200 rounded-xl">
                    <p className="text-xs text-blue-800 leading-relaxed">
                        💡 <b>Tip:</b> Este horario se aplicará automáticamente a especialistas que seleccionen "Horario Regular"
                        en su configuración personal. Los especialistas con "Horario Custom" mantendrán su horario personalizado.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Save Section */}
                <div className="flex items-center justify-center lg:justify-start">
                    <button
                        onClick={saveSettings}
                        className="bg-primary text-white px-12 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-primary/90 shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        💾 Guardar Toda la Configuración
                    </button>
                </div>
            </div>

            {/* Peruvian Law Info Box */}
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2 uppercase text-xs tracking-tighter">
                    <span>⚠️</span> Recordatorio Normativo (Perú)
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                    Según la <b>Ley N° 29571 (Código de Protección al Consumidor)</b>, es obligatorio que tu plataforma virtual cuente con un enlace visible al <b>Libro de Reclamaciones</b>. Asimismo, para cumplir con la <b>Ley N° 29733 (Ley de Protección de Datos Personales)</b>, debes publicar tus Políticas de Privacidad y obtener el consentimiento antes de recopilar datos de clientes en tus formularios de reserva.
                </p>
            </div>
        </div>
    );
}
