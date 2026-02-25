import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    UserPlus,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    Pencil,
    Trash2,
    Filter,
    ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clientService, Client } from './clientService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Skeleton } from '../../components/Skeleton';
import { ClientForm } from './ClientForm.tsx';

export const ClientPage = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const { data: clients, isLoading } = useQuery<Client[]>({
        queryKey: ['clients'],
        queryFn: clientService.getClients,
    });

    const deleteMutation = useMutation({
        mutationFn: clientService.deleteClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });

    const filteredClients = clients?.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.includes(searchQuery)
    );

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('clients.delete_confirm'))) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">{t('clients.title')}</h1>
                    <p className="text-muted-foreground text-lg font-medium mt-1">{t('clients.subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="hidden sm:flex items-center gap-2 border-primary/10 hover:bg-primary/5">
                        <Filter size={18} />
                        <span className="font-bold text-sm">{t('clients.filters')}</span>
                    </Button>
                    <Button
                        onClick={() => { setEditingClient(null); setIsFormOpen(true); }}
                        className="flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <UserPlus size={18} />
                        <span className="font-bold text-sm">{t('clients.add_client')}</span>
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: t('clients.total_clients'), value: clients?.length || 0, icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: t('clients.active_month'), value: clients?.filter(c => c.status === 'active').length || 0, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: t('clients.total_revenue'), value: `$${clients?.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' }
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-primary/5 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-black">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Table Box */}
            <div className="bg-card border border-primary/5 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
                <div className="p-8 border-b border-primary/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <Input
                            placeholder={t('clients.search_placeholder')}
                            className="pl-12 bg-muted/30 border-none rounded-2xl h-12 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground bg-muted/30 px-4 py-2 rounded-xl italic">
                        {t('clients.showing_results', { count: filteredClients?.length || 0 })}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : filteredClients && filteredClients.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs uppercase font-black text-muted-foreground border-b border-primary/5 bg-muted/10">
                                    <th className="px-8 py-5">{t('clients.table.client')}</th>
                                    <th className="px-8 py-5 hidden md:table-cell">{t('clients.table.contact')}</th>
                                    <th className="px-8 py-5">{t('clients.table.stats')}</th>
                                    <th className="px-8 py-5">{t('common.status')}</th>
                                    <th className="px-8 py-5 text-right">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {filteredClients.map((client) => (
                                    <tr key={client._id} className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-black text-lg">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground text-base tracking-tight">{client.name}</div>
                                                    <div className="text-xs text-muted-foreground font-medium">
                                                        {t('clients.table.added')} {new Date(client.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden md:table-cell">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                                                    <Mail size={14} className="text-primary" />
                                                    {client.email}
                                                </div>
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                        <Phone size={14} className="text-zinc-400" />
                                                        {client.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-sm font-black">
                                                    <DollarSign size={14} className="text-emerald-500" />
                                                    {client.totalSpent}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                    <ArrowUpRight size={14} className="text-blue-500" />
                                                    {client.totalBookings} {t('clients.table.bookings')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${client.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                                                }`}>
                                                {client.status === 'active' ? t('common.active') : t('common.inactive')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(client)}
                                                    className="p-3 bg-muted rounded-2xl text-muted-foreground hover:text-foreground hover:bg-zinc-200 transition-all hover:scale-105"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client._id)}
                                                    className="p-3 bg-red-50 rounded-2xl text-red-400 hover:text-red-600 hover:bg-red-100 transition-all hover:scale-105"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-24 h-24 rounded-[2rem] bg-muted/50 flex items-center justify-center text-muted-foreground mb-6">
                                <Search size={40} />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">{t('clients.empty.title')}</h3>
                            <p className="text-muted-foreground max-w-sm mt-2 text-lg font-medium">
                                {t('clients.empty.description')}
                            </p>
                            <Button variant="outline" className="mt-8 border-primary/20 font-bold" onClick={() => setIsFormOpen(true)}>
                                {t('clients.empty.button')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {isFormOpen && (
                <ClientForm
                    onClose={() => setIsFormOpen(false)}
                    client={editingClient}
                />
            )}
        </div>
    );
};
