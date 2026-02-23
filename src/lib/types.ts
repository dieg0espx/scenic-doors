// ── Shared TypeScript Interfaces for Admin Dashboard ──

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  zip: string | null;
  customer_type: string;
  timeline: string | null;
  source: string | null;
  status: string;
  referral_code: string | null;
  has_quote: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  prefix: string | null;
  email: string | null;
  phone: string | null;
  home_zipcode: string | null;
  role: string;
  zipcodes: string[];
  referral_codes: string[];
  start_date: string | null;
  location_code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  id: string;
  type: string;
  emails: string[];
  updated_at: string;
}

export interface QuoteNote {
  id: string;
  quote_id: string;
  content: string;
  created_by: string | null;
  created_at: string;
}

export interface QuoteTask {
  id: string;
  quote_id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_by: string | null;
  created_at: string;
}

export interface EmailHistoryEntry {
  id: string;
  quote_id: string | null;
  recipient_email: string;
  subject: string | null;
  type: string | null;
  sent_at: string;
}

export interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  client_id: string | null;
  door_type: string;
  material: string;
  color: string;
  glass_type: string;
  size: string;
  cost: number;
  notes: string | null;
  status: string;
  delivery_type: string | null;
  delivery_address: string | null;
  created_at: string;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  // New fields from migration 008
  customer_type: string;
  customer_phone: string | null;
  customer_zip: string | null;
  assigned_to: string | null;
  assigned_date: string | null;
  created_by: string | null;
  lead_status: string;
  items: QuoteItem[];
  subtotal: number;
  installation_cost: number;
  delivery_cost: number;
  tax: number;
  grand_total: number;
  follow_up_date: string | null;
  lead_id: string | null;
  shared_with: string[];
  portal_stage: string;
  // Joined relations (optional)
  quote_notes?: QuoteNote[];
  quote_tasks?: QuoteTask[];
  admin_users?: { name: string } | null;
}

export interface LeadMetrics {
  total: number;
  withoutQuotes: number;
  withQuotes: number;
  newThisWeek: number;
}

export interface DashboardMetrics {
  totalLeads: number;
  totalQuotes: number;
  totalQuoteValue: number;
  pendingOrders: number;
  totalOrders: number;
  conversionRate: number;
  averageOrderVolume: number;
}

export interface MarketingMetrics {
  abandonedLeads: number;
  completedQuotes: number;
  revenue: number;
  conversionRate: number;
  avgQuoteValue: number;
  costPerLead: number;
  roi: number;
}

export interface RevenueBySource {
  source: string;
  revenue: number;
  count: number;
}

export interface LeadsOverTime {
  date: string;
  count: number;
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

// ── Client Portal Types ──

export interface ApprovalDrawing {
  id: string;
  quote_id: string;
  overall_width: number;
  overall_height: number;
  panel_count: number;
  slide_direction: string;
  in_swing: string;
  system_type: string;
  configuration: string;
  additional_notes: string;
  frame_color: string;
  hardware_color: string;
  status: string;
  sent_at: string | null;
  signed_at: string | null;
  customer_name: string | null;
  signature_date: string | null;
  signature_data: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuotePhoto {
  id: string;
  quote_id: string | null;
  lead_id: string | null;
  photo_url: string;
  photo_type: string;
  caption: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface OrderTracking {
  id: string;
  quote_id: string;
  stage: string;
  tracking_number: string | null;
  shipping_carrier: string | null;
  shipping_updates: ShippingUpdate[];
  deposit_1_paid: boolean;
  deposit_1_amount: number;
  deposit_1_paid_at: string | null;
  deposit_2_paid: boolean;
  deposit_2_amount: number;
  deposit_2_paid_at: string | null;
  manufacturing_started_at: string | null;
  manufacturing_completed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  estimated_completion: string | null;
  estimated_delivery: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShippingUpdate {
  date: string;
  status: string;
  location?: string;
}

export interface QuoteDocument {
  id: string;
  quote_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: string | null;
  created_at: string;
}

export interface FollowUpEntry {
  id: string;
  lead_id: string | null;
  quote_id: string | null;
  scheduled_for: string;
  sent_at: string | null;
  email_type: string;
  sequence_number: number;
  status: string;
  created_at: string;
}
