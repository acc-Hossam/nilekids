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
  Chip,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from '../../hooks/useTeachers';
import type { Teacher } from '../../types';

// ============================================================
// نموذج بيانات المعلمة الفارغ
// ============================================================
const emptyForm = {
  name: '',
  username: '',
  password: '',
  specialty: '',
  contact: { phone: '', email: '' },
};

// ============================================================
// الصفحة الرئيسية
// ============================================================
export default function TeachersList() {
  const { data: teachers, isLoading, error } = useTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState('');

  // ============================================================
  // فتح نموذج الإضافة
  // ============================================================
  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData(emptyForm);
    setErrorMessage('');
    setOpenDialog(true);
  };

  // ============================================================
  // فتح نموذج التعديل
  // ============================================================
  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      username: teacher.username,
      password: '',
      specialty: teacher.specialty || '',
      contact: {
        phone: teacher.contact?.phone || '',
        email: teacher.contact?.email || '',
      },
    });
    setErrorMessage('');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setErrorMessage('');
  };

  // ============================================================
  // حفظ (إضافة أو تعديل)
  // ============================================================
  const handleSubmit = async () => {
    setErrorMessage('');

    if (!formData.name || !formData.username) {
      setErrorMessage('الاسم واسم المستخدم مطلوبان');
      return;
    }
    if (!editingTeacher && !formData.password) {
      setErrorMessage('كلمة المرور مطلوبة عند الإضافة');
      return;
    }

    try {
      if (editingTeacher) {
        const updateData: any = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateTeacher.mutateAsync({ id: editingTeacher._id, teacher: updateData });
      } else {
        await createTeacher.mutateAsync(formData as any);
      }
      setOpenDialog(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'حدث خطأ أثناء الحفظ';
      setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  // ============================================================
  // حذف المعلمة
  // ============================================================
  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المعلمة؟')) {
      await deleteTeacher.mutateAsync(id);
    }
  };

  // ============================================================
  // أعمدة الجدول
  // ============================================================
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'اسم المعلمة',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'primary.main',
              fontSize: '0.85rem',
            }}
          >
            {params.value?.charAt(0)}
          </Avatar>
          <Typography fontWeight="bold" fontSize="0.9rem">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'username',
      headerName: 'اسم المستخدم',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" color="primary" />
      ),
    },
    {
      field: 'specialty',
      headerName: 'التخصص',
      width: 160,
      renderCell: (params) =>
        params.value ? (
          <Chip label={params.value} size="small" color="secondary" />
        ) : (
          <Typography color="text.disabled" fontSize="0.8rem">غير محدد</Typography>
        ),
    },
    {
      field: 'contact',
      headerName: 'رقم الهاتف',
      width: 150,
      renderCell: (params) => (
        <Typography fontSize="0.85rem" dir="ltr">
          {params.value?.phone || '—'}
        </Typography>
      ),
    },
    {
      field: 'classIds',
      headerName: 'الفصول',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const count = params.value?.length || 0;
        return (
          <Chip
            label={count}
            color={count > 0 ? 'success' : 'default'}
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: 'subjectIds',
      headerName: 'المواد',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const count = params.value?.length || 0;
        return (
          <Chip
            label={count}
            color={count > 0 ? 'info' : 'default'}
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'تاريخ الإضافة',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString('ar-EG')
          : '—',
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
          onClick={() => handleOpenEdit(params.row as Teacher)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="حذف"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ];

  // ============================================================
  // حالات التحميل والخطأ
  // ============================================================
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

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================
  return (
    <Box sx={{ height: '100%', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            إدارة المعلمين
          </Typography>
          <Chip
            label={`${teachers?.length || 0} معلمة`}
            color="primary"
            sx={{ mr: 1 }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 2 }}
        >
          إضافة معلمة
        </Button>
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={teachers || []}
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
          noRowsLabel: 'لا يوجد معلمات',
        }}
      />

      {/* Dialog — إضافة / تعديل */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTeacher ? '✏️ تعديل بيانات المعلمة' : '➕ إضافة معلمة جديدة'}
        </DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            {/* الاسم */}
            <TextField
              label="الاسم الكامل"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />

            {/* اسم المستخدم + كلمة المرور */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="اسم المستخدم"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label={editingTeacher ? 'كلمة المرور (اتركه فارغاً للإبقاء)' : 'كلمة المرور'}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
                required={!editingTeacher}
              />
            </Box>

            {/* التخصص */}
            <TextField
              label="التخصص (مثال: رياضيات، لغة عربية)"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              fullWidth
            />

            {/* رقم الهاتف + البريد */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="رقم الهاتف"
                value={formData.contact.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value },
                  })
                }
                fullWidth
              />
              <TextField
                label="البريد الإلكتروني"
                type="email"
                value={formData.contact.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              createTeacher.isPending ||
              updateTeacher.isPending ||
              !formData.name ||
              !formData.username
            }
          >
            {createTeacher.isPending || updateTeacher.isPending
              ? '...جاري الحفظ'
              : editingTeacher
                ? 'حفظ التعديلات'
                : 'إضافة المعلمة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}