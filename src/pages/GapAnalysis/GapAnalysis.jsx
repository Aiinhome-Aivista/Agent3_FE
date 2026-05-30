import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';

const GapAnalysis = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Gap Analysis Report</Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Review the pre and post state of your datasets based on executed business rules and remediations.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="error">Before (Don'ts)</Typography>
            <Divider sx={{ my: 1 }} />
            <ul>
              <li>Contains 120 Null Values in email_address</li>
              <li>Contains 45 Duplicate Transaction IDs</li>
              <li>Business Rules not applied to raw dataset</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="success.main">After (Do's / Refined Dataset)</Typography>
            <Divider sx={{ my: 1 }} />
            <ul>
              <li>All Null values replaced with "unknown"</li>
              <li>Duplicate rows removed entirely</li>
              <li>Dataset passed 100% of generated business rules</li>
            </ul>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default GapAnalysis;
