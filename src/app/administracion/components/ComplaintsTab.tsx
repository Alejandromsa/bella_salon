"use client";
import { Complaint } from './types';
import { useState } from 'react';
import * as XLSX from 'xlsx';

interface ComplaintsTabProps {
    complaints: Complaint[];
    updateComplaint: (id: number, status: string, response: string) => void;
}

export default function ComplaintsTab({ complaints, updateComplaint }: ComplaintsTabProps) {
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [responseText, setResponseText] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setResponseText(complaint.response_text || '');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedComplaint(null);
    };

    const handleSubmitResponse = () => {
        if (selectedComplaint && responseText) {
            updateComplaint(selectedComplaint.id, 'Resuelto', responseText);
            handleCloseModal();
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(complaints.map(c => ({
            ID: c.id,
            Fecha: new Date(c.timestamp).toLocaleString(),
            Cliente: c.full_name,
            DNI: `${c.doc_type} ${c.doc_number}`,
            Tipo: c.complaint_type,
            Estado: c.status,
            Detalle: c.detail
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reclamaciones');
        XLSX.writeFile(workbook, `Libro_Reclamaciones_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-foreground">Libro de Reclamaciones</h2>
                <button onClick={exportToExcel} className="px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200 hover:bg-green-100 transition-colors text-sm font-bold flex items-center gap-2">
                    📊 Exportar Reporte
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/10 text-foreground/70">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest">Fecha / ID</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest">Cliente</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest">Tipo</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest">Detalle (Resumen)</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest">Estado</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/10">
                            {complaints.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-foreground/40 italic">No hay reclamaciones registradas.</td></tr>
                            )}
                            {complaints.map((c) => (
                                <tr key={c.id} className="hover:bg-secondary/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-foreground text-sm">{new Date(c.timestamp).toLocaleDateString()}</div>
                                        <div className="text-[10px] text-foreground/40 font-mono">#{c.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-foreground">{c.full_name}</div>
                                        <div className="text-xs text-foreground/50">{c.doc_type}: {c.doc_number}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${c.complaint_type === 'Reclamación' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {c.complaint_type}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="text-sm text-foreground/70 truncate">{c.detail}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${c.status === 'Resuelto' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleOpenModal(c)}
                                            className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                                        >
                                            {c.status === 'Resuelto' ? 'Ver Detalle' : 'Responder'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Response Modal */}
            {showModal && selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-8">
                            <h3 className="text-2xl font-serif text-primary mb-6 flex justify-between items-center">
                                <span>Gestión de Reclamación #{selectedComplaint.id}</span>
                                <button onClick={handleCloseModal} className="text-foreground/40 hover:text-foreground text-xl">✕</button>
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-6 bg-secondary/5 p-4 rounded-xl">
                                <div>
                                    <span className="text-xs text-foreground/40 uppercase font-bold block mb-1">Cliente</span>
                                    <p className="font-medium">{selectedComplaint.full_name}</p>
                                    <p className="text-xs text-foreground/60">{selectedComplaint.email} • {selectedComplaint.phone}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-foreground/40 uppercase font-bold block mb-1">Bien Contratado</span>
                                    <p className="font-medium">{selectedComplaint.bien_type}</p>
                                    <p className="text-xs text-foreground/60">Monto: S/ {selectedComplaint.amount_claimed}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <span className="text-xs text-foreground/40 uppercase font-bold block mb-1">Detalle del Reclamo</span>
                                    <p className="bg-white border border-secondary/20 p-3 rounded-xl text-sm leading-relaxed">{selectedComplaint.detail}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-foreground/40 uppercase font-bold block mb-1">Pedido del Cliente</span>
                                    <p className="bg-white border border-secondary/20 p-3 rounded-xl text-sm leading-relaxed">{selectedComplaint.request}</p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-secondary/10 pt-6">
                                <h4 className="font-bold text-foreground">Respuesta del Establecimiento</h4>
                                <textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    disabled={selectedComplaint.status === 'Resuelto'}
                                    className="w-full h-32 p-4 rounded-xl border border-secondary focus:border-primary outline-none resize-none disabled:bg-gray-50 disabled:text-gray-500"
                                    placeholder="Escriba aquí la respuesta formal al cliente..."
                                ></textarea>

                                {selectedComplaint.status !== 'Resuelto' && (
                                    <div className="flex gap-4 pt-2">
                                        <button
                                            onClick={handleCloseModal}
                                            className="flex-1 py-3 border border-secondary/30 rounded-xl font-bold text-foreground/60 hover:text-foreground hover:bg-secondary/5 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSubmitResponse}
                                            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg"
                                        >
                                            Enviar Respuesta y Cerrar Caso
                                        </button>
                                    </div>
                                )}
                                {selectedComplaint.status === 'Resuelto' && (
                                    <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center font-medium text-sm">
                                        Este caso fue resuelto el {selectedComplaint.response_date ? new Date(selectedComplaint.response_date).toLocaleDateString() : 'Fecha desconocida'}.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
