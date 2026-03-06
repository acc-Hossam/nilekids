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
    Alert,
    CircularProgress,
    MenuItem,
} from '@mui/material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, MenuBook as BookIcon, LibraryBooks as LessonIcon } from '@mui/icons-material';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '../../hooks/useSubject';
import type { Subject } from '../../api/subject';
import ManageLessonsDialog from '../../components/ManageLessonsDialog';

const GRADES = [
    { code: 'PREKG', label: 'التمهيدي (PREKG)' },
    { code: 'KG1', label: 'الصف الأول رياض (KG1)' },
    { code: 'KG2', label: 'الصف الثاني رياض (KG2)' },
];

export default function SubjectsList() {
    const { data: subjects, isLoading, error } = useSubjects();
    const createMutation = useCreateSubject();
    const updateMutation = useUpdateSubject();
    const deleteMutation = useDeleteSubject();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [formData, setFormData] = useState({ name: '', grade: '' });

    // For Lessons
    const [lessonsSubjectId, setLessonsSubjectId] = useState<string | null>(null);

    const handleOpenNew = () => {
        setEditingSubject(null);
        setFormData({ name: '', grade: '' });
        setOpenDialog(true);
    };

    const handleOpenEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setFormData({ name: subject.name, grade: subject.grade });
        setOpenDialog(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المادة؟')) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            if (editingSubject) {
                await updateMutation.mutateAsync({ id: editingSubject._id, data: formData });
            } else {
                await createMutation.mutateAsync(formData);
            }
            setOpenDialog(false);
        } catch (err) {
            console.error(err);
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'اسم المادة', flex: 1 },
        { field: 'grade', headerName: 'الصف الدراسي', flex: 1 },
        {
            field: 'createdAt',
            headerName: 'تاريخ الإضافة',
            flex: 1,
            valueGetter: (_, row) => new Date(row.createdAt).toLocaleDateString('ar-EG'),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'إجراءات',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<LessonIcon color="info" />}
                    label="الدروس"
                    onClick={() => setLessonsSubjectId(params.row._id)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    icon={<EditIcon color="primary" />}
                    label="تعديل"
                    onClick={() => handleOpenEdit(params.row)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="حذف"
                    onClick={() => handleDelete(params.row._id)}
                    showInMenu={false}
                />,
            ],
        },
    ];

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">حدث خطأ أثناء جلب البيانات</Alert>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookIcon color="primary" fontSize="large" />
                    المواد الدراسية
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew}>
                    إضافة مادة
                </Button>
            </Box>

            <Box sx={{ height: 600, width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
                <DataGrid
                    rows={subjects || []}
                    columns={columns}
                    getRowId={(row) => row._id}
                    disableRowSelectionOnClick
                    sx={{ border: 0 }}
                />
            </Box>

            {/* Dialog for Add/Edit */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingSubject ? 'تعديل مادة' : 'إضافة مادة جديدة'}</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <TextField
                            label="اسم المادة"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            select
                            label="الصف الدراسي"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            fullWidth
                            required
                        >
                            {GRADES.map((g) => (
                                <MenuItem key={g.code} value={g.code}>{g.label}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name || !formData.grade || createMutation.isPending || updateMutation.isPending}
                    >
                        حفظ
                    </Button>
                </DialogActions>
            </Dialog>

            <ManageLessonsDialog
                open={Boolean(lessonsSubjectId)}
                onClose={() => setLessonsSubjectId(null)}
                subjectId={lessonsSubjectId}
            />
        </Box>
    );
}
