import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();

  const routeMap = {
    '/invoice-creation-dashboard': 'Dashboard',
    '/invoice-history-management': 'History',
    '/invoice-preview-print-interface': 'Preview',
    '/company-settings-configuration': 'Settings'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Always include Home/Dashboard as first breadcrumb
    breadcrumbs.push({
      label: 'Dashboard',
      path: '/invoice-creation-dashboard',
      isActive: location.pathname === '/invoice-creation-dashboard'
    });

    // Add current page if it's not the dashboard
    if (location.pathname !== '/invoice-creation-dashboard') {
      const currentPageLabel = routeMap[location.pathname];
      if (currentPageLabel) {
        breadcrumbs.push({
          label: currentPageLabel,
          path: location.pathname,
          isActive: true
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render breadcrumbs if only one item (Dashboard)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="mx-2 text-text-muted" 
              />
            )}
            {breadcrumb.isActive ? (
              <span className="font-medium text-text-primary">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="hover:text-text-primary transition-colors duration-150 ease-out"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;