import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, Chip, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const BusinessRulesPage = () => {
  const [domain, setDomain] = useState('Health Insurance');
  const [datasetName, setDatasetName] = useState('Claim Data');
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const approveRule = (idx) => {
    const newRules = [...rules];
    newRules[idx].status = 'approved';
    setRules(newRules);
  };

  const rejectRule = (idx) => {
    const newRules = [...rules];
    newRules[idx].status = 'rejected';
    setRules(newRules);
  };

  const runBusinessValidation = async () => {
    // Simulate detecting Sonia's claim
    setValidationResult("AI detected: Sonia claim 95 lakh - High Risk");
  };

  const generateRules = async () => {
    if (!domain || !datasetName) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3008/business/rules/generate/101?context=${encodeURIComponent(domain + " " + datasetName)}`, {
        method: 'POST'
      });
      const data = await response.json();
      setRules(data.data.generated_rules);
    } catch (error) {
      console.error("Error generating rules:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        AI Business Rule Generator
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Provide business context to automatically generate domain-specific validation rules.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AutoAwesomeIcon color="secondary" fontSize="large" sx={{ mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">Generate Rules</Typography>
              </Box>
              <TextField
                fullWidth
                label="Domain"
                variant="outlined"
                margin="normal"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <TextField
                fullWidth
                label="Dataset"
                variant="outlined"
                margin="normal"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
              />
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} fullWidth onClick={generateRules} disabled={!domain || loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Rules with AI'}
              </Button>
              {validationResult && (
                <Box mt={3} p={2} sx={{ bgcolor: '#ffebee', borderRadius: 2, border: '1px solid #ffcdd2' }}>
                  <Typography variant="subtitle2" color="error" fontWeight="bold">Business Validation Alert:</Typography>
                  <Typography variant="body2">{validationResult}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>Suggested Rules</Typography>
              
              {!rules ? (
                <Typography color="textSecondary">Input context and generate rules to see suggestions.</Typography>
              ) : (
                rules.map((rule, idx) => (
                  <Box key={idx} p={2} mb={2} sx={{ bgcolor: rule.status === 'approved' ? '#e8f5e9' : rule.status === 'rejected' ? '#ffebee' : '#e3f2fd', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">{rule.rule_name}</Typography>
                    <Typography variant="body2" color="textSecondary">{rule.rule_logic}</Typography>
                    <Box mt={1}>
                      <Chip label="Approve" color={rule.status === 'approved' ? "success" : "default"} size="small" sx={{ mr: 1 }} clickable onClick={() => approveRule(idx)} />
                      <Chip label="Reject" color={rule.status === 'rejected' ? "error" : "default"} size="small" clickable onClick={() => rejectRule(idx)} />
                    </Box>
                  </Box>
                ))
              )}
              {rules && rules.every(r => r.status !== 'pending') && (
                 <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth onClick={runBusinessValidation}>
                    Run Business Validation
                 </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessRulesPage;
