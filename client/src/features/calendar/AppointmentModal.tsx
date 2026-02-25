import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { X, Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

type AppointmentFormValues = {
    clientName: string;
    clientEmail: string;
    serviceId: string;
    startTime: string;
    notes: string;
};

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate: Date | null;
}

export const AppointmentModal = ({ onClose, initialDate }: AppointmentModalProps) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const appointmentSchema = z.object({
        clientName: z.string().min(2, t('calendar.appointment.validation.name_req')),
        clientEmail: z.string().email(t('calendar.appointment.validation.email_req')),
        serviceId: z.string().min(1, t('calendar.appointment.validation.service_req')),
        startTime: z.string().min(1, t('calendar.appointment.validation.datetime_req')),
        notes: z.string(),
    });

    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await api.get('/services');
            return response.data;
        }
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            clientName: '',
            clientEmail: '',
            serviceId: '',
            startTime: initialDate ? format(initialDate, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            notes: '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: AppointmentFormValues) => {
            await api.post('/appointments', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            onClose();
        },
    });

    const onSubmit = (data: AppointmentFormValues) => {
        mutation.mutate(data);
    };

    const selectedServiceId = watch('serviceId');
    const selectedService = services?.find((s: any) => s._id === selectedServiceId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-card border rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b bg-muted/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <CalendarIcon size={20} />
                        </div>
                        <h2 className="text-xl font-black">{t('calendar.appointment.title')}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <User size={12} /> {t('calendar.appointment.label_client')}
                            </label>
                            <Input {...register('clientName')} placeholder={t('calendar.appointment.placeholder_client')} />
                            {errors.clientName && <p className="text-xs text-destructive font-bold">{errors.clientName.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Scissors size={12} /> {t('calendar.appointment.label_service')}
                            </label>
                            <select
                                {...register('serviceId')}
                                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all hover:border-primary/50"
                            >
                                <option value="">{t('calendar.appointment.select_service')}</option>
                                {services?.map((s: any) => (
                                    <option key={s._id} value={s._id}>{s.name} - ${s.price}</option>
                                ))}
                            </select>
                            {errors.serviceId && <p className="text-xs text-destructive font-bold">{errors.serviceId.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Clock size={12} /> {t('calendar.appointment.label_datetime')}
                        </label>
                        <Input {...register('startTime')} type="datetime-local" />
                        {errors.startTime && <p className="text-xs text-destructive font-bold">{errors.startTime.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            {t('calendar.appointment.label_email')}
                        </label>
                        <Input {...register('clientEmail')} type="email" placeholder={t('calendar.appointment.placeholder_email')} />
                        {errors.clientEmail && <p className="text-xs text-destructive font-bold">{errors.clientEmail.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            {t('calendar.appointment.label_notes')}
                        </label>
                        <textarea
                            {...register('notes')}
                            placeholder={t('calendar.appointment.placeholder_notes')}
                            className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary/50"
                        />
                    </div>

                    {selectedService && (
                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-primary" size={20} />
                                <div>
                                    <p className="text-xs font-black uppercase tracking-tighter opacity-70">{t('calendar.appointment.summary')}</p>
                                    <p className="text-sm font-bold">{selectedService.name} ({selectedService.duration} {t('services.duration_unit')})</p>
                                </div>
                            </div>
                            <p className="text-xl font-black text-primary">${selectedService.price}</p>
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-primary/20" disabled={isSubmitting}>
                            {isSubmitting ? t('calendar.appointment.booking') : t('calendar.appointment.confirm')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
