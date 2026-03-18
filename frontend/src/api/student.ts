import { apiClient } from './axios';
import type { Student, Evaluation, Payment } from '../types';

export const studentApi = {
    // 👁️ Get My Profile (the logged-in student)
    getMyProfile: async (): Promise<Student> => {
        const { data } = await apiClient.get('/student/me');
        return data;
    },

    // 📝 Get My Evaluations
    getMyEvaluations: async (): Promise<{ evaluations: Evaluation[] }> => {
        const { data } = await apiClient.get('/student/me/evaluations');
        return data;
    },

    // 💰 Get My Payments
    getMyPayments: async (): Promise<{ payments: Payment[] }> => {
        const { data } = await apiClient.get('/student/me/payments');
        return data;
    }
};
