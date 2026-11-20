import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CompanyProfileTab = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "TechCorp Solutions",
    address: "123 Business Avenue, Suite 456",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
    email: "contact@techcorp.com",
    website: "www.techcorp.com",
    taxId: "12-3456789"
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center");
  const [dragActive, setDragActive] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
      alert('Please upload a PNG or JPG file only.');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Company Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Business Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Company Name *
              </label>
              <Input
                type="text"
                value={companyData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Business Address *
              </label>
              <Input
                type="text"
                value={companyData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  City *
                </label>
                <Input
                  type="text"
                  value={companyData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  State/Province *
                </label>
                <Input
                  type="text"
                  value={companyData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  ZIP/Postal Code *
                </label>
                <Input
                  type="text"
                  value={companyData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="ZIP Code"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Country *
                </label>
                <Input
                  type="text"
                  value={companyData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Country"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={companyData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={companyData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Website
              </label>
              <Input
                type="url"
                value={companyData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="www.company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tax ID/EIN *
              </label>
              <Input
                type="text"
                value={companyData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="12-3456789"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Logo Upload */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Company Logo</h3>
          
          {/* Logo Preview */}
          <div className="mb-6">
            <div className="w-48 h-48 mx-auto bg-secondary-50 rounded-lg border-2 border-border overflow-hidden">
              <Image
                src={logoPreview}
                alt="Company Logo Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              dragActive 
                ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-secondary-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="Upload" size={24} className="text-primary" />
                </div>
              </div>
              
              <div>
                <p className="text-text-primary font-medium">
                  Drop your logo here, or <span className="text-primary">browse</span>
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  PNG or JPG files only, max 2MB
                </p>
              </div>
            </div>
          </div>

          {logoFile && (
            <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success-600" />
                <span className="text-sm text-success-700">
                  Logo uploaded: {logoFile.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-border">
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saveStatus === 'saving'}
            iconName={saveStatus === 'success' ? 'Check' : 'Save'}
            fullWidth
          >
            {saveStatus === 'saving' ? 'Saving Changes...' : 
             saveStatus === 'success' ? 'Changes Saved!' : 'Save Changes'}
          </Button>

          {saveStatus === 'success' && (
            <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success-600" />
                <span className="text-sm text-success-700">
                  Company profile updated successfully!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileTab;