import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    alpha,
    useTheme,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    AttachMoney as MoneyIcon,
    MeetingRoom as ClassIcon,
    Add as AddIcon,
    Warning as WarningIcon,
    ArrowForward as ArrowIcon,
    Payment as PaymentIcon,
    PersonAdd as PersonAddIcon,
    PersonOff as PersonOffIcon,
    HomeWork as HomeWorkIcon,
} from '@mui/icons-material';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useStudents } from '../../hooks/useStudents';
import { useTeachers } from '../../hooks/useTeachers';
import { useClasses } from '../../hooks/useClasses';

// ─── Grade labels ──────────────────────────────────────────
const GRADE_LABELS: Record<string, string> = {
    PREKG: 'التمهيدي',
    KG1: 'KG1',
    KG2: 'KG2',
};
const PIE_COLORS = ['#7C3AED', '#2563EB', '#059669'];

// ─── Month helpers ─────────────────────────────────────────
const MONTH_LABELS_AR = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

function getLast6Months(): { key: string; label: string }[] {
    const now = new Date();
    const months: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
            label: MONTH_LABELS_AR[d.getMonth()],
        });
    }
    return months;
}

// ─── Stat Card ─────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
}
function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
    const theme = useTheme();
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(color, 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${alpha(color, 0.18)}`,
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {title}
                        </Typography>
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            sx={{ color, lineHeight: 1.1 }}
                        >
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: alpha(color, 0.15),
                            color,
                            width: 56,
                            height: 56,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
}

// ─── Alert Card ────────────────────────────────────────────
interface AlertCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    color: 'warning' | 'error' | 'info';
    actionLabel: string;
    onAction: () => void;
}
function AlertCard({ title, count, icon, color, actionLabel, onAction }: AlertCardProps) {
    const theme = useTheme();
    const colorMap = {
        warning: theme.palette.warning.main,
        error: theme.palette.error.main,
        info: theme.palette.info.main,
    };
    const c = colorMap[color];

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(c, 0.25)}`,
                background: alpha(c, 0.05),
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: alpha(c, 0.15), color: c, width: 40, height: 40 }}>
                        {icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">{title}</Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: c }}>
                            {count} طالب
                        </Typography>
                    </Box>
                    <Button
                        size="small"
                        variant="text"
                        sx={{ color: c, minWidth: 'auto', fontSize: '0.75rem' }}
                        onClick={onAction}
                        endIcon={<ArrowIcon fontSize="small" />}
                    >
                        {actionLabel}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

// ─── Main Dashboard ────────────────────────────────────────
export default function AdminDashboard() {
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: students, isLoading: studentsLoading } = useStudents();
    const { data: teachers, isLoading: teachersLoading } = useTeachers();
    const { data: classes, isLoading: classesLoading } = useClasses();

    const isLoading = studentsLoading || teachersLoading || classesLoading;

    // ── Derived stats ──
    const activeStudents = useMemo(
        () => students?.filter((s) => !s.isDeleted) ?? [],
        [students]
    );

    // Current month revenue
    const currentMonthKey = useMemo(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }, []);

    const currentMonthRevenue = useMemo(() => {
        return activeStudents.reduce((total, s) => {
            const monthPayments = (s.payments ?? []).filter((p) => {
                const payMonth = p.month ?? '';
                // match either "YYYY-MM" or "شهر X" pattern — try date-based first
                if (payMonth.startsWith(currentMonthKey.slice(0, 4))) {
                    const d = new Date(p.date ?? '');
                    if (!isNaN(d.getTime())) {
                        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        return key === currentMonthKey;
                    }
                }
                return false;
            });
            return total + monthPayments.reduce((s, p) => s + (p.amount ?? 0), 0);
        }, 0);
    }, [activeStudents, currentMonthKey]);

    // Revenue for last 6 months (based on payment date)
    const last6Months = useMemo(() => getLast6Months(), []);
    const barData = useMemo(() => {
        return last6Months.map(({ key, label }) => {
            const revenue = activeStudents.reduce((total, s) => {
                const monthTotal = (s.payments ?? []).reduce((acc, p) => {
                    const d = new Date(p.date ?? '');
                    if (!isNaN(d.getTime())) {
                        const pKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        if (pKey === key) return acc + (p.amount ?? 0);
                    }
                    return acc;
                }, 0);
                return total + monthTotal;
            }, 0);
            return { label, revenue };
        });
    }, [activeStudents, last6Months]);

    // Grade distribution
    const gradeData = useMemo(() => {
        const counts: Record<string, number> = {};
        activeStudents.forEach((s) => {
            counts[s.grade] = (counts[s.grade] ?? 0) + 1;
        });
        return Object.entries(counts).map(([grade, count]) => ({
            name: GRADE_LABELS[grade] ?? grade,
            value: count,
        }));
    }, [activeStudents]);

    // Recent students (last 5)
    const recentStudents = useMemo(
        () =>
            [...activeStudents]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5),
        [activeStudents]
    );

    // Alert counts
    const noTeacherCount = useMemo(
        () => activeStudents.filter((s) => !s.missId).length,
        [activeStudents]
    );
    const noClassCount = useMemo(
        () => activeStudents.filter((s) => !s.classId).length,
        [activeStudents]
    );
    const noPaymentThisMonthCount = useMemo(() => {
        return activeStudents.filter((s) => {
            const hasPaymentThisMonth = (s.payments ?? []).some((p) => {
                const d = new Date(p.date ?? '');
                if (!isNaN(d.getTime())) {
                    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    return k === currentMonthKey;
                }
                return false;
            });
            return !hasPaymentThisMonth;
        }).length;
    }, [activeStudents, currentMonthKey]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={48} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>

            {/* ── Header ── */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    🏠 لوحة التحكم الرئيسية
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    مرحباً، هذا ملخص شامل لأحدث البيانات في النظام
                </Typography>
            </Box>

            {/* ── Stats Cards ── */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="إجمالي الطلاب"
                        value={activeStudents.length}
                        icon={<SchoolIcon />}
                        color={theme.palette.primary.main}
                        subtitle="طالب نشط في النظام"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="المعلمون"
                        value={teachers?.length ?? 0}
                        icon={<PeopleIcon />}
                        color="#7C3AED"
                        subtitle="معلم/ة مسجل في النظام"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="إيرادات هذا الشهر"
                        value={`${currentMonthRevenue.toLocaleString()} جم`}
                        icon={<MoneyIcon />}
                        color="#059669"
                        subtitle={MONTH_LABELS_AR[new Date().getMonth()]}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="الفصول الدراسية"
                        value={classes?.length ?? 0}
                        icon={<ClassIcon />}
                        color="#2563EB"
                        subtitle="فصل مسجل في النظام"
                    />
                </Grid>
            </Grid>

            {/* ── Charts Row ── */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Bar Chart */}
                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                📈 الإيرادات - آخر 6 أشهر
                            </Typography>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                                    <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                                    <Tooltip
                                        formatter={(value: number) => [`${value.toLocaleString()} جم`, 'الإيرادات']}
                                        contentStyle={{
                                            borderRadius: 8,
                                            border: `1px solid ${theme.palette.divider}`,
                                            direction: 'rtl',
                                        }}
                                    />
                                    <Bar dataKey="revenue" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pie Chart */}
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                🎓 توزيع الطلاب حسب المرحلة
                            </Typography>
                            {gradeData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={gradeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={90}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {gradeData.map((_, index) => (
                                                <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => [`${value} طالب`, '']} />
                                        <Legend iconType="circle" iconSize={10} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
                                    <Typography color="text.secondary" variant="body2">لا توجد بيانات بعد</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ── Bottom Row: Recent Students + Alerts + Quick Actions ── */}
            <Grid container spacing={3}>
                {/* Recent Students */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    👶 آخر الطلاب المضافين
                                </Typography>
                                <Button
                                    size="small"
                                    endIcon={<ArrowIcon />}
                                    onClick={() => navigate('/admin/students')}
                                    sx={{ fontSize: '0.75rem' }}
                                >
                                    عرض الكل
                                </Button>
                            </Box>
                            {recentStudents.length === 0 ? (
                                <Alert severity="info">لا يوجد طلاب مسجلون بعد</Alert>
                            ) : (
                                <List disablePadding>
                                    {recentStudents.map((student, index) => (
                                        <Box key={student._id}>
                                            <ListItem sx={{ px: 0, py: 1.2 }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: alpha(PIE_COLORS[index % PIE_COLORS.length], 0.15),
                                                            color: PIE_COLORS[index % PIE_COLORS.length],
                                                            fontWeight: 'bold',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {student.name.charAt(0)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {student.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                                                            <Chip
                                                                label={GRADE_LABELS[student.grade] ?? student.grade}
                                                                size="small"
                                                                sx={{ height: 18, fontSize: '0.65rem' }}
                                                            />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {student.missId
                                                                    ? `م/ ${(student.missId as any).name}`
                                                                    : 'بدون معلمة'}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                                    {new Date(student.createdAt).toLocaleDateString('ar-EG', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}
                                                </Typography>
                                            </ListItem>
                                            {index < recentStudents.length - 1 && <Divider />}
                                        </Box>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Alerts + Quick Actions */}
                <Grid item xs={12} md={7}>
                    <Grid container spacing={3} direction="column" sx={{ height: '100%' }}>
                        {/* Alerts */}
                        <Grid item>
                            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        ⚠️ تنبيهات تحتاج انتباهك
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        <Grid item xs={12}>
                                            <AlertCard
                                                title="بدون دفعة هذا الشهر"
                                                count={noPaymentThisMonthCount}
                                                icon={<WarningIcon />}
                                                color="warning"
                                                actionLabel="التفاصيل"
                                                onAction={() => navigate('/admin/payments')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <AlertCard
                                                title="بدون معلمة مسؤولة"
                                                count={noTeacherCount}
                                                icon={<PersonOffIcon />}
                                                color="error"
                                                actionLabel="تعديل"
                                                onAction={() => navigate('/admin/students')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <AlertCard
                                                title="بدون فصل دراسي"
                                                count={noClassCount}
                                                icon={<HomeWorkIcon />}
                                                color="info"
                                                actionLabel="تعديل"
                                                onAction={() => navigate('/admin/students')}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Quick Actions */}
                        <Grid item>
                            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        ⚡ وصول سريع
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        {[
                                            {
                                                label: 'إدارة الطلاب',
                                                icon: <SchoolIcon />,
                                                color: theme.palette.primary.main,
                                                path: '/admin/students',
                                            },
                                            {
                                                label: 'إدارة المعلمين',
                                                icon: <PeopleIcon />,
                                                color: '#7C3AED',
                                                path: '/admin/teachers',
                                            },
                                            {
                                                label: 'المدفوعات',
                                                icon: <PaymentIcon />,
                                                color: '#059669',
                                                path: '/admin/payments',
                                            },
                                            {
                                                label: 'الفصول',
                                                icon: <ClassIcon />,
                                                color: '#2563EB',
                                                path: '/admin/classes',
                                            },
                                        ].map((action) => (
                                            <Grid item xs={6} key={action.label}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={action.icon}
                                                    onClick={() => navigate(action.path)}
                                                    sx={{
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        borderColor: alpha(action.color, 0.35),
                                                        color: action.color,
                                                        bgcolor: alpha(action.color, 0.04),
                                                        fontWeight: 'medium',
                                                        '&:hover': {
                                                            bgcolor: alpha(action.color, 0.1),
                                                            borderColor: action.color,
                                                        },
                                                    }}
                                                >
                                                    {action.label}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}