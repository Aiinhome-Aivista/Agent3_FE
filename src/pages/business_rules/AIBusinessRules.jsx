import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';
import axios from 'axios';

const AIBusinessRules = () => {
  const [datasetId, setDatasetId] = useState(1);
  const [context, setContext] = useState("Health Insurance");
  const [rules, setRules] = useState([]);
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

  const generateRules = async () => {
    if (!datasetId) return;
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:3008/business/rules/generate/${datasetId}?context=${context}`);
      setRules(res.data.data.generated_rules || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAction = async (ruleId, action) => {
    try {
      await axios.post(`http://localhost:3008/business/rules/${action}/${ruleId}`);
      // Update local state
      setRules(rules.map(r => r.id === ruleId ? { ...r, status: action === 'approve' ? 'active' : 'inactive' } : r));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>AI Generated Business Rules</Typography>

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
        <TextField 
          label="Business Context" 
          value={context} 
          onChange={(e) => setContext(e.target.value)} 
          size="small"
        />
        <Button variant="contained" color="secondary" onClick={generateRules} disabled={loading || !datasetId}>
          {loading ? 'Generating Rules...' : 'Generate AI Rules'}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rule Name</TableCell>
              <TableCell>Rule Logic</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.rule_name}</TableCell>
                <TableCell>{rule.rule_logic}</TableCell>
                <TableCell>{rule.status}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="success" onClick={() => handleAction(rule.id, 'approve')} sx={{ mr: 1 }} disabled={rule.status !== 'draft'}>Approve</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleAction(rule.id, 'reject')} disabled={rule.status !== 'draft'}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
            {rules.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">Generate rules to view them here.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AIBusinessRules;
