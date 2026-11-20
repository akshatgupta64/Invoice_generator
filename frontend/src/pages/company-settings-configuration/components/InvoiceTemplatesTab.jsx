import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const InvoiceTemplatesTab = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [customization, setCustomization] = useState({
    primaryColor: '#2563EB',
    secondaryColor: '#64748B',
    fontFamily: 'Inter',
    logoPosition: 'top-left',
    showCompanyAddress: true,
    showTaxId: true,
    footerText: 'Thank you for your business!'
  });

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, contemporary design with bold headers',
      preview: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop',
      features: ['Clean layout', 'Bold typography', 'Color customization']
    },
    {
      id: 'classic',
      name: 'Classic Business',
      description: 'Traditional layout with professional styling',
      preview: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?w=300&h=400&fit=crop',
      features: ['Traditional design', 'Formal structure', 'Conservative colors']
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple, distraction-free design',
      preview: 'https://images.pixabay.com/photo/2017/06/20/22/14/receipt-2424810_1280.jpg?w=300&h=400&fit=crop',
      features: ['Minimal design', 'Maximum readability', 'Space efficient']
    },
    {
      id: 'creative',
      name: 'Creative Edge',
      description: 'Modern design with creative elements',
      preview: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=400&fit=crop',
      features: ['Creative layout', 'Modern styling', 'Brand focused']
    }
  ];

  const colorOptions = [
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#059669' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#D97706' },
    { name: 'Teal', value: '#0D9488' }
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Lato', value: 'Lato' }
  ];

  const handleCustomizationChange = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveTemplate = () => {
    console.log('Saving template:', selectedTemplate, customization);
    alert('Template settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Choose Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative bg-surface border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedTemplate === template.id
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary-300'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <Image
                  src={template.preview}
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{template.name}</h4>
                  {selectedTemplate === template.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-3">{template.description}</p>
                <div className="space-y-1">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={12} className="text-success-600" />
                      <span className="text-xs text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customization Options */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Customize Template</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Customization */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Primary Color
              </label>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleCustomizationChange('primaryColor', color.value)}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                      customization.primaryColor === color.value
                        ? 'border-text-primary' :'border-border hover:border-text-secondary'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded-md"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-xs text-text-secondary mt-1 block">{color.name}</span>
                    {customization.primaryColor === color.value && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-text-primary rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Font Family
              </label>
              <div className="grid grid-cols-2 gap-3">
                {fontOptions.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => handleCustomizationChange('fontFamily', font.value)}
                    className={`p-3 text-left border-2 rounded-lg transition-all duration-200 ${
                      customization.fontFamily === font.value
                        ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                    }`}
                  >
                    <span className="font-medium text-text-primary" style={{ fontFamily: font.value }}>
                      {font.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Layout Options */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Logo Position
              </label>
              <div className="space-y-2">
                {[
                  { value: 'top-left', label: 'Top Left' },
                  { value: 'top-center', label: 'Top Center' },
                  { value: 'top-right', label: 'Top Right' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="logoPosition"
                      value={option.value}
                      checked={customization.logoPosition === option.value}
                      onChange={(e) => handleCustomizationChange('logoPosition', e.target.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary"
                    />
                    <span className="text-sm text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Display Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.showCompanyAddress}
                    onChange={(e) => handleCustomizationChange('showCompanyAddress', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">Show Company Address</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.showTaxId}
                    onChange={(e) => handleCustomizationChange('showTaxId', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">Show Tax ID</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Footer Text
              </label>
              <textarea
                value={customization.footerText}
                onChange={(e) => handleCustomizationChange('footerText', e.target.value)}
                placeholder="Enter custom footer text..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-border">
          <Button
            variant="primary"
            onClick={handleSaveTemplate}
            iconName="Save"
            className="w-full sm:w-auto"
          >
            Save Template Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplatesTab;