import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectApi, type Subject, type Lesson } from '../api/subject';

// ========== ADMIN HOOKS ==========
export function useSubjects(grade?: string) {
    return useQuery<Subject[]>({
        queryKey: ['subjects', grade],
        queryFn: () => subjectApi.getAllSubjects(grade)
    });
}

export function useCreateSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectApi.createSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        }
    });
}

export function useUpdateSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Subject> }) =>
            subjectApi.updateSubject(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        }
    });
}

export function useDeleteSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectApi.deleteSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        }
    });
}

// ========== LESSON HOOKS ==========
export function useAddLesson() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ subjectId, data }: { subjectId: string, data: Partial<Lesson> }) =>
            subjectApi.addLesson(subjectId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        }
    });
}

export function useUpdateLesson() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ subjectId, lessonId, data }: { subjectId: string, lessonId: string, data: Partial<Lesson> }) =>
            subjectApi.updateLesson(subjectId, lessonId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        }
    });
}

export function useDeleteLesson() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ subjectId, lessonId }: { subjectId: string, lessonId: string }) =>
            subjectApi.deleteLesson(subjectId, lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        }
    });
}

// ========== STUDENT HOOKS ==========
export function useMySubjects() {
    return useQuery<{ subjects: Subject[] }>({
        queryKey: ['mySubjects'],
        queryFn: () => subjectApi.getMySubjects()
    });
}
