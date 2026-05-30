import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import axios from 'axios'; // Assuming axios is used, otherwise fetch

const StewardshipPage = () => {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3008/steward/review/pending');
      const data = await response.json();
      setTasks(data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Data Stewardship Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Review technical validation results, AI anomaly reports, and approve remediation actions.
      </Typography>

      <Button variant="contained" color="primary" onClick={fetchTasks} sx={{ mb: 4 }}>
        Fetch Pending AI Tasks
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssignmentTurnedInIcon color="action" fontSize="large" sx={{ mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">Pending Remediation Tasks</Typography>
              </Box>
              
              {loading ? (
                <CircularProgress />
              ) : !tasks ? (
                <Typography color="textSecondary">No pending tasks. Click fetch to check for new anomalies.</Typography>
              ) : (
                <List>
                  {tasks.anomalies.map((anomaly, idx) => (
                    <React.Fragment key={anomaly.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`AI Detection: ${anomaly.description}`}
                          secondary={anomaly.impacted_records ? `Impacted Records: ${anomaly.impacted_records} | Severity: ${anomaly.severity}` : `Severity: ${anomaly.severity}`}
                        />
                        <Button variant="outlined" color="success" sx={{ mr: 1 }} onClick={async () => {
                          await fetch('http://localhost:3008/steward/approve/validation', { method: 'POST' });
                          alert(`Approved Technical Validation. Advancing data to Silver Layer.`);
                        }}>
                          Approve (Run Validation)
                        </Button>
                      </ListItem>
                      {idx < tasks.anomalies.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StewardshipPage;
