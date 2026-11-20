import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import InvoicePreview from './components/InvoicePreview';
import ActionToolbar from './components/ActionToolbar';
import TemplateSelector from './components/TemplateSelector';
import PrintSettingsPanel from './components/PrintSettingsPanel';
import EmailModal from './components/EmailModal';

const InvoicePreviewPrintInterface = () => {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [isPrintPanelOpen, setIsPrintPanelOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  // Mock invoice data - in real app this would come from props/context/API
  useEffect(() => {
    const mockData = {
      invoiceNumber: "INV-07-2025-632",
      creationDate: "2025-01-07",
      dueDate: "2025-02-07",
      format: "A4 Standard",
      company: {
        name: "TechSolutions Inc.",
        address: "123 Business Street, Suite 100\nNew York, NY 10001",
        phone: "+1 (555) 123-4567",
        email: "info@techsolutions.com",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop"
      },
      customer: {
        name: "Acme Corporation",
        address: "456 Client Avenue\nLos Angeles, CA 90210",
        phone: "+1 (555) 987-6543",
        email: "billing@acmecorp.com"
      },
      items: [
        {
          id: 1,
          description: "Web Development Services",
          quantity: 40,
          rate: 125.00,
          amount: 5000.00
        },
        {
          id: 2,
          description: "UI/UX Design Consultation",
          quantity: 20,
          rate: 150.00,
          amount: 3000.00
        },
        {
          id: 3,
          description: "Project Management",
          quantity: 15,
          rate: 100.00,
          amount: 1500.00
        }
      ],
      subtotal: 9500.00,
      taxRate: 8.5,
      taxAmount: 807.50,
      total: 10307.50,
      notes: "Payment due within 30 days. Late payments may incur additional fees.",
      terms: "Net 30 days payment terms apply. All work completed as per signed agreement."
    };
    setInvoiceData(mockData);
  }, []);

  const handleEditInvoice = () => {
    navigate('/invoice-creation-dashboard');
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download the PDF
    console.log('Downloading PDF for invoice:', invoiceData?.invoiceNumber);
    
    // Simulate PDF generation
    const link = document.createElement('a');
    link.href = '#'; // Would be actual PDF blob URL
    link.download = `Invoice-${invoiceData?.invoiceNumber || 'INV-07-2025-632'}.pdf`;
    // link.click(); // Commented out to prevent actual download in demo
    
    // Show success message (in real app, would use toast notification)
    alert('PDF download started!');
  };

  const handleQuickPrint = () => {
    setIsPrintPanelOpen(true);
  };

  const handleSendEmail = () => {
    setIsEmailModalOpen(true);
  };

  const handlePrint = (printSettings) => {
    console.log('Printing with settings:', printSettings);
    
    // In a real app, this would trigger the browser's print dialog
    // with the specified settings
    window.print();
  };

  const handleEmailSend = (emailData) => {
    console.log('Sending email:', emailData);
    
    // Show success message (in real app, would use toast notification)
    alert('Email sent successfully!');
  };

  const handleZoomChange = (newZoom) => {
    setZoomLevel(newZoom);
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    console.log('Template changed to:', templateId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="px-5 lg:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                  Invoice Preview
                </h1>
                <p className="text-text-secondary">
                  Review your invoice before printing or sending to clients
                </p>
              </div>
              
              {/* Quick Actions - Mobile */}
              <div className="flex flex-wrap gap-3 mt-4 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditInvoice}
                  iconName="Edit"
                >
                  Edit
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadPDF}
                  iconName="Download"
                >
                  Download
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleQuickPrint}
                  iconName="Printer"
                >
                  Print
                </Button>
              </div>
            </div>

            {/* Template Selector */}
            <div className="mb-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
              />
            </div>

            {/* Main Content Area */}
            <div className="relative">
              {/* Preview Container */}
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  {/* Zoom Controls - Desktop */}
                  <div className="hidden lg:flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-text-secondary">Zoom:</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleZoomChange(Math.max(50, zoomLevel - 25))}
                          disabled={zoomLevel <= 50}
                          className="p-2"
                        >
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="text-sm font-medium text-text-primary min-w-[60px] text-center">
                          {zoomLevel}%
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleZoomChange(Math.min(150, zoomLevel + 25))}
                          disabled={zoomLevel >= 150}
                          className="p-2"
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-text-secondary">
                      <Icon name="FileText" size={16} />
                      <span>Invoice #{invoiceData?.invoiceNumber}</span>
                      <span>•</span>
                      <span>{selectedTemplate} Format</span>
                    </div>
                  </div>

                  {/* Invoice Preview */}
                  <div className="relative overflow-auto">
                    <InvoicePreview 
                      invoiceData={invoiceData}
                      zoomLevel={zoomLevel}
                    />
                  </div>

                  {/* Mobile Actions */}
                  <div className="lg:hidden mt-6 p-4 bg-surface border border-border rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleEditInvoice}
                        iconName="Edit"
                        fullWidth
                      >
                        Edit Invoice
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleDownloadPDF}
                        iconName="Download"
                        fullWidth
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleQuickPrint}
                        iconName="Printer"
                        fullWidth
                      >
                        Print
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSendEmail}
                        iconName="Mail"
                        fullWidth
                      >
                        Send Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Action Toolbar */}
              <div className="hidden lg:block">
                <ActionToolbar
                  onEdit={handleEditInvoice}
                  onDownloadPDF={handleDownloadPDF}
                  onQuickPrint={handleQuickPrint}
                  onSendEmail={handleSendEmail}
                  zoomLevel={zoomLevel}
                  onZoomChange={handleZoomChange}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 p-6 bg-secondary-50 border border-border rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-text-primary mb-1">
                    Preview Information
                  </h3>
                  <p className="text-sm text-text-secondary">
                    This preview shows how your invoice will appear when printed or exported as PDF. 
                    You can adjust the template, zoom level, and print settings before finalizing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Print Settings Panel */}
      <PrintSettingsPanel
        isOpen={isPrintPanelOpen}
        onClose={() => setIsPrintPanelOpen(false)}
        onPrint={handlePrint}
      />

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleEmailSend}
        invoiceData={invoiceData}
      />
    </div>
  );
};

export default InvoicePreviewPrintInterface;