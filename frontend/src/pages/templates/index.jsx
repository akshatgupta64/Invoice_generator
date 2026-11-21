import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import { pdf } from '@react-pdf/renderer';
import InvoicePDFDocument from '../../components/pdf/InvoicePDFDocument';
import {
  Palette, Download, Eye, Check, Sparkles, Sliders,
  FileText, Shield, Globe, Award, CheckCircle2, ChevronRight
} from 'lucide-react';

const TEMPLATES = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimalist',
    description: 'Clean typographic layout favored by tech startups, design studios, and consultancies.',
    badge: 'Popular',
    color: '#3B82F6',
    features: ['Bold headers', 'Compact line items', 'High readability']
  },
  {
    id: 'corporate-executive',
    name: 'Corporate Executive',
    description: 'Traditional formal structure with structured borders and bank wire instruction blocks.',
    badge: 'Enterprise',
    color: '#0F172A',
    features: ['Official tax table', 'Full company registration block', 'Multi-currency support']
  },
  {
    id: 'creative-bold',
    name: 'Creative Studio',
    description: 'High-contrast design with accent color highlights for agencies and freelancers.',
    badge: 'Creative',
    color: '#8B5CF6',
    features: ['Vibrant accent header', 'Detailed scope notes', 'Portfolio links']
  },
  {
    id: 'emerald-trust',
    name: 'Fintech Clean',
    description: 'Trust-focused layout with emerald green balance indicators and clear payment terms.',
    badge: 'Recommended',
    color: '#10B981',
    features: ['Clear payment deadline', 'Prominent bank details', 'Due on receipt badge']
  }
];

const ACCENT_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#0F172A'];

const Templates = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState('modern-minimal');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const sampleInvoice = {
    invoiceNumber: 'INV-2026-894',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentTerms: 'net_30',
    currency: 'USD',
    notes: 'Thank you for your partnership! Payment is due within 30 days via direct wire or ACH.'
  };

  const sampleCompany = {
    name: 'Apex Digital Technologies LLC',
    email: 'billing@apexdigital.io',
    phone: '+1 (800) 555-0199',
    address: '500 Technology Square, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    website: 'https://apexdigital.io'
  };

  const sampleCustomer = {
    name: 'Horizon Global Ventures',
    email: 'accounts@horizonglobal.com',
    company: 'Horizon Global Inc.',
    address: '742 Evergreen Blvd',
    city: 'Austin',
    state: 'TX'
  };

  const sampleItems = [
    { description: 'Cloud Architecture & Enterprise Backend Setup', quantity: 40, rate: 125, amount: 5000 },
    { description: 'React SaaS Dashboard UI & Design System', quantity: 35, rate: 95, amount: 3325 },
    { description: 'Database Security & Row-Level Authorization Audit', quantity: 15, rate: 110, amount: 1650 }
  ];

  const handleDownloadSample = async () => {
    try {
      setDownloading(true);
      const blob = await pdf(
        <InvoicePDFDocument
          invoiceDetails={sampleInvoice}
          companyData={sampleCompany}
          customerData={sampleCustomer}
          items={sampleItems}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_Sample_${selectedTemplate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Error generating template PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Palette className="w-4 h-4" />
              Document Customization Studio
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">Invoice Templates & Styling</h1>
            <p className="text-sm text-slate-500 mt-1">
              Select design systems and color palettes for enterprise compliance and client presentation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadSample}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Rendering PDF...' : 'Download Template Sample'}
            </button>
            <button
              onClick={() => navigate('/create-invoice')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl shadow-md hover:bg-primary-dark transition"
            >
              <FileText className="w-4 h-4" />
              Use This Design
            </button>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                setSelectedTemplate(tmpl.id);
                setSelectedColor(tmpl.color);
              }}
              className={`cursor-pointer rounded-2xl p-5 border transition flex flex-col justify-between ${
                selectedTemplate === tmpl.id
                  ? 'bg-white dark:bg-slate-900 border-primary shadow-lg ring-2 ring-primary/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: tmpl.color }}
                  >
                    {tmpl.badge}
                  </span>
                  {selectedTemplate === tmpl.id && (
                    <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{tmpl.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {tmpl.description}
                </p>

                <div className="mt-4 space-y-1.5">
                  {tmpl.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-primary">
                <span>{selectedTemplate === tmpl.id ? 'Active Selected' : 'Click to select'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Live Interactive Preview Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Mock Preview</div>
              <h2 className="text-xl font-bold mt-1">High-Fidelity Document Rendering</h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Accent Hue:</span>
              <div className="flex items-center gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      selectedColor === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Rendered Invoice Paper Representation */}
          <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 space-y-8 font-sans">
            {/* Top Bar / Header */}
            <div className="flex justify-between items-start">
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl mb-3 shadow-md"
                  style={{ backgroundColor: selectedColor }}
                >
                  AP
                </div>
                <h3 className="font-extrabold text-xl">{sampleCompany.name}</h3>
                <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                  <div>{sampleCompany.address}</div>
                  <div>{sampleCompany.city}, {sampleCompany.state}</div>
                  <div>{sampleCompany.email} • {sampleCompany.phone}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black tracking-tight" style={{ color: selectedColor }}>
                  INVOICE
                </div>
                <div className="font-mono text-xs font-bold text-slate-600 mt-1">{sampleInvoice.invoiceNumber}</div>
                <div className="text-xs text-slate-500 mt-2">
                  <div><span className="font-semibold">Issue:</span> {sampleInvoice.issueDate}</div>
                  <div><span className="font-semibold">Due:</span> {sampleInvoice.dueDate}</div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Billed To</div>
                <div className="font-bold text-sm text-slate-900">{sampleCustomer.name}</div>
                <div className="text-xs text-slate-500">{sampleCustomer.company}</div>
                <div className="text-xs text-slate-500">{sampleCustomer.address}, {sampleCustomer.city}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Terms</div>
                <div className="text-xs font-bold text-slate-800">Net 30 Days</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">Due on Receipt</div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Rate</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sampleItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-slate-900">{item.description}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">${item.rate.toFixed(2)}</td>
                    <td className="py-3 text-right font-bold">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotal & Total Block */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">$9,975.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard VAT / Tax (10%):</span>
                  <span className="font-semibold">$997.50</span>
                </div>
                <div
                  className="flex justify-between text-base font-extrabold pt-2 border-t-2 border-slate-900"
                  style={{ color: selectedColor }}
                >
                  <span>Total Due:</span>
                  <span>$10,972.50</span>
                </div>
              </div>
            </div>

            {/* Footer notes */}
            <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
              <div>{sampleInvoice.notes}</div>
              <div className="font-semibold text-slate-400">Page 1 of 1</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Templates;
