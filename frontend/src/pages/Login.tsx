import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: 'admin' as 'admin' | 'teacher' | 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authApi.login(credentials);
      const user = { id: response.userId, role: response.role };
      login(user, response.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default' 
    }}>
      <Paper elevation={3} sx={{ p: 4, width: 400, direction: 'rtl' }}>
        <Typography variant="h4" align="center" gutterBottom>
          🎓 Nile Kids
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          نظام إدارة الحضانة
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>نوع المستخدم</InputLabel>
            <Select
              value={credentials.role}
              label="نوع المستخدم"
              onChange={(e) => setCredentials({...credentials, role: e.target.value as any})}
            >
              <MenuItem value="admin">مدير النظام</MenuItem>
              <MenuItem value="teacher">معلمة</MenuItem>
              <MenuItem value="student">طالب</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="اسم المستخدم"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="كلمة المرور"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            sx={{ mb: 3 }}
          />

          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            type="submit"
            disabled={loading}
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>

        <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          admin / admin123 | teacher_sarah / pass123 | student_ali / pass123
        </Typography>
      </Paper>
    </Box>
  );
}