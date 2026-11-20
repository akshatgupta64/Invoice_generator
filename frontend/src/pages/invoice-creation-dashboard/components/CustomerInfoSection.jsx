import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CustomerInfoSection = ({ 
  customerData, 
  onCustomerDataChange, 
  isCollapsed, 
  onToggleCollapse 
}) => {
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