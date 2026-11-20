import React from 'react';
import Image from '../../../components/AppImage';

const InvoicePreview = ({ invoiceData, zoomLevel = 100 }) => {
  const mockInvoiceData = {
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

  const data = invoiceData || mockInvoiceData;
  const scaleStyle = {
    transform: `scale(${zoomLevel / 100})`,
    transformOrigin: 'top center',
    width: `${100 * (100 / zoomLevel)}%`
  };

  return (
    <div className="bg-white shadow-elevation-lg rounded-lg overflow-hidden">
      <div 
        className="invoice-preview bg-white p-8 min-h-[1056px] w-[816px] mx-auto"
        style={scaleStyle}
      >
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src={data.company.logo} 
                alt={`${data.company.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{data.company.name}</h1>
              <p className="text-sm text-text-secondary whitespace-pre-line">{data.company.address}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-primary mb-2">INVOICE</h2>
            <div className="text-sm text-text-secondary space-y-1">
              <p><span className="font-medium">Invoice #:</span> {data.invoiceNumber}</p>
              <p><span className="font-medium">Date:</span> {new Date(data.creationDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Due Date:</span> {new Date(data.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Company Contact Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">From</h3>
            <div className="text-sm text-text-secondary space-y-1">
              <p className="font-medium text-text-primary">{data.company.name}</p>
              <p className="whitespace-pre-line">{data.company.address}</p>
              <p>{data.company.phone}</p>
              <p>{data.company.email}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">Bill To</h3>
            <div className="text-sm text-text-secondary space-y-1">
              <p className="font-medium text-text-primary">{data.customer.name}</p>
              <p className="whitespace-pre-line">{data.customer.address}</p>
              <p>{data.customer.phone}</p>
              <p>{data.customer.email}</p>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 text-sm font-semibold text-text-primary uppercase tracking-wide">Description</th>
                <th className="text-center py-3 text-sm font-semibold text-text-primary uppercase tracking-wide w-20">Qty</th>
                <th className="text-right py-3 text-sm font-semibold text-text-primary uppercase tracking-wide w-24">Rate</th>
                <th className="text-right py-3 text-sm font-semibold text-text-primary uppercase tracking-wide w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-secondary-50' : 'bg-white'}>
                  <td className="py-4 text-sm text-text-primary">{item.description}</td>
                  <td className="py-4 text-sm text-text-secondary text-center">{item.quantity}</td>
                  <td className="py-4 text-sm text-text-secondary text-right">${item.rate.toFixed(2)}</td>
                  <td className="py-4 text-sm font-medium text-text-primary text-right">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-sm text-text-secondary">Subtotal:</span>
                <span className="text-sm font-medium text-text-primary">${data.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-text-secondary">Tax ({data.taxRate}%):</span>
                <span className="text-sm font-medium text-text-primary">${data.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between py-2">
                  <span className="text-lg font-semibold text-text-primary">Total:</span>
                  <span className="text-lg font-bold text-primary">${data.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        <div className="space-y-6">
          {data.notes && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">Notes</h4>
              <p className="text-sm text-text-secondary">{data.notes}</p>
            </div>
          )}
          {data.terms && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">Terms & Conditions</h4>
              <p className="text-sm text-text-secondary">{data.terms}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            Thank you for your business! For questions about this invoice, please contact {data.company.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;