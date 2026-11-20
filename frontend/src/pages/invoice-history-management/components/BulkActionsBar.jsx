import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (selectedCount === 0) return null;

  const bulkActions = [
    {
      id: 'export',
      label: 'Export Selected',
      icon: 'Download',
      action: () => onBulkAction('export')
    },
    {
      id: 'mark-sent',
      label: 'Mark as Sent',
      icon: 'Send',
      action: () => onBulkAction('mark-sent')
    },
    {
      id: 'mark-paid',
      label: 'Mark as Paid',
      icon: 'CheckCircle',
      action: () => onBulkAction('mark-paid')
    },
    {
      id: 'duplicate',
      label: 'Duplicate Selected',
      icon: 'Copy',
      action: () => onBulkAction('duplicate')
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: 'Trash2',
      action: () => onBulkAction('delete'),
      variant: 'danger'
    }
  ];

  const handleActionClick = (action) => {
    action.action();
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-surface border border-border rounded-lg shadow-elevation-lg px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {selectedCount} invoice{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="primary"
                size="sm"
                iconName="ChevronDown"
                iconPosition="right"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Bulk Actions
              </Button>

              {isDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-48 bg-surface border border-border rounded-lg shadow-elevation-lg py-1 z-10">
                  {bulkActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-secondary-50 transition-colors ${
                        action.variant === 'danger' ? 'text-error-600 hover:bg-error-50' : 'text-text-primary'
                      }`}
                    >
                      <Icon name={action.icon} size={16} />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
              className="text-text-muted hover:text-text-primary"
              title="Clear Selection"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;