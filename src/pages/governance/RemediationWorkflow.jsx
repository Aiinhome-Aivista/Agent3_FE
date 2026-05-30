import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Chip, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';
import axios from 'axios';

const RemediationWorkflow = () => {
  const [datasetId, setDatasetId] = useState(1);
  const [issues, setIssues] = useState([]);
  const [actions, setActions] = useState({});
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3008/api/datasets/list').then(res => {
      setDatasets(res.data || []);
      if (res.data && res.data.length > 0) {
        setDatasetId(res.data[0].id);
      }
    }).catch(console.error);
  }, []);

  const fetchIssues = async () => {
    if (!datasetId) return;
    try {
      const res = await axios.get(`http://localhost:3008/remediation/issues/${datasetId}`);
      setIssues(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [datasetId]);

  const suggestFix = async (issueId) => {
    try {
      const res = await axios.post(`http://localhost:3008/remediation/suggest/${issueId}`);
      setActions({
        ...actions,
        [issueId]: { actionId: res.data.data.action_id, suggestion: res.data.data.suggestion, status: 'pending' }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const executeFix = async (issueId) => {
    const action = actions[issueId];
    if (!action) return;
    try {
      await axios.post(`http://localhost:3008/remediation/execute/${action.actionId}`);
      setActions({
        ...actions,
        [issueId]: { ...action, status: 'executed' }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Remediation Workflow</Typography>

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
        <Button variant="outlined" onClick={fetchIssues} disabled={!datasetId}>Refresh Issues</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Issue Detected</TableCell>
              <TableCell>Affected</TableCell>
              <TableCell>AI Suggested Fix</TableCell>
              <TableCell>Execution Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue) => {
              const action = actions[issue.id];
              return (
                <TableRow key={issue.id}>
                  <TableCell>{issue.issue_type} - {issue.recommendation}</TableCell>
                  <TableCell>{issue.affected_records}</TableCell>
                  <TableCell>
                    {action ? <Chip label={action.suggestion} color="primary" variant="outlined" /> : '-'}
                  </TableCell>
                  <TableCell>
                    {action ? (
                      <Chip label={action.status.toUpperCase()} color={action.status === 'executed' ? 'success' : 'warning'} size="small" />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {!action ? (
                      <Button size="small" variant="contained" color="info" onClick={() => suggestFix(issue.id)}>Suggest Fix</Button>
                    ) : action.status === 'pending' ? (
                      <Button size="small" variant="contained" color="success" onClick={() => executeFix(issue.id)}>Approve & Execute</Button>
                    ) : (
                      <Button size="small" variant="contained" disabled>Executed</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {issues.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No issues to remediate.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RemediationWorkflow;
