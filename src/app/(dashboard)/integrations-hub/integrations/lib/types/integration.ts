export interface Integration {
  id: string;
  name: string;
  type: string;
  status: string;
  delivery_type?: string; // Added based on API response
  connectionType?: string;
  label?: string;
  url?: string;
  headers?: string;
  script?: string;
  // Legacy fields - may not be used for FTP anymore
  host?: string;
  port?: number;
  userName?: string;
  privateFile?: string;
  privateFilePassword?: string;
  // Config object for structured data
  config?: {
    headers?: Record<string, any>;
    // FTP config fields
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    privateKeyFileId?: string;
    privateKeyPassword?: string;
    remotePath?: string;
  };
  description?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface IntegrationsResponse {
  data: Integration[];
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export interface IntegrationType {
  id: string;
  name: string;
  type?: string;
  logo?: string;
}

export interface IntegrationTypesResponse {
  data: IntegrationType[];
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}
