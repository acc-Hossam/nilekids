import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import type { Student } from '../types';

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
    mutationFn: (student: Omit<Student, '_id' | 'isDeleted' | 'evaluations' | 'payments' | 'createdAt'>) => 
      adminApi.createStudent(student),
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