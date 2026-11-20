-- Migration: 20241216120000_invoice_app_with_auth.sql

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE public.payment_terms AS ENUM ('due_on_receipt', 'net_15', 'net_30', 'net_45', 'net_60');
CREATE TYPE public.currency_code AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR');

-- 2. User Profiles (Critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Company Profiles
CREATE TABLE public.company_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    logo_url TEXT,
    tax_id TEXT,
    currency public.currency_code DEFAULT 'USD'::public.currency_code,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Customers
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Invoices
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    company_profile_id UUID REFERENCES public.company_profiles(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payment_terms public.payment_terms DEFAULT 'net_30'::public.payment_terms,
    currency public.currency_code DEFAULT 'USD'::public.currency_code,
    status public.invoice_status DEFAULT 'draft'::public.invoice_status,
    subtotal DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Invoice Items
CREATE TABLE public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    rate DECIMAL(10,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Invoice Templates
CREATE TABLE public.invoice_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_company_profiles_user_id ON public.company_profiles(user_id);
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX idx_invoice_templates_user_id ON public.invoice_templates(user_id);

-- 9. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_templates ENABLE ROW LEVEL SECURITY;

-- 10. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.owns_invoice(invoice_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.invoices i
    WHERE i.id = invoice_uuid AND i.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_customer(customer_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.customers c
    WHERE c.id = customer_uuid AND c.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_company_profile(company_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.company_profiles cp
    WHERE cp.id = company_uuid AND cp.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_invoice_item(item_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.invoice_items ii
    JOIN public.invoices i ON ii.invoice_id = i.id
    WHERE ii.id = item_uuid AND i.user_id = auth.uid()
)
$$;

-- 11. Automatic Profile Creation Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- 12. Trigger for New User Creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Update Timestamps Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Update Triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON public.company_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoice_templates_updated_at BEFORE UPDATE ON public.invoice_templates 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 15. RLS Policies
-- User Profiles
CREATE POLICY "users_own_profile" ON public.user_profiles 
FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Company Profiles
CREATE POLICY "users_manage_company_profiles" ON public.company_profiles 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Customers
CREATE POLICY "users_manage_customers" ON public.customers 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Invoices
CREATE POLICY "users_manage_invoices" ON public.invoices 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Invoice Items
CREATE POLICY "users_access_invoice_items" ON public.invoice_items 
FOR ALL USING (public.can_access_invoice_item(id)) WITH CHECK (public.can_access_invoice_item(id));

-- Invoice Templates
CREATE POLICY "users_manage_templates" ON public.invoice_templates 
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 16. Mock Data
DO $$
DECLARE
    user1_auth_id UUID := gen_random_uuid();
    user2_auth_id UUID := gen_random_uuid();
    company1_id UUID := gen_random_uuid();
    customer1_id UUID := gen_random_uuid();
    invoice1_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (user1_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@invoicepro.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@invoicepro.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create company profile
    INSERT INTO public.company_profiles (id, user_id, name, email, phone, address, city, state, zip_code, currency)
    VALUES (company1_id, user2_auth_id, 'Acme Corporation', 'info@acmecorp.com', '+1-555-123-4567', 
            '123 Business Ave', 'New York', 'NY', '10001', 'USD'::public.currency_code);

    -- Create customer
    INSERT INTO public.customers (id, user_id, name, email, phone, company, address, city, state, zip_code)
    VALUES (customer1_id, user2_auth_id, 'Jane Smith', 'jane@clientcorp.com', '+1-555-987-6543', 
            'Client Corp', '456 Client St', 'Los Angeles', 'CA', '90210');

    -- Create sample invoice
    INSERT INTO public.invoices (id, user_id, customer_id, company_profile_id, invoice_number, 
                                issue_date, due_date, status, subtotal, tax_amount, total_amount, notes)
    VALUES (invoice1_id, user2_auth_id, customer1_id, company1_id, 'INV-001-2024', 
            '2024-01-15'::date, '2024-02-14'::date, 'sent'::public.invoice_status, 
            1000.00, 100.00, 1100.00, 'Sample invoice for web development services');

    -- Create invoice items
    INSERT INTO public.invoice_items (invoice_id, description, quantity, rate, amount)
    VALUES 
        (invoice1_id, 'Web Development - Homepage Design', 20.00, 75.00, 1500.00),
        (invoice1_id, 'Consultation - SEO Strategy', 5.00, 100.00, 500.00);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 17. Cleanup Function
CREATE OR REPLACE FUNCTION public.cleanup_demo_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    demo_user_ids UUID[];
BEGIN
    -- Get demo user IDs
    SELECT ARRAY_AGG(id) INTO demo_user_ids
    FROM auth.users
    WHERE email LIKE '%@invoicepro.com';

    -- Delete in dependency order
    DELETE FROM public.invoice_items WHERE invoice_id IN (
        SELECT id FROM public.invoices WHERE user_id = ANY(demo_user_ids)
    );
    DELETE FROM public.invoices WHERE user_id = ANY(demo_user_ids);
    DELETE FROM public.customers WHERE user_id = ANY(demo_user_ids);
    DELETE FROM public.company_profiles WHERE user_id = ANY(demo_user_ids);
    DELETE FROM public.invoice_templates WHERE user_id = ANY(demo_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(demo_user_ids);
    DELETE FROM auth.users WHERE id = ANY(demo_user_ids);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;
