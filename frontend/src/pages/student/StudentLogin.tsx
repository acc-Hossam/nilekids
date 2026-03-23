import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  InputAdornment, 
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  PersonOutline, 
  LockOpenOutlined
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import { keyframes } from '@emotion/react';

// Animations

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const slideUpAnimation = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseBgAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function StudentLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: 'student' as const
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('loginPage', '/student-login');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authApi.login(credentials);
      const user = { id: response.userId, role: response.role, name: response.name };
      login(user, response.token);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من اسم المستخدم وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(-45deg, #FF9A9E, #FECFEF, #A18CD1, #FBC2EB)',
        backgroundSize: '400% 400%',
        animation: `${pulseBgAnimation} 15s ease infinite`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Circles */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '30%', height: '30%', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', filter: 'blur(40px)', animation: `${floatAnimation} 6s ease-in-out infinite` }} />
      <Box sx={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', filter: 'blur(50px)', animation: `${floatAnimation} 8s ease-in-out infinite reverse` }} />
      <Box sx={{ position: 'absolute', top: '20%', right: '15%', width: '15%', height: '15%', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)', filter: 'blur(30px)', animation: `${floatAnimation} 5s ease-in-out infinite` }} />

      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, sm: 6 }, 
          width: '100%',
          maxWidth: 480, 
          direction: 'rtl',
          borderRadius: 6,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          zIndex: 1,
          animation: `${slideUpAnimation} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
          <Box 
            sx={{ 
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 10px 20px rgba(108, 155, 207, 0.3)',
              mb: 2,
              animation: `${floatAnimation} 3s ease-in-out infinite`
            }}
          >
            {/* <SchoolIcon sx={{ fontSize: 48 }} /> */}
          <img src="vite.svg" alt=""  style={{ width: 48 }} />
          </Box>
          {/* <Typography variant="h3" fontWeight="900" sx={{ 
            background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            letterSpacing: '-1px'
          }}>
            بوابة الطلاب
          </Typography> */}
          <Typography variant="subtitle1" color="text.secondary" fontWeight="500">
            أهلاً بك يا بطل! 👋 سجل دخولك لمتابعة دروسك وتقييماتك
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 3, 
              fontWeight: 'bold',
              bgcolor: 'rgba(253, 237, 237, 0.9)',
              border: '1px solid #fecaca'
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="اسم المستخدم"
            variant="outlined"
            size="medium"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline color="primary" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.7)' }
            }}
            sx={{ mb: 3 }}
            required
            autoComplete="username"
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="كلمة المرور"
            variant="outlined"
            size="medium"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpenOutlined color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.7)' }
            }}
            sx={{ mb: 4 }}
            required
            autoComplete="current-password"
          />

          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            type="submit"
            disabled={loading}
            sx={{ 
              borderRadius: 4, 
              py: 1.8, 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
              boxShadow: '0 10px 20px rgba(142, 45, 226, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 24px rgba(142, 45, 226, 0.4)',
                background: 'linear-gradient(45deg, #3A00B0, #7E1DD2)'
              }
            }}
          >
            {loading ? <CircularProgress size={28} color="inherit" /> : 'دخول المنصة 🚀'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
