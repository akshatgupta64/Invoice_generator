import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TemplateSelector = ({ selectedTemplate, onTemplateChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const templates = [
    {
      id: 'standard',
      name: 'A4 Standard',
      description: 'Professional standard layout',
      preview: 'Standard business format with clean typography',
      isDefault: true
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with accent colors',
      preview: 'Modern layout with enhanced visual elements',
      isDefault: false
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design',
      preview: 'Minimalist approach with essential information',
      isDefault: false
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Formal business template',
      preview: 'Traditional corporate styling with formal structure',
      isDefault: false
    }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  const handleTemplateSelect = (templateId) => {
    if (onTemplateChange) {
      onTemplateChange(templateId);
    }
    setIsExpanded(false);
  };

  return (
    <div className={`bg-surface border border-border rounded-lg shadow-elevation ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Invoice Template</h3>
            <p className="text-xs text-text-secondary">Choose your preferred format</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            className="p-2"
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </Button>
        </div>

        {/* Current Selection */}
        <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="FileText" size={16} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{currentTemplate.name}</p>
              <p className="text-xs text-text-secondary">{currentTemplate.description}</p>
            </div>
          </div>
          {currentTemplate.isDefault && (
            <span className="text-xs bg-success-100 text-success-600 px-2 py-1 rounded-full">
              Default
            </span>
          )}
        </div>

        {/* Template Options */}
        {isExpanded && (
          <div className="mt-4 space-y-2">
            <div className="border-t border-border pt-3">
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
                Available Templates
              </p>
              
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-md border cursor-pointer transition-all duration-150 ${
                      selectedTemplate === template.id
                        ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200 hover:bg-secondary-50'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-text-primary">{template.name}</h4>
                          {template.isDefault && (
                            <span className="text-xs bg-secondary-100 text-secondary-600 px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary mb-2">{template.description}</p>
                        <p className="text-xs text-text-muted">{template.preview}</p>
                      </div>
                      
                      <div className="ml-3">
                        {selectedTemplate === template.id ? (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Icon name="Check" size={12} color="white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-border rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Actions */}
            <div className="border-t border-border pt-3 mt-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  className="flex-1"
                  onClick={() => {
                    // Preview functionality
                    console.log('Preview template:', selectedTemplate);
                  }}
                >
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="RotateCcw"
                  onClick={() => handleTemplateSelect('standard')}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;