"use client";

interface ScheduleTabProps {
    schedule: {
        start: string;
        end: string;
        days: string[];
    };
    setSchedule: (s: any) => void;
    holidays: string[];
    setHolidays: (h: string[]) => void;
    saveScheduleAndHolidays: () => Promise<void>;
}

export default function ScheduleTab({
    schedule,
    setSchedule,
    holidays,
    setHolidays,
    saveScheduleAndHolidays
}: ScheduleTabProps) {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const toggleDay = (day: string) => {
        if (schedule.days.includes(day)) {
            setSchedule({ ...schedule, days: schedule.days.filter(d => d !== day) });
        } else {
            setSchedule({ ...schedule, days: [...schedule.days, day] });
        }
    };

    const addHoliday = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const date = (e.currentTarget.elements.namedItem('holidayDate') as HTMLInputElement).value;
        if (date && !holidays.includes(date)) {
            setHolidays([...holidays, date]);
            e.currentTarget.reset();
        }
    };

    const removeHoliday = (date: string) => {
        setHolidays(holidays.filter(d => d !== date));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-serif text-foreground mb-6">Gestión de Horarios y Festivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                    <h3 className="text-lg font-bold text-foreground mb-6">Horario Laboral General</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Apertura</label>
                            <input type="time" value={schedule.start} onChange={(e) => setSchedule({ ...schedule, start: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Cierre</label>
                            <input type="time" value={schedule.end} onChange={(e) => setSchedule({ ...schedule, end: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">Días Laborales</label>
                            <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${schedule.days.includes(day) ? 'bg-primary text-white' : 'bg-secondary/20 text-foreground/60'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
                    <h3 className="text-lg font-bold text-foreground mb-6">Días Festivos / Cierres</h3>
                    <form onSubmit={addHoliday} className="flex gap-2 mb-4">
                        <input name="holidayDate" type="date" className="flex-1 px-4 py-2 rounded-lg border border-secondary focus:border-primary outline-none" />
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90">+</button>
                    </form>
                    <div className="space-y-2">
                        {holidays.map(date => (
                            <div key={date} className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                                <span className="font-medium text-foreground">{date}</span>
                                <button onClick={() => removeHoliday(date)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8">
                <button
                    onClick={saveScheduleAndHolidays}
                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 font-bold shadow-lg transition-all transform hover:-translate-y-1"
                >
                    💾 Guardar Horarios y Festivos
                </button>
            </div>
        </div>
    );
}
