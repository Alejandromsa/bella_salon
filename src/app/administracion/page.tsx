"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Import Shared Types
import { Staff, Service, Appointment, Client, LoyaltyConfig, Promotion, Complaint } from './components/types';

// Import Utilities
import { compressImage, formatFileSize } from '@/lib/imageCompression';

// Import Tab Components
import AppointmentsTab from './components/AppointmentsTab';
import StaffTab from './components/StaffTab';
import ServicesTab from './components/ServicesTab';
import ClientsTab from './components/ClientsTab';
import PromotionsTab from './components/PromotionsTab';
import ScheduleTab from './components/ScheduleTab';
import SettingsTab from './components/SettingsTab';
import StatsTab from './components/StatsTab';
import RedemptionsTab from './components/RedemptionsTab';
import PointsVisitsTab from './components/PointsVisitsTab';
import ComplaintsTab from './components/ComplaintsTab';
import StaffScheduleModal from './components/StaffScheduleModal';
import ClientProfileModal from './components/ClientProfileModal';

// Initial data is now empty, it will be loaded from DB
const initialStaff: Staff[] = [];
const initialAppointments: Appointment[] = [];
const initialServices: Service[] = [];
const initialClients: Client[] = [];
const initialHolidays: string[] = [];

const initialLoyaltyConfig: LoyaltyConfig = {
    pointsPerSole: 1,
    vipThreshold: 500,
    promotions: []
};

