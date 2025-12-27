"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Service, Staff } from './types';

interface ServicesTabProps {
    services: Service[];
    newService: {
        name: string;
        price: number;
        duration: number;
        category: string;
        description: string;
        image: string;
        assignedStaff: string[];
    };
    handleNewServiceChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleStaffAssignment: (staffName: string) => void;
    addService: (e: React.FormEvent) => void;
    toggleServiceStatus: (id: number) => void;
    updateService: (id: number, updates: Partial<Service>) => void;
    deleteService: (id: number) => void;
    serviceImageRef: React.RefObject<HTMLInputElement | null>;
    handleServiceImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    staff: Staff[];
}

export default function ServicesTab({
    services,
    newService,
    handleNewServiceChange,
    handleStaffAssignment,
    addService,
    toggleServiceStatus,
    updateService,
    deleteService,
    serviceImageRef,
    handleServiceImageUpload,
    staff
}: ServicesTabProps) {
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        price: 0,
        duration: '',
        category: 'Cabello',
        description: '',
        image: '',
        assignedStaff: [] as string[]
    });
    const [editImageFile, setEditImageFile] = useState<File | null>(null);

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setEditForm({
            name: service.name,
            price: service.price,
            duration: service.duration.toString(),
            category: service.category,
            description: service.description || '',
            image: service.image || '',
            assignedStaff: [...service.assignedStaff]
        });
        setEditImageFile(null);
    };

    const closeEditModal = () => {
        setEditingService(null);
        setEditForm({
            name: '',
            price: 0,
            duration: '',
            category: 'Cabello',
            description: '',
            image: '',
            assignedStaff: []
        });
        setEditImageFile(null);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleEditStaffToggle = (staffName: string) => {
        setEditForm(prev => ({
            ...prev,
            assignedStaff: prev.assignedStaff.includes(staffName)
                ? prev.assignedStaff.filter(s => s !== staffName)
                : [...prev.assignedStaff, staffName]
        }));
    };

    const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setEditImageFile(file);

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditForm(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const saveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        const updates: Partial<Service> = {
            name: editForm.name,
            price: editForm.price,
            duration: parseInt(editForm.duration) || 0,
            category: editForm.category,
            description: editForm.description,
            image: editForm.image,
            assignedStaff: editForm.assignedStaff
        };

        updateService(editingService.id, updates);
        closeEditModal();
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-serif text-foreground">Gestión de Servicios</h2>
                    <p className="text-sm text-foreground/60 mt-2">Configura tu catálogo de servicios, precios y especialistas asignados.</p>
                </div>
            </div>

            {/* Add Service Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/20">
                <h3 className="text-lg font-bold text-foreground mb-6 text-primary">Agregar Nuevo Servicio</h3>
                <form onSubmit={addService} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground/70 mb-2">Nombre del Servicio *</label>
                                <input name="name" type="text" placeholder="Ej. Corte y Estilo" value={newService.name} onChange={handleNewServiceChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground/70 mb-2">Categoría *</label>
                                <select name="category" value={newService.category} onChange={handleNewServiceChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none bg-white font-medium" required>
                                    <option value="Cabello">💇 Cabello</option>
                                    <option value="Uñas">💅 Uñas</option>
                                    <option value="Facial">✨ Facial</option>
                                    <option value="Maquillaje">🧴 Maquillaje</option>
                                    <option value="Cejas y Pestañas">👁️ Cejas y Pestañas</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground/70 mb-2">Precio (S/) *</label>
                                    <input name="price" type="number" placeholder="0.00" value={newService.price} onChange={handleNewServiceChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground/70 mb-2">Duración (min) *</label>
                                    <input name="duration" type="text" placeholder="Ej. 60 min" value={newService.duration} onChange={handleNewServiceChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground/70 mb-2">Asignar Especialistas *</label>
                                <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-secondary bg-secondary/5 min-h-[50px]">
                                    {staff.filter(s => s.active).map(member => (
                                        <button key={member.name} type="button" onClick={() => handleStaffAssignment(member.name)} className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border-2 ${newService.assignedStaff.includes(member.name) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-foreground/40 border-secondary hover:border-primary'}`}>
                                            {member.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground/70 mb-2">Descripción Corta</label>
                                <textarea name="description" placeholder="Breve descripción del servicio..." value={newService.description} onChange={handleNewServiceChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none resize-none h-[100px]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-secondary/20 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-secondary/20 border-2 border-dashed border-secondary shadow-inner">
                                <Image src={newService.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'} alt="Service Preview" fill className="object-cover" />
                            </div>
                            <input type="file" ref={serviceImageRef} onChange={handleServiceImageUpload} className="hidden" accept="image/*" />
                            <button type="button" onClick={() => serviceImageRef.current?.click()} className="px-5 py-2.5 bg-secondary/20 hover:bg-secondary/40 text-foreground rounded-lg text-sm font-bold transition-all flex items-center gap-2 border border-secondary/30">
                                🖼️ Subir Foto del Servicio
                            </button>
                        </div>
                        <button type="submit" className="w-full md:w-auto bg-primary text-white px-10 py-3.5 rounded-xl hover:bg-primary/90 font-bold shadow-lg transition-all transform hover:-translate-y-1">
                            🚀 Crear Nuevo Servicio
                        </button>
                    </div>
                </form>
            </div>

            {/* Services List by Category */}
            {['Cabello', 'Uñas', 'Facial', 'Maquillaje', 'Cejas y Pestañas'].map(cat => (
                <div key={cat} className="space-y-4">
                    <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 flex items-center gap-2">
                        {cat === 'Cabello' ? '💇' : cat === 'Uñas' ? '💅' : cat === 'Facial' ? '✨' : cat === 'Maquillaje' ? '🧴' : '👁️'} {cat}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.filter(s => s.category === cat).map(service => (
                            <div key={service.id} className={`bg-white rounded-2xl shadow-sm border p-5 transition-all relative group overflow-hidden ${service.active ? 'border-secondary/20' : 'opacity-60 border-gray-200 grayscale'}`}>
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 relative rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-secondary/20">
                                        {service.image ? (
                                            <Image src={service.image} alt={service.name} fill className="object-cover transition-transform group-hover:scale-110 duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl">
                                                {service.category === 'Cabello' ? '💇' : service.category === 'Uñas' ? '💅' : service.category === 'Facial' ? '✨' : service.category === 'Maquillaje' ? '🧴' : '👁️'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-foreground leading-tight mb-1">{service.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-primary font-bold">S/ {Number(service.price).toFixed(2)}</span>
                                            <span className="text-xs text-foreground/40 font-medium bg-secondary/10 px-2 py-0.5 rounded-full">{service.duration}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {service.assignedStaff.map((staffName, i) => (
                                                <span key={i} className="text-[9px] bg-secondary/20 text-foreground/60 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                    {staffName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-foreground/60 mt-4 line-clamp-2 h-8 italic border-l-2 border-secondary/20 pl-2">
                                    "{service.description}"
                                </p>
                                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-secondary/10 pt-4">
                                    <button onClick={() => openEditModal(service)} className="py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                                        ✏️ Editar
                                    </button>
                                    <button onClick={() => toggleServiceStatus(service.id)} className={`py-1.5 rounded-lg text-xs font-bold transition-all ${service.active ? 'bg-secondary/10 text-foreground/60 hover:bg-secondary/30' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                        {service.active ? '❌' : '✅'}
                                    </button>
                                    <button onClick={() => deleteService(service.id)} className="py-1.5 bg-red-50 text-red-500 rounded-lg text-xs hover:bg-red-100 transition-colors">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Edit Service Modal */}
            {editingService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeEditModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-secondary/20 px-8 py-6 rounded-t-2xl z-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-foreground">Editar Servicio</h3>
                                    <p className="text-sm text-foreground/60 mt-1">Actualiza la información del servicio</p>
                                </div>
                                <button onClick={closeEditModal} className="text-foreground/40 hover:text-foreground/80 text-3xl leading-none transition-colors">
                                    ×
                                </button>
                            </div>
                        </div>

                        <form onSubmit={saveEdit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Columna Izquierda */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Nombre del Servicio *</label>
                                        <input
                                            name="name"
                                            type="text"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Categoría *</label>
                                        <select
                                            name="category"
                                            value={editForm.category}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none bg-white transition-colors"
                                            required
                                        >
                                            <option value="Cabello">💇 Cabello</option>
                                            <option value="Uñas">💅 Uñas</option>
                                            <option value="Facial">✨ Facial</option>
                                            <option value="Maquillaje">🧴 Maquillaje</option>
                                            <option value="Cejas y Pestañas">👁️ Cejas y Pestañas</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground/70 mb-2">Precio (S/) *</label>
                                            <input
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                value={editForm.price}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground/70 mb-2">Duración *</label>
                                            <input
                                                name="duration"
                                                type="text"
                                                placeholder="Ej. 60 min"
                                                value={editForm.duration}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Descripción</label>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            placeholder="Breve descripción del servicio..."
                                            value={editForm.description}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Columna Derecha */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Especialistas Asignados *</label>
                                        <div className="flex flex-wrap gap-2 p-4 rounded-lg border border-secondary bg-secondary/5 min-h-[120px]">
                                            {staff.filter(s => s.active).map(member => (
                                                <button
                                                    key={member.id}
                                                    type="button"
                                                    onClick={() => handleEditStaffToggle(member.name)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border-2 ${
                                                        editForm.assignedStaff.includes(member.name)
                                                            ? 'bg-primary text-white border-primary shadow-md'
                                                            : 'bg-white text-foreground/50 border-secondary hover:border-primary'
                                                    }`}
                                                >
                                                    {member.name}
                                                </button>
                                            ))}
                                        </div>
                                        {editForm.assignedStaff.length === 0 && (
                                            <p className="text-xs text-red-500 mt-1">Selecciona al menos un especialista</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Imagen del Servicio</label>
                                        <div className="space-y-3">
                                            <div className="w-full h-40 relative rounded-xl overflow-hidden bg-secondary/20 border-2 border-dashed border-secondary">
                                                {editForm.image ? (
                                                    <Image src={editForm.image} alt="Preview" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-5xl text-primary/40">
                                                        {editForm.category === 'Cabello' ? '💇' : editForm.category === 'Uñas' ? '💅' : editForm.category === 'Facial' ? '✨' : editForm.category === 'Maquillaje' ? '🧴' : '👁️'}
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                id="edit-service-image"
                                                onChange={handleEditImageUpload}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('edit-service-image')?.click()}
                                                className="w-full px-4 py-2 bg-secondary/20 hover:bg-secondary/40 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span>📷</span> Cambiar Imagen
                                            </button>
                                            {editImageFile && (
                                                <p className="text-xs text-foreground/60 text-center">
                                                    {editImageFile.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex gap-3 pt-4 border-t border-secondary/20">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 px-6 py-3 bg-secondary/20 hover:bg-secondary/40 text-foreground rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.assignedStaff.length === 0}
                                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    💾 Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
