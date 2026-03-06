import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../../hooks/useStudents';
import { useTeachers } from '../../hooks/useTeachers';
import { useClasses } from '../../hooks/useClasses';
import type { Student } from '../../types';

const GRADES = [
    { code: 'PREKG', label: 'التمهيدي (PREKG)' },
    { code: 'KG1', label: 'الصف الأول رياض (KG1)' },
    { code: 'KG2', label: 'الصف الثاني رياض (KG2)' },
];

export default function StudentsList() {
    const { data: students, isLoading, error } = useStudents();
    const createStudent = useCreateStudent();
    const updateStudent = useUpdateStudent();
    const deleteStudent = useDeleteStudent();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        grade: 'PREKG',
        studentId: '',
        birthDay: '',
        userName: '',
        password: '',
        phoneNumber: '',
        whatsApp: '',
        dressCode: '',
        missId: '',
        classId: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch teachers and classes for dropdowns
    const { data: teachers } = useTeachers();
    const { data: classes } = useClasses();

    const handleOpenAdd = () => {
        setEditingStudent(null);
        setFormData({
            name: '',
            grade: 'PREKG',
            studentId: '',
            birthDay: '',
            userName: '',
            password: '',
            phoneNumber: '',
            whatsApp: '',
            dressCode: '',
            missId: '',
            classId: '',
        });
        setErrorMessage('');
        setOpenDialog(true);
    };

    const handleOpenEdit = (student: Student) => {
        setEditingStudent(student);
        setFormData({
            name: student.name,
            grade: student.grade,
            studentId: student.studentId,
            birthDay: student.birthDay?.split('T')[0] || '',
            userName: student.userName,
            password: '',
            phoneNumber: student.phoneNumber,
            whatsApp: student.whatsApp,
            dressCode: student.dressCode,
            missId: student.missId?._id || '',
            classId: student.classId?._id || '',
        });
        setErrorMessage('');
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setErrorMessage('');
    };
    const handleSubmit = async () => {
        setErrorMessage('');

        // Validation
        if (!formData.name || (!editingStudent && !formData.password)) {
            setErrorMessage('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }

        if (!formData.studentId) {
            setErrorMessage('كود الطالب مطلوب');
            return;
        }

        if (!formData.birthDay) {
            setErrorMessage('تاريخ الميلاد مطلوب');
            return;
        }

        // ✅ الحل: لو userName فاضي، استخدم studentId
        const dataToSend: any = {
            ...formData,
            userName: formData.userName.trim() || formData.studentId,
        };

        // Remove empty relations to avoid cast errors
        if (!dataToSend.missId) delete dataToSend.missId;
        if (!dataToSend.classId) delete dataToSend.classId;

        try {
            if (editingStudent) {
                const updateData: any = { ...dataToSend };
                if (!updateData.password) delete updateData.password;
                await updateStudent.mutateAsync({ id: editingStudent._id, student: updateData });
            } else {
                await createStudent.mutateAsync(dataToSend);
            }
            setOpenDialog(false);
        } catch (err: any) {
            const message = err.response?.data?.message || err.response?.data?.error || 'حدث خطأ أثناء الحفظ';
            setErrorMessage(typeof message === 'string' ? message : JSON.stringify(message));
            console.error('Error:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا الطالب؟ (سيتم نقله للأرشيف)')) {
            await deleteStudent.mutateAsync(id);
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'اسم الطالب',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color="primary" />
                    <Typography
                        sx={{
                            textDecoration: params.row?.isDeleted ? 'line-through' : 'none',
                            color: params.row?.isDeleted ? 'text.disabled' : 'text.primary',
                            fontWeight: params.row?.isDeleted ? 'normal' : 'bold'
                        }}
                    >
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'studentId',
            headerName: 'كود الطالب',
            width: 120,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'grade',
            headerName: 'المرحلة',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value?.includes('KG') ? 'secondary' : 'primary'}
                    size="small"
                />
            )
        },
        {
            field: 'missId',
            headerName: 'المعلمة',
            width: 150,
            renderCell: (params) => (
                <span>{params.row?.missId?.name || 'غير محدد'}</span>
            )
        },
        {
            field: 'phoneNumber',
            headerName: 'رقم الهاتف',
            width: 130,
            align: 'left',
            headerAlign: 'right'
        },
        {
            field: 'evaluations',
            headerName: 'التقييمات',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const count = params.row?.evaluations?.length || 0;
                return (
                    <Chip
                        label={count}
                        color={count > 0 ? 'success' : 'default'}
                        variant="outlined"
                        size="small"
                    />
                );
            }
        },
        {
            field: 'payments',
            headerName: 'الدفعات',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const count = params.row?.payments?.length || 0;
                return (
                    <Chip
                        label={count}
                        color={count > 0 ? 'info' : 'default'}
                        variant="outlined"
                        size="small"
                    />
                );
            }
        },
        {
            field: 'isDeleted',
            headerName: 'الحالة',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                params.value ?
                    <Chip label="محذوف" color="error" size="small" /> :
                    <Chip label="نشط" color="success" size="small" />
            )
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'إجراءات',
            width: 120,
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="تعديل"
                    onClick={() => handleOpenEdit(params.row as Student)}
                    disabled={params.row?.isDeleted}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="حذف"
                    onClick={() => handleDelete(params.id as string)}
                    disabled={params.row?.isDeleted}
                />,
            ],
        },
    ];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                حدث خطأ في تحميل البيانات. الرجاء المحاولة مرة أخرى.
            </Alert>
        );
    }

    return (
        <Box sx={{ height: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    👶 إدارة الطلاب
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ borderRadius: 2 }}
                >
                    إضافة طالب جديد
                </Button>
            </Box>

            <DataGrid
                rows={students || []}
                columns={columns}
                getRowId={(row) => row._id}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                    '& .MuiDataGrid-cell': {
                        borderColor: 'divider',
                    },
                    '& .MuiDataGrid-row:hover': {
                        bgcolor: 'action.hover',
                    },
                }}
                localeText={{
                    noRowsLabel: 'لا يوجد طلاب',
                }}
            />

            <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingStudent ? '✏️ تعديل بيانات الطالب' : '➕ إضافة طالب جديد'}
                </DialogTitle>
                <DialogContent>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <TextField
                            label="الاسم الكامل"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                select
                                label="المرحلة الدراسية"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                fullWidth
                            >
                                {GRADES.map((g) => (
                                    <MenuItem key={g.code} value={g.code}>
                                        {g.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="تاريخ الميلاد"
                                type="date"
                                value={formData.birthDay}
                                onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>

                        {/* ======================================= */}
                        {/* اختيار الفصل والمعلمة */}
                        {/* ======================================= */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                select
                                label="الفصل (اختياري)"
                                value={formData.classId}
                                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value=""><em>غير محدد</em></MenuItem>
                                {classes?.map((cls) => (
                                    <MenuItem key={cls._id} value={cls._id}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                label="المعلمة المسؤولة (اختياري)"
                                value={formData.missId}
                                onChange={(e) => setFormData({ ...formData, missId: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value=""><em>غير محدد</em></MenuItem>
                                {teachers?.map((t) => (
                                    <MenuItem key={t._id} value={t._id}>
                                        {t.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <TextField
                            label="كود الطالب (STUxxx)"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            fullWidth
                            required
                            placeholder="مثال: STU001"
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                label="اسم المستخدم"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                fullWidth
                                required
                            />

                            <TextField
                                label={editingStudent ? "كلمة المرور (اتركه فارغاً للتعديل)" : "كلمة المرور"}
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                fullWidth
                                required={!editingStudent}
                            />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                label="رقم الهاتف"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                fullWidth
                            />

                            <TextField
                                label="واتساب"
                                value={formData.whatsApp}
                                onChange={(e) => setFormData({ ...formData, whatsApp: e.target.value })}
                                fullWidth
                            />
                        </Box>

                        <TextField
                            label="الزي المدرسي"
                            value={formData.dressCode}
                            onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                            fullWidth
                            placeholder="مثال: Blue uniform"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit">
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name || !formData.userName || (!editingStudent && !formData.password)}
                    >
                        {editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}