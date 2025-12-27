"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Staff } from './types';

interface StaffTabProps {
    staff: Staff[];
    newStaff: {
        name: string;
        role: string;
        email: string;
        phone: string;
        bio: string;
        specialties: string;
        image: string;
    };
    handleNewStaffChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    addStaff: (e: React.FormEvent) => void;
    toggleStaffActive: (id: number) => void;
    deleteStaff: (id: number) => void;
    updateStaff: (id: number, updates: Partial<Staff>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    openStaffSchedule: (id: number) => void;
}

export default function StaffTab({
    staff,
    newStaff,
    handleNewStaffChange,
    addStaff,
    toggleStaffActive,
    deleteStaff,
    updateStaff,
    fileInputRef,
    handleImageUpload,
    openStaffSchedule
}: StaffTabProps) {
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        bio: '',
        specialties: '',
        image: ''
    });
    const [editImageFile, setEditImageFile] = useState<File | null>(null);

    const openEditModal = (member: Staff) => {
        setEditingStaff(member);
        setEditForm({
            name: member.name,
            role: member.role,
            email: member.email,
            phone: member.phone,
            bio: member.bio,
            specialties: member.specialties.join(', '),
            image: member.image
        });
        setEditImageFile(null);
    };

    const closeEditModal = () => {
        setEditingStaff(null);
        setEditForm({
            name: '',
            role: '',
            email: '',
            phone: '',
            bio: '',
            specialties: '',
            image: ''
        });
        setEditImageFile(null);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        if (!editingStaff) return;

        const updates: Partial<Staff> = {
            name: editForm.name,
            role: editForm.role,
            email: editForm.email,
            phone: editForm.phone,
            bio: editForm.bio,
            specialties: editForm.specialties.split(',').map(s => s.trim()).filter(s => s),
            image: editForm.image
        };

        updateStaff(editingStaff.id, updates);
        closeEditModal();
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-serif text-foreground">Gestión de Personal</h2>
                    <p className="text-sm text-foreground/60 mt-2">Administra tu equipo de especialistas y sus funciones.</p>
                </div>
            </div>

            {/* Add Staff Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/20">
                <h3 className="text-lg font-bold text-foreground mb-6">Agregar Nuevo Especialista</h3>
                <form onSubmit={addStaff} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Nombre Completo *</label>
                            <input name="name" type="text" placeholder="Ej. Ana García" value={newStaff.name} onChange={handleNewStaffChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Cargo / Rol *</label>
                            <input name="role" type="text" placeholder="Ej. Estilista Master" value={newStaff.role} onChange={handleNewStaffChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Email</label>
                            <input name="email" type="email" placeholder="ana@ejemplo.com" value={newStaff.email} onChange={handleNewStaffChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Teléfono</label>
                            <input name="phone" type="tel" placeholder="+51 999 999 999" value={newStaff.phone} onChange={handleNewStaffChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Especialidades</label>
                            <input name="specialties" type="text" placeholder="Separadas por comas (Ej: Color, Corte, Manicura)" value={newStaff.specialties} onChange={handleNewStaffChange} className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none" />
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Foto de Perfil</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-secondary/20 border-2 border-dashed border-secondary">
                                    <Image src={newStaff.image || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80'} alt="Preview" fill className="object-cover" />
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-secondary/20 hover:bg-secondary/40 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <span>📷</span> Seleccionar Imagen
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 font-medium shadow-lg transition-all">
                            Registrar Especialista
                        </button>
                    </div>
                </form>
            </div>

            {/* Staff List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                    <div key={member.id} className={`bg-white rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md ${member.active ? 'border-secondary/20' : 'opacity-60 border-gray-200 grayscale'}`}>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-20 h-20 relative rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-secondary/20">
                                {member.image ? (
                                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-serif text-primary/60">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {!member.active && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold">INACTIVO</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-lg text-foreground truncate">{member.name}</h4>
                                <p className="text-primary font-medium text-sm mb-1">{member.role}</p>
                                <div className="flex flex-wrap gap-1">
                                    {member.specialties.map((s, i) => (
                                        <span key={i} className="text-[10px] bg-secondary/10 px-2 py-0.5 rounded-full text-foreground/70 font-medium">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6 text-sm">
                            <div className="flex items-center gap-2 text-foreground/60">
                                <span className="text-xs">📧</span> <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground/60">
                                <span className="text-xs">📱</span> {member.phone}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => openEditModal(member)} className="text-xs bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors font-bold">
                                ✏️ Editar
                            </button>
                            <button onClick={() => openStaffSchedule(member.id)} className="text-xs bg-primary/10 text-primary py-2 rounded-lg hover:bg-primary/20 transition-colors font-bold">
                                📅 Horarios
                            </button>
                            <button onClick={() => toggleStaffActive(member.id)} className={`text-xs py-2 rounded-lg transition-colors font-bold ${member.active ? 'bg-secondary/20 text-foreground/60 hover:bg-secondary/40' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                {member.active ? '❌' : '✅'}
                            </button>
                        </div>
                        <button onClick={() => deleteStaff(member.id)} className="w-full mt-2 text-[10px] text-red-400 hover:text-red-600 font-medium transition-colors">
                            🗑️ Eliminar Especialista
                        </button>
                    </div>
                ))}
            </div>

            {/* Edit Staff Modal */}
            {editingStaff && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeEditModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-secondary/20 px-8 py-6 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-foreground">Editar Especialista</h3>
                                    <p className="text-sm text-foreground/60 mt-1">Actualiza la información del personal</p>
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
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Nombre Completo *</label>
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
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Cargo / Rol *</label>
                                        <input
                                            name="role"
                                            type="text"
                                            value={editForm.role}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Teléfono</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Columna Derecha */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Especialidades</label>
                                        <input
                                            name="specialties"
                                            type="text"
                                            placeholder="Separadas por comas"
                                            value={editForm.specialties}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Biografía</label>
                                        <textarea
                                            name="bio"
                                            rows={3}
                                            placeholder="Breve descripción profesional..."
                                            value={editForm.bio}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary focus:border-primary outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/70 mb-2">Foto de Perfil</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-secondary/20 border-2 border-dashed border-secondary flex-shrink-0">
                                                {editForm.image ? (
                                                    <Image src={editForm.image} alt="Preview" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl text-primary/40">
                                                        {editForm.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    id="edit-staff-image"
                                                    onChange={handleEditImageUpload}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('edit-staff-image')?.click()}
                                                    className="w-full px-4 py-2 bg-secondary/20 hover:bg-secondary/40 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <span>📷</span> Cambiar Imagen
                                                </button>
                                                {editImageFile && (
                                                    <p className="text-xs text-foreground/60 mt-2">
                                                        {editImageFile.name}
                                                    </p>
                                                )}
                                            </div>
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
                                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium shadow-lg transition-all"
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
