import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

const CompliancePage = () => {
  const [scanResults, setScanResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remediationLogs, setRemediationLogs] = useState(null);

  const maskAadhaar = async () => {
    try {
      const response = await fetch('http://localhost:3008/compliance/pii/mask/101', { method: 'POST' });
      const data = await response.json();
      setRemediationLogs(data.logs);
      
      // Update local state to show it's masked
      const updatedResults = [...scanResults];
      updatedResults[0].status = 'Masked';
      setScanResults(updatedResults);
    } catch (error) {
      console.error("Error masking:", error);
    }
  };

  const runScan = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3008/compliance/pii/scan/101', { method: 'POST' });
      const data = await response.json();
      setScanResults(data.data.pii_found);
    } catch (error) {
      console.error("Error running scan:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Compliance & PII Scanner
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Review PII scan results, audit logs, and compliance violations across datasets.
      </Typography>

      <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              <PrivacyTipIcon color="error" fontSize="large" sx={{ mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">Recent PII Detections</Typography>
            </Box>
            <Button variant="contained" color="error" onClick={runScan} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Full Scan'}
            </Button>
          </Box>
          
          {!scanResults ? (
            <Typography color="textSecondary" sx={{ mt: 2 }}>No recent scans. Click "Run Full Scan" to analyze datasets.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Dataset</TableCell>
                  <TableCell>Column</TableCell>
                  <TableCell>PII Type</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scanResults.map((pii, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{pii.dataset}</TableCell>
                    <TableCell>{pii.column}</TableCell>
                    <TableCell><Chip label={pii.type} size="small" color="error" /></TableCell>
                    <TableCell>99.9%</TableCell>
                    <TableCell><Chip label={pii.status} size="small" color={pii.status === 'Masked' ? "success" : "warning"} /></TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" color="secondary" onClick={maskAadhaar} disabled={pii.status === 'Masked'}>
                        Mask Aadhaar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {remediationLogs && (
            <Box mt={4} p={3} sx={{ bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #c8e6c9' }}>
              <Typography variant="h6" color="success.dark" fontWeight="bold" mb={2}>Remediation Agent Logs</Typography>
              {remediationLogs.map((log, idx) => (
                <Typography key={idx} variant="body1" sx={{ mb: 1 }}>{log}</Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompliancePage;