export default function Administracion() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('appointments');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const serviceImageRef = useRef<HTMLInputElement>(null);

    // Data States
    const [staff, setStaff] = useState(initialStaff);
    const [services, setServices] = useState(initialServices);
    const [clients, setClients] = useState(initialClients);
    const [loyaltyConfig, setLoyaltyConfig] = useState(initialLoyaltyConfig);
    const [appointments, setAppointments] = useState(initialAppointments);
    const [apptPagination, setApptPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [apptSearch, setApptSearch] = useState('');
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [holidays, setHolidays] = useState<string[]>(initialHolidays);
    const [newDate, setNewDate] = useState('');
    const [schedule, setSchedule] = useState({ start: '09:00', end: '20:00', days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] });

    // Horario estándar para especialistas (preset "Horario Regular")
    const [standardStaffSchedule, setStandardStaffSchedule] = useState({
        Lun: { active: true, start: '09:00', end: '18:00', breaks: [] },
        Mar: { active: true, start: '09:00', end: '18:00', breaks: [] },
        Mié: { active: true, start: '09:00', end: '18:00', breaks: [] },
        Jue: { active: true, start: '09:00', end: '18:00', breaks: [] },
        Vie: { active: true, start: '09:00', end: '18:00', breaks: [] },
        Sáb: { active: true, start: '10:00', end: '16:00', breaks: [] },
        Dom: { active: false, start: '', end: '', breaks: [] }
    });

    const [salonSettings, setSalonSettings] = useState({
        businessName: 'Bella Salon E.I.R.L.',
        ruc: '20123456789',
        fiscalAddress: 'Av. Las Gardenias 456, Santiago de Surco, Lima',
        whatsapp: '+51 999 999 999',
        complaintsBookUrl: '/libro-de-reclamaciones',
        privacyPolicyUrl: '/privacidad',
        termsUrl: '/terminos',
        bookingEnabled: true,
        bookingWhatsapp: '+51 999 999 999',
        bookingWhatsappMessage: 'Hola, quisiera reservar una cita en BellaSalón. ¿Tienen disponibilidad?',
        bookingRateLimitEnabled: true,
        bookingRateLimitMinutes: 30,
        bookingRateLimitMaxBookings: 3,
    });

    // Staff Schedule Editor State
    const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [clientSearchTerm, setClientSearchTerm] = useState('');

    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // New Staff Form State
    const [newStaff, setNewStaff] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        bio: '',
        specialties: '',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80',
    });

    // New Appointment Form State
    const [newAppt, setNewAppt] = useState({
        clientName: '',
        service: 'Corte y Estilo',
        staff: 'Ana García',
        date: '',
        time: '',
        phone: ''
    });

    // New Service Form State
    const [newService, setNewService] = useState({
        name: '',
        category: 'Cabello',
        description: '',
        duration: 60,
        price: 0,
        image: '',
        requirements: '',
        assignedStaff: [] as string[],
        featured: false
    });

    // New Client Form State
    const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        phone: '',
        docType: 'DNI',
        docNumber: '',
        birthDate: '',
        address: '',
        notes: '',
        tags: [] as string[]
    });

    // New Promotion Form State
    const [newPromotion, setNewPromotion] = useState({
        name: '',
        type: 'discount' as 'discount' | 'free_service',
        trigger: 'visits' as 'visits' | 'points',
        threshold: 5,
        period: 'total' as 'month' | 'total',
        reward: 10 as number | string,
        description: ''
    });

    const [editingPromotionId, setEditingPromotionId] = useState<number | null>(null);

    const loadAllData = async () => {
        try {
            const [clientsRes, staffRes, servicesRes, promoRes, settingsRes, complaintsRes, holidaysRes] = await Promise.all([
                fetch('/api/clients'),
                fetch('/api/staff'),
                fetch('/api/services'),
                fetch('/api/promotions'),
                fetch('/api/settings'),
                fetch('/api/complaints'),
                fetch('/api/holidays')
            ]);

            if (clientsRes.ok) setClients(await clientsRes.json());
            if (staffRes.ok) setStaff(await staffRes.json());
            if (servicesRes.ok) setServices(await servicesRes.json());
            if (complaintsRes.ok) {
                const data = await complaintsRes.json();
                setComplaints(data.data);
            }
            if (promoRes.ok) {
                const data = await promoRes.json();
                setLoyaltyConfig(prev => ({
                    ...prev,
                    promotions: data.promotions,
                    pointsPerSole: data.config?.points_per_sole ? parseFloat(data.config.points_per_sole) : prev.pointsPerSole,
                    vipThreshold: data.config?.vip_threshold ? parseFloat(data.config.vip_threshold) : prev.vipThreshold
                }));
            }
            if (settingsRes.ok) {
                const data = await settingsRes.json();
                if (data.business_name) {
                    setSalonSettings({
                        businessName: data.business_name,
                        ruc: data.ruc,
                        fiscalAddress: data.fiscal_address,
                        whatsapp: data.whatsapp,
                        complaintsBookUrl: data.complaints_book_url,
                        privacyPolicyUrl: data.privacy_policy_url,
                        termsUrl: data.terms_url,
                        bookingEnabled: data.booking_enabled !== undefined ? data.booking_enabled : true,
                        bookingWhatsapp: data.booking_whatsapp || '+51 999 999 999',
                        bookingWhatsappMessage: data.booking_whatsapp_message || 'Hola, quisiera reservar una cita en BellaSalón. ¿Tienen disponibilidad?',
                        bookingRateLimitEnabled: data.booking_rate_limit_enabled !== undefined ? data.booking_rate_limit_enabled : true,
                        bookingRateLimitMinutes: data.booking_rate_limit_minutes || 30,
                        bookingRateLimitMaxBookings: data.booking_rate_limit_max_bookings || 3,
                    });
                }
                if (data.schedule) setSchedule(data.schedule);
                if (data.standard_staff_schedule) {
                    setStandardStaffSchedule(data.standard_staff_schedule);
                }
            }
            if (holidaysRes.ok) {
                const holidaysData = await holidaysRes.json();
                setHolidays(holidaysData);
            }
        } catch (error) {
            console.error("Error loading synchronized data:", error);
        }
    };

    const fetchAppointments = async (page = 1, search = '') => {
        try {
            const res = await fetch(`/api/appointments?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(data.data);
                setApptPagination(data.pagination);
            }
        } catch (error) {
            console.error("Error loading appointments:", error);
        }
    };

    useEffect(() => {
        loadAllData();
        fetchAppointments(1, '');
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchAppointments(1, apptSearch);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [apptSearch]);

    useEffect(() => {
        const storedAuth = localStorage.getItem('isAdminAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            localStorage.setItem('isAdminAuthenticated', 'true');
        } else {
            alert('Contraseña incorrecta');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdminAuthenticated');
    };

    // --- Staff Logic ---
    const toggleStaffStatus = async (id: number) => {
        const target = staff.find(s => s.id === id);
        if (!target) return;
        try {
            const res = await fetch(`/api/staff/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...target, active: !target.active })
            });
            if (res.ok) loadAllData();
        } catch (error) {
            alert("Error al actualizar estado");
        }
    };

    const updateStaff = async (id: number, updates: Partial<Staff>) => {
        const target = staff.find(s => s.id === id);
        if (!target) return;

        try {
            const updatedStaff = { ...target, ...updates };
            const res = await fetch(`/api/staff/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStaff)
            });

            if (res.ok) {
                loadAllData();
                alert("Especialista actualizado correctamente");
            } else {
                const errorData = await res.json();
                console.error('Error updating staff:', errorData);
                alert(`Error al actualizar: ${errorData.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error updating staff:', error);
            alert("Error al actualizar especialista");
        }
    };

    const deleteStaff = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este especialista?')) {
            try {
                const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
                if (res.ok) loadAllData();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    const handleNewStaffChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show loading state
        const loadingToast = alert('Procesando imagen...');

        try {
            const result = await compressImage(file, {
                maxSizeMB: 5,
                maxWidthOrHeight: 1920,
                initialQuality: 0.85
            });

            if (result.success && result.data) {
                setNewStaff({ ...newStaff, image: result.data });

                // Show compression info
                if (result.originalSize && result.compressedSize) {
                    const saved = result.originalSize - result.compressedSize;
                    console.log(`Imagen optimizada: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (${Math.round((saved / result.originalSize) * 100)}% reducción)`);
                }

                alert('Imagen cargada y optimizada correctamente');
            } else {
                alert(result.error || 'Error al procesar la imagen');
            }
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error al procesar la imagen. Por favor, intente con otra imagen.');
        }

        // Clear input to allow re-upload of same file
        e.target.value = '';
    };

    const addStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStaff.name || !newStaff.role) return;

        const defaultSchedule = {
            weeklySchedule: {
                'Lun': { active: true, start: '09:00', end: '18:00', breaks: [] },
                'Mar': { active: true, start: '09:00', end: '18:00', breaks: [] },
                'Mié': { active: true, start: '09:00', end: '18:00', breaks: [] },
                'Jue': { active: true, start: '09:00', end: '18:00', breaks: [] },
                'Vie': { active: true, start: '09:00', end: '18:00', breaks: [] },
                'Sáb': { active: false, start: '09:00', end: '14:00', breaks: [] },
                'Dom': { active: false, start: '09:00', end: '14:00', breaks: [] }
            },
            vacations: [],
            exceptions: [],
            worksHolidays: false
        };

        try {
            const response = await fetch('/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newStaff,
                    specialties: newStaff.specialties ? newStaff.specialties.split(',').map(s => s.trim()).filter(s => s) : [],
                    schedule: defaultSchedule
                }),
            });
            if (response.ok) {
                loadAllData();
                setNewStaff({ name: '', role: '', email: '', phone: '', bio: '', specialties: '', image: '' });
                alert("Personal agregado correctamente.");
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert(`Error al guardar especialista: ${errorData.details || errorData.error}`);
            }
        } catch (error) {
            console.error('Error saving staff:', error);
            alert('Error al guardar especialista');
        }
    };

    // Advanced Schedule Management
    const openScheduleEditor = (staffId: number) => {
        setEditingStaffId(staffId);
        setShowScheduleModal(true);
    };

    const updateStaffSchedule = (staffId: number, day: string, field: string, value: any) => {
        setStaff(staff.map(s => {
            if (s.id === staffId) {
                const weeklySchedule = s.schedule.weeklySchedule as any;
                return {
                    ...s,
                    schedule: {
                        ...s.schedule,
                        weeklySchedule: {
                            ...weeklySchedule,
                            [day]: {
                                ...weeklySchedule[day],
                                [field]: value
                            }
                        }
                    }
                };
            }
            return s;
        }));
    };

    const addVacationDay = (staffId: number, date: string) => {
        setStaff(staff.map(s => {
            if (s.id === staffId && date && !s.schedule.vacations.includes(date)) {
                return {
                    ...s,
                    schedule: {
                        ...s.schedule,
                        vacations: [...s.schedule.vacations, date].sort()
                    }
                };
            }
            return s;
        }));
    };

    const removeVacationDay = (staffId: number, date: string) => {
        setStaff(staff.map(s => {
            if (s.id === staffId) {
                return {
                    ...s,
                    schedule: {
                        ...s.schedule,
                        vacations: s.schedule.vacations.filter(d => d !== date)
                    }
                };
            }
            return s;
        }));
    };

    const addException = (staffId: number, exception: any) => {
        setStaff(staff.map(s => {
            if (s.id === staffId) {
                return {
                    ...s,
                    schedule: {
                        ...s.schedule,
                        exceptions: [...s.schedule.exceptions, exception]
                    }
                };
            }
            return s;
        }));
    };

    const removeException = (staffId: number, index: number) => {
        setStaff(staff.map(s => {
            if (s.id === staffId) {
                return {
                    ...s,
                    schedule: {
                        ...s.schedule,
                        exceptions: s.schedule.exceptions.filter((_, i) => i !== index)
                    }
                };
            }
            return s;
        }));
    };

    const toggleWorksHolidays = (staffId: number) => {
        setStaff(staff.map(s => {
            if (s.id === staffId) {
                return {
                    ...s,
                    schedule: {
                        ...s.schedule,
                        worksHolidays: !s.schedule.worksHolidays
                    }
                };
            }
            return s;
        }));
    };

    const applyStandardSchedule = (staffId: number) => {
        setStaff(staff.map(s => {
            if (s.id === staffId) {
                return {
                    ...s,
                    schedule: {
                        ...s.schedule,
                        weeklySchedule: { ...standardStaffSchedule }
                    }
                };
            }
            return s;
        }));
        alert('Horario Regular aplicado correctamente. No olvides guardar los cambios.');
    };

    const saveStaffSchedule = async (staffId: number) => {
        const targetStaff = staff.find(s => s.id === staffId);
        if (!targetStaff) return;

        try {
            const res = await fetch(`/api/staff/${staffId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(targetStaff)
            });
            if (res.ok) {
                setShowScheduleModal(false);
                alert('Horario guardado correctamente');
            } else {
                alert('Error al guardar el horario');
            }
        } catch (error) {
            console.error('Error saving staff schedule:', error);
            alert('Error al guardar el horario');
        }
    };

    // --- Appointment Logic ---
    const handleApptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewAppt({ ...newAppt, [e.target.name]: e.target.value });
    };

    const addAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newAppt,
                    date: `${newAppt.date}T${newAppt.time}:00`,
                    status: 'Confirmada'
                }),
            });
            if (response.ok) {
                loadAllData();
                fetchAppointments(apptPagination.page, apptSearch);
                setNewAppt({ clientName: '', service: 'Corte y Estilo', staff: 'Ana García', date: '', time: '', phone: '' });
                alert("Cita agendada correctamente");
            }
        } catch (error) {
            alert('Error al agendar cita');
        }
    };

    const updateApptStatus = async (id: number, newStatus: string) => {
        const target = appointments.find(a => a.id === id);
        if (!target) return;
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...target, status: newStatus })
            });
            if (res.ok) {
                loadAllData();
                fetchAppointments(apptPagination.page, apptSearch);
            }
        } catch (error) {
            alert("Error al actualizar cita");
        }
    };

    const deleteAppointment = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta cita?')) {
            try {
                const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    loadAllData();
                    fetchAppointments(apptPagination.page, apptSearch);
                }
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    // --- Service Management Logic ---
    const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setNewService({
            ...newService,
            [name]: type === 'number' ? parseFloat(value) : value
        });
    };

    const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await compressImage(file, {
                maxSizeMB: 5,
                maxWidthOrHeight: 1920,
                initialQuality: 0.85
            });

            if (result.success && result.data) {
                setNewService({ ...newService, image: result.data });

                // Show compression info in console
                if (result.originalSize && result.compressedSize) {
                    const saved = result.originalSize - result.compressedSize;
                    console.log(`Imagen de servicio optimizada: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (${Math.round((saved / result.originalSize) * 100)}% reducción)`);
                }
            } else {
                alert(result.error || 'Error al procesar la imagen');
            }
        } catch (error) {
            console.error('Error processing service image:', error);
            alert('Error al procesar la imagen. Por favor, intente con otra imagen.');
        }

        // Clear input to allow re-upload
        e.target.value = '';
    };

    const toggleStaffAssignment = (staffName: string) => {
        const currentStaff = newService.assignedStaff;
        const newStaff = currentStaff.includes(staffName)
            ? currentStaff.filter(s => s !== staffName)
            : [...currentStaff, staffName];
        setNewService({ ...newService, assignedStaff: newStaff });
    };

    const addService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newService.name || !newService.price) return;

        try {
            const response = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newService),
            });
            if (response.ok) {
                loadAllData();
                setNewService({
                    name: '',
                    category: 'Cabello',
                    description: '',
                    duration: 60,
                    price: 0,
                    image: '',
                    requirements: '',
                    assignedStaff: [],
                    featured: false
                });
                alert('Servicio agregado correctamente');
            }
        } catch (error) {
            alert('Error al guardar el servicio');
        }
    };

    const toggleServiceStatus = async (id: number) => {
        const target = services.find(s => s.id === id);
        if (!target) return;
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...target, active: !target.active })
            });
            if (res.ok) loadAllData();
        } catch (error) {
            alert("Error al actualizar servicio");
        }
    };

    const toggleServiceFeatured = async (id: number) => {
        const target = services.find(s => s.id === id);
        if (!target) return;
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...target, featured: !target.featured })
            });
            if (res.ok) loadAllData();
        } catch (error) {
            alert("Error al actualizar servicio");
        }
    };

    const updateService = async (id: number, updates: Partial<Service>) => {
        const target = services.find(s => s.id === id);
        if (!target) return;

        try {
            const updatedService = { ...target, ...updates };
            const res = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedService)
            });

            if (res.ok) {
                loadAllData();
                alert("Servicio actualizado correctamente");
            } else {
                const errorData = await res.json();
                console.error('Error updating service:', errorData);
                alert(`Error al actualizar: ${errorData.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error updating service:', error);
            alert("Error al actualizar servicio");
        }
    };

    const deleteService = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este servicio?')) {
            try {
                const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
                if (res.ok) loadAllData();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    // --- Client Management Logic ---
    const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewClient({ ...newClient, [e.target.name]: e.target.value });
    };

    const addClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClient.name || !newClient.phone) return;

        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient),
            });
            if (response.ok) {
                loadAllData();
                setNewClient({
                    name: '',
                    email: '',
                    phone: '',
                    docType: 'DNI',
                    docNumber: '',
                    birthDate: '',
                    address: '',
                    notes: '',
                    tags: []
                });
                alert('Cliente agregado correctamente');
            }
        } catch (error) {
            alert('Error al guardar el cliente');
        }
    };

    const updateClient = async (id: number, updates: any) => {
        const target = clients.find(c => c.id === id);
        if (!target) return;
        try {
            const res = await fetch(`/api/clients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...target, ...updates })
            });
            if (res.ok) loadAllData();
        } catch (error) {
            alert("Error al actualizar cliente");
        }
    };

    const deleteClient = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este cliente? Se perderá todo su historial.')) {
            try {
                const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
                if (res.ok) loadAllData();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    const openClientProfile = (clientId: number) => {
        setSelectedClientId(clientId);
        setShowClientModal(true);
    };

    const calculateMonthlyVisits = (clientId: number) => {
        const client = clients.find(c => c.id === clientId);
        if (!client) return 0;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return appointments.filter(a => {
            const apptDate = new Date(a.date);
            return a.clientName === client.name &&
                apptDate.getMonth() === currentMonth &&
                apptDate.getFullYear() === currentYear &&
                a.status === 'Confirmada';
        }).length;
    };

    const getApplicablePromotions = (clientId: number) => {
        const client = clients.find(c => c.id === clientId);
        if (!client) return [];

        const monthlyVisits = calculateMonthlyVisits(clientId);

        return loyaltyConfig.promotions.filter(p => {
            if (!p.active) return false;
            if (p.trigger === 'visits') {
                return monthlyVisits >= p.threshold;
            } else if (p.trigger === 'points') {
                return client.loyaltyPoints >= p.threshold;
            }
            return false;
        }).sort((a, b) => b.threshold - a.threshold);
    };

    const redeemPromotion = (clientId: number, promotionId: number) => {
        const client = clients.find(c => c.id === clientId);
        const promotion = loyaltyConfig.promotions.find(p => p.id === promotionId);

        if (!client || !promotion) return;

        if (promotion.trigger === 'points') {
            if (client.loyaltyPoints < promotion.threshold) {
                alert('Puntos insuficientes');
                return;
            }

            const redeemedPromo = {
                id: promotion.id,
                name: promotion.name,
                date: new Date().toISOString().split('T')[0],
                pointsUsed: promotion.threshold
            };

            updateClient(clientId, {
                loyaltyPoints: client.loyaltyPoints - promotion.threshold,
                redeemedPromotions: [...(client.redeemedPromotions || []), redeemedPromo]
            });

            alert(`Promoción "${promotion.name}" canjeada con éxito. Se descontaron ${promotion.threshold} puntos.`);
        } else {
            alert(`Promoción "${promotion.name}" aplicada por visitas.`);
        }
    };

    const addTagToClient = (clientId: number, tag: string) => {
        const client = clients.find(c => c.id === clientId);
        if (client && !client.tags.includes(tag)) {
            updateClient(clientId, { tags: [...client.tags, tag] });
        }
    };

    const removeTagFromClient = (clientId: number, tag: string) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            updateClient(clientId, { tags: client.tags.filter(t => t !== tag) });
        }
    };

    // --- Loyalty/Promotion Management Logic ---
    const handlePromotionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setNewPromotion({
            ...newPromotion,
            [name]: type === 'number' ? parseFloat(value) : value
        });
    };

    const addPromotion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPromotion.name) return;

        try {
            // If editing, use PUT. Otherwise, use POST
            if (editingPromotionId) {
                const response = await fetch(`/api/promotions/${editingPromotionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPromotion),
                });
                if (response.ok) {
                    loadAllData();
                    setNewPromotion({
                        name: '',
                        type: 'discount',
                        trigger: 'visits',
                        threshold: 5,
                        period: 'total',
                        reward: 10,
                        description: ''
                    });
                    setEditingPromotionId(null);
                    alert('Promoción actualizada correctamente');
                } else {
                    alert('Error al actualizar la promoción');
                }
            } else {
                const response = await fetch('/api/promotions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPromotion),
                });
                if (response.ok) {
                    loadAllData();
                    setNewPromotion({
                        name: '',
                        type: 'discount',
                        trigger: 'visits',
                        threshold: 5,
                        period: 'total',
                        reward: 10,
                        description: ''
                    });
                    alert('Promoción agregada correctamente');
                } else {
                    alert('Error al crear la promoción');
                }
            }
        } catch (error) {
            alert('Error al guardar la promoción');
        }
    };

    const editPromotion = (promo: any) => {
        setNewPromotion({
            name: promo.name,
            type: promo.type,
            trigger: promo.trigger,
            threshold: promo.threshold,
            period: promo.period,
            reward: promo.reward,
            description: promo.description
        });
        setEditingPromotionId(promo.id);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clonePromotion = (promo: any) => {
        setNewPromotion({
            name: `${promo.name} (Copia)`,
            type: promo.type,
            trigger: promo.trigger,
            threshold: promo.threshold,
            period: promo.period,
            reward: promo.reward,
            description: promo.description
        });
        setEditingPromotionId(null); // Not editing, creating a new one
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditPromotion = () => {
        setNewPromotion({
            name: '',
            type: 'discount',
            trigger: 'visits',
            threshold: 5,
            period: 'total',
            reward: 10,
            description: ''
        });
        setEditingPromotionId(null);
    };

    const togglePromotionStatus = async (id: number) => {
        const target = loyaltyConfig.promotions.find(p => p.id === id);
        if (!target) return;
        try {
            const res = await fetch(`/api/promotions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...target, active: !target.active })
            });
            if (res.ok) loadAllData();
        } catch (error) {
            alert("Error al actualizar promoción");
        }
    };

    const deletePromotion = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta promoción?')) {
            try {
                const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
                if (res.ok) loadAllData();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    const updateComplaint = async (id: number, status: string, response: string) => {
        try {
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, response_text: response })
            });
            if (res.ok) {
                alert('Respuesta enviada correctamente.');
                loadAllData();
            }
        } catch (error) {
            alert('Error al actualizar reclamación');
        }
    };

    const updateLoyaltySettings = async (field: string, value: number) => {
        // Optimistic update: Update local state immediately
        setLoyaltyConfig(prev => ({
            ...prev,
            [field]: value
        }));

        try {
            const response = await fetch('/api/loyalty-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    [field]: value
                }),
            });

            if (response.ok) {
                console.log(`✅ Configuración de fidelización actualizada: ${field} = ${value}`);
                // No need to reload all data, state is already updated
            } else {
                const errorData = await response.json();
                console.error('Error updating loyalty settings:', errorData);
                alert(`Error al actualizar configuración: ${errorData.error || 'Error desconocido'}`);
                // Revert optimistic update
                loadAllData();
            }
        } catch (error) {
            console.error('Error updating loyalty settings:', error);
            alert('Error de conexión al actualizar configuración');
            // Revert optimistic update
            loadAllData();
        }
    };

    // --- Schedule/Holiday Logic ---
    const addHoliday = () => {
        if (newDate && !holidays.includes(newDate)) {
            setHolidays([...holidays, newDate]);
            setNewDate('');
        }
    };

    const removeHoliday = (date: string) => {
        setHolidays(holidays.filter(h => h !== date));
    };

    // --- Settings Logic ---
    const updateSettings = (field: string, value: string | boolean) => {
        setSalonSettings(prev => ({ ...prev, [field]: value }));
    };

    const saveSettings = async () => {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    business_name: salonSettings.businessName,
                    ruc: salonSettings.ruc,
                    fiscal_address: salonSettings.fiscalAddress,
                    whatsapp: salonSettings.whatsapp,
                    complaints_book_url: salonSettings.complaintsBookUrl,
                    privacy_policy_url: salonSettings.privacyPolicyUrl,
                    terms_url: salonSettings.termsUrl,
                    booking_enabled: salonSettings.bookingEnabled,
                    booking_whatsapp: salonSettings.bookingWhatsapp,
                    booking_whatsapp_message: salonSettings.bookingWhatsappMessage,
                    booking_rate_limit_enabled: salonSettings.bookingRateLimitEnabled,
                    booking_rate_limit_minutes: salonSettings.bookingRateLimitMinutes,
                    booking_rate_limit_max_bookings: salonSettings.bookingRateLimitMaxBookings,
                    schedule: schedule,
                    standard_staff_schedule: standardStaffSchedule
                }),
            });
            if (response.ok) {
                alert('Configuración guardada correctamente.');
                loadAllData();
            }
        } catch (error) {
            alert('Error al guardar configuración');
        }
    };

    const updateStandardSchedule = (day: string, field: string, value: any) => {
        setStandardStaffSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day as keyof typeof prev],
                [field]: value
            }
        }));
    };

    const saveScheduleAndHolidays = async () => {
        try {
            // Save schedule to settings table
            const scheduleResponse = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    schedule: schedule
                })
            });

            // Save holidays to holidays table
            const holidaysResponse = await fetch('/api/holidays', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    holidays: holidays
                })
            });

            if (scheduleResponse.ok && holidaysResponse.ok) {
                alert('Horarios y festivos guardados correctamente.');
            } else {
                alert('Error al guardar algunos datos.');
            }
        } catch (error) {
            console.error('Error saving schedule and holidays:', error);
            alert('Error al guardar horarios y festivos');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-secondary/20">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif text-primary mb-2">Administración</h1>
                        <p className="text-foreground/60">Acceso exclusivo para gerencia</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/90 transition-all">
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const editingStaff = staff.find(s => s.id === editingStaffId);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    const tabItems = [
        { id: 'appointments', icon: '📝', label: 'Citas y Agenda' },
        { id: 'staff', icon: '👥', label: 'Gestión de Personal' },
        { id: 'services', icon: '💇', label: 'Gestión de Servicios' },
        { id: 'clients', icon: '👤', label: 'Gestión de Clientes' },
        { id: 'promotions', icon: '🎁', label: 'Gestión de Promociones y Fidelización' },
        { id: 'redemptions', icon: '🎫', label: 'Gestión de Canjes' },
        { id: 'points_visits', icon: '⭐', label: 'Puntos y Visitas' },
        { id: 'schedule', icon: '📅', label: 'Gestión de Horarios y Festivos' },
        { id: 'complaints', icon: '📖', label: 'Libro de Reclamaciones' },
        { id: 'settings', icon: '⚙️', label: 'Configuración' },
        { id: 'stats', icon: '📊', label: 'Estadísticas' }
    ];

    return (
        <div className="min-h-screen bg-secondary/10 flex">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-white border-r border-secondary/20 fixed h-full z-50 overflow-y-auto pt-20 md:pt-24 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block`}>
                <div className="p-8">
                    <h2 className="text-2xl font-serif text-primary font-bold">BellaAdmin</h2>
                </div>

                <nav className="mt-4">
                    {tabItems.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`w-full text-left px-8 py-4 font-medium transition-colors ${activeTab === tab.id ? 'bg-secondary/20 text-primary border-r-4 border-primary' : 'text-foreground/60 hover:bg-secondary/10'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="p-8 border-t border-secondary/20 mt-auto">
                    <button onClick={handleLogout} className="text-red-500 font-medium hover:text-red-600 flex items-center gap-2">
                        ← Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Modals */}
            <StaffScheduleModal
                show={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                editingStaff={staff.find(s => s.id === editingStaffId) || null}
                daysOfWeek={daysOfWeek}
                standardStaffSchedule={standardStaffSchedule}
                updateStaffSchedule={updateStaffSchedule}
                applyStandardSchedule={applyStandardSchedule}
                addVacationDay={addVacationDay}
                removeVacationDay={removeVacationDay}
                addException={addException}
                removeException={removeException}
                toggleWorksHolidays={toggleWorksHolidays}
                saveStaffSchedule={saveStaffSchedule}
            />

            <ClientProfileModal
                show={showClientModal}
                onClose={() => setShowClientModal(false)}
                client={clients.find(c => c.id === selectedClientId) || null}
                updateClient={updateClient}
            />

            {/* Mobile Header - Fixed at top */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30 border-b border-secondary/20">
                <div className="flex justify-between items-center p-4">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
                        aria-label="Abrir menú"
                    >
                        <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-base font-serif text-primary font-bold truncate px-2 flex-1 text-center">
                        {tabItems.find(t => t.id === activeTab)?.icon} {tabItems.find(t => t.id === activeTab)?.label}
                    </h1>
                    <button onClick={handleLogout} className="text-sm text-red-500 font-medium whitespace-nowrap">Salir</button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-24 md:ml-64 overflow-y-auto">
                <div className="max-w-6xl mx-auto">

                    {/* --- APPOINTMENTS TAB --- */}
                    {activeTab === 'appointments' && (
                        <AppointmentsTab
                            appointments={appointments}
                            pagination={apptPagination}
                            onPageChange={(p) => fetchAppointments(p, apptSearch)}
                            onSearchChange={setApptSearch}
                            searchValue={apptSearch}
                            addAppointment={addAppointment}
                            updateApptStatus={updateApptStatus}
                            deleteAppointment={deleteAppointment}
                            newAppt={newAppt}
                            handleApptChange={handleApptChange}
                            staff={staff}
                            services={services}
                        />
                    )}

                    {/* --- STAFF TAB --- */}
                    {activeTab === 'staff' && (
                        <StaffTab
                            staff={staff}
                            newStaff={newStaff}
                            handleNewStaffChange={handleNewStaffChange}
                            addStaff={addStaff}
                            toggleStaffActive={toggleStaffStatus}
                            updateStaff={updateStaff}
                            deleteStaff={deleteStaff}
                            fileInputRef={fileInputRef}
                            handleImageUpload={handleImageUpload}
                            openStaffSchedule={openScheduleEditor}
                        />
                    )}

                    {/* --- SERVICES TAB --- */}
                    {activeTab === 'services' && (
                        <ServicesTab
                            services={services}
                            newService={newService}
                            handleNewServiceChange={handleServiceChange}
                            handleStaffAssignment={toggleStaffAssignment}
                            addService={addService}
                            toggleServiceStatus={toggleServiceStatus}
                            updateService={updateService}
                            deleteService={deleteService}
                            serviceImageRef={serviceImageRef}
                            handleServiceImageUpload={handleServiceImageUpload}
                            staff={staff}
                        />
                    )}

                    {/* --- CLIENTS TAB --- */}
                    {activeTab === 'clients' && (
                        <ClientsTab
                            clients={clients}
                            newClient={newClient as any}
                            handleNewClientChange={handleClientChange}
                            addClient={addClient}
                            updateClient={updateClient}
                            deleteClient={deleteClient}
                            openClientProfile={openClientProfile}
                            searchTerm={clientSearchTerm}
                            setSearchTerm={setClientSearchTerm}
                            calculateMonthlyVisits={calculateMonthlyVisits}
                            getApplicablePromotions={getApplicablePromotions}
                            redeemPromotion={redeemPromotion}
                        />
                    )}


                    {/* --- PROMOTIONS TAB --- */}
                    {activeTab === 'promotions' && (
                        <PromotionsTab
                            loyaltyConfig={loyaltyConfig}
                            updateLoyaltySettings={updateLoyaltySettings}
                            newPromotion={newPromotion as any}
                            handlePromotionChange={handlePromotionChange}
                            addPromotion={addPromotion}
                            togglePromotionStatus={togglePromotionStatus}
                            deletePromotion={deletePromotion}
                            services={services}
                            editPromotion={editPromotion}
                            clonePromotion={clonePromotion}
                            isEditing={editingPromotionId !== null}
                            cancelEdit={cancelEditPromotion}
                        />
                    )}

                    {/* --- REDEMPTIONS TAB --- */}
                    {activeTab === 'redemptions' && (
                        <RedemptionsTab clients={clients} />
                    )}

                    {/* --- POINTS & VISITS TAB --- */}
                    {activeTab === 'points_visits' && (
                        <PointsVisitsTab
                            clients={clients}
                            updateClient={updateClient}
                        />
                    )}

                    {/* --- SCHEDULE TAB --- */}
                    {activeTab === 'schedule' && (
                        <ScheduleTab
                            schedule={schedule}
                            setSchedule={setSchedule}
                            holidays={holidays}
                            setHolidays={setHolidays}
                            saveScheduleAndHolidays={saveScheduleAndHolidays}
                        />
                    )}

                    {/* --- COMPLAINTS TAB --- */}
                    {activeTab === 'complaints' && (
                        <ComplaintsTab
                            complaints={complaints}
                            updateComplaint={updateComplaint}
                        />
                    )}

                    {/* --- CONFIGURATION TAB --- */}
                    {activeTab === 'settings' && (
                        <SettingsTab
                            settings={salonSettings}
                            standardStaffSchedule={standardStaffSchedule}
                            daysOfWeek={daysOfWeek}
                            updateSettings={updateSettings}
                            updateStandardSchedule={updateStandardSchedule}
                            saveSettings={saveSettings}
                        />
                    )}

                    {/* --- STATISTICS TAB --- */}
                    {activeTab === 'stats' && (
                        <StatsTab
                            appointments={appointments}
                            staff={staff}
                            services={services}
                            clients={clients}
                        />
                    )}

                </div>
            </main>
        </div >
    );
}
