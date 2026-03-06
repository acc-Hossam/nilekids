import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    List,
    CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, LibraryBooks as LessonIcon, Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import type { Lesson } from '../api/subject';
import { useSubjects, useAddLesson, useDeleteLesson } from '../hooks/useSubject';

interface ManageLessonsDialogProps {
    open: boolean;
    onClose: () => void;
    subjectId: string | null;
}

export default function ManageLessonsDialog({ open, onClose, subjectId }: ManageLessonsDialogProps) {
    // Pull live data from the query cache so UI updates immediately after mutation
    const { data: subjects, isLoading } = useSubjects();
    const subject = subjects?.find((s) => s._id === subjectId) ?? null;

    const addMutation = useAddLesson();
    const deleteMutation = useDeleteLesson();

    const [tab, setTab] = useState<'list' | 'add'>('list');
    const [formData, setFormData] = useState({ title: '', description: '', videoUrl: '', pdfUrl: '' });

    const handleAdd = async () => {
        if (!subject) return;
        try {
            await addMutation.mutateAsync({
                subjectId: subject._id,
                data: {
                    title: formData.title,
                    description: formData.description,
                    contents: [
                        ...(formData.videoUrl ? [{ type: 'Video', url: formData.videoUrl }] : []),
                        ...(formData.pdfUrl ? [{ type: 'PDF', url: formData.pdfUrl }] : []),
                    ]
                }
            });
            setFormData({ title: '', description: '', videoUrl: '', pdfUrl: '' });
            setTab('list');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (lessonId: string) => {
        if (!subject) return;
        if (window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
            try {
                await deleteMutation.mutateAsync({ subjectId: subject._id, lessonId });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleClose = () => {
        setTab('list');
        setFormData({ title: '', description: '', videoUrl: '', pdfUrl: '' });
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LessonIcon color="primary" />
                    <Typography variant="h6">
                        دروس مادة: {subject?.name ?? '...'}
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, display: 'flex', gap: 2 }}>
                <Button
                    onClick={() => setTab('list')}
                    sx={{ borderBottom: tab === 'list' ? 2 : 0, borderRadius: 0, pb: 1 }}
                    color={tab === 'list' ? 'primary' : 'inherit'}
                >
                    قائمة الدروس
                </Button>
                <Button
                    onClick={() => setTab('add')}
                    sx={{ borderBottom: tab === 'add' ? 2 : 0, borderRadius: 0, pb: 1 }}
                    color={tab === 'add' ? 'primary' : 'inherit'}
                >
                    اضافة درس
                </Button>
            </Box>

            <DialogContent dividers sx={{ minHeight: 300 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : tab === 'list' ? (
                    subject?.lessons && subject.lessons.length > 0 ? (
                        <List sx={{ p: 0 }}>
                            {subject.lessons.map((lesson: Lesson, index: number) => (
                                <Paper key={lesson._id} elevation={1} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {index + 1}. {lesson.title}
                                            </Typography>
                                            {lesson.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {lesson.description}
                                                </Typography>
                                            )}
                                            {lesson.contents && lesson.contents.length > 0 && (
                                                <Box sx={{ mt: 1 }}>
                                                    {lesson.contents.map((c, i) => (
                                                        <Typography
                                                            key={i}
                                                            variant="caption"
                                                            display="block"
                                                            sx={{ color: c.type === 'PDF' ? 'error.main' : 'primary.main', wordBreak: 'break-all' }}
                                                        >
                                                            {c.type === 'PDF' ? '📄' : '🎬'} {c.type}: {c.url}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            disabled={deleteMutation.isPending}
                                            onClick={() => handleDelete(lesson._id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Typography color="text.secondary">لا توجد دروس مضافة لهذه المادة بعد.</Typography>
                        </Box>
                    )
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <TextField
                            label="عنوان الدرس"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="وصف الدرس (اختياري)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="رابط الفيديو (اختياري)"
                            placeholder="https://youtube.com/..."
                            value={formData.videoUrl}
                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            fullWidth
                            dir="ltr"
                            InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1 }}>🎬</Box> }}
                        />
                        <TextField
                            label="رابط الـ PDF (اختياري)"
                            placeholder="https://example.com/file.pdf"
                            value={formData.pdfUrl}
                            onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                            fullWidth
                            dir="ltr"
                            InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1 }}>📄</Box> }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAdd}
                            disabled={!formData.title || addMutation.isPending}
                        >
                            {addMutation.isPending ? 'جاري الحفظ...' : 'حفظ الدرس'}
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
