import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PreferencesTab = () => {
  const [preferences, setPreferences] = useState({
    defaultCurrency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '1,000.00',
    taxCalculation: 'exclusive',
    invoiceNumbering: 'auto',
    invoicePrefix: 'INV',
    startingNumber: '1000',
    timeZone: 'America/New_York',
    language: 'en',
    autoSave: true,
    emailNotifications: true,
    reminderDays: '7'
  });

  const [saveStatus, setSaveStatus] = useState('');

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
    { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
    { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
    { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
    { value: 'DD MMM YYYY', label: 'DD MMM YYYY (31 Dec 2024)' }
  ];

  const numberFormatOptions = [
    { value: '1,000.00', label: '1,000.00 (US/UK Format)' },
    { value: '1.000,00', label: '1.000,00 (European Format)' },
    { value: '1 000.00', label: '1 000.00 (French Format)' },
    { value: '1000.00', label: '1000.00 (No Separators)' }
  ];

  const taxCalculationOptions = [
    { value: 'exclusive', label: 'Tax Exclusive (Add tax to subtotal)' },
    { value: 'inclusive', label: 'Tax Inclusive (Tax included in prices)' }
  ];

  const timeZoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' }
  ];

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const generatePreviewInvoiceNumber = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const number = preferences.startingNumber || '1000';
    return `${preferences.invoicePrefix}-${month}-${year}-${number}`;
  };

  return (
    <div className="space-y-8">
      {/* Currency & Formatting */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-6">Currency & Formatting</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Default Currency
            </label>
            <select
              value={preferences.defaultCurrency}
              onChange={(e) => handlePreferenceChange('defaultCurrency', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {currencyOptions.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Date Format
            </label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dateFormatOptions.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Number Format
            </label>
            <select
              value={preferences.numberFormat}
              onChange={(e) => handlePreferenceChange('numberFormat', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {numberFormatOptions.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Time Zone
            </label>
            <select
              value={preferences.timeZone}
              onChange={(e) => handlePreferenceChange('timeZone', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {timeZoneOptions.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Tax Calculation</h3>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Tax Calculation Method
          </label>
          <div className="space-y-3">
            {taxCalculationOptions.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="taxCalculation"
                  value={option.value}
                  checked={preferences.taxCalculation === option.value}
                  onChange={(e) => handlePreferenceChange('taxCalculation', e.target.value)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">
                    {option.label.split(' (')[0]}
                  </span>
                  <p className="text-xs text-text-secondary">
                    {option.label.split(' (')[1]?.replace(')', '')}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Numbering */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Invoice Numbering</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Invoice Prefix
            </label>
            <Input
              type="text"
              value={preferences.invoicePrefix}
              onChange={(e) => handlePreferenceChange('invoicePrefix', e.target.value)}
              placeholder="INV"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Starting Number
            </label>
            <Input
              type="number"
              value={preferences.startingNumber}
              onChange={(e) => handlePreferenceChange('startingNumber', e.target.value)}
              placeholder="1000"
              min="1"
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-secondary-50 border border-secondary-200 rounded-md">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Eye" size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Preview</span>
          </div>
          <p className="text-sm text-text-secondary">
            Next invoice number: <span className="font-mono font-medium text-text-primary">
              {generatePreviewInvoiceNumber()}
            </span>
          </p>
        </div>
      </div>

      {/* System Preferences */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">System Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-text-primary">Auto-save drafts</span>
              <p className="text-xs text-text-secondary">Automatically save invoice drafts while editing</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.autoSave}
              onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-text-primary">Email notifications</span>
              <p className="text-xs text-text-secondary">Receive notifications for invoice updates</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
          </label>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Payment reminder (days before due date)
            </label>
            <Input
              type="number"
              value={preferences.reminderDays}
              onChange={(e) => handlePreferenceChange('reminderDays', e.target.value)}
              placeholder="7"
              min="1"
              max="30"
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="border-t border-border pt-6">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={saveStatus === 'saving'}
          iconName={saveStatus === 'success' ? 'Check' : 'Save'}
          className="w-full sm:w-auto"
        >
          {saveStatus === 'saving' ? 'Saving Preferences...' : 
           saveStatus === 'success' ? 'Preferences Saved!' : 'Save Preferences'}
        </Button>

        {saveStatus === 'success' && (
          <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success-600" />
              <span className="text-sm text-success-700">
                Preferences updated successfully!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesTab;