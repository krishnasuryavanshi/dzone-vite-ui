import { fetchOrganizationType } from '@/app/(dashboard)/(system-admin)/organizations/services';
import { create } from 'zustand';

export interface TenantTypeOption {
  id: string;
  name: string;
}

interface TenantTypeStore {
  tenantTypes: TenantTypeOption[];
  fetchTenantTypes: () => Promise<void>;
}

export const useTenantTypeStore = create<TenantTypeStore>((set) => ({
  tenantTypes: [],
  fetchTenantTypes: async () => {
    const data = await fetchOrganizationType();
    set({
      tenantTypes: data?.data,
    });
  },
}));
