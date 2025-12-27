"use client";

import { Staff } from './types';

interface StaffScheduleModalProps {
    show: boolean;
    onClose: () => void;
    editingStaff: Staff | null;
    daysOfWeek: string[];
    standardStaffSchedule: {
        [key: string]: {
            active: boolean;
            start: string;
            end: string;
            breaks: any[];
        };
    };
    updateStaffSchedule: (id: number, day: string, field: string, value: any) => void;
    applyStandardSchedule: (id: number) => void;
    addVacationDay: (id: number, date: string) => void;
    removeVacationDay: (id: number, date: string) => void;
    addException: (id: number, exception: any) => void;
    removeException: (id: number, index: number) => void;
    toggleWorksHolidays: (id: number) => void;
    saveStaffSchedule: (id: number) => void;
}

export default function StaffScheduleModal({
    show,
    onClose,
    editingStaff,
    daysOfWeek,
    standardStaffSchedule,
    updateStaffSchedule,
    applyStandardSchedule,
    addVacationDay,
    removeVacationDay,
    addException,
    removeException,
    toggleWorksHolidays,
    saveStaffSchedule
}: StaffScheduleModalProps) {
    if (!show || !editingStaff) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-secondary/20 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-foreground">Calendario de {editingStaff.name}</h2>
                        <p className="text-sm text-foreground/60">{editingStaff.role}</p>
                    </div>
                    <button onClick={onClose} className="text-3xl text-foreground/40 hover:text-foreground transition-colors">×</button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Schedule Preset Selector */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            ⚙️ Tipo de Horario
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-white p-4 rounded-xl border-2 border-primary/30">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <span className="text-2xl">🕒</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-foreground mb-1">Horario Regular</h4>
                                        <p className="text-xs text-foreground/60 mb-3">
                                            Aplica el horario estándar configurado globalmente en Ajustes. Ideal para especialistas con horarios consistentes.
                                        </p>
                                        <button
                                            onClick={() => applyStandardSchedule(editingStaff.id)}
                                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium text-sm transition-all transform hover:scale-105 shadow-md"
                                        >
                                            ✨ Aplicar Horario Regular
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 bg-white p-4 rounded-xl border-2 border-secondary/30">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <span className="text-2xl">🎨</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-foreground mb-1">Horario Custom</h4>
                                        <p className="text-xs text-foreground/60">
                                            Personaliza el horario día por día según las necesidades específicas del especialista.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-100/50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-800">
                                💡 <b>Tip:</b> Puedes usar el Horario Regular como punto de partida y luego personalizarlo.
                                Los cambios se guardan automáticamente como Horario Custom.
                            </p>
                        </div>
                    </div>

                    {/* Weekly Schedule */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            📅 Horario Semanal Regular
                        </h3>
                        <div className="space-y-3">
                            {daysOfWeek.map(day => {
                                const daySchedule = editingStaff.schedule.weeklySchedule[day];
                                return (
                                    <div key={day} className={`p-4 rounded-xl border-2 transition-all ${daySchedule?.active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={daySchedule?.active || false}
                                                    onChange={(e) => updateStaffSchedule(editingStaff.id, day, 'active', e.target.checked)}
                                                    className="w-5 h-5 accent-primary cursor-pointer"
                                                />
                                                <span className="font-bold text-foreground w-12">{day}</span>
                                            </div>

                                            {daySchedule?.active && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm text-foreground/70">Inicio:</label>
                                                        <input
                                                            type="time"
                                                            value={daySchedule.start}
                                                            onChange={(e) => updateStaffSchedule(editingStaff.id, day, 'start', e.target.value)}
                                                            className="px-3 py-1 rounded-lg border border-secondary text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm text-foreground/70">Fin:</label>
                                                        <input
                                                            type="time"
                                                            value={daySchedule.end}
                                                            onChange={(e) => updateStaffSchedule(editingStaff.id, day, 'end', e.target.value)}
                                                            className="px-3 py-1 rounded-lg border border-secondary text-sm"
                                                        />
                                                    </div>
                                                    <span className="text-xs text-foreground/50 ml-auto">
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
                    </div>

                    {/* Vacations/Days Off */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            🏖️ Vacaciones y Días Libres
                        </h3>
                        <div className="bg-secondary/5 p-4 rounded-xl">
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="date"
                                    id={`vacation-${editingStaff.id}`}
                                    className="flex-1 px-4 py-2 rounded-lg border border-secondary"
                                />
                                <button
                                    onClick={() => {
                                        const input = document.getElementById(`vacation-${editingStaff.id}`) as HTMLInputElement;
                                        if (input.value) {
                                            addVacationDay(editingStaff.id, input.value);
                                            input.value = '';
                                        }
                                    }}
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium"
                                >
                                    + Agregar Día
                                </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {editingStaff.schedule.vacations.length === 0 && (
                                    <p className="text-sm text-foreground/40 italic text-center py-4">No hay días de vacaciones registrados</p>
                                )}
                                {editingStaff.schedule.vacations.map(date => (
                                    <div key={date} className="flex justify-between items-center p-3 bg-white rounded-lg border border-secondary/20">
                                        <span className="font-medium text-foreground">{date}</span>
                                        <button
                                            onClick={() => removeVacationDay(editingStaff.id, date)}
                                            className="text-red-500 hover:text-red-700 text-sm font-bold"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Exceptions */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            ⚡ Excepciones (Horarios Especiales)
                        </h3>
                        <div className="bg-secondary/5 p-4 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                                <input
                                    type="date"
                                    id={`exc-date-${editingStaff.id}`}
                                    className="px-4 py-2 rounded-lg border border-secondary"
                                    placeholder="Fecha"
                                />
                                <input
                                    type="time"
                                    id={`exc-start-${editingStaff.id}`}
                                    className="px-4 py-2 rounded-lg border border-secondary"
                                    placeholder="Inicio"
                                />
                                <input
                                    type="time"
                                    id={`exc-end-${editingStaff.id}`}
                                    className="px-4 py-2 rounded-lg border border-secondary"
                                    placeholder="Fin"
                                />
                                <button
                                    onClick={() => {
                                        const dateInput = document.getElementById(`exc-date-${editingStaff.id}`) as HTMLInputElement;
                                        const startInput = document.getElementById(`exc-start-${editingStaff.id}`) as HTMLInputElement;
                                        const endInput = document.getElementById(`exc-end-${editingStaff.id}`) as HTMLInputElement;

                                        if (dateInput.value && startInput.value && endInput.value) {
                                            addException(editingStaff.id, {
                                                date: dateInput.value,
                                                start: startInput.value,
                                                end: endInput.value,
                                                reason: 'Horario especial'
                                            });
                                            dateInput.value = '';
                                            startInput.value = '';
                                            endInput.value = '';
                                        }
                                    }}
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium"
                                >
                                    + Agregar
                                </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {editingStaff.schedule.exceptions.length === 0 && (
                                    <p className="text-sm text-foreground/40 italic text-center py-4">No hay excepciones configuradas</p>
                                )}
                                {editingStaff.schedule.exceptions.map((exc, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div>
                                            <span className="font-bold text-foreground">{exc.date}</span>
                                            <span className="text-sm text-foreground/70 ml-3">{exc.start} - {exc.end}</span>
                                            {exc.reason && <span className="text-xs text-foreground/50 ml-2">({exc.reason})</span>}
                                        </div>
                                        <button
                                            onClick={() => removeException(editingStaff.id, idx)}
                                            className="text-red-500 hover:text-red-700 text-sm font-bold"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Works Holidays Toggle */}
                    <div className="bg-secondary/5 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id={`holidays-${editingStaff.id}`}
                                checked={editingStaff.schedule.worksHolidays}
                                onChange={() => toggleWorksHolidays(editingStaff.id)}
                                className="w-5 h-5 accent-primary cursor-pointer"
                            />
                            <label htmlFor={`holidays-${editingStaff.id}`} className="text-sm font-medium text-foreground cursor-pointer">
                                ⭐ Disponible para trabajar en días festivos nacionales
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-secondary/20">
                        <button
                            onClick={onClose}
                            className="bg-secondary text-foreground px-8 py-3 rounded-xl hover:bg-secondary/80 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => editingStaff && saveStaffSchedule(editingStaff.id)}
                            className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 font-medium shadow-lg"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
