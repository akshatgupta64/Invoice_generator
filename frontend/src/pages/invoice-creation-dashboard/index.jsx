import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ActionButtonCluster from '../../components/ui/ActionButtonCluster';
import CompanyInfoSection from './components/CompanyInfoSection';
import CustomerInfoSection from './components/CustomerInfoSection';
import InvoiceDetailsSection from './components/InvoiceDetailsSection';
import InvoiceItemsSection from './components/InvoiceItemsSection';
import InvoicePreview from './components/InvoicePreview';
import ValidationMessage from './components/ValidationMessage';
import Button from '../../components/ui/Button';
import invoiceService from '../../utils/invoiceService';
import customerService from '../../utils/customerService';
import companyService from '../../utils/companyService';
import InvoicePreviewModal from 'components/ui/InvoicePreviewModal';

const InvoiceCreationDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [companyData, setCompanyData] = useState({ name:'', email:'', phone:'', website:'', address:'', city:'', state:'', zipCode:'', logo:null });
  const [customerData, setCustomerData] = useState({ name:'', email:'', phone:'', company:'', address:'', city:'', state:'', zipCode:'' });
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber:'', format:'a4-standard', issueDate:new Date().toISOString().split('T')[0],
    dueDate:'', paymentTerms:'due_on_receipt', currency:'INR'
  });
  const [items, setItems] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidation, setShowValidation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState({ company:false, customer:false, details:false, items:false });
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);



