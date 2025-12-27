"use client";

import { useState } from 'react';
import { Appointment, Staff, Service } from './types';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AppointmentsTabProps {
    appointments: Appointment[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onSearchChange: (search: string) => void;
    searchValue: string;
    addAppointment: (e: React.FormEvent) => void;
    updateApptStatus: (id: number, status: string) => void;
    deleteAppointment: (id: number) => void;
    newAppt: {
        clientName: string;
        phone: string;
        service: string;
        staff: string;
        date: string;
        time: string;
    };
    handleApptChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    staff: Staff[];
    services: Service[];
}

export default function AppointmentsTab({
    appointments,
    pagination,
    onPageChange,
    onSearchChange,
    searchValue,
    addAppointment,
    updateApptStatus,
    deleteAppointment,
    newAppt,
    handleApptChange,
    staff,
    services
}: AppointmentsTabProps) {
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

    const fetchAllFiltered = async () => {
        const res = await fetch(`/api/appointments?limit=-1&search=${encodeURIComponent(searchValue)}`);
        const result = await res.json();
        return result.data;
    };

    const exportToExcel = async () => {
        const data = await fetchAllFiltered();
        const worksheet = XLSX.utils.json_to_sheet(data.map((a: any) => ({
            'Cliente': a.clientName,
            'Teléfono': a.phone,
            'Servicio': a.service,
            'Especialista': a.staff,
            'Fecha': a.date,
            'Hora': a.time,
            'Estado': a.status
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Citas');
        XLSX.writeFile(workbook, `Reporte_Citas_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const exportToPDF = async () => {
        const data = await fetchAllFiltered();
        const doc = new jsPDF();

        doc.text('Reporte de Citas - Bella Salon', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 22);

        const tableData = data.map((a: any) => [
            a.clientName,
            a.phone,
            a.service,
            a.staff,
            `${a.date} ${a.time}`,
            a.status
        ]);

        autoTable(doc, {
            head: [['Cliente', 'Teléfono', 'Servicio', 'Especialista', 'Fecha/Hora', 'Estado']],
            body: tableData,
            startY: 30,
            theme: 'striped',
            headStyles: { fillColor: [180, 140, 100] }
        });

        doc.save(`Reporte_Citas_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const generateWALink = (appt: Appointment) => {
        const message = `Hola ${appt.clientName}, te escribimos de BellaSalón para recordarte tu cita de ${appt.service} con ${appt.staff} el día ${appt.date} a las ${appt.time}. ¡Te esperamos! ✨`;
        return `https://wa.me/${appt.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-serif text-foreground">Citas y Agenda</h2>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-1 rounded-full text-xs font-bold border transition-all ${viewMode === 'table' ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary/40 border-primary/20 hover:border-primary'}`}
                        >
                            Vista Lista
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-1 rounded-full text-xs font-bold border transition-all ${viewMode === 'calendar' ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary/40 border-primary/20 hover:border-primary'}`}
                        >
                            Vista Agenda 📅
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-72 w-full md:min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Buscar citas..."
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-secondary focus:border-primary outline-none text-sm transition-all shadow-sm"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 text-xs">🔍</span>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={exportToExcel} className="flex-1 md:flex-none p-2 bg-green-50 text-green-700 rounded-xl border border-green-200 hover:bg-green-100 transition-all shadow-sm flex justify-center items-center gap-2 text-xs font-bold" title="Exportar a Excel">
                            📊 <span className="inline">Excel</span>
                        </button>
                        <button onClick={exportToPDF} className="flex-1 md:flex-none p-2 bg-red-50 text-red-700 rounded-xl border border-red-200 hover:bg-red-100 transition-all shadow-sm flex justify-center items-center gap-2 text-xs font-bold" title="Exportar a PDF">
                            📄 <span className="inline">PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Appointment Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20 mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4">Agendar Nueva Cita</h3>
                <form onSubmit={addAppointment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input required name="clientName" placeholder="Cliente" value={newAppt.clientName} onChange={handleApptChange} className="px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                    <input required name="phone" placeholder="Teléfono" value={newAppt.phone} onChange={handleApptChange} className="px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                    <select name="service" value={newAppt.service} onChange={handleApptChange} className="px-4 py-2 rounded-lg border border-secondary bg-white focus:border-primary outline-none">
                        {services.filter(s => s.active).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                    <select name="staff" value={newAppt.staff} onChange={handleApptChange} className="px-4 py-2 rounded-lg border border-secondary bg-white focus:border-primary outline-none">
                        {staff.filter(s => s.active).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                    <input required name="date" type="date" value={newAppt.date} onChange={handleApptChange} className="px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                    <input required name="time" type="time" value={newAppt.time} onChange={handleApptChange} className="px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                    <button type="submit" className="md:col-span-3 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium shadow-sm transition-all text-sm uppercase tracking-widest">Agendar Cita</button>
                </form>
            </div>

            {viewMode === 'table' ? (
                /* Appointments List */
                <div className="bg-white rounded-2xl shadow-sm border border-secondary/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/10 text-foreground/70">
                                <tr>
                                    <th className="p-4 font-medium text-xs uppercase tracking-widest">Cliente</th>
                                    <th className="p-4 font-medium text-xs uppercase tracking-widest">Servicio</th>
                                    <th className="p-4 font-medium text-xs uppercase tracking-widest">Especialista</th>
                                    <th className="p-4 font-medium text-xs uppercase tracking-widest">Fecha/Hora</th>
                                    <th className="p-4 font-medium text-xs uppercase tracking-widest">Estado</th>
                                    <th className="p-4 font-medium text-xs uppercase tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary/10">
                                {appointments.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-foreground/40">No hay citas registradas.</td></tr>}
                                {appointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-secondary/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-foreground">{appt.clientName}</div>
                                            <div className="text-xs text-foreground/50">{appt.phone}</div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-foreground/80">{appt.service}</td>
                                        <td className="p-4 text-sm text-foreground/70">{appt.staff}</td>
                                        <td className="p-4 text-sm">
                                            <div className="text-foreground/80">{appt.date}</div>
                                            <div className="text-xs text-primary font-bold">{appt.time}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-tighter
                                                ${appt.status === 'Confirmada' ? 'bg-green-100 text-green-700' :
                                                    appt.status === 'Completada' ? 'bg-purple-100 text-purple-700' :
                                                        appt.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                <a
                                                    href={generateWALink(appt)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm"
                                                    title="Enviar recordatorio WhatsApp"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                </a>
                                                <button onClick={() => updateApptStatus(appt.id, 'Confirmada')} className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors shadow-sm" title="Confirmar">✓</button>
                                                <button onClick={() => updateApptStatus(appt.id, 'Completada')} className="w-8 h-8 flex items-center justify-center bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors shadow-sm" title="Marcar como Atendido">✨</button>
                                                <button onClick={() => updateApptStatus(appt.id, 'Pendiente')} className="w-8 h-8 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors shadow-sm" title="Pendiente">⏳</button>
                                                <button onClick={() => updateApptStatus(appt.id, 'Cancelada')} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm" title="Cancelar">✕</button>
                                                <button onClick={() => deleteAppointment(appt.id)} className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors shadow-sm" title="Eliminar">🗑</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="p-4 bg-secondary/5 border-t border-secondary/10 flex items-center justify-between">
                            <div className="text-sm text-foreground/50 font-medium">
                                Mostrando <span className="text-foreground font-bold">{(pagination.page - 1) * pagination.limit + 1}</span> a <span className="text-foreground font-bold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> de <span className="text-foreground font-bold">{pagination.total}</span> citas
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={pagination.page === 1}
                                    onClick={() => onPageChange(pagination.page - 1)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${pagination.page === 1 ? 'text-foreground/20 cursor-not-allowed' : 'text-primary hover:bg-primary/10'}`}
                                >
                                    Anterior
                                </button>
                                <div className="flex gap-1 text-xs">
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => onPageChange(i + 1)}
                                            className={`w-8 h-8 rounded-lg font-bold transition-all ${pagination.page === i + 1 ? 'bg-primary text-white shadow-md' : 'text-foreground/40 hover:bg-secondary/20'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={pagination.page === pagination.totalPages}
                                    onClick={() => onPageChange(pagination.page + 1)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${pagination.page === pagination.totalPages ? 'text-foreground/20 cursor-not-allowed' : 'text-primary hover:bg-primary/10'}`}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Calendar View - Weekly Agenda */
                <div className="bg-white rounded-2xl shadow-sm border border-secondary/20 p-6 overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-7 gap-4 mb-4">
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                <div key={day} className="text-center font-bold text-xs uppercase tracking-widest text-primary/60 py-2 border-b border-secondary/20">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {[...Array(7)].map((_, dayIndex) => {
                                const dayDate = new Date();
                                dayDate.setDate(dayDate.getDate() + dayIndex - (dayDate.getDay() || 7) + 1);
                                const dateStr = dayDate.toISOString().split('T')[0];

                                return (
                                    <div key={dayIndex} className="bg-secondary/5 rounded-xl p-4 min-h-[150px] relative">
                                        <div className="text-[10px] text-foreground/40 font-bold mb-3 sticky top-0 bg-secondary/5 pb-1 uppercase tracking-tighter">{dateStr}</div>
                                        <div className="space-y-3">
                                            {appointments.filter(a => a.date === dateStr).sort((a, b) => a.time.localeCompare(b.time)).map(appt => (
                                                <div
                                                    key={appt.id}
                                                    className={`p-3 rounded-xl text-[10px] shadow-sm border-l-4 transition-all hover:scale-105 cursor-pointer ${appt.status === 'Confirmada' ? 'bg-green-50 border-green-500' :
                                                        appt.status === 'Completada' ? 'bg-purple-50 border-purple-500' :
                                                            appt.status === 'Cancelada' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                                                        }`}
                                                >
                                                    <div className="font-bold text-foreground flex justify-between mb-1">
                                                        <span className="text-primary">{appt.time}</span>
                                                        <span className="text-[8px] opacity-30 font-mono">#{appt.id}</span>
                                                    </div>
                                                    <div className="font-bold truncate text-foreground/80">{appt.clientName}</div>
                                                    <div className="text-[9px] text-foreground/50 truncate mb-2">{appt.service}</div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-secondary/10">
                                                        <span className="font-bold text-secondary text-[8px] uppercase">{appt.staff}</span>
                                                        <a href={generateWALink(appt)} target="_blank" rel="noopener" className="text-green-500 hover:scale-110 transition-transform">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                            {appointments.filter(a => a.date === dateStr).length === 0 && (
                                                <div className="h-full flex items-center justify-center text-[10px] text-foreground/10 italic py-10">Libre</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] text-foreground/40 italic">* Esta vista muestra las citas de la semana actual basadas en los datos cargados. Usa el buscador para filtrar.</p>
                </div>
            )}
        </div>
    );
}
