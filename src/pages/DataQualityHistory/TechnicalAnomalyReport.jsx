import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';
import axios from 'axios';

const TechnicalAnomalyReport = () => {
  const [datasetId, setDatasetId] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    // Fetch available datasets
    axios.get('http://localhost:3008/api/datasets/list').then(res => {
      setDatasets(res.data || []);
      if (res.data && res.data.length > 0) {
        setDatasetId(res.data[0].id);
      }
    }).catch(console.error);
  }, []);

  const fetchResults = async () => {
    if (!datasetId) return;
    try {
      const res = await axios.get(`http://localhost:3008/validation/results/${datasetId}`);
      setResults(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [datasetId]);

  const runValidation = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:3008/validation/run/${datasetId}`);
      fetchResults();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Technical Anomaly Report</Typography>
      
      {datasets.length === 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No datasets found. Please register a dataset in the Connectors tab first.
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 200 }} disabled={datasets.length === 0}>
          <InputLabel>Select Dataset</InputLabel>
          <Select
            value={datasetId || ''}
            label="Select Dataset"
            onChange={(e) => setDatasetId(e.target.value)}
          >
            {datasets.length === 0 ? (
              <MenuItem value="" disabled>No Data Found</MenuItem>
            ) : (
              datasets.map(ds => (
                <MenuItem key={ds.id} value={ds.id}>{ds.dataset_name} (ID: {ds.id})</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={runValidation} disabled={loading || !datasetId}>
          {loading ? 'Running Validation...' : 'Run Automated Technical Validation'}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Issue Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Affected Records</TableCell>
              <TableCell>Recommendation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.issue_type}</TableCell>
                <TableCell>{row.severity}</TableCell>
                <TableCell>{row.affected_records}</TableCell>
                <TableCell>{row.recommendation}</TableCell>
              </TableRow>
            ))}
            {results.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No anomalies detected yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TechnicalAnomalyReport;
