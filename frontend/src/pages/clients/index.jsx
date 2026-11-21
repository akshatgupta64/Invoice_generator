import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import customerService from '../../utils/customerService';
import invoiceService from '../../utils/invoiceService';
import {
  Users, UserPlus, Search, Building, Mail, Phone, MapPin,
  Edit2, Trash2, FileText, Plus, X, Check, ArrowRight,
  ExternalLink, Sparkles
} from 'lucide-react';

const Clients = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [custRes, invRes] = await Promise.all([
        customerService.getCustomers(),
        invoiceService.getInvoices()
      ]);
      if (custRes?.success && custRes.data) {
        setCustomers(custRes.data);
      }
      if (invRes?.success && invRes.data) {
        setInvoices(invRes.data);
      }
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip_code: customer.zip_code || ''
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        city: '',
        state: '',
        zip_code: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Client Name is required');
      return;
    }

    try {
      setSaving(true);
      if (editingCustomer) {
        const res = await customerService.updateCustomer(editingCustomer.id, formData);
        if (res.success) {
          alert('Client updated successfully!');
          handleCloseModal();
          loadData();
        } else {
          alert(res.error || 'Failed to update client');
        }
      } else {
        const res = await customerService.createCustomer(formData);
        if (res.success) {
          alert('Client created successfully!');
          handleCloseModal();
          loadData();
        } else {
          alert(res.error || 'Failed to create client');
        }
      }
    } catch (err) {
      console.error('Error saving client:', err);
      alert('Error saving client');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete client "${name}"?`)) {
      try {
        const res = await customerService.deleteCustomer(id);
        if (res.success) {
          loadData();
        } else {
          alert(res.error || 'Failed to delete client');
        }
      } catch (err) {
        console.error('Error deleting client:', err);
      }
    }
  };

  // Compute Client Stats
  const getClientInvoiceStats = (customerId) => {
    const clientInvs = invoices.filter(inv => inv.customer_id === customerId);
    const totalBilled = clientInvs.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
    const pendingAmount = clientInvs
      .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
      .reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
    return {
      count: clientInvs.length,
      totalBilled,
      pendingAmount
    };
  };

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Users className="w-4 h-4" />
              Client Relationship Management
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">Clients & Accounts</h1>
            <p className="text-sm text-slate-500 mt-1">
              Maintain company contact directories, payment terms, and aggregate billing histories.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl shadow-md hover:bg-primary-dark transition"
          >
            <UserPlus className="w-4 h-4" />
            Add New Client
          </button>
        </div>

        {/* Search & Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Total Clients</div>
              <div className="text-2xl font-bold mt-1">{customers.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Active Accounts</div>
              <div className="text-2xl font-bold mt-1 text-emerald-600">
                {customers.filter(c => getClientInvoiceStats(c.id).count > 0).length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Global Portfolio</div>
              <div className="text-2xl font-bold mt-1 text-indigo-600">
                ${invoices.reduce((s, i) => s + Number(i.total_amount || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Search clients by name, email, or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-slate-400 text-slate-900 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Client Table / List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
              Loading client records...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-14 h-14 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-base font-bold">No clients found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchQuery ? 'Try matching another name or keyword.' : 'Add your first client to start sending invoices in one click.'}
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition"
              >
                + Add Client Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Client / Company</th>
                    <th className="py-3.5 px-6">Contact Info</th>
                    <th className="py-3.5 px-6">Address</th>
                    <th className="py-3.5 px-6">Invoices</th>
                    <th className="py-3.5 px-6">Total Billed</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCustomers.map((c) => {
                    const stats = getClientInvoiceStats(c.id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                              {c.name ? c.name.slice(0, 2).toUpperCase() : 'CL'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100">{c.name}</div>
                              {c.company && (
                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Building className="w-3 h-3" />
                                  {c.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400">
                          {c.email && (
                            <div className="flex items-center gap-1.5 mb-1">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                            </div>
                          )}
                          {c.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{c.phone}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-500 max-w-xs">
                          {c.city || c.address ? (
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <span>{[c.address, c.city, c.state, c.zip_code].filter(Boolean).join(', ')}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No address on file</span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {stats.count} invoices
                          </span>
                        </td>

                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-100">
                          ${stats.totalBilled.toLocaleString()}
                          {stats.pendingAmount > 0 && (
                            <div className="text-[11px] text-amber-600 font-medium">
                              ${stats.pendingAmount.toLocaleString()} pending
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate('/create-invoice')}
                              className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold rounded-lg transition inline-flex items-center gap-1"
                              title="Create Invoice for Client"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Bill
                            </button>
                            <button
                              onClick={() => handleOpenModal(c)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                              title="Edit Client Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id, c.name)}
                              className="p-1.5 text-slate-400 hover:text-red-500 transition"
                              title="Delete Client"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Add / Edit Client */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold">
                  {editingCustomer ? 'Edit Client Record' : 'Add New Client Profile'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Client / Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="billing@acme.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Market St"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      ZIP
                    </label>
                    <input
                      type="text"
                      placeholder="10001"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingCustomer ? 'Update Client' : 'Save Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Clients;
