import React, { useState } from 'react';
import { useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceTable = ({ 
  invoices = [], 
  selectedInvoices = [], 
  onSelectionChange,
  onSort,
  sortConfig = { key: null, direction: 'asc' },
  onAction
}) => {
  const [showStatusOptions, setShowStatusOptions] = useState(null);
  const statusButtonRef = useRef(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: 'bg-secondary-100', text: 'text-secondary-700', label: 'Draft' },
      sent: { bg: 'bg-accent-100', text: 'text-accent-700', label: 'Sent' },
      paid: { bg: 'bg-success-100', text: 'text-success-700', label: 'Paid' },
      overdue: { bg: 'bg-error-100', text: 'text-error-700', label: 'Overdue' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <Icon name="ArrowUpDown" size={16} className="text-text-muted" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(invoices.map(invoice => invoice.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectInvoice = (invoiceId, checked) => {
    if (checked) {
      onSelectionChange([...selectedInvoices, invoiceId]);
    } else {
      onSelectionChange(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

 const handleDownload = async (invoiceId) => {
  const fileUrl = await onAction('download', invoiceId);
  if (fileUrl) {
    // Open in new tab
    window.open(fileUrl, '_blank');
  } else {
    console.error('Download URL not returned');
  }
};


  const isAllSelected = invoices.length > 0 && selectedInvoices.length === invoices.length;
  const isPartiallySelected = selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => { if (input) input.indeterminate = isPartiallySelected; }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('invoiceNumber')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Invoice Number
                  {getSortIcon('invoiceNumber')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('customerName')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Customer
                  {getSortIcon('customerName')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Amount
                  {getSortIcon('amount')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Status
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('createdDate')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Created
                  {getSortIcon('createdDate')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                >
                  Due Date
                  {getSortIcon('dueDate')}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text-primary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className={`hover:bg-secondary-50 transition-colors ${
                  selectedInvoices.includes(invoice.id) ? 'bg-primary-50' : ''
                }`}
                onMouseEnter={() => setHoveredRow(invoice.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={(e) => handleSelectInvoice(invoice.id, e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-text-primary">{invoice.invoiceNumber}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-text-primary">{invoice.customerName}</div>
                  <div className="text-sm text-text-secondary">{invoice.customerEmail}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-text-primary">
                    {formatCurrency(invoice.amount)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-text-primary">{formatDate(invoice.createdDate)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-text-primary">{formatDate(invoice.dueDate)}</div>
                </td>
                <td className="px-4 py-3 relative">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => setShowStatusOptions(showStatusOptions === invoice.id ? null : invoice.id)}
                      className="text-text-muted hover:text-primary"
                      title="Edit Invoice"
                      ref={statusButtonRef}
                    />
                    {showStatusOptions === invoice.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg z-10">
                        {['draft', 'sent', 'paid', 'overdue'].map(status => (
                          <Button
                            key={status}
                            variant="ghost"
                            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary-50"
                            onClick={() => {
                              onAction('updateStatus', invoice.id, status);
                              setShowStatusOptions(null);
                            }}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      onClick={() => handleDownload(invoice.id)}
                      className="text-text-muted hover:text-primary"
                      title={invoice.pdf_url ? "View / Download PDF" : "PDF not available"}
                      disabled={!invoice.pdf_url}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {invoices.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No invoices found</h3>
          <p className="text-text-secondary">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
