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

import DescriptionIcon from '@mui/icons-material/Description';
import RuleIcon from '@mui/icons-material/Rule';
import { logout } from '../redux/slices/authSlice';

const drawerWidth = 240;

const items = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Connectors', icon: <HubIcon />, path: '/connectors' },
  { label: 'Dataset Insights', icon: <StorageIcon />, path: '/datasets' },
  { label: 'Knowledge Base', icon: <DescriptionIcon />, path: '/rule-books' },
  { label: 'Data Quality History', icon: <RuleIcon />, path: '/data-quality-history' },
  { label: 'Alerts', icon: <NotificationsActiveIcon />, path: '/alerts' },
  { label: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { label: 'Business Rules (BA)', icon: <DescriptionIcon />, path: '/business-rules' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
          backgroundColor: '#383838',
          color: '#e0e0e0',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/favicon.svg" alt="Logo" width="24" height="24" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            DQ Sentinel
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: '#4a4a4a' }} />
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List sx={{ px: 1 }}>
          {items.map((item) => {
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
                      backgroundColor: '#ff5722 !important',
                      color: '#fff',
                      '& .MuiListItemIcon-root': { color: '#fff' },
                      '&:hover': { backgroundColor: '#e64a19 !important' },
                    },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: selected ? 'inherit' : '#aaa' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 600 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Divider sx={{ borderColor: '#4a4a4a' }} />
      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ 
            borderRadius: 1.5,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
          }}>
            <ListItemIcon sx={{ minWidth: 36, color: '#aaa' }}>
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
