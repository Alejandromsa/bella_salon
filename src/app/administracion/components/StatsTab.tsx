"use client";

import { Appointment, Staff, Service, Client } from './types';
import { useState, useEffect } from 'react';

interface StatsTabProps {
    appointments: Appointment[];
    staff: Staff[];
    services: Service[];
    clients: Client[];
}

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'all';

interface AppointmentStatus {
    value: string;
    label: string;
    color: string;
    icon: string;
}

export default function StatsTab({
    appointments,
    staff,
    services,
    clients
}: StatsTabProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
    const [appointmentStatuses, setAppointmentStatuses] = useState<AppointmentStatus[]>([]);

    // ============ CARGAR ESTADOS DESDE LA API ============
    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await fetch('/api/appointments/statuses');
                if (response.ok) {
                    const statuses = await response.json();
                    setAppointmentStatuses(statuses);
                }
            } catch (error) {
                console.error('Error loading appointment statuses:', error);
                // Fallback a estados predeterminados si falla
                setAppointmentStatuses([
                    { value: 'Pendiente', label: 'Pendientes', color: 'yellow', icon: '⏱' },
                    { value: 'Confirmada', label: 'Confirmadas', color: 'blue', icon: '📅' },
                    { value: 'Cancelada', label: 'Canceladas', color: 'red', icon: '✗' },
                    { value: 'Completada', label: 'Completadas', color: 'green', icon: '✓' }
                ]);
            }
        };
        fetchStatuses();
    }, []);

    // ============ UTILIDADES DE FECHA ============
    const parseAppointmentDate = (dateStr: string): Date => {
        // El campo date puede venir como "YYYY-MM-DD HH:MM:SS" o "YYYY-MM-DD"
        if (!dateStr) return new Date();
        const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0];
        return new Date(cleanDate + 'T12:00:00'); // Usar mediodía para evitar problemas de zona horaria
    };

    const isInPeriod = (dateStr: string, period: PeriodType): boolean => {
        const date = parseAppointmentDate(dateStr);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (period) {
            case 'today':
                const appointmentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                return appointmentDay.getTime() === today.getTime();
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date >= weekAgo && date <= now;
            case 'month':
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            case 'year':
                return date.getFullYear() === now.getFullYear();
            case 'all':
                return true;
            default:
                return false;
        }
    };

    const getPreviousPeriodDates = (period: PeriodType): { start: Date; end: Date } => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (period) {
            case 'today':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                return { start: yesterday, end: yesterday };
            case 'week':
                const twoWeeksAgo = new Date(today);
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                const oneWeekAgo = new Date(today);
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return { start: twoWeeksAgo, end: oneWeekAgo };
            case 'month':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
                return { start: lastMonth, end: lastMonthEnd };
            case 'year':
                const lastYear = new Date(now.getFullYear() - 1, 0, 1);
                const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);
                return { start: lastYear, end: lastYearEnd };
            default:
                return { start: new Date(0), end: new Date(0) };
        }
    };

    // ============ FILTRADO DE DATOS ============
    const periodAppointments = appointments.filter(a => isInPeriod(a.date, selectedPeriod));
    const previousPeriod = getPreviousPeriodDates(selectedPeriod);
    const previousAppointments = appointments.filter(a => {
        const date = parseAppointmentDate(a.date);
        return date >= previousPeriod.start && date <= previousPeriod.end;
    });

    // ============ HELPER PARA OBTENER PRECIO ============
    const getServicePrice = (serviceName: string): number => {
        const svc = services.find(s => s.name === serviceName);
        if (!svc) return 0;
        const price = typeof svc.price === 'number' ? svc.price : parseFloat(String(svc.price || 0));
        return isNaN(price) ? 0 : price;
    };

    // ============ MÉTRICAS PRINCIPALES ============
    const totalAppointments = periodAppointments.length;
    const completedAppointments = periodAppointments.filter(a => a.status === 'Completada').length;
    const confirmedAppointments = periodAppointments.filter(a => a.status === 'Confirmada').length;
    const pendingAppointments = periodAppointments.filter(a => a.status === 'Pendiente').length;
    const canceledAppointments = periodAppointments.filter(a => a.status === 'Cancelada').length;

    // Ingresos
    const totalRevenue = periodAppointments
        .filter(a => a.status === 'Completada')
        .reduce((sum, a) => sum + getServicePrice(a.service), 0);

    const projectedRevenue = periodAppointments
        .filter(a => a.status === 'Confirmada' || a.status === 'Pendiente')
        .reduce((sum, a) => sum + getServicePrice(a.service), 0);

    // Comparación con período anterior
    const prevTotalRevenue = previousAppointments
        .filter(a => a.status === 'Completada')
        .reduce((sum, a) => sum + getServicePrice(a.service), 0);

    const revenueGrowth = prevTotalRevenue > 0
        ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100
        : 0;

    const prevTotalAppointments = previousAppointments.length;
    const appointmentsGrowth = prevTotalAppointments > 0
        ? ((totalAppointments - prevTotalAppointments) / prevTotalAppointments) * 100
        : 0;

    // Tasas
    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
    const cancellationRate = totalAppointments > 0 ? (canceledAppointments / totalAppointments) * 100 : 0;
    const confirmationRate = totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0;

    // Ticket promedio
    const averageTicket = completedAppointments > 0 ? totalRevenue / completedAppointments : 0;

    // ============ ANÁLISIS DE SERVICIOS ============
    const serviceCounts = periodAppointments.reduce((acc: any, a) => {
        if (!acc[a.service]) {
            acc[a.service] = { count: 0, revenue: 0, completed: 0 };
        }
        acc[a.service].count++;
        if (a.status === 'Completada') {
            acc[a.service].completed++;
            acc[a.service].revenue += getServicePrice(a.service);
        }
        return acc;
    }, {});

    const topServicesByCount = Object.entries(serviceCounts)
        .map(([name, data]: any) => ({ name, ...data }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);

    const topServicesByRevenue = Object.entries(serviceCounts)
        .map(([name, data]: any) => ({ name, ...data }))
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);

    // ============ ANÁLISIS DE PERSONAL ============
    const staffPerformance = staff.map(s => {
        const staffAppointments = periodAppointments.filter(a => a.staff === s.name);
        const completed = staffAppointments.filter(a => a.status === 'Completada').length;
        const revenue = staffAppointments
            .filter(a => a.status === 'Completada')
            .reduce((sum, a) => sum + getServicePrice(a.service), 0);
        const canceled = staffAppointments.filter(a => a.status === 'Cancelada').length;
        const cancelRate = staffAppointments.length > 0 ? (canceled / staffAppointments.length) * 100 : 0;

        return {
            name: s.name,
            total: staffAppointments.length,
            completed,
            revenue,
            canceled,
            cancelRate,
            active: s.active
        };
    }).sort((a, b) => b.revenue - a.revenue);

    // ============ ANÁLISIS DE CLIENTES ============
    const activeClients = clients.filter(c => (c.totalVisits || 0) > 0).length;
    const vipClients = clients.filter(c => c.vipStatus).length;
    const newClients = clients.filter(c => {
        if (!c.registrationDate) return false;
        return isInPeriod(c.registrationDate, selectedPeriod);
    }).length;

    const totalLoyaltyPoints = clients.reduce((sum, c) => {
        const points = typeof c.loyaltyPoints === 'number' ? c.loyaltyPoints : parseFloat(String(c.loyaltyPoints || 0));
        return sum + (isNaN(points) ? 0 : points);
    }, 0);
    const averageLoyaltyPoints = clients.length > 0 ? totalLoyaltyPoints / clients.length : 0;

    // Top clientes por gasto
    const topClients = [...clients]
        .sort((a, b) => {
            const aSpent = typeof a.totalSpent === 'number' ? a.totalSpent : parseFloat(String(a.totalSpent || 0));
            const bSpent = typeof b.totalSpent === 'number' ? b.totalSpent : parseFloat(String(b.totalSpent || 0));
            return (isNaN(bSpent) ? 0 : bSpent) - (isNaN(aSpent) ? 0 : aSpent);
        })
        .slice(0, 5);

    // ============ DISTRIBUCIÓN POR DÍA DE LA SEMANA ============
    const dayDistribution = periodAppointments.reduce((acc: any, a) => {
        const date = parseAppointmentDate(a.date);
        const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];
        acc[dayName] = (acc[dayName] || 0) + 1;
        return acc;
    }, {});

    const daysOrder = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const maxDayCount = Math.max(...Object.values(dayDistribution).map(v => v as number), 1);

    // ============ DISTRIBUCIÓN POR HORA ============
    const hourDistribution = periodAppointments.reduce((acc: any, a) => {
        if (!a.time) return acc;
        const hour = parseInt(a.time.split(':')[0]);
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});

    const peakHour = Object.entries(hourDistribution)
        .sort((a: any, b: any) => b[1] - a[1])[0];

    // ============ FUNCIÓN HELPER PARA FORMATO DE MONEDA ============
    const formatCurrency = (amount: number | string | null | undefined) => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
        return `S/ ${(isNaN(numAmount) ? 0 : numAmount).toFixed(2)}`;
    };

    // ============ FUNCIÓN HELPER PARA INDICADOR DE CRECIMIENTO ============
    const GrowthIndicator = ({ value }: { value: number }) => {
        if (value === 0) return <span className="text-gray-400 text-xs">Sin cambios</span>;
        const isPositive = value > 0;
        return (
            <span className={`text-xs font-bold flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '↑' : '↓'} {Math.abs(value).toFixed(1)}%
            </span>
        );
    };

    const getPeriodLabel = (period: PeriodType): string => {
        switch (period) {
            case 'today': return 'Hoy';
            case 'week': return 'Esta Semana';
            case 'month': return 'Este Mes';
            case 'year': return 'Este Año';
            case 'all': return 'Histórico';
            default: return '';
        }
    };

    return (
        <div className="animate-fade-in-up space-y-8">
            {/* Header con selector de período */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-foreground">Panel de Estadísticas Avanzado</h2>
                    <p className="text-sm text-foreground/60 mt-1">Análisis completo del rendimiento de tu salón</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(['today', 'week', 'month', 'year', 'all'] as PeriodType[]).map(period => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === period
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-white text-foreground/70 border border-secondary/20 hover:bg-secondary/10'
                            }`}
                        >
                            {getPeriodLabel(period)}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xs opacity-80 uppercase tracking-widest font-bold">Ingresos Totales</h3>
                        <GrowthIndicator value={revenueGrowth} />
                    </div>
                    <p className="text-3xl font-black mb-1">{formatCurrency(totalRevenue)}</p>
                    <p className="text-xs opacity-70">Proyectado: {formatCurrency(projectedRevenue)}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-200">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xs text-foreground/40 uppercase tracking-widest font-bold">Citas Totales</h3>
                        <GrowthIndicator value={appointmentsGrowth} />
                    </div>
                    <p className="text-3xl font-black text-foreground mb-1">{totalAppointments}</p>
                    <div className="flex gap-2 text-xs flex-wrap">
                        {appointmentStatuses.map((status, idx) => {
                            const count = periodAppointments.filter(a => a.status === status.value).length;
                            return (
                                <span key={idx} className={`text-${status.color}-600`}>
                                    {status.icon} {count}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-200">
                    <h3 className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-2">Ticket Promedio</h3>
                    <p className="text-3xl font-black text-blue-600 mb-1">{formatCurrency(averageTicket)}</p>
                    <p className="text-xs text-foreground/60">Por servicio completado</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-purple-200">
                    <h3 className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-2">Tasa de Finalización</h3>
                    <p className="text-3xl font-black text-purple-600 mb-1">{completionRate.toFixed(1)}%</p>
                    <p className="text-xs text-foreground/60">Cancelación: {cancellationRate.toFixed(1)}%</p>
                </div>
            </div>

            {/* Métricas de Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                    <h3 className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-2">Clientes Activos</h3>
                    <p className="text-2xl font-black text-foreground">{activeClients}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                    <h3 className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-2">Clientes VIP</h3>
                    <p className="text-2xl font-black text-amber-600">{vipClients}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                    <h3 className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-2">Nuevos Clientes</h3>
                    <p className="text-2xl font-black text-green-600">{newClients}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                    <h3 className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-2">Puntos Promedio</h3>
                    <p className="text-2xl font-black text-primary">{averageLoyaltyPoints.toFixed(0)}</p>
                </div>
            </div>

            {/* Gráficos y análisis detallados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Servicios más solicitados */}
                <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm">
                    <h3 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
                        <span>🏆</span> Top 5 Servicios por Demanda
                    </h3>
                    <div className="space-y-4">
                        {topServicesByCount.length > 0 ? topServicesByCount.map((item: any, idx) => {
                            const maxCount = topServicesByCount[0]?.count || 1;
                            const percentage = (item.count / maxCount) * 100;
                            return (
                                <div key={idx}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 text-white text-xs flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <span className="text-foreground font-semibold block">{item.name}</span>
                                                <span className="text-xs text-foreground/50">{item.completed} completados</span>
                                            </div>
                                        </div>
                                        <span className="text-primary font-bold">{item.count} citas</span>
                                    </div>
                                    <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-8 text-foreground/40">
                                <p className="text-sm">No hay datos de servicios para este período</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Servicios más rentables */}
                <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm">
                    <h3 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
                        <span>💰</span> Top 5 Servicios por Ingresos
                    </h3>
                    <div className="space-y-4">
                        {topServicesByRevenue.length > 0 ? topServicesByRevenue.map((item: any, idx) => {
                            const maxRevenue = topServicesByRevenue[0]?.revenue || 1;
                            const percentage = (item.revenue / maxRevenue) * 100;
                            return (
                                <div key={idx}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white text-xs flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <span className="text-foreground font-semibold block">{item.name}</span>
                                                <span className="text-xs text-foreground/50">{item.completed} completados</span>
                                            </div>
                                        </div>
                                        <span className="text-green-600 font-bold">{formatCurrency(item.revenue)}</span>
                                    </div>
                                    <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-8 text-foreground/40">
                                <p className="text-sm">No hay datos de ingresos para este período</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rendimiento de personal */}
                <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm">
                    <h3 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
                        <span>👥</span> Rendimiento por Especialista
                    </h3>
                    <div className="space-y-4">
                        {staffPerformance.filter(s => s.active).length > 0 ? staffPerformance.filter(s => s.active).slice(0, 6).map((item, idx) => (
                            <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-foreground font-semibold">{item.name}</span>
                                    <span className="text-primary font-bold">{formatCurrency(item.revenue)}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs text-foreground/60">
                                    <span>Total: {item.total}</span>
                                    <span className="text-green-600">✓ {item.completed}</span>
                                    <span className="text-red-600">Canc: {item.cancelRate.toFixed(0)}%</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-foreground/40">
                                <p className="text-sm">No hay especialistas activos</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top clientes */}
                <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm">
                    <h3 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
                        <span>⭐</span> Top 5 Clientes VIP
                    </h3>
                    <div className="space-y-4">
                        {topClients.length > 0 ? topClients.map((client, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-foreground font-semibold">{client.name}</span>
                                            {client.vipStatus && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">VIP</span>}
                                        </div>
                                        <span className="text-xs text-foreground/50">
                                            {client.totalVisits || 0} visitas • {client.loyaltyPoints || 0} pts
                                        </span>
                                    </div>
                                </div>
                                <span className="text-green-600 font-bold">{formatCurrency(client.totalSpent)}</span>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-foreground/40">
                                <p className="text-sm">No hay clientes registrados aún</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Distribución por día de la semana */}
                <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm">
                    <h3 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
                        <span>📊</span> Distribución por Día
                    </h3>
                    <div className="space-y-3">
                        {daysOrder.map(day => {
                            const count = dayDistribution[day] || 0;
                            const percentage = (count / maxDayCount) * 100;
                            return (
                                <div key={day}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-foreground w-12">{day}</span>
                                        <div className="flex-grow mx-4">
                                            <div className="h-8 bg-secondary/20 rounded-lg overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end pr-2 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    {count > 0 && (
                                                        <span className="text-white text-xs font-bold">{count}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm text-foreground/60 w-16 text-right">{count} citas</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {peakHour && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <span className="font-bold">Hora pico:</span> {peakHour[0]}:00 hrs con {peakHour[1]} citas
                            </p>
                        </div>
                    )}
                </div>

                {/* Resumen de estado de citas */}
                <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm">
                    <h3 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
                        <span>📈</span> Estado de Citas
                    </h3>
                    <div className="space-y-4">
                        {appointmentStatuses.map((status, idx) => {
                            const count = periodAppointments.filter(a => a.status === status.value).length;
                            const percentage = totalAppointments > 0 ? (count / totalAppointments) * 100 : 0;
                            return (
                                <div key={idx}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span>{status.icon}</span>
                                            <span className="text-foreground font-medium">{status.label}</span>
                                        </div>
                                        <span className={`text-${status.color}-600 font-bold`}>{count}</span>
                                    </div>
                                    <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-${status.color}-500 transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-foreground/50 mt-1">{percentage.toFixed(1)}% del total</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer con actualización */}
            <div className="text-center text-sm text-foreground/40 pt-4 border-t border-secondary/20">
                Última actualización: {new Date().toLocaleString('es-PE', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })}
            </div>
        </div>
    );
}
