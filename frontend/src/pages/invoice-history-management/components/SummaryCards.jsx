import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCards = ({ summaryData }) => {
  const cards = [
    {
      id: 'total-invoices',
      title: 'Total Invoices',
      value: summaryData.totalInvoices || 0,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary-50',
      change: summaryData.totalInvoicesChange || 0,
      changeType: summaryData.totalInvoicesChange >= 0 ? 'positive' : 'negative'
    },
    {
      id: 'outstanding-amount',
      title: 'Outstanding Amount',
      value: `$${(summaryData.outstandingAmount || 0).toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      change: summaryData.outstandingAmountChange || 0,
      changeType: summaryData.outstandingAmountChange <= 0 ? 'positive' : 'negative'
    },
    {
      id: 'paid-invoices',
      title: 'Paid This Month',
      value: summaryData.paidInvoices || 0,
      icon: 'CheckCircle',
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      change: summaryData.paidInvoicesChange || 0,
      changeType: summaryData.paidInvoicesChange >= 0 ? 'positive' : 'negative'
    },
    {
      id: 'overdue-invoices',
      title: 'Overdue Invoices',
      value: summaryData.overdueInvoices || 0,
      icon: 'AlertTriangle',
      color: 'text-error-600',
      bgColor: 'bg-error-50',
      change: summaryData.overdueInvoicesChange || 0,
      changeType: summaryData.overdueInvoicesChange <= 0 ? 'positive' : 'negative'
    }
  ];

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success-600' : 'text-error-600';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Summary</h3>
      
      {cards.map((card) => (
        <div key={card.id} className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon name={card.icon} size={20} className={card.color} />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">{card.title}</p>
                  <p className="text-xl font-semibold text-text-primary">{card.value}</p>
                </div>
              </div>
              
              {card.change !== 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <Icon 
                    name={getChangeIcon(card.changeType)} 
                    size={14} 
                    className={getChangeColor(card.changeType)} 
                  />
                  <span className={`text-xs font-medium ${getChangeColor(card.changeType)}`}>
                    {Math.abs(card.change)}%
                  </span>
                  <span className="text-xs text-text-muted">vs last month</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Payment Status Distribution */}
      <div className="bg-surface border border-border rounded-lg p-4 mt-6">
        <h4 className="text-sm font-medium text-text-primary mb-3">Payment Status</h4>
        <div className="space-y-3">
          {[
            { status: 'Paid', count: summaryData.statusDistribution?.paid || 0, color: 'bg-success-500' },
            { status: 'Sent', count: summaryData.statusDistribution?.sent || 0, color: 'bg-accent-500' },
            { status: 'Draft', count: summaryData.statusDistribution?.draft || 0, color: 'bg-secondary-400' },
            { status: 'Overdue', count: summaryData.statusDistribution?.overdue || 0, color: 'bg-error-500' }
          ].map((item) => {
            const total = summaryData.totalInvoices || 1;
            const percentage = Math.round((item.count / total) * 100);
            
            return (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-text-primary">{item.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{item.count}</span>
                  <span className="text-xs text-text-muted">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;