import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  Class as ClassIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Star as StarIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  useTeacherDashboard,
  useAddEvaluation,
  useStudentEvaluations
} from '../../hooks/useTeacher';
import type { Student, Class } from '../../types';

// ============================================================
// Add Evaluation Dialog
// ============================================================
function EvaluationDialog({ open, onClose, student }: { open: boolean; onClose: () => void; student: Student | null }) {
  const addEval = useAddEvaluation();
  const { data: historyData, isLoading: historyLoading } = useStudentEvaluations(student?._id || '');

  const [tab, setTab] = useState<'add' | 'history'>('add');
  const [formData, setFormData] = useState({ grade: '', notes: '' });

  const handleSubmit = async () => {
    if (!student) return;
    try {
      await addEval.mutateAsync({
        studentId: student._id,
        evaluation: {
          grade: Number(formData.grade),
          notes: formData.notes
        }
      });
      setFormData({ grade: '', notes: '' });
      setTab('history');
    } catch (error) {
      console.error(error);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">تقييم الطالب: {student.name}</Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            الكود: {student.studentId}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1, display: 'flex', gap: 2 }}>
        <Button
          variant={tab === 'add' ? 'text' : 'text'}
          color={tab === 'add' ? 'primary' : 'inherit'}
          sx={{ borderBottom: tab === 'add' ? 2 : 0, borderRadius: 0, pb: 1 }}
          onClick={() => setTab('add')}
        >
          ➕ إضافة تقييم
        </Button>
        <Button
          variant={tab === 'history' ? 'text' : 'text'}
          color={tab === 'history' ? 'primary' : 'inherit'}
          sx={{ borderBottom: tab === 'history' ? 2 : 0, borderRadius: 0, pb: 1 }}
          onClick={() => setTab('history')}
        >
          📜 سجل التقييمات
        </Button>
      </Box>

      <DialogContent dividers>
        {tab === 'add' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="الدرجة (من 100)"
              type="number"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="ملاحظات المعلمة"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              placeholder="اكتب ملاحظاتك عن أداء الطالب وتطوره..."
              required
            />
          </Box>
        ) : (
          <Box>
            {historyLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
            ) : !historyData?.evaluations?.length ? (
              <Alert severity="info" sx={{ mt: 2 }}>لا توجد تقييمات مسجلة لهذا الطالب بعد.</Alert>
            ) : (
              <List>
                {historyData.evaluations.map((ev, index) => (
                  <Box key={index}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: ev.grade >= 85 ? 'success.main' : ev.grade >= 65 ? 'warning.main' : 'error.main' }}>
                          {ev.grade}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="bold">
                            بتاريخ: {ev.createdAt ? new Date(ev.createdAt).toLocaleDateString('ar-EG') : '—'}
                          </Typography>
                        }
                        secondary={ev.notes}
                      />
                    </ListItem>
                    {index < historyData.evaluations.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>

      {tab === 'add' && (
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">إلغاء</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.grade || !formData.notes || addEval.isPending}
          >
            {addEval.isPending ? 'جاري الحفظ...' : 'حفظ التقييم'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

// ============================================================
// Main Dashboard Page
// ============================================================
export default function TeacherDashboard() {
  const { data, isLoading, error } = useTeacherDashboard();

  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">حدث خطأ أثناء جلب بيانات الفصول والطلاب.</Alert>;

  const handleOpenEval = (student: Student) => {
    setSelectedStudent(student);
    setEvalModalOpen(true);
  };

  const StudentCard = ({ student }: { student: Student }) => {
    const evalsCount = student.evaluations ? student.evaluations.length : 0;
    return (
      <Card sx={{ mb: 2, boxShadow: 1, '&:hover': { boxShadow: 3 }, transition: 'all 0.2s ease' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: "16px !important" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', fontWeight: 'bold' }}>
              {student.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, lineHeight: 1 }}>
                {student.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                الكود: {student.studentId} {student.phoneNumber && `| 📞 ${student.phoneNumber}`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              icon={<StarIcon sx={{ fontSize: '1rem !important' }} />}
              label={`${evalsCount} تقييم`}
              size="small"
              color={evalsCount > 0 ? "success" : "default"}
              variant="outlined"
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleOpenEval(student)}
              sx={{ borderRadius: 2 }}
            >
              تعديل/إضافة
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const hasClasses = data?.classes && data.classes.length > 0;
  const hasDirectStudents = data?.directStudents && data.directStudents.length > 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <SchoolIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            لوحة تحكم المعلمة
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            مرحباً بك، يمكنك إدارة تقييمات طلابك وفصولك من هنا.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* 1️⃣ الفصول المسندة للمعلمة */}
        {hasClasses && data.classes.map((cls: Class) => (
          <Grid item xs={12} md={6} key={cls._id}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3, boxShadow: 1, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ClassIcon color="secondary" fontSize="large" />
                  <Typography variant="h5" fontWeight="bold">
                    الفصل: {cls.name}
                  </Typography>
                </Box>
                <Chip label={cls.grade} color="primary" variant="filled" />
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Students in class */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {cls.studentIds && cls.studentIds.length > 0 ? (
                  cls.studentIds.map((student: Student) => (
                    <StudentCard key={student._id} student={student} />
                  ))
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>لا يوجد طلاب مسجلين في هذا الفصل حالياً.</Alert>
                )}
              </Box>
            </Box>
          </Grid>
        ))}

        {/* 2️⃣ الطلاب المسندين مباشرة للمعلمة */}
        {hasDirectStudents && (
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3, boxShadow: 1, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight="bold">
                  طلابي المباشرين (بدون فصل)
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Direct students list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {data.directStudents.map((student: Student) => (
                  <StudentCard key={student._id} student={student} />
                ))}
              </Box>
            </Box>
          </Grid>
        )}

        {/* Empty State */}
        {!hasClasses && !hasDirectStudents && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <SchoolIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                لا يوجد فصول أو طلاب
              </Typography>
              <Typography color="text.secondary">
                لم يتم إسناد أي فصول أو طلاب لك حتى الآن. يرجى مراجعة إدارة المدرسة.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Evaluation Modal */}
      <EvaluationDialog
        open={evalModalOpen}
        onClose={() => setEvalModalOpen(false)}
        student={selectedStudent}
      />
    </Box>
  );
}