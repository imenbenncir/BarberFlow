import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { X } from 'lucide-react';
import { Service } from './ServicesList';
import { useTranslation } from 'react-i18next';

interface ServiceFormProps {
    onClose: () => void;
    service?: Service | null;
}

export const ServiceForm = ({ onClose, service }: ServiceFormProps) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEditing = !!service;

    const serviceSchema = z.object({
        name: z.string().min(2, t('services.form.validation.name_min')),
        description: z.string(),
        duration: z.number().min(1, t('services.form.validation.duration_req')),
        price: z.number().min(0, t('services.form.validation.price_positive')),
        category: z.string(),
    });

    type ServiceFormValues = z.infer<typeof serviceSchema>;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: service?.name || '',
            description: service?.description || '',
            duration: service?.duration || 30,
            price: service?.price || 25,
            category: service?.category || 'General',
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: ServiceFormValues) => {
            if (isEditing && service) {
                await api.patch(`/services/${service._id}`, data);
            } else {
                await api.post('/services', data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            onClose();
        },
    });

    const onSubmit = (data: ServiceFormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-card border rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">
                        {isEditing ? t('services.form.edit_title') : t('services.form.add_title')}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">{t('services.form.label_name')}</label>
                        <Input {...register('name')} placeholder={t('services.form.placeholder_name')} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">{t('services.form.label_description')}</label>
                        <textarea
                            {...register('description')}
                            placeholder={t('services.form.placeholder_description')}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">{t('services.form.label_duration')}</label>
                            <Input {...register('duration', { valueAsNumber: true })} type="number" />
                            {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">{t('services.form.label_price')}</label>
                            <Input {...register('price', { valueAsNumber: true })} type="number" step="0.01" />
                            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting
                                ? t('common.saving')
                                : isEditing
                                    ? t('services.form.submit_update')
                                    : t('services.form.submit_create')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
