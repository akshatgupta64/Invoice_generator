import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterToolbar = ({ onFiltersChange, activeFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: { start: '', end: '' },
    customer: '',
    amountRange: { min: '', max: '' },
    ...activeFilters
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const updatedDateRange = { ...filters.dateRange, [type]: value };
    const updatedFilters = { ...filters, dateRange: updatedDateRange };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleAmountRangeChange = (type, value) => {
    const updatedAmountRange = { ...filters.amountRange, [type]: value };
    const updatedFilters = { ...filters, amountRange: updatedAmountRange };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      dateRange: { start: '', end: '' },
      customer: '',
      amountRange: { min: '', max: '' }
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.customer) count++;
    if (filters.amountRange.min || filters.amountRange.max) count++;
    return count;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="text"
              placeholder="Search invoices..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
          
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              iconName="X"
              className="text-text-muted hover:text-text-primary"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Customer Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Customer</label>
              <Input
                type="text"
                placeholder="Filter by customer name"
                value={filters.customer}
                onChange={(e) => handleFilterChange('customer', e.target.value)}
              />
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Amount Range</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.amountRange.min}
                  onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.amountRange.max}
                  onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;