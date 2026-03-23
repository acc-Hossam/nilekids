import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi, type TeacherDashboardData } from '../api/teacher';
import type { Student } from '../types';

// ============================================================
// 🏠 DASHBOARD DATA (Classes & Direct Students)
// ============================================================
export function useTeacherDashboard() {
    return useQuery<TeacherDashboardData>({
        queryKey: ['teacherDashboard'],
        queryFn: () => teacherApi.getDashboardData(),
    });
}

// ============================================================
// 📝 EVALUATIONS
// ============================================================
export function useStudentEvaluations(studentId: string) {
    return useQuery({
        queryKey: ['evaluations', studentId],
        queryFn: () => teacherApi.getStudentEvaluations(studentId),
        enabled: !!studentId,
    });
}

export function useAddEvaluation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, evaluation }: { studentId: string, evaluation: { grade: number; notes: string; examId?: string; } }) =>
            teacherApi.addEvaluation(studentId, evaluation),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['evaluations', variables.studentId] });
            queryClient.invalidateQueries({ queryKey: ['teacherDashboard'] });
        },
    });
}

// ============================================================
// 💰 PAYMENTS
// ============================================================
export function useStudentPayments(studentId: string) {
    return useQuery({
        queryKey: ['payments', studentId],
        queryFn: () => teacherApi.getStudentPayments(studentId),
        enabled: !!studentId,
    });
}

export function useAddPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, payment }: { studentId: string, payment: { amount: number; type: string; date?: string; } }) =>
            teacherApi.addPayment(studentId, payment),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['payments', variables.studentId] });
        },
    });
}

// ============================================================
// 👁️ STUDENT PROFILE
// ============================================================
export function useStudentProfile(studentId: string) {
    return useQuery<Student>({
        queryKey: ['studentProfile', studentId],
        queryFn: () => teacherApi.getStudentProfile(studentId),
        enabled: !!studentId,
    });
}
