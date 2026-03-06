// ========== AUTH ==========
export interface User {
    id: string;
    role: 'admin' | 'teacher' | 'student';
    name?: string;
    username?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
    role: 'admin' | 'teacher' | 'student';
}

export interface LoginResponse {
    token: string;
    role: 'admin' | 'teacher' | 'student';
    userId: string;
}

// ========== TEACHER ==========
export interface Teacher {
    _id: string;
    name: string;
    username: string;
    specialty: string;
    contact: {
        phone: string;
        email: string;
    };
    classIds?: string[];
    subjectIds?: string[];
    createdAt: string;
}

// ========== STUDENT ==========
export interface Student {
    _id: string;
    name: string;
    grade: string;
    studentId: string;
    birthDay: string;
    userName: string;
    password?: string;
    phoneNumber: string;
    whatsApp: string;
    dressCode: string;
    missId?: Teacher;
    classId?: any;
    curriculumId?: any;
    isDeleted: boolean;
    evaluations: Evaluation[];
    payments: Payment[];
    createdAt: string;
}

// ========== CLASS ==========
export interface Class {
    _id: string;
    name: string;
    grade: string;
    teacherIds: Teacher[];
    studentIds: Student[];
    curriculumId?: string;
    createdAt: string;
}

// ========== SUBJECT ==========
export interface Subject {
    _id: string;
    name: string;
    lessons: Lesson[];
    books: Book[];
    createdAt: string;
}

export interface Lesson {
    title: string;
    description: string;
    date: string;
}

export interface Book {
    title: string;
    author: string;
}

// ========== EVALUATION & PAYMENT ==========
export interface Evaluation {
    _id?: string;
    grade: number;
    notes: string;
    createdAt?: string;
}

export interface Payment {
    _id?: string;
    amount: number;
    date: string;
    type: string;
    createdAt?: string;
}

// ========== QUESTIONS ==========
export type QuestionType = 'mcq' | 'math';

export interface QuestionOption {
    label: string;
    isCorrect: boolean;
}

export interface Question {
    _id: string;
    type: QuestionType;
    text: string;
    options?: QuestionOption[];
    answer?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    createdAt: string;
}