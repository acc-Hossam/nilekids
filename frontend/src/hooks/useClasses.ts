import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import type { Class } from '../types';

// ============================================================
// 📋 GET ALL CLASSES
// ============================================================
export function useClasses() {
    return useQuery<Class[]>({
        queryKey: ['classes'],
        queryFn: adminApi.getClasses,
    });
}

// ============================================================
// ➕ CREATE CLASS
// ============================================================
export function useCreateClass() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cls: { name: string; grade: string }) => adminApi.createClass(cls),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
    });
}

// ============================================================
// ✏️ UPDATE CLASS
// ============================================================
export function useUpdateClass() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, cls }: { id: string; cls: Partial<Class> }) =>
            adminApi.updateClass(id, cls),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
    });
}

// ============================================================
// 🗑️ DELETE CLASS
// ============================================================
export function useDeleteClass() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminApi.deleteClass(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
    });
}

// ============================================================
// 👩‍🏫 ASSIGN TEACHER TO CLASS
// ============================================================
export function useAssignTeacher() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ classId, teacherId }: { classId: string; teacherId: string }) =>
            adminApi.assignTeacherToClass(classId, teacherId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
    });
}

// ============================================================
// 🎓 ASSIGN STUDENT TO CLASS
// ============================================================
export function useAssignStudent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
            adminApi.assignStudentToClass(classId, studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
    });
}
