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
    CircularProgress,
    Avatar,
    AvatarGroup,
    Tooltip,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MeetingRoom as ClassIcon,
    PersonAdd as PersonAddIcon,
    School as SchoolIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass, useAssignTeacher, useAssignStudent } from '../../hooks/useClasses';
import { useTeachers } from '../../hooks/useTeachers';
import { useStudents } from '../../hooks/useStudents';
import type { Class } from '../../types';

const GRADES = [
    { code: 'PREKG', label: 'التمهيدي (PREKG)' },
    { code: 'KG1', label: 'الصف الأول رياض (KG1)' },
    { code: 'KG2', label: 'الصف الثاني رياض (KG2)' },
];

// ============================================================
// Dialog لإسناد معلمة أو طالب لفصل
// ============================================================
function AssignDialog({
    open,
    onClose,
    classItem,
    mode,
}: {
    open: boolean;
    onClose: () => void;
    classItem: Class | null;
    mode: 'teacher' | 'student';
}) {
    const { data: teachers } = useTeachers();
    const { data: students } = useStudents();
    const assignTeacher = useAssignTeacher();
    const assignStudent = useAssignStudent();

    const [selectedId, setSelectedId] = useState('');

    const assignedIds = mode === 'teacher'
        ? (classItem?.teacherIds || []).map((t) => t._id)
        : (classItem?.studentIds || []).map((s) => s._id);

    const options = mode === 'teacher'
        ? (teachers || []).filter((t) => !assignedIds.includes(t._id))
        : (students || []).filter((s) => !s.isDeleted && !assignedIds.includes(s._id));

    const handleAssign = async () => {
        if (!classItem || !selectedId) return;
        if (mode === 'teacher') {
            await assignTeacher.mutateAsync({ classId: classItem._id, teacherId: selectedId });
        } else {
            await assignStudent.mutateAsync({ classId: classItem._id, studentId: selectedId });
        }
        setSelectedId('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                {mode === 'teacher' ? '👩‍🏫 إضافة معلمة للفصل' : '🎓 إضافة طالب للفصل'}
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', left: 8, top: 8 }}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    الفصل: <strong>{classItem?.name}</strong>
                </Typography>
                <TextField
                    select
                    label={mode === 'teacher' ? 'اختر المعلمة' : 'اختر الطالب'}
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    fullWidth
                >
                    {options.length === 0 ? (
                        <MenuItem disabled>لا يوجد {mode === 'teacher' ? 'معلمات' : 'طلاب'} متاحون</MenuItem>
                    ) : (
                        options.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                                {'name' in item ? item.name : ''}
                                {'specialty' in item && item.specialty
                                    ? ` — ${item.specialty}`
                                    : ''}
                                {'studentId' in item
                                    ? ` (${(item as any).studentId})`
                                    : ''}
                            </MenuItem>
                        ))
                    )}
                </TextField>

                {/* المضافون مسبقاً */}
                {assignedIds.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="caption" color="text.secondary">
                            {mode === 'teacher' ? 'المعلمات الحاليات:' : 'الطلاب الحاليون:'}
                        </Typography>
                        <List dense>
                            {(mode === 'teacher' ? classItem?.teacherIds : classItem?.studentIds)?.map((item) => (
                                <ListItem key={item._id} sx={{ py: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.light' }}>
                                            {item.name?.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">إلغاء</Button>
                <Button
                    onClick={handleAssign}
                    variant="contained"
                    disabled={!selectedId || assignTeacher.isPending || assignStudent.isPending}
                >
                    إضافة
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ============================================================
// الصفحة الرئيسية
// ============================================================
export default function ClassesList() {
    const { data: classes, isLoading, error } = useClasses();
    const createClass = useCreateClass();
    const updateClass = useUpdateClass();
    const deleteClass = useDeleteClass();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [formData, setFormData] = useState({ name: '', grade: 'PREKG' });
    const [errorMessage, setErrorMessage] = useState('');

    // Assign dialog state
    const [assignOpen, setAssignOpen] = useState(false);
    const [assignMode, setAssignMode] = useState<'teacher' | 'student'>('teacher');
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    // ============================================================
    // فتح نموذج الإضافة
    const handleOpenAdd = () => {
        setEditingClass(null);
        setFormData({ name: '', grade: 'PREKG' });
        setErrorMessage('');
        setOpenDialog(true);
    };

    // فتح نموذج التعديل
    const handleOpenEdit = (cls: Class) => {
        setEditingClass(cls);
        setFormData({ name: cls.name, grade: cls.grade });
        setErrorMessage('');
        setOpenDialog(true);
    };

    // فتح dialog الإسناد
    const handleOpenAssign = (cls: Class, mode: 'teacher' | 'student') => {
        setSelectedClass(cls);
        setAssignMode(mode);
        setAssignOpen(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setErrorMessage('');
    };

    // حفظ
    const handleSubmit = async () => {
        setErrorMessage('');
        if (!formData.name) {
            setErrorMessage('اسم الفصل مطلوب');
            return;
        }
        try {
            if (editingClass) {
                await updateClass.mutateAsync({ id: editingClass._id, cls: formData });
            } else {
                await createClass.mutateAsync(formData);
            }
            setOpenDialog(false);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'حدث خطأ أثناء الحفظ';
            setErrorMessage(msg);
        }
    };

    // حذف
    const handleDelete = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا الفصل؟')) {
            await deleteClass.mutateAsync(id);
        }
    };

    // ============================================================
    // أعمدة الجدول
    // ============================================================
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'اسم الفصل',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', color: 'text.primary', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <ClassIcon fontSize="small" />
                    </Avatar>
                    <Typography fontWeight="bold">{params.value}</Typography>
                </Box>
            ),
        },
        {
            field: 'grade',
            headerName: 'المرحلة',
            width: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Chip
                    label={params.value || '—'}
                    color={params.value?.includes('KG') ? 'secondary' : 'primary'}
                    size="small"
                />
            ),
        },
        {
            field: 'teacherIds',
            headerName: 'المعلمات',
            width: 180,
            renderCell: (params) => {
                const teachers = params.value as Class['teacherIds'];
                if (!teachers || teachers.length === 0) {
                    return (
                        <Typography color="text.disabled" fontSize="0.8rem">لا يوجد معلمات</Typography>
                    );
                }
                return (
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.7rem' } }}>
                        {teachers.map((t) => (
                            <Tooltip key={t._id} title={t.name}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>{t.name?.charAt(0)}</Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                );
            },
        },
        {
            field: 'studentIds',
            headerName: 'الطلاب',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const count = (params.value as any[])?.length || 0;
                return (
                    <Chip
                        label={`${count} طالب`}
                        color={count > 0 ? 'success' : 'default'}
                        variant="outlined"
                        size="small"
                    />
                );
            },
        },
        {
            field: 'assign',
            headerName: 'إسناد',
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="إضافة معلمة">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenAssign(params.row as Class, 'teacher')}
                        >
                            <PersonAddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="إضافة طالب">
                        <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenAssign(params.row as Class, 'student')}
                        >
                            <SchoolIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'تاريخ الإنشاء',
            width: 130,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) =>
                params.value ? new Date(params.value).toLocaleDateString('ar-EG') : '—',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'إجراءات',
            width: 100,
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="تعديل"
                    onClick={() => handleOpenEdit(params.row as Class)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="حذف"
                    onClick={() => handleDelete(params.id as string)}
                />,
            ],
        },
    ];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
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
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClassIcon color="secondary" sx={{ fontSize: 32 }} />
                    <Typography variant="h4" component="h1">
                        إدارة الفصول
                    </Typography>
                    <Chip
                        label={`${classes?.length || 0} فصل`}
                        color="secondary"
                        sx={{ mr: 1 }}
                    />
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ borderRadius: 2 }}
                >
                    إضافة فصل
                </Button>
            </Box>

            {/* DataGrid */}
            <DataGrid
                rows={classes || []}
                columns={columns}
                getRowId={(row) => row._id}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                    '& .MuiDataGrid-cell': { borderColor: 'divider' },
                    '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' },
                }}
                localeText={{
                    noRowsLabel: 'لا يوجد فصول مضافة بعد',
                    footerRowSelected: (count: number) => `${count} صف محدد`,
                }}
            />

            {/* Dialog — إضافة / تعديل */}
            <Dialog open={openDialog} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>
                    {editingClass ? '✏️ تعديل بيانات الفصل' : '➕ إضافة فصل جديد'}
                </DialogTitle>
                <DialogContent>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
                        <TextField
                            label="اسم الفصل (مثال: KG1 — أ)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                            placeholder="مثال: KG1 - أ"
                        />
                        <TextField
                            select
                            label="المرحلة الدراسية"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            fullWidth
                        >
                            {GRADES.map((g) => (
                                <MenuItem key={g.code} value={g.code}>{g.label}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit">إلغاء</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={createClass.isPending || updateClass.isPending || !formData.name}
                    >
                        {createClass.isPending || updateClass.isPending
                            ? '...جاري الحفظ'
                            : editingClass ? 'حفظ التعديلات' : 'إضافة الفصل'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assign Dialog */}
            <AssignDialog
                open={assignOpen}
                onClose={() => setAssignOpen(false)}
                classItem={selectedClass}
                mode={assignMode}
            />
        </Box>
    );
}
