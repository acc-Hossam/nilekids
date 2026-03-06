import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Box, Drawer, List, ListItemButton, ListItemText, ListItemIcon, Typography, AppBar, Toolbar } from '@mui/material';
import { Dashboard, People, School, MeetingRoom, MenuBook as BookIcon, Payment as PaymentIcon } from '@mui/icons-material';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import TeachersList from './pages/admin/TeachersList';
import StudentsList from './pages/admin/StudentsList';
import ClassesList from './pages/admin/ClassesList';
import SubjectsList from './pages/admin/SubjectsList';
import PaymentsPage from './pages/admin/PaymentsPage';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentProfile from './pages/student/Profile';


function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>جاري التحميل...</Typography>
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        <Route path="/admin/*" element={
          user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<TeachersList />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="classes" element={<ClassesList />} />
          <Route path="subjects" element={<SubjectsList />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        <Route path="/teacher/*" element={
          user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" />
        } />

        <Route path="/student/*" element={
          user?.role === 'student' ? <StudentProfile /> : <Navigate to="/login" />
        } />

        <Route path="/" element={
          user ? (
            user.role === 'admin' ? <Navigate to="/admin" /> :
              user.role === 'teacher' ? <Navigate to="/teacher" /> :
                <Navigate to="/student" />
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

// ============================================================
// Admin Layout
// ============================================================
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'الرئيسية', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'المعلمين', icon: <People />, path: '/admin/teachers' },
    { text: 'الطلاب', icon: <School />, path: '/admin/students' },
    { text: 'الفصول', icon: <MeetingRoom />, path: '/admin/classes' },
    { text: 'المواد الدراسية', icon: <BookIcon />, path: '/admin/subjects' },
    { text: 'المدفوعات', icon: <PaymentIcon />, path: '/admin/payments' },
  ];

  return (
    <Box sx={{ display: 'flex', direction: 'rtl' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <img src="/vite.svg" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <Typography marginRight="50px" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nile Kids Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* spacer */}
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;