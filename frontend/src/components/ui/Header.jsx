import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, FileText, PlusCircle, Users, Package,
  Palette, Settings, LogOut, ChevronDown, Plus, Sparkles,
  Menu, X, ExternalLink, ShieldCheck, User
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);
  const quickCreateRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (quickCreateRef.current && !quickCreateRef.current.contains(e.target)) {
        setIsQuickCreateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) {
      navigate('/login');
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Create', href: '/create-invoice', icon: PlusCircle },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Catalog', href: '/catalog', icon: Package },
    { name: 'Templates', href: '/templates', icon: Palette },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/')) return true;
    if (path === '/invoices' && (location.pathname === '/invoices' || location.pathname === '/invoice-history-management')) return true;
    if (path === '/create-invoice' && (location.pathname === '/create-invoice' || location.pathname === '/invoice-creation-dashboard')) return true;
    if (path === '/clients' && (location.pathname === '/clients' || location.pathname === '/customers')) return true;
    if (path === '/catalog' && (location.pathname === '/catalog' || location.pathname === '/items')) return true;
    if (path === '/templates' && (location.pathname === '/templates' || location.pathname === '/invoice-preview-print-interface')) return true;
    if (path === '/settings' && (location.pathname === '/settings' || location.pathname === '/company-settings-configuration')) return true;
    return false;
  };

  const userInitial = userProfile?.full_name
    ? userProfile.full_name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 fixed top-0 left-0 right-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Workspace Tag */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition transform">
                Δ
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">InvoicePro</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-md">
                    Enterprise
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-primary dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-primary dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Quick "+ New" Dropdown */}
                <div className="relative hidden sm:block" ref={quickCreateRef}>
                  <button
                    onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:opacity-90 shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400 dark:text-slate-600" />
                  </button>

                  {isQuickCreateOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                      <button
                        onClick={() => {
                          setIsQuickCreateOpen(false);
                          navigate('/create-invoice');
                        }}
                        className="w-full px-3.5 py-2 text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-blue-500" />
                        New Invoice
                      </button>
                      <button
                        onClick={() => {
                          setIsQuickCreateOpen(false);
                          navigate('/clients');
                        }}
                        className="w-full px-3.5 py-2 text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Users className="w-4 h-4 text-emerald-500" />
                        Add Client
                      </button>
                      <button
                        onClick={() => {
                          setIsQuickCreateOpen(false);
                          navigate('/catalog');
                        }}
                        className="w-full px-3.5 py-2 text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-purple-500" />
                        Add Product / Service
                      </button>
                    </div>
                  )}
                </div>

                {/* User Profile Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {userProfile?.full_name || user?.email?.split('@')[0]}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                        {user?.email}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {userInitial}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs">
                      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {userProfile?.full_name || 'Business Account'}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate mt-0.5">{user?.email}</div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/settings');
                          }}
                          className="w-full px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          Company Settings
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/templates');
                          }}
                          className="w-full px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Palette className="w-3.5 h-3.5 text-slate-400" />
                          Template Studio
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-3 py-2 text-left font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-xl"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {user && (
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
