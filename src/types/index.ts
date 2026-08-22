export interface LeadItem {
  id: string;
  name: string;
  company: string;
  title: string;
  email?: string;
  phone?: string;
  location?: string;
  rating?: number;
  reviewsCount?: number;
  website?: string;
  source: 'google_maps' | 'linkedin' | 'apollo' | 'csv' | 'custom';
  status: 'new' | 'enriching' | 'enriched' | 'failed' | 'contacted';
  customFields?: Record<string, any>;
}

export interface TableFile {
  id: string;
  name: string;
  favorite: boolean;
  tags: string[];
  createdAt: string;
  lastOpened: string;
  owner: string;
  access: 'Edit' | 'View';
  rowCount: number;
  type: 'leads' | 'companies' | 'local_businesses' | 'campaign';
}

export interface CampaignItem {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leadsCount: number;
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  createdAt: string;
}

export interface LocalBusinessSearchParams {
  query: string;
  location: string;
  radiusKm?: number;
  minRating?: number;
  limit?: number;
}
