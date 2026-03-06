import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import type { Student } from '../types';

type CreateStudentPayload = {
    name: string;
    grade: string;
    studentId: string;
    birthDay: string;
    userName: string;
    password: string;
    phoneNumber?: string;
    whatsApp?: string;
    dressCode?: string;
    missId?: string;
    classId?: string;
    curriculumId?: string;
};

const STUDENTS_KEY = ['students'];

export const useStudents = () => {
    return useQuery({
        queryKey: STUDENTS_KEY,
        queryFn: adminApi.getStudents,
    });
};

export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (student: CreateStudentPayload) =>
            adminApi.createStudent(student as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_KEY });
        },
    });
};

export const useUpdateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, student }: { id: string; student: Partial<Student> }) =>
            adminApi.updateStudent(id, student),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_KEY });
        },
    });
};

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminApi.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_KEY });
        },
    });
};