import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, Box, Card, CardContent, TextField, Button, Typography,
  Alert, InputAdornment, IconButton, Stack, useTheme
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../../redux/slices/authSlice';

const Login = ({ open = true, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const { loading, error, token } = useSelector((s) => s.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (token) {
      if (onSuccess) onSuccess();
      else navigate('/dashboard', { replace: true });
    }
  }, [token, navigate, onSuccess]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) {
      if (onSuccess) onSuccess();
      else navigate('/dashboard', { replace: true });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: 3, 
          boxShadow: isDark ? 'none' : '0 20px 60px rgba(0,0,0,0.1)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
          backgroundImage: 'none',
          bgcolor: isDark ? '#2a2a2a' : '#FFFFFF',
        } 
      }}
      slotProps={{
        backdrop: {
          sx: {
            background: isDark 
              ? 'radial-gradient(circle at center, #2b221d 0%, #26201e 50%, #2b211d 100%)' 
              : 'radial-gradient(circle at center, rgb(255, 237, 242) 0%, #FFFFFF 100%)',
          }
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 64, height: 64, borderRadius: 2,
              bgcolor: 'primary.main', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <img src="/favicon.svg" alt="Logo" width="36" height="36" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>DQ Sentinel</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            AI-Powered Data Quality, Governance &amp; Observability
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Password"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd((s) => !s)} edge="end" size="small">
                      {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !username || !password}
              fullWidth
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Typography variant="caption" align="center" color="text.secondary">
              Default credentials: <strong>admin / Admin@123</strong>
            </Typography>
          </Stack>
        </form>
      </CardContent>
    </Dialog>
  );
};

export default Login;
