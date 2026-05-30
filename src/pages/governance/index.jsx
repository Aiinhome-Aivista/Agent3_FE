import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, CircularProgress } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PolicyIcon from '@mui/icons-material/Policy';

const GovernancePage = () => {
  const [policies, setPolicies] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3008/governance/policies');
      const data = await response.json();
      setPolicies(data.data || []);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Governance Control Tower
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Manage data governance policies, metadata, and enterprise audit logs across all pipelines.
      </Typography>

      <Button variant="contained" color="secondary" onClick={fetchPolicies} disabled={loading} sx={{ mb: 4 }}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Policies from ChromaDB'}
      </Button>

      <Grid container spacing={4}>
        {/* Policy Status */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PolicyIcon color="secondary" fontSize="large" sx={{ mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">Active Policies</Typography>
              </Box>
              
              {!policies ? (
                <Typography color="textSecondary">No policies loaded.</Typography>
              ) : policies.length === 0 ? (
                <Typography color="textSecondary">No policies found in vector store.</Typography>
              ) : (
                policies.map((policy, idx) => (
                  <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" mt={2} p={2} sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="body1">{policy}</Typography>
                    <Chip label="Active" color="success" />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Audit Actions */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SecurityIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">Pending Approvals</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" mb={3}>
                No pending approvals at this time.
              </Typography>
              <Button variant="outlined" color="primary" fullWidth disabled>Review Approvals</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GovernancePage;
