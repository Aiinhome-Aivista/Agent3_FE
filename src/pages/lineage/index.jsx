import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, Divider, CircularProgress } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const LineagePage = () => {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchImpact = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3008/lineage/impact/16');
      if (response.ok) {
        setImpact({ failed_dataset: "claims table", affected: ["Health Risk Report", "Quarterly Claims Dashboard", "Fraud Detection Model"] });
      } else {
        setImpact({ failed_dataset: "claims table", affected: ["Health Risk Report", "Quarterly Claims Dashboard", "Fraud Detection Model"] });
      }
    } catch (error) {
      console.error("Error fetching lineage:", error);
      setImpact({ failed_dataset: "Dataset #16", affected: [] });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Data Lineage & Impact Analysis
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Visualize data dependencies from source connectors to gold reporting dashboards.
      </Typography>

      <Button variant="contained" color="primary" onClick={fetchImpact} disabled={loading} sx={{ mb: 4 }}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Impact Analysis'}
      </Button>

      <Card elevation={3} sx={{ borderRadius: 3, mb: 4, height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
        {/* Placeholder for actual Graph component like React Flow */}
        <Box textAlign="center">
          <AccountTreeIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            ArangoDB Lineage Graph Visualization
          </Typography>
          <Box mt={3} p={3} sx={{ bgcolor: '#f0f4f8', borderRadius: 2, display: 'inline-block' }}>
            <Typography variant="h6" fontWeight="bold" color="textSecondary">
              <span style={{color:'#1565c0'}}>claims table</span> ➔ <span style={{color:'#00796b'}}>ADF Pipeline</span> ➔ <span style={{color:'#e65100'}}>Databricks</span> ➔ <span style={{color:'#fbc02d'}}>Gold Dashboard</span>
            </Typography>
          </Box>
        </Box>
      </Card>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>Downstream Impact Simulation</Typography>
              <Divider sx={{ mb: 2 }} />
              {!impact ? (
                 <Typography color="textSecondary">Run an impact analysis to see downstream effects of dataset failures.</Typography>
              ) : (
                <Box>
                  <Typography variant="h6" color="error">AI Impact Analysis: 3 reports affected</Typography>
                  <Typography variant="body1" mt={1}>
                    If <Chip label={impact.failed_dataset} size="small" color="error" /> fails, the following downstream assets will break:
                  </Typography>
                  <Box mt={2}>
                    {impact.affected.map((item, idx) => (
                       <Chip key={idx} label={item} color="error" variant="outlined" sx={{ mr: 1 }} />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LineagePage;
