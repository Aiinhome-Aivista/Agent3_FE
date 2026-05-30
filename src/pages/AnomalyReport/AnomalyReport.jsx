import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Chip } from '@mui/material';

const AnomalyReport = () => {
  const [anomalies, setAnomalies] = useState([
    { id: 1, type: 'Null Values', column: 'email_address', count: 120, recommendation: 'Fill with "unknown"', fixType: 'fill_nulls' },
    { id: 2, type: 'Duplicates', column: 'transaction_id', count: 45, recommendation: 'Delete duplicate rows', fixType: 'drop_duplicates' }
  ]);

  const [logs, setLogs] = useState([]);

  const applyFix = (anomaly) => {
    // Mock API call to /api/remediation/execute
    setLogs([...logs, `Executed fix: ${anomaly.fixType} on ${anomaly.column}`]);
    setAnomalies(anomalies.filter(a => a.id !== anomaly.id));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Automated Technical Anomaly Report</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Detected Anomalies & Remediation</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Issue Type</TableCell>
              <TableCell>Column</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>AI Recommendation</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {anomalies.map(row => (
              <TableRow key={row.id}>
                <TableCell><Chip label={row.type} color="error" size="small" /></TableCell>
                <TableCell>{row.column}</TableCell>
                <TableCell>{row.count}</TableCell>
                <TableCell>{row.recommendation}</TableCell>
                <TableCell>
                  <Button variant="contained" color="warning" size="small" onClick={() => applyFix(row)}>
                    Apply Fix
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {anomalies.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No anomalies detected. Dataset is clean.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {logs.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Remediation Logs</Typography>
          {logs.map((log, i) => (
            <Typography key={i} variant="body2" color="textSecondary">- {log}</Typography>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default AnomalyReport;
