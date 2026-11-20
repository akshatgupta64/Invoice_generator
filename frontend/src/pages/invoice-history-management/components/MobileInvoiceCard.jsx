import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const MobileInvoiceCard = ({ invoice, isSelected, onSelect, onAction }) => {
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const statusOptions = ['draft', 'sent', 'paid', 'overdue'];

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

  return (
    <div className={`bg-surface border rounded-lg p-4 ${isSelected ? 'border-primary bg-primary-50' : 'border-border'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(invoice.id, e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary"
          />
          <div>
            <h3 className="font-medium text-text-primary">{invoice.invoiceNumber}</h3>
            <p className="text-sm text-text-secondary">{invoice.customerName}</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
          {invoice.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Amount:</span>
          <span className="font-medium text-text-primary">{formatCurrency(invoice.amount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Created:</span>
          <span className="text-sm text-text-primary">{formatDate(invoice.createdDate)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Due Date:</span>
          <span className="text-sm text-text-primary">{formatDate(invoice.dueDate)}</span>
        </div>
        {invoice.customerEmail && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Email:</span>
            <span className="text-sm text-text-primary truncate ml-2">{invoice.customerEmail}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          iconName="Edit"
          onClick={() => onAction('edit', invoice.id)}
          className="flex-1 text-text-muted hover:text-primary"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Download"
          onClick={async () => {
            const url = await onAction('download', invoice.id);
            if (url) {
              const link = document.createElement('a');
              link.href = url;
              link.download = invoice.invoiceNumber + '.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              console.error('PDF URL not found');
            }
          }}
          className="flex-1 text-text-muted hover:text-primary"
          disabled={!invoice.pdf_url}
        >
          PDF
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="ArrowDown"
          onClick={() => setShowStatusOptions(!showStatusOptions)}
          className="flex-1 text-text-muted hover:text-primary"
        >
          Update
        </Button>
      </div>

      {/* Status options below */}
      {showStatusOptions && (
        <div className="mt-2 space-y-1">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => {
                onAction('updateStatus', invoice.id, status);
                setShowStatusOptions(false);
              }}
              className="block w-full text-left px-3 py-1 text-xs hover:bg-secondary-50 rounded"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileInvoiceCard;
