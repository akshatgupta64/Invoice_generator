import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AccountManagementTab = () => {
  const [accountData, setAccountData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: '30'
  });

  const [exportData, setExportData] = useState({
    format: 'json',
    includeInvoices: true,
    includeCustomers: true,
    includeSettings: true
  });

  const [saveStatus, setSaveStatus] = useState('');

  const handleAccountChange = (field, value) => {
    setAccountData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportChange = (field, value) => {
    setExportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = () => {
    if (accountData.newPassword !== accountData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (accountData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setAccountData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const handleExportData = () => {
    console.log('Exporting data:', exportData);
    alert('Data export initiated! You will receive a download link via email.');
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
    );
    if (confirmation) {
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  const activityLogs = [
    {
      id: 1,
      action: 'Password changed',
      timestamp: '2024-01-15 10:30 AM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows'
    },
    {
      id: 2,
      action: 'Login successful',
      timestamp: '2024-01-15 09:15 AM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows'
    },
    {
      id: 3,
      action: 'Settings updated',
      timestamp: '2024-01-14 03:45 PM',
      ipAddress: '192.168.1.100',
      device: 'Safari on macOS'
    },
    {
      id: 4,
      action: 'Invoice generated',
      timestamp: '2024-01-14 02:20 PM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Password Change */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-6">Change Password</h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Current Password
            </label>
            <Input
              type="password"
              value={accountData.currentPassword}
              onChange={(e) => handleAccountChange('currentPassword', e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              New Password
            </label>
            <Input
              type="password"
              value={accountData.newPassword}
              onChange={(e) => handleAccountChange('newPassword', e.target.value)}
              placeholder="Enter new password"
            />
            <p className="text-xs text-text-secondary mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={accountData.confirmPassword}
              onChange={(e) => handleAccountChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <Button
            variant="primary"
            onClick={handlePasswordChange}
            loading={saveStatus === 'saving'}
            iconName={saveStatus === 'success' ? 'Check' : 'Lock'}
            disabled={!accountData.currentPassword || !accountData.newPassword || !accountData.confirmPassword}
          >
            {saveStatus === 'saving' ? 'Updating Password...' : 
             saveStatus === 'success' ? 'Password Updated!' : 'Update Password'}
          </Button>

          {saveStatus === 'success' && (
            <div className="p-3 bg-success-50 border border-success-200 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success-600" />
                <span className="text-sm text-success-700">
                  Password updated successfully!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Security Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Two-Factor Authentication</h4>
              <p className="text-sm text-text-secondary">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <Button
                variant={securitySettings.twoFactorAuth ? 'secondary' : 'primary'}
                size="sm"
              >
                {securitySettings.twoFactorAuth ? 'Configure' : 'Enable'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Login notifications</span>
              <p className="text-xs text-text-secondary">Get notified of new login attempts</p>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.loginNotifications}
              onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-text-primary">Session timeout (minutes)</span>
              <p className="text-xs text-text-secondary">Automatically log out after inactivity</p>
            </div>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
              className="px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Data Export</h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Export Format
            </label>
            <select
              value={exportData.format}
              onChange={(e) => handleExportChange('format', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Include Data
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportData.includeInvoices}
                  onChange={(e) => handleExportChange('includeInvoices', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Invoices</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportData.includeCustomers}
                  onChange={(e) => handleExportChange('includeCustomers', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Customer Data</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportData.includeSettings}
                  onChange={(e) => handleExportChange('includeSettings', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Settings</span>
              </label>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={handleExportData}
            iconName="Download"
          >
            Export Data
          </Button>
        </div>
      </div>

      {/* Activity Log */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Recent Activity</h3>
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3 text-sm text-text-primary">{log.action}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{log.timestamp}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{log.device}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary font-mono">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-error-200 pt-8">
        <h3 className="text-lg font-semibold text-error-600 mb-6">Danger Zone</h3>
        <div className="p-6 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Icon name="AlertTriangle" size={24} className="text-error-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-error-800 mb-2">Delete Account</h4>
              <p className="text-sm text-error-700 mb-4">
                Once you delete your account, there is no going back. Please be certain. All your invoices, 
                customer data, and settings will be permanently deleted.
              </p>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                iconName="Trash2"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagementTab;