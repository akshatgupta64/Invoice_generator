import supabase from './supabase';

class CompanyService {
  // Get company profile for the current user
  async getCompanyProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load company profile. Please try again.' };
    }
  }

  // Create a company profile
  async createCompanyProfile(companyData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('company_profiles')
        .insert({ ...companyData, user_id: user.id })
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
      return { success: false, error: 'Failed to create company profile. Please try again.' };
    }
  }

  // Update company profile
  async updateCompanyProfile(companyId, updates) {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .update(updates)
        .eq('id', companyId)
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
      return { success: false, error: 'Failed to update company profile. Please try again.' };
    }
  }

  // Create or update company profile (upsert functionality)
  async saveCompanyProfile(companyData) {
    try {
      const existingProfile = await this.getCompanyProfile();
      
      if (existingProfile?.success && existingProfile?.data) {
        // Update existing profile
        return await this.updateCompanyProfile(existingProfile.data.id, companyData);
      } else {
        // Create new profile
        return await this.createCompanyProfile(companyData);
      }
    } catch (error) {
      return { success: false, error: 'Failed to save company profile. Please try again.' };
    }
  }

  // Upload company logo
  async uploadLogo(file) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${user.id}/logo.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('company-assets')
        .upload(fileName, file, {
          upsert: true
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(fileName);

      return { success: true, data: { url: publicUrl, path: data.path } };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to storage service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to upload logo. Please try again.' };
    }
  }

  // Delete company logo
  async deleteLogo(filePath) {
    try {
      const { error } = await supabase.storage
        .from('company-assets')
        .remove([filePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete logo. Please try again.' };
    }
  }
}

const companyService = new CompanyService();
export default companyService;