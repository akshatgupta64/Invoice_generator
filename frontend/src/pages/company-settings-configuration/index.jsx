import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import CompanyProfileTab from './components/CompanyProfileTab';
import InvoiceTemplatesTab from './components/InvoiceTemplatesTab';
import PreferencesTab from './components/PreferencesTab';
import AccountManagementTab from './components/AccountManagementTab';

const CompanySettingsConfiguration = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      label: 'Company Profile',
      icon: 'Building2',
      description: 'Business information and logo'
    },
    {
      id: 'templates',
      label: 'Invoice Templates',
      icon: 'FileText',
      description: 'Customize invoice appearance'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      description: 'System and formatting settings'
    },
    {
      id: 'account',
      label: 'Account Management',
      icon: 'User',
      description: 'Security and account settings'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <CompanyProfileTab />;
      case 'templates':
        return <InvoiceTemplatesTab />;
      case 'preferences':
        return <PreferencesTab />;
      case 'account':
        return <AccountManagementTab />;
      default:
        return <CompanyProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="px-5 lg:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Settings" size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-text-primary">
                  Company Settings & Configuration
                </h1>
              </div>
              <p className="text-text-secondary">
                Configure your business information, invoice templates, and system preferences for professional branding.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Desktop Tabs Sidebar */}
              <div className="hidden lg:block">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 border-primary text-primary' :'bg-surface border-border text-text-secondary hover:bg-secondary-50 hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon 
                          name={tab.icon} 
                          size={20} 
                          className={activeTab === tab.id ? 'text-primary' : 'text-text-secondary'} 
                        />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      <p className="text-xs text-text-muted">{tab.description}</p>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Mobile/Tablet Tabs */}
              <div className="lg:hidden col-span-full">
                <div className="flex overflow-x-auto space-x-2 pb-4 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 border-primary text-primary' :'bg-surface border-border text-text-secondary hover:bg-secondary-50'
                      }`}
                    >
                      <Icon 
                        name={tab.icon} 
                        size={18} 
                        className={activeTab === tab.id ? 'text-primary' : 'text-text-secondary'} 
                      />
                      <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="lg:col-span-3">
                <div className="bg-surface border border-border rounded-lg shadow-elevation">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={tabs.find(tab => tab.id === activeTab)?.icon || 'Settings'} 
                        size={24} 
                        className="text-primary" 
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-text-primary">
                          {tabs.find(tab => tab.id === activeTab)?.label}
                        </h2>
                        <p className="text-sm text-text-secondary">
                          {tabs.find(tab => tab.id === activeTab)?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {renderTabContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanySettingsConfiguration;