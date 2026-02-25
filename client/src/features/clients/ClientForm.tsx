import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, User, Mail, Phone, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { clientService, Client } from './clientService';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface ClientFormProps {
    onClose: () => void;
    client?: Client | null;
}

export const ClientForm = ({ onClose, client }: ClientFormProps) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEditing = !!client;

    const clientSchema = z.object({
        name: z.string().min(2, t('clients.validation.name_min')),
        email: z.string().email(t('clients.validation.email_invalid')),
        phone: z.string().optional(),
        notes: z.string().optional(),
        status: z.union([z.literal('active'), z.literal('inactive')]),
    });

    type ClientFormData = z.infer<typeof clientSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            notes: '',
            status: 'active',
        },
    });

    useEffect(() => {
        if (client) {
            reset({
                name: client.name,
                email: client.email,
                phone: client.phone || '',
                notes: client.notes || '',
                status: client.status,
            });
        }
    }, [client, reset]);

    const mutation = useMutation({
        mutationFn: (data: ClientFormData) =>
            isEditing
                ? clientService.updateClient(client._id, data)
                : clientService.createClient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            onClose();
        },
    });

    const onSubmit = (data: ClientFormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-xl bg-card border border-primary/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-primary/5 flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <User size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">
                                {isEditing ? t('clients.form.edit_title') : t('clients.form.add_title')}
                            </h2>
                            <p className="text-sm font-medium text-muted-foreground">
                                {isEditing ? t('clients.form.edit_desc') : t('clients.form.add_desc')}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('clients.form.label_name')}</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    {...register('name')}
                                    className="pl-12 bg-muted/30 border-none rounded-2xl h-12 text-sm font-medium"
                                    placeholder={t('clients.form.placeholder_name')}
                                    error={errors.name?.message}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('clients.form.label_email')}</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    {...register('email')}
                                    className="pl-12 bg-muted/30 border-none rounded-2xl h-12 text-sm font-medium"
                                    placeholder="email@example.com"
                                    error={errors.email?.message}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('clients.form.label_phone')}</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    {...register('phone')}
                                    className="pl-12 bg-muted/30 border-none rounded-2xl h-12 text-sm font-medium"
                                    placeholder="+1 (555) 000-0000"
                                    error={errors.phone?.message}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('clients.form.label_status')}</label>
                            <select
                                {...register('status')}
                                className="w-full h-12 pl-4 bg-muted/30 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 appearance-none"
                            >
                                <option value="active">{t('common.active')}</option>
                                <option value="inactive">{t('common.inactive')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('clients.form.label_notes')}</label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <textarea
                                {...register('notes')}
                                className="w-full p-4 pl-12 bg-muted/30 border-none rounded-2xl text-sm font-medium min-h-[120px] focus:ring-2 focus:ring-primary/20"
                                placeholder={t('clients.form.placeholder_notes')}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-14 font-black">
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" className="flex-1 rounded-2xl h-14 font-black shadow-lg shadow-primary/20" disabled={isSubmitting}>
                            {isSubmitting ? t('common.saving') : (isEditing ? t('clients.form.submit_update') : t('clients.form.submit_create'))}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
