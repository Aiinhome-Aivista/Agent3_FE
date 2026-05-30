import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MemoryIcon from '@mui/icons-material/Memory';

const Monitoring = () => {
  const [loadingStep, setLoadingStep] = useState(null);
  const [pipelineState, setPipelineState] = useState({
    adf: null,
    databricks: null,
  });
  const [error, setError] = useState(null);

  const triggerADF = async () => {
    setLoadingStep("adf");
    setError(null);
    try {
      const response = await fetch("http://localhost:3008/monitoring/adf/trigger", {
        method: "POST"
      });
      if (response.ok) {
        const result = await response.json();
        setPipelineState(prev => ({ ...prev, adf: result.data }));
      } else {
        setError("Failed to trigger ADF Pipeline.");
      }
    } catch (err) {
      setError("Error connecting to backend.");
    }
    setLoadingStep(null);
  };

  const triggerDatabricks = async () => {
    setLoadingStep("databricks");
    setError(null);
    try {
      const response = await fetch("http://localhost:3008/monitoring/databricks/jobs?job_name=bronze_ingestion", {
        method: "POST"
      });
      if (response.ok) {
        const result = await response.json();
        setPipelineState(prev => ({ ...prev, databricks: result.data }));
      } else {
        setError("Failed to run Databricks Job.");
      }
    } catch (err) {
      setError("Error connecting to backend.");
    }
    setLoadingStep(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Enterprise Pipeline Execution
        </Typography>
      </Stack>

      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Data Engineer Flow: Manually trigger the end-to-end data ingestion pipeline from operational sources to the Databricks Lakehouse.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={4}>
        {/* Step 1: Source */}
        <Card elevation={2} sx={{ borderLeft: '6px solid #1976d2' }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <DeveloperBoardIcon sx={{ fontSize: 40, color: '#1976d2' }} />
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold">1. Source Systems (Health Insurance)</Typography>
                <Typography variant="body2" color="textSecondary">
                  MySQL (Customer Data: <b>customer_id, name, age</b>) & MSSQL (Claim Data: <b>claim_id, amount</b>)
                </Typography>
              </Box>
              <Chip label="Ready" color="success" />
            </Stack>
          </CardContent>
        </Card>

        {/* Step 2: ADF */}
        <Card elevation={2} sx={{ borderLeft: '6px solid #0288d1' }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <CloudUploadIcon sx={{ fontSize: 40, color: '#0288d1' }} />
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold">2. Azure Data Factory (ADF)</Typography>
                <Typography variant="body2" color="textSecondary">
                  Extracts data into ADLS: <code>ADLS/raw/customers</code> & <code>ADLS/raw/claims</code> (Every 1 Hour)
                </Typography>
                {pipelineState.adf && (
                  <Paper sx={{ mt: 2, p: 2, bgcolor: '#f1f8e9', border: '1px solid #c5e1a5' }} elevation={0}>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      <CheckCircleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                      {pipelineState.adf.message}
                    </Typography>
                  </Paper>
                )}
              </Box>
              <Button
                variant="contained"
                color="info"
                startIcon={loadingStep === "adf" ? <CircularProgress size={20} color="inherit" /> : <PlayCircleIcon />}
                onClick={triggerADF}
                disabled={loadingStep !== null}
              >
                Trigger ADF
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Step 3: Databricks */}
        <Card elevation={2} sx={{ borderLeft: '6px solid #ff9800' }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <MemoryIcon sx={{ fontSize: 40, color: '#ff9800' }} />
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold">3. Databricks Processing (Bronze)</Typography>
                <Typography variant="body2" color="textSecondary">
                  Creates <code>bronze_customers</code> and <code>bronze_claims</code> tables for AI Validation.
                </Typography>
                {pipelineState.databricks && (
                  <Paper sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', border: '1px solid #ffcc80' }} elevation={0}>
                    <Typography variant="body2" fontWeight="bold" color="warning.dark">
                      <CheckCircleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                      {pipelineState.databricks.message}
                    </Typography>
                  </Paper>
                )}
              </Box>
              <Button
                variant="contained"
                color="warning"
                startIcon={loadingStep === "databricks" ? <CircularProgress size={20} color="inherit" /> : <PlayCircleIcon />}
                onClick={triggerDatabricks}
                disabled={loadingStep !== null || !pipelineState.adf}
              >
                Run Bronze Job
              </Button>
            </Stack>
          </CardContent>
        </Card>

      </Stack>

      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          Once the pipeline reaches Databricks Bronze, it triggers the <b>AI Orchestrator Agent</b> to perform Technical Validations. 
          <br/>The Data Steward can then review the results in the Stewardship dashboard.
        </Typography>
      </Box>
    </Box>
  );
};

export default Monitoring;
