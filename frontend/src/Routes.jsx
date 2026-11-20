import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import InvoiceCreationDashboard from "pages/invoice-creation-dashboard";
import InvoiceHistoryManagement from "pages/invoice-history-management";
import InvoicePreviewPrintInterface from "pages/invoice-preview-print-interface";
import CompanySettingsConfiguration from "pages/company-settings-configuration";
import NotFound from "pages/NotFound";
import Login from "components/auth/Login";
import Signup from "components/auth/Signup";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<Login />} />
        <Route path="/invoice-creation-dashboard" element={<InvoiceCreationDashboard />} />
        <Route path="/invoice-history-management" element={<InvoiceHistoryManagement />} />
        <Route path="/invoice-preview-print-interface" element={<InvoicePreviewPrintInterface />} />
        <Route path="/company-settings-configuration" element={<CompanySettingsConfiguration />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;