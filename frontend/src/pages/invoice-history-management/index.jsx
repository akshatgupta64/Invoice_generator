import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterToolbar from './components/FilterToolbar';
import InvoiceTable from './components/InvoiceTable';
import BulkActionsBar from './components/BulkActionsBar';
import SummaryCards from './components/SummaryCards';
import MobileInvoiceCard from './components/MobileInvoiceCard';
import Pagination from './components/Pagination';
import Button from '../../components/ui/Button';
import supabase from '../../utils/supabase';

const InvoiceHistoryManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'invoiceNumber', direction: 'desc' });
  const [filters, setFilters] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const summaryData = {
    totalInvoices: invoices.length,
    outstandingAmount: invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
    overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length,
    statusDistribution: invoices.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {})
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            id, invoice_number, status, created_at, due_date, pdf_url, total_amount,
            customers (name, email)
          `);
        if (error) throw error;

        const transformed = data.map(invoice => ({
          id: invoice.id,
          invoiceNumber: invoice.invoice_number,
          customerName: invoice.customers ? invoice.customers.name : 'N/A',
          customerEmail: invoice.customers ? invoice.customers.email : 'N/A',
          amount: invoice.total_amount,
          status: invoice.status,
          createdDate: invoice.created_at ? new Date(invoice.created_at).toISOString().split('T')[0] : null,
          dueDate: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : null,
          pdf_url: invoice.pdf_url || null,
        }));
        setInvoices(transformed);
        setFilteredInvoices(transformed);
      } catch (err) {
        console.error('Error fetching invoices:', err.message);
        setError('Failed to load invoices: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    let temp = [...invoices];
    if (filters.search) {
      temp = temp.filter(inv =>
        inv.invoiceNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
        inv.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        inv.customerEmail?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.status) temp = temp.filter(inv => inv.status === filters.status);
    if (filters.customer) temp = temp.filter(inv => inv.customerName?.toLowerCase().includes(filters.customer.toLowerCase()));
    if (filters.dateRange?.start || filters.dateRange?.end) {
      temp = temp.filter(inv => {
        const date = new Date(inv.createdDate);
        if (filters.dateRange.start && date < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange.end && date > new Date(filters.dateRange.end)) return false;
        return true;
      });
    }
    if (filters.amountRange?.min || filters.amountRange?.max) {
      temp = temp.filter(inv => {
        const min = filters.amountRange.min ? parseFloat(filters.amountRange.min) : 0;
        const max = filters.amountRange.max ? parseFloat(filters.amountRange.max) : Infinity;
        return inv.amount >= min && inv.amount <= max;
      });
    }

    if (sortConfig.key) {
      temp.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'amount') {
          aVal = parseFloat(aVal); bVal = parseFloat(bVal);
        } else if (sortConfig.key === 'createdDate' || sortConfig.key === 'dueDate') {
          aVal = new Date(aVal); bVal = new Date(bVal);
        } else if (sortConfig.key === 'invoiceNumber') {
          const comparison = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    setFilteredInvoices(temp);
    setCurrentPage(1);
  }, [invoices, filters, sortConfig]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleFiltersChange = (newFilters) => setFilters(prev => ({ ...prev, ...newFilters }));
  const handleClearFilters = () => {
    setFilters({});
    setSortConfig({ key: 'createdDate', direction: 'desc' });
  };

  const handleSelectionChange = (id) => {
    setSelectedInvoices(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  const handleSelectAllInvoices = () => {
    if (selectedInvoices.length === paginatedInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(paginatedInvoices.map(inv => inv.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on invoices:`, selectedInvoices);
    setSelectedInvoices([]);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (value) => { setItemsPerPage(value); setCurrentPage(1); };

  const handleAction = async (action, invoiceId, newStatus) => {
    if (action === 'download') {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      return invoice?.pdf_url || null;
    } else if (action === 'edit') {
      console.log(`Editing invoice: ${invoiceId}`);
    } else if (action === 'updateStatus') {
      try {
        setLoading(true);
        const { error } = await supabase.from('invoices').update({ status: newStatus }).eq('id', invoiceId);
        if (error) throw error;
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));
        console.log(`Invoice ${invoiceId} status updated to ${newStatus}`);
      } catch (error) {
        console.error('Error updating invoice status:', error.message);
        setError('Failed to update invoice status: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMobileAction = (action, invoiceId, newStatus) => {
    handleAction(action, invoiceId, newStatus);
  };

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Invoice History', link: '/invoice-history' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Invoice History & Management</h1>
              <p className="text-text-secondary mt-2">Track, search, and manage all your invoices</p>
            </div>
          
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <FilterToolbar filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />
              {loading && <p>Loading invoices...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {!loading && !error && (
                isMobile ? (
                  <div className="space-y-4">
                    {paginatedInvoices.map(invoice => (
                      <MobileInvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        isSelected={selectedInvoices.includes(invoice.id)}
                        onSelect={handleSelectionChange}
                        onAction={handleMobileAction}
                      />
                    ))}
                  </div>
                ) : (
                  <InvoiceTable
                    invoices={paginatedInvoices}
                    selectedInvoices={selectedInvoices}
                    onSelectionChange={handleSelectionChange}
                    onSelectAll={handleSelectAllInvoices}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onAction={handleAction}
                  />
                )
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredInvoices.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
            <div className="lg:col-span-1">
              <SummaryCards summaryData={summaryData} />
            </div>
          </div>
        </div>
      </main>

      {selectedInvoices.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedInvoices.length}
          onBulkAction={handleBulkAction}
          onClearSelection={() => setSelectedInvoices([])}
        />
      )}
    </div>
  );
};

export default InvoiceHistoryManagement;
