import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import catalogService from '../../utils/catalogService';
import {
  Package, Plus, Search, Tag, DollarSign, Clock,
  Edit2, Trash2, FileText, Check, X, Sparkles, Filter
} from 'lucide-react';

const CATEGORIES = ['All', 'Development', 'Design', 'Retainer', 'Consulting', 'Marketing', 'Goods'];

const Catalog = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rate: '',
    unit: 'Hour',
    category: 'Development'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const loadItems = () => {
    const list = catalogService.getItems();
    setItems(list);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        rate: item.rate || '',
        unit: item.unit || 'Hour',
        category: item.category || 'Development'
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        rate: '',
        unit: 'Hour',
        category: 'Development'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.rate) {
      alert('Item Name and Rate are required');
      return;
    }

    const payload = {
      ...formData,
      rate: parseFloat(formData.rate)
    };
    if (editingItem) {
      payload.id = editingItem.id;
    }

    catalogService.saveItem(payload);
    handleCloseModal();
    loadItems();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete product "${name}" from catalog?`)) {
      catalogService.deleteItem(id);
      loadItems();
    }
  };

  const handleUseInInvoice = (item) => {
    // Navigate to create invoice with state
    navigate('/create-invoice', { state: { prefillItem: item } });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Package className="w-4 h-4" />
              Products & Billable Services
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">Item Catalog & Pricing</h1>
            <p className="text-sm text-slate-500 mt-1">
              Store pre-configured line items and hourly rates to populate invoices instantly.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl shadow-md hover:bg-primary-dark transition"
          >
            <Plus className="w-4 h-4" />
            Add New Service / Product
          </button>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search catalog items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>
        </div>

        {/* Item Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Standard Rate</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    ${Number(item.rate).toFixed(2)}
                    <span className="text-xs font-normal text-slate-500 ml-1">/ {item.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleUseInInvoice(item)}
                  className="px-3.5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:opacity-90 transition inline-flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Bill This
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add/Edit Product */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold">
                  {editingItem ? 'Edit Catalog Service' : 'Add New Service / Product'}
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
                    Service / Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mobile App Development"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details on the scope of work or item specifications..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Rate / Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="95.00"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Billing Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Hour">Per Hour</option>
                      <option value="Project">Per Project</option>
                      <option value="Day">Per Day</option>
                      <option value="Month">Per Month</option>
                      <option value="Unit">Per Unit / Item</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Retainer">Retainer</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Goods">Goods</option>
                  </select>
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
                    className="px-5 py-2 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dark transition"
                  >
                    {editingItem ? 'Save Changes' : 'Create Product'}
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

export default Catalog;
