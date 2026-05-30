import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Chip, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';
import axios from 'axios';

const BusinessValidationResults = () => {
  const [datasetId, setDatasetId] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
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
      const res = await axios.get(`http://localhost:3008/business/validation/results/${datasetId}`);
      setResults(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [datasetId]);

  const executeRules = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:3008/business/validation/run/${datasetId}`);
      fetchResults();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Business Validation Results</Typography>

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
        <Button variant="contained" color="success" onClick={executeRules} disabled={loading || !datasetId}>
          {loading ? 'Executing...' : 'Execute Approved Rules'}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Execution Date</TableCell>
              <TableCell>Rule Executed</TableCell>
              <TableCell>Records Affected</TableCell>
              <TableCell>Risk Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{new Date(row.execution_date).toLocaleString()}</TableCell>
                <TableCell>{row.rule_name}</TableCell>
                <TableCell>{row.records_affected}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.risk_level} 
                    color={row.risk_level === 'High' ? 'error' : row.risk_level === 'Medium' ? 'warning' : 'info'} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
            {results.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">Execute rules to see results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BusinessValidationResults;
