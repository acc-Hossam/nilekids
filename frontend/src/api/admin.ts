import { apiClient } from './axios';
import type { Teacher, Student, Subject, Question, Class } from '../types';

// ========== TEACHERS ==========
export const adminApi = {
  getTeachers: async (): Promise<Teacher[]> => {
    const { data } = await apiClient.get('/admin/teachers');
    return data;
  },

  createTeacher: async (teacher: Omit<Teacher, '_id' | 'createdAt'>): Promise<Teacher> => {
    const { data } = await apiClient.post('/admin/teachers', teacher);
    return data.teacher;
  },

  updateTeacher: async (id: string, teacher: Partial<Teacher>): Promise<Teacher> => {
    const { data } = await apiClient.put(`/admin/teachers/${id}`, teacher);
    return data.teacher;
  },

  deleteTeacher: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/teachers/${id}`);
  },

  // ========== STUDENTS ==========
  getStudents: async (): Promise<Student[]> => {
    const { data } = await apiClient.get('/admin/students');
    return data;
  },

  createStudent: async (student: Omit<Student, '_id' | 'isDeleted' | 'evaluations' | 'payments' | 'createdAt'>): Promise<Student> => {
    console.log(JSON.stringify(student, null, 2));
    const { data } = await apiClient.post('/admin/students', student);
    console.log(data);
    return data.student;
  },

  updateStudent: async (id: string, student: Partial<Student>): Promise<Student> => {
    const { data } = await apiClient.put(`/admin/students/${id}`, student);
    return data.student;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/students/${id}`);
  },

  // ========== CLASSES ==========
  getClasses: async (): Promise<Class[]> => {
    const { data } = await apiClient.get('/admin/classes');
    return data;
  },

  createClass: async (cls: { name: string; grade: string }): Promise<Class> => {
    const { data } = await apiClient.post('/admin/classes', cls);
    return data.class;
  },

  updateClass: async (id: string, cls: Partial<Class>): Promise<Class> => {
    const { data } = await apiClient.put(`/admin/classes/${id}`, cls);
    return data.class;
  },

  deleteClass: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/classes/${id}`);
  },

  assignTeacherToClass: async (classId: string, teacherId: string): Promise<Class> => {
    const { data } = await apiClient.post(`/admin/classes/${classId}/assign-teacher`, { teacherId });
    return data.class;
  },

  assignStudentToClass: async (classId: string, studentId: string): Promise<Class> => {
    const { data } = await apiClient.post(`/admin/classes/${classId}/assign-student`, { studentId });
    return data.class;
  },

  // ========== SUBJECTS ==========
  getSubjects: async (): Promise<Subject[]> => {
    const { data } = await apiClient.get('/admin/subjects');
    return data;
  },

  createSubject: async (subject: Omit<Subject, '_id' | 'createdAt'>): Promise<Subject> => {
    const { data } = await apiClient.post('/admin/subjects', subject);
    return data.subject;
  },

  // ========== QUESTIONS ==========
  getQuestions: async (): Promise<Question[]> => {
    const { data } = await apiClient.get('/questions');
    return data;
  },

  createQuestion: async (question: Omit<Question, '_id' | 'createdAt'>): Promise<Question> => {
    const { data } = await apiClient.post('/questions', question);
    return data.question;
  },

  updateQuestion: async (id: string, question: Partial<Question>): Promise<Question> => {
    const { data } = await apiClient.put(`/questions/${id}`, question);
    return data.question;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await apiClient.delete(`/questions/${id}`);
  },
};