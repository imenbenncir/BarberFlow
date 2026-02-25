import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Scissors, Clock, DollarSign, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { useState } from 'react';
import { ServiceForm } from './ServiceForm';
import { useTranslation } from 'react-i18next';

export interface Service {
    _id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
    isActive: boolean;
}

export const ServicesPage = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { data: services, isLoading } = useQuery<Service[]>({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await api.get('/services');
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/services/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('services.delete_confirm'))) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('services.title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('services.subtitle')}</p>
                </div>
                <Button onClick={() => { setEditingService(null); setIsFormOpen(true); }} className="flex gap-2">
                    <Plus size={18} />
                    <span>{t('services.add_service')}</span>
                </Button>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 rounded-xl border bg-card animate-pulse" />
                    ))}
                </div>
            ) : services && services.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div key={service._id} className="group relative rounded-xl border bg-card p-6 transition-all hover:shadow-md">
                            <div className="flex items-start justify-between">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Scissors size={20} />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(service)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(service._id)} className="p-2 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {service.description || t('services.no_description')}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-4 text-sm font-medium">
                                <div className="flex items-center gap-1.5 text-zinc-500">
                                    <Clock size={16} />
                                    <span>{service.duration} {t('services.duration_unit')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-primary">
                                    <DollarSign size={16} />
                                    <span>{service.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-muted/30">
                    <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-medium">{t('services.empty.title')}</h3>
                    <p className="text-muted-foreground mt-1 mb-6">{t('services.empty.description')}</p>
                    <Button variant="outline" onClick={() => setIsFormOpen(true)}>{t('services.empty.button')}</Button>
                </div>
            )}

            {isFormOpen && (
                <ServiceForm
                    onClose={() => setIsFormOpen(false)}
                    service={editingService}
                />
            )}
        </div>
    );
};
