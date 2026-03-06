import { useState } from 'react';
import {
    Box, Typography, Paper, TextField, Button, MenuItem,
    CircularProgress, Alert, Chip, IconButton,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
    Payment as PaymentIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useAllStudentsPayments, useAddPayment, useDeletePayment } from '../../hooks/usePayment';
import type { StudentPaymentSummary } from '../../api/payment';

const MONTHS = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];
const YEARS = ['2024', '2025', '2026'];
const TYPES = ['رسوم شهرية', 'كتب', 'أنشطة', 'رسوم تسجيل', 'أخرى'];

export default function PaymentsPage() {
    const { data: students, isLoading, error } = useAllStudentsPayments();
    const addPayment = useAddPayment();
    const deletePayment = useDeletePayment();

    const [selectedStudent, setSelectedStudent] = useState<StudentPaymentSummary | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({ amount: '', monthName: 'يناير', year: '2025', type: 'رسوم شهرية' });
    const [errorMsg, setErrorMsg] = useState('');

    const handleOpenDialog = (student: StudentPaymentSummary) => {
        setSelectedStudent(student);
        setOpenDialog(true);
        setErrorMsg('');
    };

    const handleAdd = async () => {
        if (!selectedStudent || !form.amount) {
            setErrorMsg('الرجاء إدخال المبلغ');
            return;
        }
        const month = form.monthName + ' ' + form.year;
        try {
            await addPayment.mutateAsync({
                studentId: selectedStudent._id,
                amount: Number(form.amount),
                month,
                type: form.type,
            });
            setForm({ amount: '', monthName: 'يناير', year: '2025', type: 'رسوم شهرية' });
            setOpenDialog(false);
        } catch (e: any) {
            setErrorMsg(e?.response?.data?.message || 'حدث خطأ');
        }
    };

    const handleDelete = async (studentId: string, paymentId: string) => {
        await deletePayment.mutateAsync({ studentId, paymentId });
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">حدث خطأ في تحميل بيانات المدفوعات</Alert>;

    const studentList = students ?? [];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <WalletIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                    <Typography variant="h4" fontWeight="bold">المدفوعات</Typography>
                    <Typography color="text.secondary">إدارة مدفوعات الطلاب الشهرية</Typography>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الطالب</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الصف</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>المدفوعات</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الإجمالي</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>إضافة</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentList.map((student) => {
                            const total = student.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
                            return (
                                <TableRow key={student._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                    <TableCell>
                                        <Typography fontWeight="medium">{student.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{student.studentId}</Typography>
                                    </TableCell>
                                    <TableCell>{student.grade}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 400 }}>
                                            {student.payments.length === 0 ? (
                                                <Typography variant="caption" color="text.secondary">لا توجد دفعات</Typography>
                                            ) : (
                                                student.payments.map((p) => (
                                                    <Box key={p._id} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Chip
                                                            size="small"
                                                            label={p.month + ' \u2014 ' + p.amount + ' \u062c.\u0645'}
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            sx={{ ml: 0.5 }}
                                                            disabled={deletePayment.isPending}
                                                            onClick={() => handleDelete(student._id, p._id)}
                                                        >
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Box>
                                                ))
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="bold" color={total > 0 ? 'success.main' : 'text.secondary'}>
                                            {total.toLocaleString()} ج.م
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenDialog(student)}>
                                            إضافة
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaymentIcon color="primary" />
                    {'إضافة دفعة — ' + (selectedStudent?.name ?? '')}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                        <TextField
                            label="المبلغ (ج.م)"
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="الشهر"
                                select
                                value={form.monthName}
                                onChange={(e) => setForm({ ...form, monthName: e.target.value })}
                                fullWidth
                            >
                                {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                            </TextField>
                            <TextField
                                label="السنة"
                                select
                                value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                fullWidth
                            >
                                {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                            </TextField>
                        </Box>

                        <TextField
                            label="نوع الدفع"
                            select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            fullWidth
                        >
                            {TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">إلغاء</Button>
                    <Button
                        variant="contained"
                        onClick={handleAdd}
                        disabled={addPayment.isPending}
                        startIcon={<AddIcon />}
                    >
                        {addPayment.isPending ? 'جاري الحفظ...' : 'تسجيل الدفع'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
