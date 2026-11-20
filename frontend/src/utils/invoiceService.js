import supabase from './supabase';

class InvoiceService {
  // Get all invoices for the current user
  async getInvoices() {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(*),
          company_profile:company_profiles(*),
          invoice_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load invoices. Please try again.' };
    }
  }

  // Get a single invoice by ID
  async getInvoice(invoiceId) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(*),
          company_profile:company_profiles(*),
          invoice_items(*)
        `)
        .eq('id', invoiceId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load invoice. Please try again.' };
    }
  }

  // Create a new invoice
  async createInvoice(invoiceData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('invoices')
        .insert({ ...invoiceData, user_id: user.id })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to create invoice. Please try again.' };
    }
  }

  // Update an invoice
  async updateInvoice(invoiceId, updates) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', invoiceId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to update invoice. Please try again.' };
    }
  }

  // Delete an invoice
  async deleteInvoice(invoiceId) {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to delete invoice. Please try again.' };
    }
  }

  // Get the last invoice number for the current user
  async getLastInvoiceNumber() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // Order by creation date first
        .order('invoice_number', { ascending: false }) // Then by invoice number as a fallback
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        return { success: false, error: error.message };
      }

      return { success: true, data: data ? data.invoice_number : null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to get last invoice number. Please try again.' };
    }
  }

  // Create invoice items
  async createInvoiceItems(invoiceId, items) {
    try {
      const itemsWithInvoiceId = items?.map(item => ({
        ...item,
        invoice_id: invoiceId
      }));

      const { data, error } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId)
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to create invoice items. Please try again.' };
    }
  }

  // Update invoice items
  async updateInvoiceItems(invoiceId, items) {
    try {
      // First, delete existing items
      await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', invoiceId);

      // Then create new items
      if (items?.length > 0) {
        return await this.createInvoiceItems(invoiceId, items);
      }

      return { success: true, data: [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to update invoice items. Please try again.' };
    }
  }

  // Save invoice as draft
  async saveDraft(invoiceData, items) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Calculate totals
      const subtotal = items?.reduce((sum, item) => sum + (item?.amount || 0), 0) || 0;
      const taxAmount = subtotal * 0.1; // 10% tax for demo
      const totalAmount = subtotal + taxAmount;

      const invoiceWithTotals = {
        ...invoiceData,
        user_id: user.id,
        status: 'draft',
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount
      };

      // Create or update invoice
      let invoiceResult;
      if (invoiceData?.id) {
        invoiceResult = await this.updateInvoice(invoiceData.id, invoiceWithTotals);
      } else {
        invoiceResult = await this.createInvoice(invoiceWithTotals);
      }

      if (!invoiceResult?.success) {
        return invoiceResult;
      }

      // Create or update items
      if (items?.length > 0) {
        const itemsResult = await this.updateInvoiceItems(invoiceResult.data.id, items);
        if (!itemsResult?.success) {
          return itemsResult;
        }
      }

      return { success: true, data: invoiceResult.data };
    } catch (error) {
      return { success: false, error: 'Failed to save draft. Please try again.' };
    }
  }

  // Generate final invoice
  async generateInvoice(invoiceData, items) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Calculate totals
      const subtotal = items?.reduce((sum, item) => sum + (item?.amount || 0), 0) || 0;
      const taxAmount = subtotal * 0.1; // 10% tax for demo
      const totalAmount = subtotal + taxAmount;

      const invoiceWithTotals = {
        ...invoiceData,
        user_id: user.id,
        status: 'sent',
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount
      };

      // Create or update invoice
      let invoiceResult;
      if (invoiceData?.id) {
        invoiceResult = await this.updateInvoice(invoiceData.id, invoiceWithTotals);
      } else {
        invoiceResult = await this.createInvoice(invoiceWithTotals);
      }

      if (!invoiceResult?.success) {
        return invoiceResult;
      }

      // Create or update items
      if (items?.length > 0) {
        const itemsResult = await this.updateInvoiceItems(invoiceResult.data.id, items);
        if (!itemsResult?.success) {
          return itemsResult;
        }
      }

      return { success: true, data: invoiceResult.data };
    } catch (error) {
      return { success: false, error: 'Failed to generate invoice. Please try again.' };
    }
  }

  // Subscribe to invoice changes
  subscribeToInvoices(callback) {
    const subscription = supabase
      .channel('invoices')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'invoices' }, 
          callback)
      .subscribe();

    return subscription;
  }
}

const invoiceService = new InvoiceService();
export default invoiceService;