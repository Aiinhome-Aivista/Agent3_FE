import React, { useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Stack,
  Alert, Chip, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  Avatar, LinearProgress
} from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorageIcon from '@mui/icons-material/Storage';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboard } from '../../redux/slices/dashboardSlice';
import Loader from '../../components/Loader';
import AlertTable from '../../components/AlertTable';
import { keyframes } from '@mui/system';
import { useTheme, alpha } from '@mui/material/styles';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#3b82f6',
  info: '#8b5cf6',
};

const getThemeStyles = (theme) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    bg: isDark ? 'linear-gradient(135deg, #090e17 0%, #111827 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    cardBg: isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    cardBorder: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
    textPrimary: isDark ? '#f9fafb' : '#0f172a',
    textSecondary: isDark ? '#9ca3af' : '#64748b',
    accent: '#0ea5e9',
    inversePrimary: isDark ? '#fff' : '#0f172a'
  };
};

const GlassCard = ({ children, delay = '0s', sx = {} }) => {
  const theme = useTheme();
  const st = getThemeStyles(theme);
  return (
    <Card sx={{
      background: st.cardBg,
      backdropFilter: 'blur(10px)',
      border: st.cardBorder,
      borderRadius: 4,
      color: st.textPrimary,
      boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.05)',
      animation: `${slideUp} 0.5s ease-out forwards`,
      animationDelay: delay,
      opacity: 0,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)'
      },
      ...sx
    }}>
      {children}
    </Card>
  );
};

