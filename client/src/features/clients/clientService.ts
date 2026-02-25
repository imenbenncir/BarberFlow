import api from '../../api/axios';

export interface Client {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    totalBookings: number;
    totalSpent: number;
    lastVisit?: string;
    notes?: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

export const clientService = {
    getClients: async (): Promise<Client[]> => {
        const response = await api.get('/clients');
        return response.data;
    },

    createClient: async (clientData: Partial<Client>): Promise<Client> => {
        const response = await api.post('/clients', clientData);
        return response.data;
    },

    updateClient: async (id: string, clientData: Partial<Client>): Promise<Client> => {
        const response = await api.put(`/clients/${id}`, clientData);
        return response.data;
    },

    deleteClient: async (id: string): Promise<void> => {
        await api.delete(`/clients/${id}`);
    }
};
