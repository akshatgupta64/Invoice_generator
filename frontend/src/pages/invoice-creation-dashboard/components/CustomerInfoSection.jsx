import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import customerService from '../../../utils/customerService';

const CustomerInfoSection = ({ 
  customerData, 
  onCustomerDataChange, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const [savedClients, setSavedClients] = useState([]);

  useEffect(() => {
    customerService.getCustomers().then(res => {
      if (res?.success && res.data) {
        setSavedClients(res.data);
      }
    });
  }, []);

  const handleSelectSavedClient = (clientId) => {
    const selected = savedClients.find(c => c.id === clientId);
    if (selected) {
      onCustomerDataChange({
        ...customerData,
        id: selected.id,
        name: selected.name || '',
        email: selected.email || '',
        phone: selected.phone || '',
        company: selected.company || '',
        address: selected.address || '',
        city: selected.city || '',
        state: selected.state || '',
        zipCode: selected.zip_code || ''
      });
    }
  };

  const handleInputChange = (field, value) => {
    onCustomerDataChange({
      ...customerData,
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
          <Icon name="Users" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Customer Information</h3>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>
      
      {!isCollapsed && (
        <div className="p-4 pt-0 space-y-4">
          {savedClients.length > 0 && (
            <div className="p-3 bg-indigo-50/70 dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                ⚡ Select from Saved Clients:
              </div>
              <select
                onChange={(e) => handleSelectSavedClient(e.target.value)}
                defaultValue=""
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>Choose existing client ({savedClients.length} available)...</option>
                {savedClients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Customer Name *
              </label>
              <Input
                type="text"
                placeholder="Enter customer name"
                value={customerData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="customer@example.com"
                value={customerData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Phone Number *
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={customerData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Company
              </label>
              <Input
                type="text"
                placeholder="Customer company"
                value={customerData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
              />
            </div>
          </div>

          {/* Customer Address */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Billing Address
            </label>
            <Input
              type="text"
              placeholder="Street address"
              value={customerData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                City
              </label>
              <Input
                type="text"
                placeholder="City"
                value={customerData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                State/Province
              </label>
              <Input
                type="text"
                placeholder="State"
                value={customerData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                ZIP/Postal Code
              </label>
              <Input
                type="text"
                placeholder="12345"
                value={customerData.zipCode || ''}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerInfoSection;