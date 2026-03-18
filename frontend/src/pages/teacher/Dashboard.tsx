import { useState, useMemo } from 'react';
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
    alpha,
    useTheme,
    LinearProgress,
    Tooltip,
} from '@mui/material';
import {
    School as SchoolIcon,
    Class as ClassIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Star as StarIcon,
    Close as CloseIcon,
    Assignment as EvalIcon,
    TrendingUp as TrendingIcon,
    Phone as PhoneIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import {
    useTeacherDashboard,
    useAddEvaluation,
    useStudentEvaluations,
} from '../../hooks/useTeacher';
import type { Student, Class } from '../../types';

// ─── Grade colour helper ──────────────────────────────────────
function gradeColor(grade: number, theme: ReturnType<typeof useTheme>) {
    if (grade >= 85) return theme.palette.success.main;
    if (grade >= 65) return theme.palette.warning.main;
    return theme.palette.error.main;
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({
    title,
    value,
    icon,
    color,
    subtitle,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
}) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(color, 0.25)}`,
                background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.03)} 100%)`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${alpha(color, 0.18)}` },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ color, lineHeight: 1.1 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(color, 0.15), color, width: 52, height: 52 }}>
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
}

// ─── Evaluation Dialog ───────────────────────────────────────
function EvaluationDialog({
    open,
    onClose,
    student,
}: {
    open: boolean;
    onClose: () => void;
    student: Student | null;
}) {
    const theme = useTheme();
    const addEval = useAddEvaluation();
    const { data: historyData, isLoading: historyLoading } = useStudentEvaluations(student?._id || '');

    const [tab, setTab] = useState<'add' | 'history'>('add');
    const [formData, setFormData] = useState({ grade: '', notes: '' });

    const gradeNum = Number(formData.grade);
    const gradeValid = gradeNum >= 0 && gradeNum <= 100;
    const gaugeColor = formData.grade ? gradeColor(gradeNum, theme) : theme.palette.divider;

    const handleSubmit = async () => {
        if (!student) return;
        try {
            await addEval.mutateAsync({
                studentId: student._id,
                evaluation: { grade: gradeNum, notes: formData.notes },
            });
            setFormData({ grade: '', notes: '' });
            setTab('history');
        } catch (err) {
            console.error(err);
        }
    };

    if (!student) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {/* Header */}
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">تقييم الطالب</Typography>
                    <Typography variant="subtitle2" color="primary">{student.name}</Typography>
                    <Typography variant="caption" color="text.secondary">الكود: {student.studentId}</Typography>
                </Box>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>

            {/* Tab switcher */}
            <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', px: 3 }}>
                {[
                    { key: 'add', label: '➕ إضافة تقييم' },
                    { key: 'history', label: '📜 السجل' },
                ].map((t) => (
                    <Button
                        key={t.key}
                        color={tab === t.key ? 'primary' : 'inherit'}
                        sx={{ borderBottom: tab === t.key ? 2 : 0, borderRadius: 0, pb: 1, mr: 1 }}
                        onClick={() => setTab(t.key as 'add' | 'history')}
                    >
                        {t.label}
                    </Button>
                ))}
            </Box>

            <DialogContent>
                {tab === 'add' ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            label="الدرجة (من 100)"
                            type="number"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            inputProps={{ min: 0, max: 100 }}
                            fullWidth
                            required
                            error={!!formData.grade && !gradeValid}
                            helperText={!!formData.grade && !gradeValid ? 'يجب أن تكون الدرجة بين 0 و 100' : undefined}
                        />
                        {/* Grade gauge */}
                        {formData.grade && gradeValid && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">مستوى الأداء</Typography>
                                    <Typography variant="caption" fontWeight="bold" sx={{ color: gaugeColor }}>
                                        {gradeNum >= 85 ? 'ممتاز 🌟' : gradeNum >= 65 ? 'جيد 👍' : 'يحتاج تحسين ⚠️'}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={gradeNum}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: alpha(gaugeColor, 0.15),
                                        '& .MuiLinearProgress-bar': { bgcolor: gaugeColor, borderRadius: 4 },
                                    }}
                                />
                            </Box>
                        )}
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
                    <Box sx={{ pt: 1 }}>
                        {historyLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : !historyData?.evaluations?.length ? (
                            <Alert severity="info">لا توجد تقييمات مسجلة لهذا الطالب بعد.</Alert>
                        ) : (
                            <List disablePadding>
                                {[...historyData.evaluations].reverse().map((ev, i, arr) => {
                                    const c = gradeColor(ev.grade, theme);
                                    return (
                                        <Box key={i}>
                                            <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: alpha(c, 0.15), color: c, fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                        {ev.grade}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" fontWeight="bold">
                                                                {ev.createdAt
                                                                    ? new Date(ev.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
                                                                    : '—'}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={ev.grade >= 85 ? 'ممتاز' : ev.grade >= 65 ? 'جيد' : 'ضعيف'}
                                                                sx={{ bgcolor: alpha(c, 0.12), color: c, fontWeight: 'bold', height: 20, fontSize: '0.65rem' }}
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption" color="text.secondary">{ev.notes}</Typography>
                                                    }
                                                />
                                            </ListItem>
                                            {i < arr.length - 1 && <Divider />}
                                        </Box>
                                    );
                                })}
                            </List>
                        )}
                    </Box>
                )}
            </DialogContent>

            {tab === 'add' && (
                <DialogActions sx={{ p: 2.5, pt: 1 }}>
                    <Button onClick={onClose} color="inherit">إلغاء</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.grade || !formData.notes || !gradeValid || addEval.isPending}
                        startIcon={addEval.isPending ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                    >
                        {addEval.isPending ? 'جاري الحفظ...' : 'حفظ التقييم'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}

// ─── Student Row Card ─────────────────────────────────────────
function StudentRow({
    student,
    onEval,
    index,
}: {
    student: Student;
    onEval: (s: Student) => void;
    index: number;
}) {
    const theme = useTheme();
    const evalsCount = student.evaluations?.length ?? 0;
    const lastGrade = evalsCount > 0 ? student.evaluations[evalsCount - 1].grade : null;
    const COLORS = [theme.palette.primary.main, '#7C3AED', '#059669', '#2563EB', '#DC2626'];
    const color = COLORS[index % COLORS.length];

    return (
        <Card
            elevation={0}
            sx={{
                mb: 1.5,
                border: `1px solid ${alpha(color, 0.15)}`,
                borderRadius: 2.5,
                transition: 'all 0.2s',
                '&:hover': { boxShadow: `0 4px 16px ${alpha(color, 0.15)}`, transform: 'translateY(-1px)' },
            }}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: '16px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: alpha(color, 0.15), color, fontWeight: 'bold', width: 44, height: 44 }}>
                        {student.name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="body1" fontWeight="bold" lineHeight={1.2}>{student.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                            <Typography variant="caption" color="text.secondary">#{student.studentId}</Typography>
                            {student.phoneNumber && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                    <PhoneIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                                    <Typography variant="caption" color="text.secondary">{student.phoneNumber}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Last grade badge */}
                    {lastGrade !== null && (
                        <Tooltip title="آخر تقييم">
                            <Chip
                                size="small"
                                icon={<TrendingIcon sx={{ fontSize: '0.85rem !important' }} />}
                                label={`${lastGrade}%`}
                                sx={{
                                    bgcolor: alpha(gradeColor(lastGrade, theme), 0.12),
                                    color: gradeColor(lastGrade, theme),
                                    fontWeight: 'bold',
                                    border: `1px solid ${alpha(gradeColor(lastGrade, theme), 0.25)}`,
                                }}
                            />
                        </Tooltip>
                    )}
                    <Chip
                        size="small"
                        icon={<StarIcon sx={{ fontSize: '0.85rem !important' }} />}
                        label={`${evalsCount} تقييم`}
                        variant="outlined"
                        color={evalsCount > 0 ? 'success' : 'default'}
                        sx={{ fontWeight: 'medium' }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onEval(student)}
                        sx={{ borderRadius: 2, whiteSpace: 'nowrap', bgcolor: color, '&:hover': { bgcolor: alpha(color, 0.85) } }}
                    >
                        تقييم
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

// ─── Class Section Card ───────────────────────────────────────
const GRADE_LABELS: Record<string, string> = {
    PREKG: 'التمهيدي',
    KG1: 'KG1',
    KG2: 'KG2',
};

function ClassSection({ cls, onEval }: { cls: Class; onEval: (s: Student) => void }) {
    const theme = useTheme();
    const studentsInClass = (cls.studentIds ?? []) as Student[];

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                overflow: 'visible',
            }}
        >
            {/* Class header */}
            <Box
                sx={{
                    p: 2.5,
                    pb: 2,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 100%)`,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), color: 'primary.main' }}>
                        <ClassIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">{cls.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {studentsInClass.length} طالب
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={GRADE_LABELS[cls.grade] ?? cls.grade}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                />
            </Box>

            <CardContent sx={{ p: 2.5 }}>
                {studentsInClass.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>لا يوجد طلاب في هذا الفصل.</Alert>
                ) : (
                    studentsInClass.map((s, i) => (
                        <StudentRow key={s._id} student={s} onEval={onEval} index={i} />
                    ))
                )}
            </CardContent>
        </Card>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function TeacherDashboard() {
    const theme = useTheme();
    const { data, isLoading, error } = useTeacherDashboard();
    const [evalOpen, setEvalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Derived stats
    const allStudents = useMemo(() => {
        if (!data) return [];
        const fromClasses = (data.classes ?? []).flatMap((c: Class) => (c.studentIds ?? []) as Student[]);
        const direct = data.directStudents ?? [];
        const seen = new Set<string>();
        return [...fromClasses, ...direct].filter((s) => {
            if (seen.has(s._id)) return false;
            seen.add(s._id);
            return true;
        });
    }, [data]);

    const totalEvals = useMemo(
        () => allStudents.reduce((acc, s) => acc + (s.evaluations?.length ?? 0), 0),
        [allStudents]
    );

    const handleOpenEval = (student: Student) => {
        setSelectedStudent(student);
        setEvalOpen(true);
    };

    if (isLoading)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={48} />
            </Box>
        );

    if (error)
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">حدث خطأ أثناء جلب البيانات. يرجى إعادة المحاولة.</Alert>
            </Box>
        );

    const hasClasses = (data?.classes?.length ?? 0) > 0;
    const hasDirectStudents = (data?.directStudents?.length ?? 0) > 0;
    const isEmpty = !hasClasses && !hasDirectStudents;

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1300, mx: 'auto' }}>

            {/* ── Stat Cards ── */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        title="إجمالي الطلاب"
                        value={allStudents.length}
                        icon={<SchoolIcon />}
                        color={theme.palette.primary.main}
                        subtitle="طالب تحت إشرافك"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        title="الفصول الدراسية"
                        value={data?.classes?.length ?? 0}
                        icon={<ClassIcon />}
                        color="#7C3AED"
                        subtitle="فصل مسند إليك"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        title="إجمالي التقييمات"
                        value={totalEvals}
                        icon={<EvalIcon />}
                        color="#059669"
                        subtitle="تقييم مسجّل"
                    />
                </Grid>
            </Grid>

            {/* ── Content ── */}
            {isEmpty ? (
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ textAlign: 'center', py: 10 }}>
                        <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            لا يوجد فصول أو طلاب
                        </Typography>
                        <Typography color="text.secondary">
                            لم يتم إسناد أي فصول أو طلاب لك حتى الآن. يرجى مراجعة إدارة المدرسة.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {/* Classes */}
                    {hasClasses && data.classes.map((cls: Class) => (
                        <Grid item xs={12} md={6} key={cls._id}>
                            <ClassSection cls={cls} onEval={handleOpenEval} />
                        </Grid>
                    ))}

                    {/* Direct students */}
                    {hasDirectStudents && (
                        <Grid item xs={12} md={6}>
                            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                                <Box
                                    sx={{
                                        p: 2.5,
                                        pb: 2,
                                        background: `linear-gradient(135deg, ${alpha('#7C3AED', 0.08)} 0%, transparent 100%)`,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: '12px 12px 0 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: alpha('#7C3AED', 0.12), color: '#7C3AED' }}>
                                        <PersonIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">طلابي المباشرون</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {data.directStudents.length} طالب بدون فصل
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent sx={{ p: 2.5 }}>
                                    {data.directStudents.map((s: Student, i: number) => (
                                        <StudentRow key={s._id} student={s} onEval={handleOpenEval} index={i} />
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Evaluation modal */}
            <EvaluationDialog
                open={evalOpen}
                onClose={() => setEvalOpen(false)}
                student={selectedStudent}
            />
        </Box>
    );
}