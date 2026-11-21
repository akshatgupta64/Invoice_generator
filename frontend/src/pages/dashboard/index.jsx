import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import invoiceService from '../../utils/invoiceService';
import customerService from '../../utils/customerService';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FileText, Users, DollarSign, TrendingUp, Clock, CheckCircle2,
  AlertTriangle, PlusCircle, ArrowUpRight, ArrowDownRight,
  Download, Eye, ChevronRight, ShieldCheck, Sparkles, Building2
} from 'lucide-react';

const STATUS_COLORS = {
  paid: '#10B981',
  sent: '#3B82F6',
  draft: '#6B7280',
  overdue: '#EF4444',
  cancelled: '#9CA3AF'
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [invRes, custRes] = await Promise.all([
          invoiceService.getInvoices(),
          customerService.getCustomers()
        ]);

        if (isMounted) {
          if (invRes?.success && invRes.data) {
            setInvoices(invRes.data);
            if (invRes.data[0]?.currency) {
              setCurrency(invRes.data[0].currency);
            }
          }
          if (custRes?.success && custRes.data) {
            setCustomers(custRes.data);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Financial Computations
  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const paidTotal = paidInvoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'draft');
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
  const overdueInvoices = invoices.filter(inv => {
    if (inv.status === 'paid' || inv.status === 'cancelled') return false;
    if (!inv.due_date) return false;
    return new Date(inv.due_date) < new Date();
  });
  const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

  const collectionRate = totalInvoiced > 0 ? Math.round((paidTotal / totalInvoiced) * 100) : 0;

  // Monthly Revenue Chart Data
  const monthlyDataMap = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthlyDataMap[key] = { month: key, billed: 0, collected: 0 };
  }

  invoices.forEach(inv => {
    if (!inv.created_at) return;
    const d = new Date(inv.created_at);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    if (monthlyDataMap[key]) {
      monthlyDataMap[key].billed += Number(inv.total_amount || 0);
      if (inv.status === 'paid') {
        monthlyDataMap[key].collected += Number(inv.total_amount || 0);
      }
    }
  });

  const chartData = Object.values(monthlyDataMap);

  // Status Distribution for Donut Chart
  const statusCounts = invoices.reduce((acc, inv) => {
    const st = inv.status || 'draft';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const statusPieData = [
    { name: 'Paid', value: statusCounts.paid || 0, color: STATUS_COLORS.paid },
    { name: 'Pending', value: statusCounts.sent || 0, color: STATUS_COLORS.sent },
    { name: 'Draft', value: statusCounts.draft || 0, color: STATUS_COLORS.draft },
    { name: 'Overdue', value: overdueInvoices.length, color: STATUS_COLORS.overdue }
  ].filter(item => item.value > 0);

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading executive analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Top Banner / Welcome */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-white/5 skew-x-12 transform pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Enterprise Billing Pulse
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-blue-100 text-sm max-w-xl">
                Your financial command center is live. Track receivables, generate compliance-ready invoices, and close deals faster.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/create-invoice')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 font-semibold text-sm rounded-xl shadow-lg hover:bg-blue-50 transition duration-150 ease-in-out"
              >
                <PlusCircle className="w-4 h-4" />
                Create Invoice
              </button>
              <button
                onClick={() => navigate('/clients')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-md transition duration-150"
              >
                <Users className="w-4 h-4" />
                Manage Clients
              </button>
            </div>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Invoiced */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Invoiced</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight">{formatCurrency(totalInvoiced)}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{invoices.length} invoices generated</span>
              </div>
            </div>
          </div>

          {/* Paid / Collected */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cash Collected</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{formatCurrency(paidTotal)}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(collectionRate, 100)}%` }}></div>
                </div>
                <span className="font-semibold">{collectionRate}% rate</span>
              </div>
            </div>
          </div>

          {/* Pending / Outstanding */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Receivables</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{formatCurrency(pendingTotal)}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                <span>{pendingInvoices.length} active invoices awaiting settlement</span>
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overdue Alerts</span>
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">{formatCurrency(overdueTotal)}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500 font-medium">
                <span>{overdueInvoices.length} overdue invoices requiring follow-up</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Inflow Area Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Revenue & Inflow Timeline</h2>
                <p className="text-xs text-slate-500 mt-1">Comparison of billed vs collected revenue over the last 6 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>Billed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Collected</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none' }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="billed" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBilled)" name="Billed" />
                  <Area type="monotone" dataKey="collected" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCollected)" name="Collected" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Status Donut Chart (1 col) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Invoice Status Matrix</h2>
              <p className="text-xs text-slate-500 mt-1">Breakdown of portfolio lifecycle</p>

              <div className="h-56 w-full mt-4 flex items-center justify-center">
                {statusPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-slate-400 text-xs py-8">
                    No status distribution yet
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              {statusPieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}:</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Invoices & Quick Launch CRM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Invoices Table (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Recent Invoices</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time status of recently created documents</p>
              </div>
              <Link
                to="/invoices"
                className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1"
              >
                View all ({invoices.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {invoices.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No invoices yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Create your first invoice in seconds to unlock full financial tracking.
                </p>
                <button
                  onClick={() => navigate('/create-invoice')}
                  className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition"
                >
                  Create Invoice Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Invoice #</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Due Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {invoices.slice(0, 5).map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {inv.invoice_number || 'INV-DRAFT'}
                        </td>
                        <td className="py-3.5 text-slate-600 dark:text-slate-400">
                          {inv.customer?.name || inv.customer?.company || 'Direct Client'}
                        </td>
                        <td className="py-3.5 text-slate-500 text-xs">
                          {inv.due_date || 'On receipt'}
                        </td>
                        <td className="py-3.5 font-bold">
                          {formatCurrency(inv.total_amount)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                            style={{
                              backgroundColor: `${STATUS_COLORS[inv.status || 'draft']}15`,
                              color: STATUS_COLORS[inv.status || 'draft']
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: STATUS_COLORS[inv.status || 'draft'] }}
                            />
                            {inv.status || 'draft'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to="/invoices"
                            className="p-1.5 text-slate-400 hover:text-primary transition inline-flex items-center"
                            title="Open in Invoices"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Client CRM Widget (1 col) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Active Clients</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Top customer relationships</p>
                </div>
                <Link
                  to="/clients"
                  className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-0.5"
                >
                  CRM
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {customers.length === 0 ? (
                <div className="py-10 text-center">
                  <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No client accounts saved yet.</p>
                  <button
                    onClick={() => navigate('/clients')}
                    className="mt-3 text-xs text-primary font-semibold hover:underline"
                  >
                    + Add your first client
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  {customers.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white font-bold text-xs flex items-center justify-center">
                          {c.name ? c.name.slice(0, 2).toUpperCase() : 'CL'}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{c.name}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[130px]">{c.email || c.company || 'Customer'}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/create-invoice')}
                        className="px-2.5 py-1 text-[11px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg font-medium hover:text-primary transition"
                      >
                        Bill
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  PostgreSQL RLS Protected
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{customers.length} total</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
