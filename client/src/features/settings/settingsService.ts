import api from '../../api/axios';

export interface ProfileData {
    name: string;
    email: string;
    barberShop: string;
}

export interface PasswordData {
    currentPassword: string;
    newPassword: string;
}

export const settingsService = {
    updateProfile: async (data: ProfileData) => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    updatePassword: async (data: PasswordData) => {
        const response = await api.put('/auth/password', data);
        return response.data;
    }
};
