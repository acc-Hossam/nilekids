import { apiClient } from './axios';

export interface Payment {
    _id: string;
    amount: number;
    month: string;
    paymentType: string;
    date: string;
}

export interface StudentPaymentSummary {
    _id: string;
    name: string;
    grade: string;
    studentId: string;
    payments: Payment[];
}

export const paymentApi = {
    // Get all students with their payments
    getAllStudentsPayments: async (): Promise<StudentPaymentSummary[]> => {
        const { data } = await apiClient.get('/admin/payments');
        return data;
    },
    // Get a specific student's payments
    getStudentPayments: async (studentId: string): Promise<{ student: { _id: string; name: string }; payments: Payment[] }> => {
        const { data } = await apiClient.get(`/admin/students/${studentId}/payments`);
        return data;
    },
    // Add payment
    addPayment: async (studentId: string, payload: { amount: number; month: string; type?: string }): Promise<{ message: string; payments: Payment[] }> => {
        const { data } = await apiClient.post(`/admin/students/${studentId}/payments`, payload);
        return data;
    },
    // Delete payment
    deletePayment: async (studentId: string, paymentId: string): Promise<{ message: string }> => {
        const { data } = await apiClient.delete(`/admin/students/${studentId}/payments/${paymentId}`);
        return data;
    },
};
