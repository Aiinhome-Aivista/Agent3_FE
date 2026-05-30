import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, LinearProgress, Chip, CircularProgress } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

const TrustScoresPage = () => {
  const [datasets, setDatasets] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchScores = async () => {
    setLoading(true);
    try {
      // Hardcoding for Health Insurance Demo
      setDatasets([
        {
          name: "gold_claims",
          tier: "Gold",
          score: 95,
          quality: 90, // Accuracy
          freshness: 95, // Completeness
          compliance: 100
        }
      ]);
    } catch (error) {
      console.error("Error fetching trust scores:", error);
      setDatasets([]);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Dataset Trust Scores
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        View certified datasets, data quality ratings, and overall trust metrics.
      </Typography>

      <Button variant="contained" color="primary" onClick={fetchScores} disabled={loading} sx={{ mb: 4 }}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Trust Scores'}
      </Button>

      <Grid container spacing={4}>
        {!datasets ? (
          <Grid item xs={12}>
            <Typography color="textSecondary">No datasets analyzed. Click "Calculate Trust Scores" to begin.</Typography>
          </Grid>
        ) : (
          datasets.map((dataset, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">{dataset.name}</Typography>
                    <Chip icon={dataset.tier === 'Gold' ? <VerifiedIcon /> : undefined} label={dataset.tier} color={dataset.tier === 'Gold' ? "warning" : "default"} size="small" />
                  </Box>
                  <Typography variant="body2" color="textSecondary" mb={2}>Overall Trust Score: {dataset.score}/100</Typography>
                  <Box mb={1}>
                    <Typography variant="caption">Completeness ({dataset.freshness}%)</Typography>
                    <LinearProgress variant="determinate" value={dataset.freshness} color="success" />
                  </Box>
                  <Box mb={1}>
                    <Typography variant="caption">Accuracy ({dataset.quality}%)</Typography>
                    <LinearProgress variant="determinate" value={dataset.quality} color="success" />
                  </Box>
                  <Box mb={1}>
                    <Typography variant="caption">Compliance ({dataset.compliance}%)</Typography>
                    <LinearProgress variant="determinate" value={dataset.compliance} color="success" />
                  </Box>
                  <Button size="small" variant="outlined" sx={{ mt: 2 }} fullWidth>View Details</Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      
      {datasets && datasets.length > 0 && (
        <Card elevation={3} sx={{ borderRadius: 3, mt: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>AI Gap Analysis Report</Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box p={2} sx={{ bgcolor: '#e8f5e9', borderRadius: 2 }}>
                  <Typography variant="subtitle1" color="success.dark" fontWeight="bold">DO</Typography>
                  <ul>
                    <li><Typography variant="body2">Keep Aadhaar masked</Typography></li>
                    <li><Typography variant="body2">Review high claims</Typography></li>
                  </ul>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box p={2} sx={{ bgcolor: '#ffebee', borderRadius: 2 }}>
                  <Typography variant="subtitle1" color="error.dark" fontWeight="bold">DON'T</Typography>
                  <ul>
                    <li><Typography variant="body2">Publish raw PII</Typography></li>
                    <li><Typography variant="body2">Approve abnormal claims blindly</Typography></li>
                  </ul>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TrustScoresPage;
