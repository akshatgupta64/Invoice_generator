import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const InvoiceDetailsSection = ({
  invoiceDetails,
  onInvoiceDetailsChange,
  isCollapsed,
  onToggleCollapse,
  onGenerateInvoiceNumber // Add this prop
}) => {
  const handleInputChange = (field, value) => {
    onInvoiceDetailsChange({
      ...invoiceDetails,
      [field]: value
    });
  };





  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary-50 transition-colors duration-150"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Invoice Details</h3>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>
      
      {!isCollapsed && (
        <div className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Invoice Number *
              </label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="INV-07-2025-632"
                  value={invoiceDetails.invoiceNumber || ''}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  required
                  className="flex-1"
                />

              </div>
            </div>
            

            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Issue Date *
              </label>
              <Input
                type="date"
                value={invoiceDetails.issueDate || ''}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Due Date *
              </label>
              <Input
                type="date"
                value={invoiceDetails.dueDate || ''}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Payment Terms
              </label>
              <select
                value={invoiceDetails.paymentTerms || 'net_30'}
                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_60">Net 60</option>
                <option value="net_90">Net 90</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Currency
              </label>
              <select
                value={invoiceDetails.currency || 'USD'}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Notes/Comments
            </label>
            <textarea
              placeholder="Add any additional notes or payment instructions..."
              value={invoiceDetails.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailsSection;