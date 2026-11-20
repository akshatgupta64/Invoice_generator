import React from 'react';
import Button from './Button';

const ActionButtonCluster = ({ 
  actions = [],
  layout = 'horizontal',
  size = 'md',
  className = '',
  loading = false
}) => {
  const defaultActions = [
    {
      label: 'Save Draft',
      variant: 'secondary',
      iconName: 'Save',
      onClick: () => console.log('Save draft'),
      tooltip: 'Save as draft'
    },
    {
      label: 'Preview',
      variant: 'outline',
      iconName: 'Eye',
      onClick: () => console.log('Preview'),
      tooltip: 'Preview invoice'
    },
    {
      label: 'Generate Invoice',
      variant: 'primary',
      iconName: 'FileText',
      onClick: () => console.log('Generate'),
      tooltip: 'Generate final invoice'
    }
  ];

  const actionItems = actions.length > 0 ? actions : defaultActions;

  const getLayoutClasses = () => {
    const baseClasses = 'flex gap-3';
    
    switch (layout) {
      case 'vertical':
        return `${baseClasses} flex-col`;
      case 'horizontal':
      default:
        return `${baseClasses} flex-row flex-wrap`;
    }
  };

  const getResponsiveClasses = () => {
    if (layout === 'horizontal') {
      return 'sm:flex-row sm:flex-nowrap';
    }
    return '';
  };

  return (
    <div className={`${getLayoutClasses()} ${getResponsiveClasses()} ${className}`}>
      {actionItems.map((action, index) => (
        <Button
          key={action.key || index}
          variant={action.variant || 'primary'}
          size={size}
          onClick={action.onClick}
          disabled={action.disabled || loading}
          loading={action.loading || (loading && action.primary)}
          iconName={action.iconName}
          iconPosition={action.iconPosition || 'left'}
          className={action.className}
          title={action.tooltip}
          fullWidth={layout === 'vertical'}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default ActionButtonCluster;