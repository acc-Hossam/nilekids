import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/student';
import type { Student, Evaluation, Payment } from '../types';

export function useMyProfile() {
    return useQuery<Student>({
        queryKey: ['myProfile'],
        queryFn: () => studentApi.getMyProfile(),
    });
}

export function useMyEvaluations() {
    return useQuery<{ evaluations: Evaluation[] }>({
        queryKey: ['myEvaluations'],
        queryFn: () => studentApi.getMyEvaluations(),
    });
}

export function useMyPayments() {
    return useQuery<{ payments: Payment[] }>({
        queryKey: ['myPayments'],
        queryFn: () => studentApi.getMyPayments(),
    });
}
