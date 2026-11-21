// Catalog Service for managing Products and Services
const STORAGE_KEY = 'invoicepro_catalog_items';

const DEFAULT_ITEMS = [
  {
    id: 'item-1',
    name: 'Full-Stack Web Development',
    description: 'Custom web application design, frontend implementation & backend API integration',
    rate: 95.00,
    unit: 'Hour',
    category: 'Development'
  },
  {
    id: 'item-2',
    name: 'UI/UX Design & Prototyping',
    description: 'High-fidelity Figma mockups, user research, wireframes & interactive prototypes',
    rate: 85.00,
    unit: 'Hour',
    category: 'Design'
  },
  {
    id: 'item-3',
    name: 'Monthly Maintenance & DevOps',
    description: 'Cloud server monitoring, database backups, security patches & uptime guarantee',
    rate: 750.00,
    unit: 'Month',
    category: 'Retainer'
  },
  {
    id: 'item-4',
    name: 'Database Architecture & Optimization',
    description: 'PostgreSQL schema design, query optimization, indexing & performance tuning',
    rate: 120.00,
    unit: 'Hour',
    category: 'Consulting'
  },
  {
    id: 'item-5',
    name: 'SEO & Performance Audit',
    description: 'Complete Core Web Vitals audit, technical SEO fixes & speed acceleration',
    rate: 600.00,
    unit: 'Project',
    category: 'Marketing'
  }
];

class CatalogService {
  getItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS));
        return DEFAULT_ITEMS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading catalog items:', e);
      return DEFAULT_ITEMS;
    }
  }

  saveItem(item) {
    try {
      const items = this.getItems();
      if (item.id) {
        const index = items.findIndex(i => i.id === item.id);
        if (index >= 0) {
          items[index] = { ...items[index], ...item, updatedAt: new Date().toISOString() };
        } else {
          items.push({ ...item, id: item.id || `item-${Date.now()}`, createdAt: new Date().toISOString() });
        }
      } else {
        items.push({
          ...item,
          id: `item-${Date.now()}`,
          createdAt: new Date().toISOString()
        });
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return { success: true, data: items };
    } catch (e) {
      console.error('Error saving catalog item:', e);
      return { success: false, error: e.message };
    }
  }

  deleteItem(id) {
    try {
      const items = this.getItems().filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return { success: true, data: items };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

const catalogService = new CatalogService();
export default catalogService;
