import { apiClient } from './axios';

export interface LessonContent {
    _id?: string;
    type: string;
    url: string;
    notes?: string;
}

export interface Lesson {
    _id: string;
    title: string;
    description?: string;
    date?: string;
    contents: LessonContent[];
}

export interface Subject {
    _id: string;
    name: string;
    grade: string;
    curriculumId?: { _id: string; name: string } | string;
    teacherId?: { _id: string; name: string } | string;
    lessons: Lesson[];
    books: any[];
    createdAt: string;
}

export const subjectApi = {
    // Admin Endpoints
    getAllSubjects: async (grade?: string): Promise<Subject[]> => {
        const params = grade ? { grade } : {};
        const { data } = await apiClient.get('/subjects', { params });
        return data;
    },

    createSubject: async (subjectData: Partial<Subject>): Promise<{ message: string; subject: Subject }> => {
        const { data } = await apiClient.post('/subjects', subjectData);
        return data;
    },

    updateSubject: async (id: string, subjectData: Partial<Subject>): Promise<{ message: string; subject: Subject }> => {
        const { data } = await apiClient.put(`/subjects/${id}`, subjectData);
        return data;
    },

    deleteSubject: async (id: string): Promise<{ message: string }> => {
        const { data } = await apiClient.delete(`/subjects/${id}`);
        return data;
    },

    // Lesson Endpoints
    addLesson: async (subjectId: string, lessonData: Partial<Lesson>): Promise<{ message: string; subject: Subject }> => {
        const { data } = await apiClient.post(`/subjects/${subjectId}/lessons`, lessonData);
        return data;
    },

    updateLesson: async (subjectId: string, lessonId: string, lessonData: Partial<Lesson>): Promise<{ message: string; subject: Subject }> => {
        const { data } = await apiClient.put(`/subjects/${subjectId}/lessons/${lessonId}`, lessonData);
        return data;
    },

    deleteLesson: async (subjectId: string, lessonId: string): Promise<{ message: string; subject: Subject }> => {
        const { data } = await apiClient.delete(`/subjects/${subjectId}/lessons/${lessonId}`);
        return data;
    },

    // Student Endpoints
    getMySubjects: async (): Promise<{ subjects: Subject[] }> => {
        const { data } = await apiClient.get('/student/me/subjects');
        return data;
    }
};
