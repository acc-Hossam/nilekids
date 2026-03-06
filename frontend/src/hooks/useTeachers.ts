import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import type { Teacher } from '../types';

// ============================================================
// 📋 GET ALL TEACHERS
// ============================================================
export function useTeachers() {
    return useQuery<Teacher[]>({
        queryKey: ['teachers'],
        queryFn: adminApi.getTeachers,
    });
}

// ============================================================
// ➕ CREATE TEACHER
// ============================================================
export function useCreateTeacher() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (teacher: Omit<Teacher, '_id' | 'createdAt'>) =>
            adminApi.createTeacher(teacher),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });
}

// ============================================================
// ✏️ UPDATE TEACHER
// ============================================================
export function useUpdateTeacher() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, teacher }: { id: string; teacher: Partial<Teacher> }) =>
            adminApi.updateTeacher(id, teacher),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });
}

// ============================================================
// 🗑️ DELETE TEACHER
// ============================================================
export function useDeleteTeacher() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminApi.deleteTeacher(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });
}
