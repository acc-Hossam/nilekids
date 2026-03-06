import { useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Avatar, Chip, Dialog, DialogTitle, DialogContent, IconButton, Paper, Button } from '@mui/material';
import { MenuBook as BookIcon, School as SchoolIcon, Close as CloseIcon, LibraryBooks as LessonIcon, PlayCircleOutline as VideoIcon } from '@mui/icons-material';
import { useMySubjects } from '../../hooks/useSubject';
import { useAuth } from '../../contexts/AuthContext';
import type { Subject, Lesson } from '../../api/subject';

export default function StudentProfile() {
  const { user } = useAuth();
  const { data, isLoading, error } = useMySubjects();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">حدث خطأ أثناء تحميل البيانات</Alert>;

  const subjects = data?.subjects || [];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
          <SchoolIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">مرحباً بكل بطل!</Typography>
          <Typography color="text.secondary">هذه هي موادك الدراسية يا {user?.name || 'طالب'}:</Typography>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BookIcon color="secondary" />
        المواد المقررة عليك
      </Typography>

      {subjects.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          لا توجد مواد مقيدة لك في صفك الدراسي حتى الآن.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {subjects.map((subject) => (
            <Card
              key={subject._id}
              sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4, cursor: 'pointer', transform: 'translateY(-4px)' }, transition: '0.3s' }}
              onClick={() => setSelectedSubject(subject)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {subject.name}
                  </Typography>
                  <Chip size="small" label={`${subject.lessons?.length || 0} دروس`} color="secondary" variant="filled" />
                </Box>

                {subject.teacherId && (
                  <Typography variant="body2" color="text.secondary">
                    المعلم: {typeof subject.teacherId === 'object' ? subject.teacherId.name : 'غير محدد'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Lessons View Dialog */}
      <Dialog open={Boolean(selectedSubject)} onClose={() => setSelectedSubject(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LessonIcon />
            <Typography variant="h6">دروس مادة: {selectedSubject?.name}</Typography>
          </Box>
          <IconButton onClick={() => setSelectedSubject(null)} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'background.default', p: 3, minHeight: 400 }}>
          {selectedSubject?.lessons && selectedSubject.lessons.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedSubject.lessons.map((lesson: Lesson, index: number) => (
                <Paper key={lesson._id} sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
                    الدرس {index + 1}: {lesson.title}
                  </Typography>

                  {lesson.description && (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {lesson.description}
                    </Typography>
                  )}

                  {lesson.contents && lesson.contents.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ width: '100%' }}>مرفقات الدرس:</Typography>
                      {lesson.contents.map((content, i) => (
                        <Button
                          key={i}
                          variant="outlined"
                          size="small"
                          startIcon={content.type === 'PDF' ? <span>📄</span> : <VideoIcon />}
                          color={content.type === 'PDF' ? 'error' : 'primary'}
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {content.type === 'PDF' ? 'تحميل PDF' : 'مشاهدة الفيديو'}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <LessonIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                لا توجد دروس متاحة حالياً.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}