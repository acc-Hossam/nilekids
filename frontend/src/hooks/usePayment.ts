import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/payment';

export function useAllStudentsPayments() {
    return useQuery({
        queryKey: ['payments'],
        queryFn: paymentApi.getAllStudentsPayments,
    });
}

export function useStudentPayments(studentId: string | null) {
    return useQuery({
        queryKey: ['payments', studentId],
        queryFn: () => paymentApi.getStudentPayments(studentId!),
        enabled: !!studentId,
    });
}

export function useAddPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, amount, month, type }: { studentId: string; amount: number; month: string; type?: string }) =>
            paymentApi.addPayment(studentId, { amount, month, type }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
    });
}

export function useDeletePayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, paymentId }: { studentId: string; paymentId: string }) =>
            paymentApi.deletePayment(studentId, paymentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
    });
}
