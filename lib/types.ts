export type PublicContact = {
  company_name: string;
  product_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  app_store_url: string;
  play_store_url: string;
  privacy_url: string;
  terms_url: string;
};

export type LandingData = {
  founding_limit: number;
  founding_claimed: number;
  founding_remaining: number;
  founding_months: number;
  total_users: number;
  waitlist_count: number;
  spots_available: boolean;
  contact: PublicContact;
};

export type WaitlistResult = {
  status: string;
  message: string;
  founding_remaining: number;
  created: boolean;
};