useEffect(() => {
}, []);

  // Load company profile & invoice number
  useEffect(() => {
    if (showValidation && validationErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showValidation, validationErrors]);

  useEffect(() => {
    let isMounted = true;
    const loadProfileAndNumber = async () => {
      try {
        setIsLoading(true);
        const profileResult = await companyService.getCompanyProfile();
        if (isMounted && profileResult?.success && profileResult.data) {
          const p = profileResult.data;
          setCompanyData({
            name: p.name || '', email: p.email || '', phone: p.phone || '', website: p.website || '',
            address: p.address || '', city: p.city || '', state: p.state || '', zipCode: p.zip_code || '', logo: p.logo_url || null
          });
        }
        await generateInvoiceNumber();
      } catch (e) {
        console.error('Error loading company profile:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    if (user && !authLoading) loadProfileAndNumber();
    return () => { isMounted = false; };
  }, [user, authLoading]);

  const generateInvoiceNumber = async () => {
    try {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      let nextNumber = 1;
      const lastRes = await invoiceService.getLastInvoiceNumber();
      if (lastRes?.success && lastRes.data) {
        const parts = lastRes.data.split('-');
        const lastSeq = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(lastSeq)) nextNumber = lastSeq + 1;
      }
      const formatted = String(nextNumber).padStart(3, '0');
      const invoiceNumber = `INV-${month}-${year}-${formatted}`;
      setInvoiceDetails(prev => ({ ...prev, invoiceNumber }));
    } catch (e) {
      console.error('Error generating invoice number:', e);
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const validateForm = () => {
    const errors = [];
    if (!companyData.name.trim()) errors.push('Company name is required');
    if (!companyData.email.trim()) errors.push('Company email is required');
    if (!companyData.phone.trim()) errors.push('Company phone is required');
    if (!companyData.address.trim()) errors.push('Company address is required');
    if (!companyData.city.trim()) errors.push('Company city is required');
    if (!companyData.state.trim()) errors.push('Company state is required');
    if (!companyData.zipCode.trim()) errors.push('Company ZIP code is required');
    if (!customerData.name.trim()) errors.push('Customer name is required');
    if (!customerData.phone.trim()) errors.push('Customer phone is required');
    if (!invoiceDetails.invoiceNumber.trim()) errors.push('Invoice number is required');
    if (!invoiceDetails.issueDate) errors.push('Issue date is required');
    
    if (items.length === 0) errors.push('At least one invoice item is required');
    items.forEach((item, i) => {
      if (!item.description.trim()) errors.push(`Item ${i+1}: Description is required`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Item ${i+1}: Quantity must be > 0`);
      if (!item.rate || item.rate <= 0) errors.push(`Item ${i+1}: Rate must be > 0`);
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) setPreviewModalOpen(true);
    else setShowValidation(true);
  };

  // ✅ FIX: move handleSaveDraft **before** actionButtons:
  const handleSaveDraft = async () => {
    if (!user) return alert('Please sign in');
    setIsSaving(true); setShowValidation(false);
    try {
      const invoiceData = {
        invoice_number: invoiceDetails.invoiceNumber,
        issue_date: invoiceDetails.issueDate,
        due_date: invoiceDetails.dueDate,
        payment_terms: invoiceDetails.paymentTerms,
        currency: invoiceDetails.currency,
        notes: invoiceDetails.notes
      };
      const itemsData = items.map(item => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount: parseFloat(item.quantity) * parseFloat(item.rate)
      }));
      const res = await invoiceService.saveDraft(invoiceData, itemsData);
      alert(res?.success ? 'Draft saved!' : res?.error || 'Error saving draft');
    } catch (e) {
      console.error(e); alert('Error saving draft');
    } finally { setIsSaving(false); }
  };

  const handleCreateInvoice = async () => {
    if (!user) return alert('Please sign in');
    if (!validateForm()) return setShowValidation(true);
    setIsSaving(true);
    try {
      let customerId = null;
      if (customerData.email) {
        const search = await customerService.searchCustomers(customerData.email);
        if (search.success && search.data.length > 0) customerId = search.data[0].id;
        else {
          const create = await customerService.createCustomer({
            name: customerData.name, email: customerData.email, phone: customerData.phone,
            company: customerData.company, address: customerData.address,
            city: customerData.city, state: customerData.state, zip_code: customerData.zipCode
          });
          if (create.success) customerId = create.data.id;
          else return alert(create.error || 'Error creating customer');
        }
      } else return alert('Customer email is required');
      const subtotal = items.reduce((s, i) => s + i.quantity * i.rate, 0);
      const invoiceData = {
        invoice_number: invoiceDetails.invoiceNumber,
        issue_date: invoiceDetails.issueDate,
        due_date: invoiceDetails.dueDate,
        payment_terms: invoiceDetails.paymentTerms,
        currency: invoiceDetails.currency,
        notes: invoiceDetails.notes,
        subtotal, tax_amount: 0, total_amount: subtotal, customer_id: customerId
      };
      const res = await invoiceService.createInvoice(invoiceData);
      if (res?.success) {
        const newId = res.data.id;
        console.log('newInvoiceId:', newId);
        const itemsRes = await invoiceService.createInvoiceItems(newId, items.map(i => ({
          description: i.description, quantity: i.quantity, rate: i.rate, amount: i.quantity * i.rate
        })));
        if (itemsRes?.success) {
          setInvoiceDetails(prev => ({ ...prev, id: newId }));
          setPreviewModalOpen(true);
        } else alert(itemsRes?.error || 'Error creating invoice items');
      } else alert(res?.error || 'Error creating invoice');
    } catch (e) {
      console.error(e); alert('Error generating invoice');
    } finally { setIsSaving(false); }
  };

  const actionButtons = [
    { label: 'Save Draft', variant: 'secondary', iconName: 'Save', onClick: handleSaveDraft, loading: isSaving, disabled: !user },
    { label: 'Preview', variant: 'outline', iconName: 'Eye', onClick: handlePreview },
    { label: 'Generate Invoice', variant: 'primary', iconName: 'FileText', onClick: handleCreateInvoice, loading: isSaving, disabled: !user }
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Create Invoice</h1>
              <p className="text-text-secondary mt-2">Generate professional invoices easily</p>
            </div>
            <div className="lg:hidden">
              <Button variant="outline" onClick={() => setPreviewVisible(!previewVisible)} iconName={previewVisible ? "EyeOff" : "Eye"}>
                {previewVisible ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </div>

          <ValidationMessage errors={validationErrors} isVisible={showValidation} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <CompanyInfoSection companyData={companyData} onCompanyDataChange={setCompanyData} onLogoUpload={logo => setCompanyData(prev => ({ ...prev, logo }))} isCollapsed={collapsedSections.company} onToggleCollapse={() => toggleSection('company')} />
              <CustomerInfoSection customerData={customerData} onCustomerDataChange={setCustomerData} isCollapsed={collapsedSections.customer} onToggleCollapse={() => toggleSection('customer')} />
              <InvoiceDetailsSection invoiceDetails={invoiceDetails} onInvoiceDetailsChange={setInvoiceDetails} isCollapsed={collapsedSections.details} onToggleCollapse={() => toggleSection('details')} onGenerateInvoiceNumber={generateInvoiceNumber} />
              <InvoiceItemsSection items={items} onItemsChange={setItems} isCollapsed={collapsedSections.items} onToggleCollapse={() => toggleSection('items')} />
              <div className="bg-surface rounded-lg border border-border shadow-elevation p-6">
                <ActionButtonCluster actions={actionButtons} layout="horizontal" className="justify-end" />
              </div>
            </div>
            <div className={`lg:col-span-2 ${previewVisible ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto bg-white">
                <InvoicePreview companyData={companyData} customerData={customerData} invoiceDetails={invoiceDetails} items={items} />
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-8 bg-surface rounded-lg border border-border shadow-elevation p-4">
            <ActionButtonCluster actions={actionButtons} layout="vertical" />
          </div>
        </div>
      </main>

          <InvoicePreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            invoiceDetails={invoiceDetails}
            companyData={companyData}
            customerData={customerData}
            items={items}
            onGenerateAndSave={(pdfUrl) => {
              // Handle post-save actions if needed
              console.log('PDF saved to:', pdfUrl);
              setPreviewModalOpen(false);
              generateInvoiceNumber(); // Call to generate next invoice number
            }}
          />
    </div>
  );
};

export default InvoiceCreationDashboard;
