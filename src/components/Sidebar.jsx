import React from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, Toolbar,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HubIcon from '@mui/icons-material/Hub';
import StorageIcon from '@mui/icons-material/Storage';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';
import DescriptionIcon from '@mui/icons-material/Description';
import RuleIcon from '@mui/icons-material/Rule';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import { logout } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const drawerWidth = 240;

const items = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['all'] },
  { label: 'Connectors', icon: <HubIcon />, path: '/connectors', roles: ['data_engineer'] },
  { label: 'Datasets', icon: <StorageIcon />, path: '/datasets', roles: ['data_engineer', 'data_steward'] },
  { label: 'Rule Books', icon: <DescriptionIcon />, path: '/rule-books', roles: ['business_analyst', 'data_steward'] },
  { label: 'Data Quality History', icon: <RuleIcon />, path: '/data-quality-history', roles: ['data_steward'] },
  { label: 'Technical Anomalies', icon: <FormatListBulletedIcon />, path: '/technical-anomalies', roles: ['data_steward'] },
  { label: 'AI Business Rules', icon: <AutoFixHighIcon />, path: '/ai-business-rules', roles: ['business_analyst'] },
  { label: 'Validation Results', icon: <PlaylistAddCheckIcon />, path: '/business-validation-results', roles: ['business_analyst', 'data_steward'] },
  { label: 'Remediation Workflow', icon: <ManageHistoryIcon />, path: '/remediation-workflow', roles: ['compliance_officer', 'data_steward'] },
  { label: 'Alerts', icon: <NotificationsActiveIcon />, path: '/alerts', roles: ['all'] },
  { label: 'Notifications', icon: <NotificationsIcon />, path: '/notifications', roles: ['all'] },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['all'] },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userRole = user?.role || 'viewer';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            DQ Sentinel
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List sx={{ px: 1 }}>
          {items.filter(item => item.roles.includes('all') || item.roles.includes(userRole)).map((item) => {
            const selected = item.path === '/dashboard' 
              ? (location.pathname === '/dashboard' || location.pathname === '/')
              : location.pathname.startsWith(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={selected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: selected ? 'inherit' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 600 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Divider />
      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
export { drawerWidth };
