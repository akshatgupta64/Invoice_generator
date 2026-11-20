import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const EmailModal = ({ isOpen, onClose, onSend, invoiceData, className = '' }) => {
  const [emailForm, setEmailForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: `Invoice ${invoiceData?.invoiceNumber || 'INV-07-2025-632'} from ${invoiceData?.company?.name || 'TechSolutions Inc.'}`,
    message: `Dear ${invoiceData?.customer?.name || 'Valued Customer'},\n\nPlease find attached your invoice for the services provided. The payment is due by ${invoiceData?.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : 'the due date specified'}.\n\nIf you have any questions about this invoice, please don't hesitate to contact us.\n\nThank you for your business!\n\nBest regards,\n${invoiceData?.company?.name || 'TechSolutions Inc.'}`
  });

  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      name: `Invoice-${invoiceData?.invoiceNumber || 'INV-07-2025-632'}.pdf`,
      size: '245 KB',
      type: 'PDF'
    }
  ]);

  const handleInputChange = (field, value) => {
    setEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSend = async () => {
    setIsLoading(true);
    
    // Simulate email sending
    setTimeout(() => {
      if (onSend) {
        onSend({
          ...emailForm,
          attachments
        });
      }
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  const isFormValid = emailForm.to.trim() && emailForm.subject.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-surface rounded-lg shadow-elevation-lg overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="Mail" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Send Invoice via Email</h2>
                <p className="text-sm text-text-secondary">Share your invoice with clients</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              disabled={isLoading}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Email Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Recipients */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    To <span className="text-error-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="recipient@example.com"
                    value={emailForm.to}
                    onChange={(e) => handleInputChange('to', e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      CC
                    </label>
                    <Input
                      type="email"
                      placeholder="cc@example.com"
                      value={emailForm.cc}
                      onChange={(e) => handleInputChange('cc', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      BCC
                    </label>
                    <Input
                      type="email"
                      placeholder="bcc@example.com"
                      value={emailForm.bcc}
                      onChange={(e) => handleInputChange('bcc', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Subject <span className="text-error-500">*</span>
                </label>
                <Input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Message
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-vertical"
                  placeholder="Enter your message here..."
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Attachments
                </label>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-secondary-50 border border-border rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-error-100 rounded-md flex items-center justify-center">
                          <Icon name="FileText" size={16} className="text-error-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{attachment.name}</p>
                          <p className="text-xs text-text-secondary">{attachment.size} • {attachment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-success-100 text-success-600 px-2 py-1 rounded-full">
                          Ready
                        </span>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="p-1 text-text-muted hover:text-error-500"
                          onClick={() => {
                            setAttachments(prev => prev.filter(a => a.id !== attachment.id));
                          }}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Attachment Button */}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Paperclip"
                  className="mt-3"
                  onClick={() => {
                    // File picker functionality would go here
                    console.log('Add attachment');
                  }}
                >
                  Add Attachment
                </Button>
              </div>

              {/* Email Options */}
              <div className="bg-secondary-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-text-primary mb-3">Email Options</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-primary">Request Read Receipt</p>
                      <p className="text-xs text-text-secondary">Get notified when recipient opens the email</p>
                    </div>
                    <button className="w-10 h-6 bg-secondary-300 rounded-full">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-0.5"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-primary">High Priority</p>
                      <p className="text-xs text-text-secondary">Mark this email as high priority</p>
                    </div>
                    <button className="w-10 h-6 bg-secondary-300 rounded-full">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-0.5"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Save"
                  onClick={() => {
                    // Save draft functionality
                    console.log('Save draft');
                  }}
                >
                  Save Draft
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Eye"
                  onClick={() => {
                    // Preview email functionality
                    console.log('Preview email');
                  }}
                >
                  Preview
                </Button>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSend}
                  iconName="Send"
                  loading={isLoading}
                  disabled={!isFormValid}
                >
                  {isLoading ? 'Sending...' : 'Send Email'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;