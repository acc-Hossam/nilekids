import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, CircularProgress, Alert, Avatar,
  Chip, Dialog, DialogTitle, DialogContent, IconButton, Button,
  Grid, Divider, useTheme, alpha
} from '@mui/material';
import {
  MenuBook as BookIcon, School as SchoolIcon, Close as CloseIcon,
  LibraryBooks as LessonIcon, PlayCircleOutline as VideoIcon,
  StarRate as StarIcon, Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMySubjects } from '../../hooks/useSubject';
import { useMyProfile, useMyEvaluations } from '../../hooks/useStudent';
import { useAuth } from '../../contexts/AuthContext';
import type { Subject, Lesson } from '../../api/subject';

// ─── Grade colour helper ──────────────────────────────────────
function gradeColor(grade: number, theme: any) {
  if (grade >= 85) return theme.palette.success.main;
  if (grade >= 65) return theme.palette.warning.main;
  return theme.palette.error.main;
}

export default function StudentProfile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: subjectsData, isLoading: subjectsLoading } = useMySubjects();
  const { data: evalsData, isLoading: evalsLoading } = useMyEvaluations();

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const isLoading = profileLoading || subjectsLoading || evalsLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2, background: 'linear-gradient(-45deg, #FDFBFB 0%, #EBEDEE 100%)' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">جاري تحضير ملفك الشخصي يا بطل...</Typography>
      </Box>
    );
  }

  const subjects = subjectsData?.subjects || [];
  const evaluations = evalsData?.evaluations || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', direction: 'rtl' }}>

      {/* ── HEADER ── */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #6C9BCF 0%, #A18CD1 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(108, 155, 207, 0.3)'
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative' }}>
          {/* Logout Button */}
          <IconButton
            onClick={handleLogout}
            sx={{ position: 'absolute', top: 16, left: 16, color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
          >
            <LogoutIcon />
          </IconButton>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, flexWrap: 'wrap', textAlign: { xs: 'center', sm: 'right' } }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
              // src={profile?.img} 
              // sx={{ 
              //   width: 100, 
              //   height: 100, 
              //   bgcolor: 'white', 
              //   color: 'primary.main',
              //   border: '4px solid rgba(255,255,255,0.8)',
              //   boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              // }}
              >
                <SchoolIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Box sx={{ position: 'absolute', bottom: -5, right: -5, bgcolor: '#FFD93D', borderRadius: '50%', p: 0.5 }}>
                <TrophyIcon sx={{ color: '#D97706', fontSize: 28 }} />
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h3" fontWeight="900" sx={{ mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                مرحباً يا بطل، {profile?.name || user?.name}! 🌟
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label={`الصف: ${profile?.grade || 'غير محدد'}`} sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 'bold', px: 1, fontSize: '1rem' }} />
                <Chip label={`كود الطالب: ${profile?.studentId || '---'}`} sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 'bold', px: 1, fontSize: '1rem' }} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={4}>

        {/* ── LEFT COLUMN: EVALUATIONS & TEACHER ── */}
        <Grid size={{ xs: 12, md: 4 }}>

          {/* TEACHER INFO */}
          <Card elevation={0} sx={{ borderRadius: 4, mb: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.secondary.main, 0.1), display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="secondary.dark">معلمتي</Typography>
            </Box>
            <CardContent>
              {profile?.missId ? (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>أ. {profile.missId.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{profile.missId.specialty || 'معلمة فصل'}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {profile.missId.contact?.phone && <Chip size="small" label={profile.missId.contact.phone} />}
                    {profile.missId.contact?.email && <Chip size="small" label={profile.missId.contact.email} />}
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary">لم يتم تعيين معلمة بعد.</Typography>
              )}
            </CardContent>
          </Card>

          {/* EVALUATIONS */}
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.success.main, 0.1), display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'success.main', color: 'white' }}>
                <StarIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="success.dark">أحدث التقييمات</Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              {evaluations.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">لا توجد تقييمات مسجلة بعد. استمر في الاجتهاد! 💪</Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {[...evaluations].reverse().slice(0, 5).map((ev, i) => {
                    const c = gradeColor(ev.grade, theme);
                    return (
                      <Box key={i} sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 }, '&:hover': { bgcolor: alpha(c, 0.04) }, transition: '0.2s' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                              width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              bgcolor: alpha(c, 0.15), color: c, fontWeight: '900', fontSize: '1.2rem', boxShadow: `0 4px 10px ${alpha(c, 0.2)}`
                            }}>
                              {ev.grade}%
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {ev.createdAt ? new Date(ev.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }) : 'تقييم جديد'}
                              </Typography>
                              <Typography fontWeight="bold" sx={{ color: c }}>
                                {ev.grade >= 85 ? 'ممتاز بطل! 🌟' : ev.grade >= 65 ? 'أحسنت 👍' : 'حاول أكثر! ⚠️'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 1.5, borderRadius: 2, fontStyle: 'italic' }}>
                          "{ev.notes}"
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>

        </Grid>

        {/* ── RIGHT COLUMN: SUBJECTS & LESSONS ── */}
        <Grid size={{ xs: 12, md: 8 }}>

          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}>
            <BookIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            موادي الدراسية ({subjects.length})
          </Typography>

          {subjects.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 3, fontSize: '1.1rem' }}>
              لا توجد مواد مقيدة لك في صفك الدراسي حتى الآن.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {subjects.map((subject) => (
                <Grid size={{ xs: 12, sm: 6 }} key={subject._id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 12px 28px rgba(108, 155, 207, 0.2)',
                        borderColor: 'primary.light'
                      }
                    }}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <Box sx={{ height: 8, background: 'linear-gradient(90deg, #6C9BCF, #A18CD1)' }} />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" fontWeight="900" color="text.primary">
                          {subject.name}
                        </Typography>
                        <Chip
                          icon={<LessonIcon sx={{ fontSize: '1rem !important' }} />}
                          label={`${subject.lessons?.length || 0} درس`}
                          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 'bold' }}
                        />
                      </Box>

                      {subject.teacherId && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.light', fontSize: '0.8rem' }}>
                            {typeof subject.teacherId === 'object' ? subject.teacherId.name.charAt(0) : 'أ'}
                          </Avatar>
                          <Typography variant="body2" color="text.secondary" fontWeight="500">
                            أ. {typeof subject.teacherId === 'object' ? subject.teacherId.name : 'غير محدد'}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

        </Grid>
      </Grid>

      {/* ── LESSONS DIALOG ── */}
      <Dialog
        open={Boolean(selectedSubject)}
        onClose={() => setSelectedSubject(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #6C9BCF 0%, #A18CD1 100%)',
          color: 'white',
          p: 3,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 2 }}>
              <LessonIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">{selectedSubject?.name}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                {selectedSubject?.lessons?.length || 0} دروس متاحة
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setSelectedSubject(null)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: '#F9FAFB', p: { xs: 2, sm: 4 }, minHeight: 400 }}>
          {selectedSubject?.lessons && selectedSubject.lessons.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {selectedSubject.lessons.map((lesson: Lesson, index: number) => (
                <Card key={lesson._id} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {index + 1}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color="text.primary">
                        {lesson.title}
                      </Typography>
                    </Box>

                    {lesson.description && (
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, px: { xs: 0, sm: 7 } }}>
                        {lesson.description}
                      </Typography>
                    )}

                    {lesson.contents && lesson.contents.length > 0 && (
                      <Box sx={{ px: { xs: 0, sm: 7 } }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, color: 'text.primary' }}>
                          مرفقات الدرس:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {lesson.contents.map((content, i) => (
                            <Button
                              key={i}
                              variant={content.type === 'PDF' ? "outlined" : "contained"}
                              color={content.type === 'PDF' ? "error" : "primary"}
                              size="medium"
                              startIcon={content.type === 'PDF' ? <BookIcon /> : <VideoIcon />}
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                borderRadius: 3,
                                px: 3,
                                boxShadow: content.type !== 'PDF' ? '0 4px 10px rgba(108, 155, 207, 0.3)' : 'none'
                              }}
                            >
                              {content.type === 'PDF' ? 'تحميل الملف' : 'مشاهدة الفيديو'}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <LessonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" fontWeight="500">
                لا توجد دروس متاحة حالياً في هذه المادة.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
}