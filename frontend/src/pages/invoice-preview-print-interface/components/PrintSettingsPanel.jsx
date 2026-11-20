import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PrintSettingsPanel = ({ isOpen, onClose, onPrint, className = '' }) => {
  const [printSettings, setPrintSettings] = useState({
    printer: 'default',
    orientation: 'portrait',
    paperSize: 'A4',
    quality: 'high',
    copies: 1,
    colorMode: 'color',
    margins: 'normal',
    includeBackground: true,
    fitToPage: true
  });

  const printers = [
    { id: 'default', name: 'Default Printer', status: 'Ready' },
    { id: 'hp-office', name: 'HP OfficeJet Pro 9015', status: 'Ready' },
    { id: 'canon-pixma', name: 'Canon PIXMA TR8620', status: 'Offline' },
    { id: 'pdf-printer', name: 'Microsoft Print to PDF', status: 'Ready' }
  ];

  const handleSettingChange = (key, value) => {
    setPrintSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(printSettings);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-surface shadow-elevation-lg transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Print Settings</h2>
              <p className="text-sm text-text-secondary">Configure your print options</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Printer Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Select Printer
              </label>
              <div className="space-y-2">
                {printers.map((printer) => (
                  <div
                    key={printer.id}
                    className={`p-3 rounded-md border cursor-pointer transition-all duration-150 ${
                      printSettings.printer === printer.id
                        ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200'
                    } ${printer.status === 'Offline' ? 'opacity-50' : ''}`}
                    onClick={() => printer.status !== 'Offline' && handleSettingChange('printer', printer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{printer.name}</p>
                        <p className={`text-xs ${
                          printer.status === 'Ready' ? 'text-success-600' : 'text-error-600'
                        }`}>
                          {printer.status}
                        </p>
                      </div>
                      {printSettings.printer === printer.id && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page Setup */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">Page Setup</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary mb-2">Orientation</label>
                  <select
                    value={printSettings.orientation}
                    onChange={(e) => handleSettingChange('orientation', e.target.value)}
                    className="w-full p-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-2">Paper Size</label>
                  <select
                    value={printSettings.paperSize}
                    onChange={(e) => handleSettingChange('paperSize', e.target.value)}
                    className="w-full p-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Print Quality */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">Print Quality</label>
              <div className="space-y-2">
                {[
                  { value: 'draft', label: 'Draft', description: 'Fast, lower quality' },
                  { value: 'normal', label: 'Normal', description: 'Balanced speed and quality' },
                  { value: 'high', label: 'High', description: 'Best quality, slower' }
                ].map((quality) => (
                  <div
                    key={quality.value}
                    className={`p-3 rounded-md border cursor-pointer transition-all duration-150 ${
                      printSettings.quality === quality.value
                        ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200'
                    }`}
                    onClick={() => handleSettingChange('quality', quality.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{quality.label}</p>
                        <p className="text-xs text-text-secondary">{quality.description}</p>
                      </div>
                      {printSettings.quality === quality.value && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary">Number of Copies</p>
                    <p className="text-xs text-text-secondary">How many copies to print</p>
                  </div>
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={printSettings.copies}
                    onChange={(e) => handleSettingChange('copies', parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary">Color Mode</p>
                    <p className="text-xs text-text-secondary">Print in color or grayscale</p>
                  </div>
                  <select
                    value={printSettings.colorMode}
                    onChange={(e) => handleSettingChange('colorMode', e.target.value)}
                    className="p-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="color">Color</option>
                    <option value="grayscale">Grayscale</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary">Include Background</p>
                    <p className="text-xs text-text-secondary">Print background colors and images</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('includeBackground', !printSettings.includeBackground)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      printSettings.includeBackground ? 'bg-primary' : 'bg-secondary-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      printSettings.includeBackground ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary">Fit to Page</p>
                    <p className="text-xs text-text-secondary">Scale content to fit page</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('fitToPage', !printSettings.fitToPage)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      printSettings.fitToPage ? 'bg-primary' : 'bg-secondary-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      printSettings.fitToPage ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border p-6">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePrint}
                iconName="Printer"
                className="flex-1"
                disabled={printSettings.printer === 'canon-pixma'}
              >
                Print Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintSettingsPanel;