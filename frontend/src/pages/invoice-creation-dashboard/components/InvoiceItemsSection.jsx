import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const InvoiceItemsSection = ({ 
  items, 
  onItemsChange, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (id) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = (updatedItem.quantity || 0) * (updatedItem.rate || 0);
        }
        
        return updatedItem;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.1; // 10% tax rate
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary-50 transition-colors duration-150"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <Icon name="ShoppingCart" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Invoice Items</h3>
          {items.length > 0 && (
            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>
      
      {!isCollapsed && (
        <div className="p-4 pt-0 space-y-4">
          {/* Items List */}
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <Icon name="Package" size={48} className="mx-auto mb-3 text-text-muted" />
                <p className="text-sm">No items added yet</p>
                <p className="text-xs">Click "Add Item" to get started</p>
              </div>
            ) : (
              <>
                {/* Header Row - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-medium text-text-secondary uppercase tracking-wide pb-2 border-b border-border">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Rate</div>
                  <div className="col-span-2 text-center">Amount</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Items */}
                {items.map((item, index) => (
                  <div key={item.id} className="bg-secondary-50 rounded-lg p-3 space-y-3 md:space-y-0">
                    <div className="md:hidden flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">Item #{index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        iconName="Trash2"
                        className="text-error hover:text-error hover:bg-error-50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-5">
                        <label className="block md:hidden text-xs font-medium text-text-secondary mb-1">
                          Description
                        </label>
                        <Input
                          type="text"
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block md:hidden text-xs font-medium text-text-secondary mb-1">
                          Quantity
                        </label>
                        <Input
                          type="number"
                          placeholder="1"
                          min="0"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block md:hidden text-xs font-medium text-text-secondary mb-1">
                          Rate
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block md:hidden text-xs font-medium text-text-secondary mb-1">
                          Amount
                        </label>
                        <div className="px-3 py-2 bg-secondary-100 rounded-md text-sm font-medium text-text-primary">
                          {formatCurrency(item.amount || 0)}
                        </div>
                      </div>
                      
                      <div className="hidden md:block md:col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          iconName="Trash2"
                          className="text-error hover:text-error hover:bg-error-50 w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Add Item Button */}
          <Button
            variant="outline"
            onClick={addItem}
            iconName="Plus"
            className="w-full md:w-auto"
          >
            Add Item
          </Button>

          {/* Totals Section */}
          {items.length > 0 && (
            <div className="border-t border-border pt-4 mt-6">
              <div className="bg-secondary-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Tax (10%):</span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(calculateTax(calculateSubtotal()))}
                  </span>
                </div>
                
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-text-primary">Total:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceItemsSection;