import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';

import Landing from '../pages/Landing/Landing';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Connectors from '../pages/Connectors/Connectors';
import Datasets from '../pages/Datasets/Datasets';
import Monitoring from '../pages/Monitoring/Monitoring';
import Alerts from '../pages/Alerts/Alerts';
import Notifications from '../pages/Notifications/Notifications';
import Settings from '../pages/Settings/Settings';
import RuleBooks from '../pages/RuleBooks/RuleBooks';
import DataQualityHistory from '../pages/DataQualityHistory/DataQualityHistory';
import GovernancePage from '../pages/governance';
import StewardshipPage from '../pages/stewardship';
import BusinessRulesPage from '../pages/business_rules';
import CompliancePage from '../pages/compliance';
import TrustScoresPage from '../pages/trust_scores';
import LineagePage from '../pages/lineage';

// New Must Have Pages
import TechnicalAnomalyReport from '../pages/DataQualityHistory/TechnicalAnomalyReport';
import AIBusinessRules from '../pages/business_rules/AIBusinessRules';
import BusinessValidationResults from '../pages/business_rules/BusinessValidationResults';
import RemediationWorkflow from '../pages/governance/RemediationWorkflow';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/connectors" element={<Connectors />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/rule-books" element={<RuleBooks />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/data-quality-history" element={<DataQualityHistory />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/stewardship" element={<StewardshipPage />} />
        <Route path="/business-rules" element={<BusinessRulesPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/trust-scores" element={<TrustScoresPage />} />
        <Route path="/lineage" element={<LineagePage />} />
        
        {/* New Must Have Routes */}
        <Route path="/technical-anomalies" element={<TechnicalAnomalyReport />} />
        <Route path="/ai-business-rules" element={<AIBusinessRules />} />
        <Route path="/business-validation-results" element={<BusinessValidationResults />} />
        <Route path="/remediation-workflow" element={<RemediationWorkflow />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