const GlowingStatCard = ({ icon, label, value, color, delay, onClick }) => {
  const theme = useTheme();
  const st = getThemeStyles(theme);
  return (
    <GlassCard delay={delay} sx={{ cursor: onClick ? 'pointer' : 'default', height: '100%' }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }} onClick={onClick}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Box sx={{
            p: 1.5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
            color: color,
            display: 'flex',
            border: `1px solid ${color}33`
          }}>
            {icon}
          </Box>
          <Typography variant="body2" sx={{ color: st.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </Typography>
        </Stack>
        <Typography variant="h3" sx={{ fontWeight: 800, color: st.textPrimary, textShadow: theme.palette.mode === 'dark' ? `0 0 20px ${color}44` : 'none' }}>
          {value !== undefined ? value : '-'}
        </Typography>
      </CardContent>
    </GlassCard>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const st = getThemeStyles(theme);
  const { data, loading, error } = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading && !data) return (
    <Box sx={{ minHeight: '100vh', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader label="Initializing Control Tower..." />
    </Box>
  );

  const overview = data || {};
  const cards = overview.cards || {};
  const charts = overview.charts || {};
  const recentAlerts = overview.recent_alerts || [];
  const connectorHealth = overview.connector_health || [];
  const recentActivity = overview.recent_activity || [];

  const severityData = (charts.severity || []).map((s) => ({
    name: s.severity.charAt(0).toUpperCase() + s.severity.slice(1),
    value: s.c,
    color: SEVERITY_COLORS[s.severity] || '#6b7280',
  }));

  const trendData = (charts.trend || []).map((t) => ({
    day: t.day ? new Date(t.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-',
    count: t.c,
  }));

  const cardConfigs = [
    { label: 'Connectors', value: cards.total_connectors, icon: <HubIcon />, color: '#6366f1', onClick: () => navigate('/connectors') },
    { label: 'Databricks Assets', value: cards.dataset_count, icon: <StorageIcon />, color: '#0ea5e9', onClick: () => navigate('/datasets') },
    { label: 'Compliance Risks', value: cards.pii_datasets, icon: <PrivacyTipIcon />, color: '#f43f5e', onClick: () => navigate('/compliance') },
    { label: 'Critical Anomalies', value: cards.critical_alerts, icon: <ErrorOutlineIcon />, color: '#f97316', onClick: () => navigate('/alerts') },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: st.bg, p: 4, ml: -3, mr: -3, mt: -3, mb: -3 }}>
      {/* Dynamic Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5, animation: `${slideUp} 0.5s ease-out` }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <DataUsageIcon sx={{ fontSize: 40, color: st.accent, animation: `${pulse} 2s infinite`, borderRadius: '50%' }} />
            <Typography variant="h3" sx={{ fontWeight: 900, color: st.inversePrimary, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Governance Control Tower
            </Typography>
          </Stack>
          <Typography variant="subtitle1" sx={{ color: st.textSecondary, fontWeight: 500, ml: 7 }}>
            Real-time multi-cloud oversight, data quality intelligence, and automated lineage tracking.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => dispatch(fetchDashboard())}
          variant="outlined"
          sx={{
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            color: st.accent,
            borderColor: 'rgba(14, 165, 233, 0.5)',
            '&:hover': { borderColor: st.accent, background: 'rgba(14, 165, 233, 0.1)' }
          }}
        >
          Sync Telemetry
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2, background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {error}
        </Alert>
      )}

      {/* KPI Grid */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {cardConfigs.map((config, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <GlowingStatCard
              delay={`${idx * 0.1}s`}
              icon={config.icon}
              label={config.label}
              value={config.value}
              color={config.color}
              onClick={config.onClick}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={8}>
          <GlassCard delay="0.4s" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: st.inversePrimary }}>AI Validation Velocity</Typography>
                  <Typography variant="caption" sx={{ color: st.textSecondary }}>Incident volume processed by Orchestrator Agent (Last 7 Days)</Typography>
                </Box>
                <TrendingUpIcon sx={{ color: '#10b981' }} />
              </Stack>
              <Box sx={{ height: 320, width: '100%' }}>
                {trendData.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: st.textSecondary }}>Awaiting telemetry streams...</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: st.textSecondary, fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: st.textSecondary, fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', background: 'rgba(17, 24, 39, 0.9)', border: '1px solid rgba(255,255,255,0.1)', color: st.inversePrimary }} />
                      <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorCount)" name="Incidents" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <GlassCard delay="0.5s" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: st.inversePrimary }}>Severity Distribution</Typography>
              <Typography variant="caption" sx={{ color: st.textSecondary, display: 'block', mb: 4 }}>
                Real-time risk composition across datasets
              </Typography>
              <Box sx={{ height: 300 }}>
                {severityData.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: st.textSecondary }}>100% Compliant</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={5} stroke="none">
                        {severityData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', background: 'rgba(17, 24, 39, 0.9)', border: '1px solid rgba(255,255,255,0.1)', color: st.inversePrimary }} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: st.textSecondary }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Operational Streams Row */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={7}>
          <GlassCard delay="0.6s">
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: st.inversePrimary }}>Priority Interventions</Typography>
                  <Typography variant="caption" sx={{ color: st.textSecondary }}>Requires immediate Data Steward attention</Typography>
                </Box>
                <Button size="small" onClick={() => navigate('/alerts')} sx={{ textTransform: 'none', fontWeight: 600, color: st.accent }}>
                  Review All
                </Button>
              </Stack>
              {recentAlerts.length === 0 ? (
                  <Typography sx={{ color: st.textSecondary, textAlign: 'center', py: 4 }}>No pending critical interventions.</Typography>
              ) : (
                <AlertTable alerts={recentAlerts} dense hideAction={true} />
              )}
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Stack spacing={4}>
            {/* Infrastructure Health */}
            <GlassCard delay="0.7s">
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: st.inversePrimary }}>Ecosystem Health</Typography>
                {connectorHealth.length === 0 ? (
                  <Typography sx={{ color: st.textSecondary, textAlign: 'center', py: 2 }} variant="body2">
                    No active ingestion pipelines.
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: st.textSecondary, borderBottom: st.cardBorder, fontWeight: 600 }}>Vector / Node</TableCell>
                        <TableCell sx={{ color: st.textSecondary, borderBottom: st.cardBorder, fontWeight: 600 }}>State</TableCell>
                        <TableCell sx={{ color: st.textSecondary, borderBottom: st.cardBorder, fontWeight: 600 }}>Sync</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {connectorHealth.slice(0, 5).map((c) => (
                        <TableRow key={c.id} sx={{ '& td': { borderBottom: st.cardBorder, color: st.textPrimary }, '&:last-child td': { border: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>{c.name}</Typography>
                              <Chip label={c.type} size="small" sx={{ height: 20, fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', color: st.inversePrimary }} />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.status === 'Connected' ? '#10b981' : '#ef4444', boxShadow: `0 0 10px ${c.status === 'Connected' ? '#10b981' : '#ef4444'}` }} />
                              <Typography variant="caption">{c.status}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: st.textSecondary }}>
                              {c.last_scanned_at ? new Date(c.last_scanned_at).toLocaleDateString() : '-'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </GlassCard>

            {/* AI Agent Telemetry Stream */}
            <GlassCard delay="0.8s">
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: st.inversePrimary }}>Agent Telemetry</Typography>
                  <Button size="small" onClick={() => navigate('/monitoring')} sx={{ textTransform: 'none', fontWeight: 600, color: st.accent }}>
                    Pipeline Logs
                  </Button>
                </Stack>
                <Stack spacing={2.5}>
                  {recentActivity.length === 0 ? (
                    <Typography sx={{ color: st.textSecondary, textAlign: 'center', py: 2 }} variant="body2">
                      Agent pool idle.
                    </Typography>
                  ) : (
                    recentActivity.slice(0, 4).map((r) => (
                      <Box key={r.id} sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: r.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: r.status === 'success' ? '#10b981' : '#ef4444', fontSize: '0.75rem', border: `1px solid ${r.status === 'success' ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}` }}>
                          {r.run_type?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: st.inversePrimary }}>
                              {r.dataset_name || r.connector_name}
                            </Typography>
                            <Chip label={r.run_type} size="small" sx={{ height: 18, fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', border: 'none' }} />
                          </Stack>
                          <Typography variant="caption" sx={{ display: 'block', color: st.textSecondary, mb: 0.5 }}>
                            {r.connector_name} • {new Date(r.started_at).toLocaleTimeString()}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={r.status === 'success' ? 100 : 45} 
                            sx={{ height: 2, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: r.status === 'success' ? '#10b981' : '#ef4444' } }} 
                          />
                        </Box>
                      </Box>
                    ))
                  )}
                </Stack>
              </CardContent>
            </GlassCard>

            {/* Business User Flow: Certified Gold Datasets */}
            <GlassCard delay="0.9s">
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: st.inversePrimary }}>Certified Datasets (Gold)</Typography>
                  <Chip label="Trust Score: 95%" size="small" sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 'bold' }} />
                </Stack>
                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, border: st.cardBorder }}>
                  <Typography variant="body1" sx={{ color: st.inversePrimary, fontWeight: 'bold' }}>gold_claims</Typography>
                  <Typography variant="body2" sx={{ color: st.textSecondary, mb: 2 }}>Domain: Health Insurance</Typography>
                  <Button variant="contained" fullWidth sx={{ bgcolor: st.accent, '&:hover': { bgcolor: '#0284c7' } }} onClick={() => {
                     const a = document.createElement('a');
                     const blob = new Blob(['claim_id,amount\n101,50000'], { type: 'text/csv' });
                     a.href = URL.createObjectURL(blob);
                     a.download = 'certified_gold_claims.csv';
                     a.click();
                  }}>
                    Download Certified Report
                  </Button>
                </Box>
              </CardContent>
            </GlassCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
