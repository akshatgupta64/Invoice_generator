import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { useAuth } from "contexts/AuthContext";

// Pages
import Dashboard from "pages/dashboard";
import Clients from "pages/clients";
import Catalog from "pages/catalog";
import Templates from "pages/templates";
import InvoiceCreationDashboard from "pages/invoice-creation-dashboard";
import InvoiceHistoryManagement from "pages/invoice-history-management";
import InvoicePreviewPrintInterface from "pages/invoice-preview-print-interface";
import CompanySettingsConfiguration from "pages/company-settings-configuration";
import NotFound from "pages/NotFound";
import Login from "components/auth/Login";
import Signup from "components/auth/Signup";

const RootHandler = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return user ? <Dashboard /> : <Login />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Root */}
          <Route path="/" element={<RootHandler />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Core Enterprise Suite */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Invoices List */}
          <Route path="/invoices" element={<InvoiceHistoryManagement />} />
          <Route path="/invoice-history-management" element={<InvoiceHistoryManagement />} />

          {/* Create Invoice */}
          <Route path="/create-invoice" element={<InvoiceCreationDashboard />} />
          <Route path="/invoice-creation-dashboard" element={<InvoiceCreationDashboard />} />

          {/* Clients CRM */}
          <Route path="/clients" element={<Clients />} />
          <Route path="/customers" element={<Clients />} />

          {/* Products & Services Catalog */}
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/items" element={<Catalog />} />

          {/* Templates & Preview */}
          <Route path="/templates" element={<Templates />} />
          <Route path="/invoice-preview-print-interface" element={<InvoicePreviewPrintInterface />} />

          {/* Company & Billing Settings */}
          <Route path="/settings" element={<CompanySettingsConfiguration />} />
          <Route path="/company-settings-configuration" element={<CompanySettingsConfiguration />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
