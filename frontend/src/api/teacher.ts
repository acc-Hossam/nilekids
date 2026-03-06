import { apiClient } from './axios';
import type { Student, Class, Evaluation, Payment } from '../types';

export interface TeacherDashboardData {
    classes: Class[];
    directStudents: Student[];
}

export const teacherApi = {
    // ========== DASHBOARD (Classes & Students) ==========
    getDashboardData: async (): Promise<TeacherDashboardData> => {
        const { data } = await apiClient.get('/teacher/dashboard');
        return data;
    },

    // ========== EVALUATIONS ==========
    addEvaluation: async (studentId: string, evaluation: { grade: number; notes: string; examId?: string; }): Promise<{ message: string, evaluations: Evaluation[] }> => {
        const { data } = await apiClient.post(`/teacher/students/${studentId}/evaluations`, evaluation);
        return data;
    },

    getStudentEvaluations: async (studentId: string): Promise<{ studentName: string, evaluations: Evaluation[] }> => {
        const { data } = await apiClient.get(`/teacher/students/${studentId}/evaluations`);
        return data;
    },

    // ========== PAYMENTS ==========
    addPayment: async (studentId: string, payment: { amount: number; type: string; date?: string; }): Promise<{ message: string, payments: Payment[] }> => {
        const { data } = await apiClient.post(`/teacher/students/${studentId}/payments`, payment);
        return data;
    },

    getStudentPayments: async (studentId: string): Promise<{ studentName: string, payments: Payment[] }> => {
        const { data } = await apiClient.get(`/teacher/students/${studentId}/payments`);
        return data;
    },

    // ========== STUDENT PROFILE ==========
    getStudentProfile: async (studentId: string): Promise<Student> => {
        const { data } = await apiClient.get(`/teacher/students/${studentId}`);
        return data;
    }
};
