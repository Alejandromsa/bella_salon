export interface Staff {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    bio: string;
    specialties: string[];
    image: string;
    active: boolean;
    schedule: {
        weeklySchedule: {
            [key: string]: {
                active: boolean;
                start: string;
                end: string;
                breaks: { start: string; end: string; }[];
            };
        };
        vacations: string[];
        exceptions: { date: string; start: string; end: string; reason: string; }[];
        worksHolidays: boolean;
    };
}

export interface Service {
    id: number;
    name: string;
    price: number;
    duration: number;
    category: string;
    description: string;
    image: string;
    active: boolean;
    assignedStaff: string[];
    featured: boolean;
    requirements?: string;
}

export interface Appointment {
    id: number;
    clientId?: number;
    clientName: string;
    phone: string;
    service: string;
    staff: string;
    date: string;
    time: string;
    status: string;
}

export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    docType: string;
    docNumber: string;
    birthDate: string;
    address: string;
    registrationDate: string;
    totalVisits: number;
    totalSpent: number;
    lastVisit: string;
    preferredServices: string[];
    notes: string;
    loyaltyPoints: number;
    vipStatus: boolean;
    tags: string[];
    redeemedPromotions?: {
        id: number;
        name: string;
        date: string;
        pointsUsed: number;
    }[];
}

export interface Promotion {
    id: number;
    name: string;
    type: 'discount' | 'free_service';
    trigger: 'visits' | 'points';
    threshold: number; // For points, this is the cost in points
    period: 'month' | 'total';
    reward: number | string;
    description: string;
    active: boolean;
}

export interface LoyaltyConfig {
    pointsPerSole: number;
    vipThreshold: number;
    promotions: Promotion[];
}

export interface Complaint {
    id: number;
    timestamp: string;
    full_name: string;
    doc_type: string;
    doc_number: string;
    address: string;
    phone: string;
    email: string;
    guardian_name?: string;
    bien_type: 'Producto' | 'Servicio';
    amount_claimed: number;
    bien_description: string;
    complaint_type: 'Reclamación' | 'Queja';
    detail: string;
    request: string;
    status: 'Pendiente' | 'Resuelto';
    response_text?: string;
    response_date?: string;
}
