import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CompanyInfoSection = ({ 
  companyData, 
  onCompanyDataChange, 
  onLogoUpload, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field, value) => {
    onCompanyDataChange({
      ...companyData,
      [field]: value
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }
    
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      alert('Only PNG and JPG files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onLogoUpload(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary-50 transition-colors duration-150"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Building2" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Company Information</h3>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>
      
      {!isCollapsed && (
        <div className="p-4 pt-0 space-y-4">
          {/* Logo Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Company Logo
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-150 ${
                dragActive 
                  ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-secondary-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {companyData.logo ? (
                <div className="space-y-3">
                  <img 
                    src={companyData.logo} 
                    alt="Company Logo" 
                    className="mx-auto h-16 w-auto object-contain"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLogoUpload(null)}
                    iconName="Trash2"
                  >
                    Remove Logo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Icon name="Upload" size={32} className="mx-auto text-text-muted" />
                  <div>
                    <p className="text-sm text-text-primary font-medium">
                      Drop your logo here, or click to browse
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Company Name *
              </label>
              <Input
                type="text"
                placeholder="Enter company name"
                value={companyData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="company@example.com"
                value={companyData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Phone Number *
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={companyData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Website
              </label>
              <Input
                type="url"
                placeholder="https://www.company.com"
                value={companyData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Company Address *
            </label>
            <Input
              type="text"
              placeholder="Street address"
              value={companyData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                City *
              </label>
              <Input
                type="text"
                placeholder="City"
                value={companyData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                State/Province *
              </label>
              <Input
                type="text"
                placeholder="State"
                value={companyData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                ZIP/Postal Code *
              </label>
              <Input
                type="text"
                placeholder="12345"
                value={companyData.zipCode || ''}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInfoSection;