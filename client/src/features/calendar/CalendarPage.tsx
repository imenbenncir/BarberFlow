import React, { useMemo, useState } from 'react';
import {
    format,
    startOfWeek,
    addDays,
    startOfDay,
    isSameDay,
    addWeeks,
    subWeeks
} from 'date-fns';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';
import { AppointmentModal } from './AppointmentModal';
import { useTranslation } from 'react-i18next';

interface Appointment {
    _id: string;
    clientName: string;
    clientEmail: string;
    service: {
        _id: string;
        name: string;
        duration: number;
        price: number;
    };
    barber: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const AppointmentItem = React.memo(({ app }: { app: Appointment }) => {
    const startDate = new Date(app.startTime);
    const startHour = startDate.getHours();
    const startMin = startDate.getMinutes();
    const top = (startHour - 8) * 80 + (startMin / 60) * 80;
    const height = (new Date(app.endTime).getTime() - startDate.getTime()) / 60000 / 60 * 80;

    return (
        <div
            style={{ top: `${top}px`, height: `${height}px` }}
            className={cn(
                "absolute inset-x-1 z-10 p-2 rounded-lg border shadow-sm flex flex-col justify-between transition-all hover:scale-[1.02] hover:z-20",
                app.status === 'confirmed' ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-muted-foreground/20 text-muted-foreground"
            )}
        >
            <div>
                <p className="text-[10px] font-black line-clamp-1">{app.clientName}</p>
                <p className="text-[8px] font-bold opacity-80">{app.service?.name}</p>
            </div>
            <div className="flex items-center gap-1 opacity-70">
                <Clock size={8} />
                <span className="text-[8px] font-bold">{format(startDate, 'h:mm')}</span>
            </div>
        </div>
    );
});

AppointmentItem.displayName = 'AppointmentItem';

const DayColumn = React.memo(({
    day,
    hours,
    appointments,
    onSlotClick
}: {
    day: Date;
    hours: number[];
    appointments: Appointment[];
    onSlotClick: (day: Date, hour: number) => void
}) => {
    const isToday = isSameDay(day, new Date());

    return (
        <div className={cn("border-r last:border-r-0 relative", isToday && "bg-primary/[0.02]")}>
            {hours.map((hour) => (
                <div
                    key={hour}
                    onClick={() => onSlotClick(day, hour)}
                    className="h-20 border-b hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                    <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-full text-primary/40">
                        <Plus size={16} />
                    </div>
                </div>
            ))}
            {appointments.map((app) => (
                <AppointmentItem key={app._id} app={app} />
            ))}
        </div>
    );
});

DayColumn.displayName = 'DayColumn';

export const CalendarPage = () => {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

    const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
    const weekDays = useMemo(() => [...Array(7)].map((_, i) => addDays(weekStart, i)), [weekStart]);
    const hours = useMemo(() => [...Array(13)].map((_, i) => i + 8), []);

    const { data: appointments } = useQuery<Appointment[]>({
        queryKey: ['appointments', format(weekStart, 'yyyy-MM-dd')],
        queryFn: async () => {
            const response = await api.get('/appointments', {
                params: {
                    start: startOfDay(weekStart).toISOString(),
                    end: startOfDay(addDays(weekStart, 7)).toISOString(),
                }
            });
            return response.data;
        }
    });

    const appointmentsByDay = useMemo(() => {
        if (!appointments) return {};
        return appointments.reduce((acc, app) => {
            const dateStr = format(new Date(app.startTime), 'yyyy-MM-dd');
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(app);
            return acc;
        }, {} as Record<string, Appointment[]>);
    }, [appointments]);

    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const handleSlotClick = (day: Date, hour: number) => {
        const slot = new Date(day);
        slot.setHours(hour, 0, 0, 0);
        setSelectedSlot(slot);
        setIsBookingModalOpen(true);
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">{t('calendar.title')}</h1>
                    <p className="text-muted-foreground mt-1 text-lg">{t('calendar.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3 bg-card p-1.5 rounded-2xl border shadow-sm">
                    <Button variant="ghost" size="icon" onClick={prevWeek} className="rounded-xl">
                        <ChevronLeft size={20} />
                    </Button>
                    <div className="px-4 font-black text-sm min-w-[200px] text-center">
                        {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextWeek} className="rounded-xl">
                        <ChevronRight size={20} />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button variant="ghost" size="sm" onClick={goToToday} className="rounded-xl font-bold">
                        {t('calendar.today')}
                    </Button>
                </div>
                <Button onClick={() => setIsBookingModalOpen(true)} className="flex gap-2 h-12 px-6 font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    <Plus size={18} strokeWidth={3} />
                    <span>{t('calendar.new_booking')}</span>
                </Button>
            </div>

            <div className="flex-1 bg-card rounded-[2.5rem] border border-primary/5 shadow-sm flex flex-col overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-[100px_1fr] border-b bg-muted/20">
                    <div className="p-4 border-r border-primary/5" />
                    <div className="grid grid-cols-7">
                        {weekDays.map((day) => (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "p-6 text-center border-r border-primary/5 last:border-r-0 transition-colors",
                                    isSameDay(day, new Date()) && "bg-primary/[0.05]"
                                )}
                            >
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{format(day, 'EEE')}</p>
                                <p className={cn(
                                    "mt-2 text-2xl font-black tracking-tighter",
                                    isSameDay(day, new Date()) ? "text-primary" : "text-foreground"
                                )}>
                                    {format(day, 'd')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Body */}
                <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <div className="grid grid-cols-[100px_1fr]">
                        {/* Time Indicators */}
                        <div className="bg-muted/10">
                            {hours.map((hour) => (
                                <div key={hour} className="h-20 border-r border-b border-primary/5 px-4 py-2 text-[10px] font-black text-muted-foreground/60 text-right uppercase tracking-tighter">
                                    {format(new Date().setHours(hour, 0), 'h aa')}
                                </div>
                            ))}
                        </div>

                        {/* Grid Slots */}
                        <div className="grid grid-cols-7 relative">
                            {weekDays.map((day) => (
                                <DayColumn
                                    key={day.toISOString()}
                                    day={day}
                                    hours={hours}
                                    appointments={appointmentsByDay[format(day, 'yyyy-MM-dd')] || []}
                                    onSlotClick={handleSlotClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isBookingModalOpen && (
                <AppointmentModal
                    isOpen={isBookingModalOpen}
                    onClose={() => {
                        setIsBookingModalOpen(false);
                        setSelectedSlot(null);
                    }}
                    initialDate={selectedSlot}
                />
            )}
        </div>
    );
};
