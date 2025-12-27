"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';

// Registrar locale español
registerLocale('es', es);

// Mock Services Data
const services = [
    { id: 'cut', name: 'Corte y Estilo', price: '$40', duration: '60 min', icon: '✂️' },
    { id: 'color', name: 'Coloración', price: '$80+', duration: '120 min', icon: '🎨' },
    { id: 'mani', name: 'Manicura Spa', price: '$35', duration: '45 min', icon: '💅' },
    { id: 'facial', name: 'Facial Glow', price: '$75', duration: '60 min', icon: '✨' },
];

// Mock Staff Data (Ideally would come from the same source as Admin)
const staff = [
    { id: 1, name: 'Ana García', role: 'Master Stylist' },
    { id: 2, name: 'Carlos Ruiz', role: 'Colorista' },
    { id: 3, name: 'Elena Torres', role: 'Esteticista' },
];

export default function Reservar() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [availableStaff, setAvailableStaff] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [clientExists, setClientExists] = useState<boolean | null>(null);
    const [searchingClient, setSearchingClient] = useState(false);
    const [holidays, setHolidays] = useState<string[]>([]);
    const [businessSchedule, setBusinessSchedule] = useState<any>(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [dateError, setDateError] = useState<string>('');
    const [bookingSettings, setBookingSettings] = useState<any>(null);
    const [rateLimitSettings, setRateLimitSettings] = useState<any>(null);

    const [formData, setFormData] = useState({
        service: '',
        serviceName: '',
        staff: '',
        staffId: '',
        date: '',
        time: '',
        name: '',
        docType: 'DNI',
        docNumber: '',
        phone: '',
        email: '',
        preferredContactTime: '',
        birthDate: '',
        address: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, staffRes, holidaysRes, settingsRes] = await Promise.all([
                    fetch('/api/services'),
                    fetch('/api/staff'),
                    fetch('/api/holidays'),
                    fetch('/api/settings')
                ]);
                if (servicesRes.ok) {
                    const data = await servicesRes.json();
                    setAvailableServices(data.filter((s: any) => s.active !== false));
                }
                if (staffRes.ok) {
                    const data = await staffRes.json();
                    setAvailableStaff(data.filter((s: any) => s.active !== false));
                }
                if (holidaysRes.ok) {
                    const data = await holidaysRes.json();
                    setHolidays(data);
                }
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    if (data.schedule) {
                        setBusinessSchedule(data.schedule);
                    }
                    // Store booking settings
                    setBookingSettings({
                        enabled: data.booking_enabled !== undefined ? data.booking_enabled : true,
                        whatsapp: data.booking_whatsapp || '+51 999 999 999',
                        message: data.booking_whatsapp_message || 'Hola, quisiera reservar una cita en BellaSalón. ¿Tienen disponibilidad?'
                    });
                    // Store rate limit settings
                    setRateLimitSettings({
                        enabled: data.booking_rate_limit_enabled !== undefined ? data.booking_rate_limit_enabled : true,
                        minutes: data.booking_rate_limit_minutes || 30,
                        maxBookings: data.booking_rate_limit_max_bookings || 3
                    });
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    // Verificar si una fecha es válida para reservas
    const isDateAvailable = (dateStr: string): boolean => {
        if (!dateStr) return false;

        // Comparar fechas como strings (formato YYYY-MM-DD) para evitar problemas de zona horaria
        const todayStr = new Date().toISOString().split('T')[0];

        // No permitir fechas pasadas (pero sí el día actual)
        if (dateStr < todayStr) return false;

        // Verificar si es festivo
        if (holidays.includes(dateStr)) return false;

        // Verificar si el negocio está abierto ese día
        if (businessSchedule && businessSchedule.days) {
            const date = new Date(dateStr + 'T12:00:00'); // Usar mediodía para evitar problemas de zona horaria
            const dayOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()];
            if (!businessSchedule.days.includes(dayOfWeek)) return false;
        }

        return true;
    };

    // Generar horarios disponibles según especialista y fecha
    const generateAvailableTimeSlots = (staffId: string, selectedDate: string): string[] => {
        if (!selectedDate) return [];

        const date = new Date(selectedDate + 'T12:00:00'); // Usar mediodía para evitar problemas de zona horaria
        const dayOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()];
        const dayOfWeekShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];

        // Verificar si es el día actual (comparar como strings)
        const todayStr = new Date().toISOString().split('T')[0];
        const isToday = selectedDate === todayStr;

        let slots: string[] = [];

        if (staffId === '0' || !staffId) {
            // "Cualquier especialista" - combinar horarios de todos los especialistas que ofrecen el servicio
            const selectedService = availableServices.find(s => s.id.toString() === formData.service);
            const staffForService = selectedService?.staff_ids
                ? availableStaff.filter(s => {
                    try {
                        const staffIds = Array.isArray(selectedService.staff_ids)
                            ? selectedService.staff_ids
                            : JSON.parse(selectedService.staff_ids);
                        return staffIds.includes(s.id);
                    } catch {
                        return false;
                    }
                })
                : availableStaff;

            const allSlots = new Set<string>();
            staffForService.forEach(staff => {
                const staffSlots = getStaffTimeSlots(staff, dayOfWeekShort, isToday);
                staffSlots.forEach(slot => allSlots.add(slot));
            });
            slots = Array.from(allSlots).sort();
        } else {
            // Especialista específico
            const selectedStaff = availableStaff.find(s => s.id.toString() === staffId);
            if (selectedStaff) {
                slots = getStaffTimeSlots(selectedStaff, dayOfWeekShort, isToday);
            }
        }

        return slots;
    };

    // Obtener horarios de un especialista para un día específico
    const getStaffTimeSlots = (staff: any, dayOfWeekShort: string, isToday: boolean = false): string[] => {
        const slots: string[] = [];

        try {
            const schedule = staff.schedule?.weeklySchedule?.[dayOfWeekShort];
            if (!schedule || !schedule.active || !schedule.start || !schedule.end) return slots;

            const [startHour, startMin] = schedule.start.split(':').map(Number);
            const [endHour, endMin] = schedule.end.split(':').map(Number);

            // Si es hoy, obtener la hora actual para filtrar
            let minHour = startHour;
            let minMin = startMin;

            if (isToday) {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMin = now.getMinutes();

                // Solo mostrar horarios al menos 1 hora en el futuro
                const bufferHours = 1;
                const minTime = new Date(now.getTime() + bufferHours * 60 * 60 * 1000);
                minHour = minTime.getHours();
                minMin = Math.ceil(minTime.getMinutes() / 30) * 30; // Redondear a siguiente slot de 30 min

                if (minMin >= 60) {
                    minHour += 1;
                    minMin = 0;
                }
            }

            let currentHour = Math.max(startHour, minHour);
            let currentMin = currentHour === minHour ? minMin : startMin;

            // Generar slots de 30 minutos
            while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
                // Verificar si está en horario de break
                const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
                const isBreak = schedule.breaks?.some((brk: any) => {
                    return currentTime >= brk.start && currentTime < brk.end;
                });

                if (!isBreak) {
                    slots.push(currentTime);
                }

                // Incrementar 30 minutos
                currentMin += 30;
                if (currentMin >= 60) {
                    currentHour += 1;
                    currentMin = 0;
                }
            }
        } catch (error) {
            console.error('Error generating time slots:', error);
        }

        return slots;
    };

    // Verificar qué especialistas están disponibles en una fecha específica para un servicio
    const getAvailableStaffForDate = (serviceId: string, date: string): any[] => {
        const selectedService = availableServices.find(s => s.id.toString() === serviceId);
        if (!selectedService) {
            console.log('❌ Servicio no encontrado:', serviceId);
            return [];
        }

        console.log('📋 Servicio seleccionado:', selectedService.name);
        console.log('👥 AssignedStaff:', selectedService.assignedStaff);
        console.log('🔢 Especialistas disponibles:', availableStaff.map(s => ({ id: s.id, name: s.name })));

        // Obtener especialistas que ofrecen este servicio
        // assignedStaff contiene IDs o nombres según cómo se guardó en la BD
        let staffForService = availableStaff;

        if (selectedService.assignedStaff && Array.isArray(selectedService.assignedStaff) && selectedService.assignedStaff.length > 0) {
            staffForService = availableStaff.filter(s => {
                // Verificar si assignedStaff contiene IDs o nombres
                const containsId = selectedService.assignedStaff.some((item: any) =>
                    typeof item === 'number' || !isNaN(Number(item))
                );

                if (containsId) {
                    // Buscar por ID
                    return selectedService.assignedStaff.includes(s.id) ||
                           selectedService.assignedStaff.includes(s.id.toString());
                } else {
                    // Buscar por nombre
                    return selectedService.assignedStaff.includes(s.name);
                }
            });
        }

        console.log('✅ Especialistas que ofrecen el servicio:', staffForService.map(s => s.name));

        // Filtrar solo los que tienen horarios disponibles en esta fecha
        const staffWithAvailability = staffForService.filter(staff => {
            const tempDate = new Date(date + 'T12:00:00');
            const dayOfWeekShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][tempDate.getDay()];
            const todayStr = new Date().toISOString().split('T')[0];
            const isToday = date === todayStr;

            const slots = getStaffTimeSlots(staff, dayOfWeekShort, isToday);
            console.log(`🕐 ${staff.name} - Día: ${dayOfWeekShort}, Slots: ${slots.length}`);
            return slots.length > 0;
        });

        console.log('🎯 Especialistas disponibles en', date, ':', staffWithAvailability.map(s => s.name));
        return staffWithAvailability;
    };

    // useEffect para calcular horarios disponibles cuando cambia la fecha o el especialista
    useEffect(() => {
        if (formData.date && formData.staffId) {
            const slots = generateAvailableTimeSlots(formData.staffId, formData.date);
            setAvailableTimeSlots(slots);
        } else {
            setAvailableTimeSlots([]);
        }
    }, [formData.date, formData.staffId, availableStaff, formData.service]);

    const handleServiceSelect = (serviceId: string, serviceName: string) => {
        setFormData({ ...formData, service: serviceId, serviceName: serviceName });
        setDateError(''); // Limpiar error al cambiar de paso
        setStep(2);
    };

    const handleStaffSelect = (staffId: string, staffName: string) => {
        setFormData({ ...formData, staff: staffName, staffId: staffId });
        setDateError(''); // Limpiar error al cambiar de paso
        setStep(3);
    };

    // Verificar si una fecha debe estar deshabilitada en el DatePicker
    const isDateDisabled = (date: Date): boolean => {
        const dateStr = date.toISOString().split('T')[0];
        return !isDateAvailable(dateStr);
    };

    // Obtener clase CSS para colorear fechas en el DatePicker
    const getDayClassName = (date: Date): string => {
        const dateStr = date.toISOString().split('T')[0];
        const todayStr = new Date().toISOString().split('T')[0];

        // Fechas pasadas
        if (dateStr < todayStr) {
            return 'date-past';
        }

        // Festivos
        if (holidays.includes(dateStr)) {
            return 'date-holiday';
        }

        // Días cerrados
        if (businessSchedule && businessSchedule.days) {
            const tempDate = new Date(dateStr + 'T12:00:00');
            const dayOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][tempDate.getDay()];
            if (!businessSchedule.days.includes(dayOfWeek)) {
                return 'date-closed';
            }
        }

        // Fechas disponibles
        return 'date-available';
    };

    const handleDateSelect = (date: Date | null) => {
        // Limpiar error previo
        setDateError('');

        // Si no hay fecha seleccionada, solo limpiar
        if (!date) {
            setFormData({ ...formData, date: '', time: '' });
            setAvailableTimeSlots([]);
            return;
        }

        const selectedDate = date.toISOString().split('T')[0];

        // Validar que la fecha sea disponible
        if (!isDateAvailable(selectedDate)) {
            // Determinar el motivo del error
            const todayStr = new Date().toISOString().split('T')[0];

            let errorMsg = '';
            if (selectedDate < todayStr) {
                errorMsg = 'No puedes reservar en fechas pasadas. Por favor selecciona una fecha futura.';
            } else if (holidays.includes(selectedDate)) {
                errorMsg = 'Esta fecha es un día festivo. El salón estará cerrado.';
            } else {
                const dayOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()];
                errorMsg = `Lo sentimos, no atendemos los días ${dayOfWeek}. Por favor selecciona otro día.`;
            }

            setDateError(errorMsg);
            // No actualizar la fecha en formData si es inválida
            return;
        }

        // Fecha válida - actualizar y limpiar hora
        setFormData({ ...formData, date: selectedDate, time: '' });
    };

    const handleTimeSelect = (timeSlot: string) => {
        setFormData({ ...formData, time: timeSlot });
        setStep(4);
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate Limiting Logic (configurable)
        if (rateLimitSettings && rateLimitSettings.enabled) {
            const lastBooking = localStorage.getItem('lastBookingTime');
            const COOLDOWN_TIME = (rateLimitSettings.minutes || 30) * 60 * 1000; // Configurable minutes in milliseconds

            if (lastBooking && (Date.now() - parseInt(lastBooking) < COOLDOWN_TIME)) {
                const minutesRemaining = Math.ceil((COOLDOWN_TIME - (Date.now() - parseInt(lastBooking))) / (60 * 1000));
                alert(`Por seguridad, solo permitimos una reserva cada ${rateLimitSettings.minutes} minutos. Por favor intenta nuevamente en ${minutesRemaining} minuto${minutesRemaining !== 1 ? 's' : ''}.`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Save current timestamp
                localStorage.setItem('lastBookingTime', Date.now().toString());
                setStep(5); // Success step
            } else {
                alert(result.message || "Error al procesar la reserva. Por favor intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error submitting booking:", error);
            alert("Ocurrió un error al conectar con el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Obtener información de disponibilidad del negocio
    const getAvailabilityInfo = () => {
        const info = {
            openDays: [] as string[],
            closedDays: [] as string[],
            holidays: holidays,
        };

        if (businessSchedule && businessSchedule.days) {
            const allDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            info.openDays = businessSchedule.days;
            info.closedDays = allDays.filter(day => !businessSchedule.days.includes(day));
        }

        return info;
    };

    // Mapeo de categorías a emojis
    const categoryIcons: { [key: string]: string } = {
        'Todos': '✨',
        'Cabello': '✂️',
        'Coloración': '🎨',
        'Uñas': '💅',
        'Facial': '🌟',
        'Corporal': '💆',
        'Masajes': '🧘',
        'Depilación': '🪒',
        'Maquillaje': '💄',
        'Cejas y Pestañas': '👁️',
        'Spa': '🛁',
        'Otros': '💫'
    };

    // Obtener categorías únicas de los servicios
    const getCategories = (): string[] => {
        const servicesToUse = availableServices.length > 0 ? availableServices : services;
        const categoriesSet = new Set(servicesToUse.map((s: any) => s.category || 'Otros'));
        return ['Todos', ...Array.from(categoriesSet).sort()];
    };

    // Filtrar servicios por categoría
    const getFilteredServices = () => {
        const servicesToUse = availableServices.length > 0 ? availableServices : services;
        if (selectedCategory === 'Todos') {
            return servicesToUse;
        }
        return servicesToUse.filter((s: any) => (s.category || 'Otros') === selectedCategory);
    };

    // Redirect to WhatsApp if booking is disabled
    if (bookingSettings && !bookingSettings.enabled) {
        const cleanNumber = bookingSettings.whatsapp.replace(/[^0-9]/g, '');
        const message = encodeURIComponent(bookingSettings.message);
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

        return (
            <div className="bg-background min-h-screen py-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary/20 p-12">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                <svg className="w-12 h-12 fill-current text-[#25D366]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                </svg>
                            </div>

                            <h2 className="text-4xl font-serif text-primary mb-6">Reserva por WhatsApp</h2>

                            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                                Para ofrecerte una mejor atención personalizada, las reservas se realizan a través de WhatsApp.
                                <br />
                                Haz clic en el botón de abajo para contactarnos directamente.
                            </p>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                            >
                                <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                </svg>
                                Reservar por WhatsApp
                            </a>

                            <div className="mt-8 pt-8 border-t border-secondary/30">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="text-foreground/60 hover:text-primary transition-colors text-sm"
                                >
                                    ← Volver al Inicio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Progress Steps */}
                <div className="flex justify-between mb-12 relative max-w-2xl mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary/30 -z-10 -translate-y-1/2 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>

                    {[1, 2, 3, 4].map((num) => (
                        <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 border-background ${step >= num ? 'bg-primary text-white scale-110' : 'bg-secondary text-foreground/50'}`}>
                            {step > num ? '✓' : num}
                        </div>
                    ))}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 border-background ${step === 5 ? 'bg-primary text-white scale-110' : 'bg-secondary text-foreground/50'}`}>
                        ★
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] border border-secondary/20 relative">

                    {/* Back Button */}
                    {step > 1 && step < 5 && (
                        <button onClick={() => setStep(step - 1)} className="absolute top-6 left-6 text-foreground/50 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium z-10">
                            ← Volver
                        </button>
                    )}

                    <div className="p-8 md:p-12">

                        {/* Step 1: Services */}
                        {step === 1 && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-3xl font-serif text-center mb-2">Selecciona un Servicio</h2>
                                <p className="text-center text-foreground/60 mb-8">Elige el tratamiento perfecto para ti</p>

                                {loadingData ? (
                                    <div className="flex justify-center py-20">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Category Tabs */}
                                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                                            {getCategories().map((category) => (
                                                <button
                                                    key={category}
                                                    onClick={() => setSelectedCategory(category)}
                                                    className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                                                        selectedCategory === category
                                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                                            : 'bg-secondary/20 text-foreground/70 hover:bg-secondary/40 hover:text-foreground'
                                                    }`}
                                                >
                                                    <span className="text-base">{categoryIcons[category] || '💫'}</span>
                                                    {category}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Services Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {getFilteredServices().map((svc: any) => (
                                                <button
                                                    key={svc.id}
                                                    onClick={() => handleServiceSelect(svc.id.toString(), svc.name)}
                                                    className="flex items-center p-6 border border-secondary rounded-xl hover:border-primary hover:shadow-lg hover:bg-nude-light transition-all text-left group"
                                                >
                                                    <span className="text-4xl mr-6 group-hover:scale-110 transition-transform">{svc.icon || '✨'}</span>
                                                    <div className="flex-grow">
                                                        <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary">{svc.name}</h3>
                                                        <p className="text-sm text-foreground/50 mb-1">{svc.duration} {typeof svc.duration === 'number' ? 'min' : ''}</p>
                                                        {svc.category && (
                                                            <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                                {svc.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-accent">${svc.price}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Empty State */}
                                        {getFilteredServices().length === 0 && (
                                            <div className="text-center py-12">
                                                <div className="text-6xl mb-4">🔍</div>
                                                <p className="text-foreground/50 text-lg">No hay servicios disponibles en esta categoría</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Step 2: Staff Selection */}
                        {step === 2 && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-3xl font-serif text-center mb-2">¿Quién te atenderá?</h2>
                                <p className="text-center text-foreground/60 mb-10">Selecciona a tu especialista favorito</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <button
                                        onClick={() => handleStaffSelect('0', 'Cualquiera')}
                                        className="bg-secondary/10 p-6 rounded-xl border border-secondary hover:border-primary hover:shadow-lg transition-all text-center group"
                                    >
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✨</div>
                                        <h3 className="font-serif text-lg font-bold text-foreground">Cualquier Profesional</h3>
                                        <p className="text-sm text-foreground/50">El primero disponible</p>
                                    </button>
                                    {(availableStaff.length > 0 ? availableStaff : staff).map((member: any) => (
                                        <button
                                            key={member.id}
                                            onClick={() => handleStaffSelect(member.id.toString(), member.name)}
                                            className="bg-white p-6 rounded-xl border border-secondary hover:border-primary hover:shadow-lg transition-all text-center group"
                                        >
                                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden relative">
                                                {member.image ? (
                                                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100 text-2xl font-serif">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-serif text-lg font-bold text-foreground">{member.name}</h3>
                                            <p className="text-sm text-foreground/50">{member.role}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Date & Time */}
                        {step === 3 && (
                            <div className="animate-fade-in-up max-w-2xl mx-auto">
                                <h2 className="text-3xl font-serif text-center mb-2">Fecha y Hora</h2>
                                <p className="text-center text-foreground/60 mb-8">¿Cuándo te gustaría visitarnos?</p>

                                {/* Availability Information */}
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className="text-lg">✅</span>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-green-900 text-sm mb-1">Días Disponibles</h4>
                                                <p className="text-xs text-green-700">
                                                    {getAvailabilityInfo().openDays.length > 0
                                                        ? getAvailabilityInfo().openDays.join(', ')
                                                        : 'Cargando...'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {getAvailabilityInfo().closedDays.length > 0 && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-start gap-2 mb-2">
                                                <span className="text-lg">🚫</span>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-sm mb-1">No Atendemos</h4>
                                                    <p className="text-xs text-gray-700">
                                                        {getAvailabilityInfo().closedDays.join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Info about same-day bookings */}
                                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-start gap-2">
                                        <span className="text-base flex-shrink-0">ℹ️</span>
                                        <div className="text-xs text-blue-800">
                                            <p className="font-medium mb-1">Reservas del día actual</p>
                                            <p>Puedes reservar para hoy si hay disponibilidad. Solo se mostrarán horarios con al menos 1 hora de anticipación.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-foreground/70 mb-2">Selecciona una fecha</label>
                                    <DatePicker
                                        selected={formData.date ? new Date(formData.date + 'T12:00:00') : null}
                                        onChange={handleDateSelect}
                                        locale="es"
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        filterDate={(date) => !isDateDisabled(date)}
                                        dayClassName={getDayClassName}
                                        inline
                                        calendarClassName="custom-datepicker"
                                        className={`w-full p-4 border rounded-xl focus:ring-1 outline-none text-foreground font-sans transition-colors ${
                                            dateError
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50'
                                                : 'border-secondary focus:border-primary focus:ring-primary'
                                        }`}
                                    />

                                    {/* Indicador de fecha seleccionada */}
                                    {formData.date && (
                                        <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg animate-fade-in">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-lg">📅</span>
                                                <p className="text-sm font-bold text-primary">
                                                    {(() => {
                                                        const date = new Date(formData.date + 'T12:00:00');
                                                        const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()];
                                                        const day = date.getDate();
                                                        const monthName = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][date.getMonth()];
                                                        const year = date.getFullYear();
                                                        return `${dayName}, ${day} de ${monthName} de ${year}`;
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {dateError && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                                            <p className="text-sm text-red-700 flex items-start gap-2">
                                                <span className="text-base flex-shrink-0">⚠️</span>
                                                <span>{dateError}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {formData.date && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-medium text-foreground/70 mb-4">Horarios Disponibles</label>
                                        {availableTimeSlots.length > 0 ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                {availableTimeSlots.map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => handleTimeSelect(time)}
                                                        className="py-2 px-4 rounded-lg border border-secondary hover:border-primary hover:bg-primary hover:text-white transition-all text-sm font-medium"
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            (() => {
                                                const availableStaffThisDay = getAvailableStaffForDate(formData.service, formData.date);
                                                const currentStaff = availableStaff.find(s => s.id.toString() === formData.staffId);
                                                const otherAvailableStaff = availableStaffThisDay.filter(s => s.id.toString() !== formData.staffId);

                                                return (
                                                    <div className="space-y-4">
                                                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                                            <div className="flex items-start gap-2 mb-3">
                                                                <span className="text-lg flex-shrink-0">⚠️</span>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-bold text-yellow-900 mb-1">
                                                                        {currentStaff?.name || 'Este especialista'} no está disponible esta fecha
                                                                    </p>
                                                                    <p className="text-xs text-yellow-700">
                                                                        No trabaja este día o todos sus horarios están ocupados.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {otherAvailableStaff.length > 0 && (
                                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fade-in">
                                                                <div className="flex items-start gap-2 mb-3">
                                                                    <span className="text-lg flex-shrink-0">💡</span>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-bold text-blue-900 mb-2">
                                                                            ¡Hay {otherAvailableStaff.length} especialista{otherAvailableStaff.length > 1 ? 's' : ''} disponible{otherAvailableStaff.length > 1 ? 's' : ''} este día!
                                                                        </p>
                                                                        <p className="text-xs text-blue-700 mb-3">
                                                                            Cambia de especialista para ver los horarios disponibles:
                                                                        </p>
                                                                        <div className="space-y-2">
                                                                            {otherAvailableStaff.map(staff => (
                                                                                <button
                                                                                    key={staff.id}
                                                                                    onClick={() => {
                                                                                        setFormData({ ...formData, staff: staff.name, staffId: staff.id.toString() });
                                                                                    }}
                                                                                    className="w-full flex items-center gap-3 p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left group"
                                                                                >
                                                                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                                                                        {staff.image ? (
                                                                                            <Image src={staff.image} alt={staff.name} width={48} height={48} className="object-cover w-full h-full" />
                                                                                        ) : (
                                                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 text-lg font-serif">
                                                                                                {staff.name.charAt(0)}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <p className="font-bold text-blue-900 group-hover:text-blue-700">{staff.name}</p>
                                                                                        <p className="text-xs text-blue-600">{staff.role}</p>
                                                                                    </div>
                                                                                    <span className="text-blue-400 group-hover:text-blue-600 transition-colors">→</span>
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {otherAvailableStaff.length === 0 && (
                                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                                                <p className="text-sm text-gray-700">
                                                                    😔 Ningún especialista está disponible esta fecha.
                                                                    <br />
                                                                    <span className="text-xs">Por favor selecciona otra fecha o vuelve atrás para elegir otro servicio.</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Contact Details */}
                        {step === 4 && (
                            <div className="animate-fade-in-up max-w-xl mx-auto">
                                <h2 className="text-3xl font-serif text-center mb-2">Tus Datos</h2>
                                <p className="text-center text-foreground/60 mb-10">Para poder confirmar tu cita</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-foreground/70 mb-2">Doc.</label>
                                            <select
                                                name="docType"
                                                value={formData.docType}
                                                onChange={e => setFormData({ ...formData, docType: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-white"
                                            >
                                                <option value="DNI">DNI</option>
                                                <option value="CE">CE</option>
                                                <option value="Pasaporte">Pasaporte</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-foreground/70 mb-2">Nro. Documento</label>
                                            <input
                                                required
                                                name="docNumber"
                                                type="text"
                                                value={formData.docNumber}
                                                onChange={async (e) => {
                                                    const val = e.target.value;
                                                    setFormData(prev => ({ ...prev, docNumber: val }));

                                                    // Reset client exists state
                                                    setClientExists(null);

                                                    // Trigger auto-fill if DNI length is 8 (standard for DNI)
                                                    if (val.length >= 8) {
                                                        setSearchingClient(true);
                                                        try {
                                                            const res = await fetch(`/api/clients/search?docType=${formData.docType}&docNumber=${val}`);
                                                            if (res.ok) {
                                                                const clientData = await res.json();
                                                                if (clientData.exists) {
                                                                    setClientExists(true);
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        name: clientData.name,
                                                                        phone: clientData.phone,
                                                                        email: clientData.email || prev.email,
                                                                        birthDate: clientData.birthDate || prev.birthDate,
                                                                        address: clientData.address || prev.address
                                                                    }));
                                                                }
                                                            } else if (res.status === 404) {
                                                                setClientExists(false);
                                                                // Clear fields for new client registration
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    name: '',
                                                                    phone: '',
                                                                    email: '',
                                                                    birthDate: '',
                                                                    address: ''
                                                                }));
                                                            }
                                                        } catch (err) {
                                                            console.error("Auto-fill error:", err);
                                                        } finally {
                                                            setSearchingClient(false);
                                                        }
                                                    }
                                                }}
                                                className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                                placeholder="00000000"
                                            />
                                            {searchingClient && (
                                                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                                                    <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                                    Buscando cliente...
                                                </p>
                                            )}
                                            {clientExists === true && (
                                                <p className="text-xs text-green-600 mt-1">✓ Cliente encontrado - datos cargados automáticamente</p>
                                            )}
                                            {clientExists === false && (
                                                <p className="text-xs text-blue-600 mt-1">ℹ️ Cliente nuevo - por favor completa todos los datos para tu registro</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Nombre Completo</label>
                                        <input required name="name" type="text" value={formData.name} onChange={handleContactChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Tu nombre" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Teléfono</label>
                                        <input required name="phone" type="tel" value={formData.phone} onChange={handleContactChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Tu teléfono" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Email <span className="text-xs text-foreground/50">(Opcional)</span></label>
                                        <input name="email" type="email" value={formData.email} onChange={handleContactChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="tucorreo@ejemplo.com" />
                                    </div>

                                    {/* Additional fields for new clients only */}
                                    {clientExists === false && (
                                        <>
                                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                                                <p className="text-sm text-blue-800 mb-4">
                                                    <span className="font-bold">📝 Registro de Cliente Nuevo</span>
                                                    <br />
                                                    <span className="text-xs">Como es tu primera visita, necesitamos algunos datos adicionales para tu registro.</span>
                                                </p>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Fecha de Nacimiento <span className="text-xs text-foreground/50">(Opcional)</span></label>
                                                        <input
                                                            name="birthDate"
                                                            type="date"
                                                            value={formData.birthDate}
                                                            onChange={handleContactChange}
                                                            className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Dirección <span className="text-xs text-foreground/50">(Opcional)</span></label>
                                                        <input
                                                            name="address"
                                                            type="text"
                                                            value={formData.address}
                                                            onChange={handleContactChange}
                                                            className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                                            placeholder="Ej. Av. Principal 123, Lima"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Hora de contacto preferencial <span className="text-xs text-foreground/50">(Opcional)</span></label>
                                        <input name="preferredContactTime" type="text" value={formData.preferredContactTime} onChange={handleContactChange} className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Ej. Después de las 5 PM" />
                                        <p className="text-xs text-foreground/50 mt-1 ml-1">Para coordinar detalles de tu cita si fuera necesario.</p>
                                    </div>

                                    <div className="bg-secondary/20 p-6 rounded-xl mt-8">
                                        <h4 className="font-serif font-bold text-primary mb-4 border-b border-primary/20 pb-2">Resumen de la Cita</h4>
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="text-foreground/70">Servicio:</span>
                                            <span className="font-medium">{services.find(s => s.id === formData.service)?.name}</span>
                                        </div>
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="text-foreground/70">Especialista:</span>
                                            <span className="font-medium">{formData.staff}</span>
                                        </div>
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="text-foreground/70">Fecha:</span>
                                            <span className="font-medium">{formData.date}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-foreground/70">Hora:</span>
                                            <span className="font-medium">{formData.time}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white font-medium py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 text-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Procesando...
                                            </>
                                        ) : 'Confirmar Reserva'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Step 5: Success */}
                        {step === 5 && (
                            <div className="text-center py-12 animate-fade-in-up">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <span className="text-5xl">✨</span>
                                </div>
                                <h2 className="text-4xl font-serif text-primary mb-4">¡Cita Confirmada!</h2>
                                <p className="text-xl text-foreground/70 mb-8 max-w-md mx-auto">
                                    Gracias {formData.name}, te esperamos el día {formData.date} a las {formData.time} con {formData.staff}.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-secondary/20 text-foreground rounded-full hover:bg-secondary/40 transition-colors">
                                        Volver al Inicio
                                    </button>
                                    <button onClick={() => { setStep(1); setFormData({ ...formData, service: '', time: '' }); }} className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg">
                                        Nueva Reserva
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
