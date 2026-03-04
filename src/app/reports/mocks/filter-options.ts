import { FilterOption } from '../lib/types';

export const marketerOptions: FilterOption[] = [
  { label: 'Acme Corp', value: 'acme' },
  { label: 'Globex Inc', value: 'globex' },
  { label: 'Initech', value: 'initech' },
  { label: 'Umbrella Corp', value: 'umbrella' },
  { label: 'Stark Industries', value: 'stark' },
  { label: 'Wayne Enterprises', value: 'wayne' },
];

const campaignsByMarketer: Record<string, FilterOption[]> = {
  acme: [
    { label: 'Acme Q1 Campaign', value: 'acme-q1' },
    { label: 'Acme Brand Awareness', value: 'acme-brand' },
    { label: 'Acme Product Launch', value: 'acme-launch' },
  ],
  globex: [
    { label: 'Globex Demand Gen', value: 'globex-demand' },
    { label: 'Globex ABM Campaign', value: 'globex-abm' },
  ],
  initech: [
    { label: 'Initech Lead Gen 2024', value: 'initech-leadgen' },
    { label: 'Initech Webinar Series', value: 'initech-webinar' },
  ],
  umbrella: [
    { label: 'Umbrella Content Syndication', value: 'umbrella-cs' },
  ],
  stark: [
    { label: 'Stark Tech Summit', value: 'stark-summit' },
    { label: 'Stark Innovation Drive', value: 'stark-innovation' },
  ],
  wayne: [
    { label: 'Wayne Enterprise Solutions', value: 'wayne-enterprise' },
    { label: 'Wayne Digital Transform', value: 'wayne-digital' },
  ],
};

const lineItemsByCampaign: Record<string, FilterOption[]> = {
  'acme-q1': [
    { label: 'Acme Q1 - Whitepaper Download', value: 'acme-q1-wp' },
    { label: 'Acme Q1 - Webinar Reg', value: 'acme-q1-web' },
  ],
  'acme-brand': [
    { label: 'Acme Brand - Display Ads', value: 'acme-brand-display' },
  ],
  'acme-launch': [
    { label: 'Acme Launch - Email Series', value: 'acme-launch-email' },
    { label: 'Acme Launch - Social', value: 'acme-launch-social' },
  ],
  'globex-demand': [
    { label: 'Globex Demand - IT Decision Makers', value: 'globex-demand-it' },
    { label: 'Globex Demand - C-Suite', value: 'globex-demand-csuite' },
  ],
  'globex-abm': [
    { label: 'Globex ABM - Target Accounts', value: 'globex-abm-target' },
  ],
  'initech-leadgen': [
    { label: 'Initech LeadGen - EMEA', value: 'initech-leadgen-emea' },
    { label: 'Initech LeadGen - APAC', value: 'initech-leadgen-apac' },
  ],
  'initech-webinar': [
    { label: 'Initech Webinar - Cloud Security', value: 'initech-webinar-cloud' },
  ],
  'umbrella-cs': [
    { label: 'Umbrella CS - Healthcare', value: 'umbrella-cs-health' },
    { label: 'Umbrella CS - Finance', value: 'umbrella-cs-finance' },
  ],
  'stark-summit': [
    { label: 'Stark Summit - Keynote Leads', value: 'stark-summit-keynote' },
  ],
  'stark-innovation': [
    { label: 'Stark Innovation - Research Paper', value: 'stark-innovation-paper' },
  ],
  'wayne-enterprise': [
    { label: 'Wayne Enterprise - ERP Buyers', value: 'wayne-enterprise-erp' },
  ],
  'wayne-digital': [
    { label: 'Wayne Digital - AI Adopters', value: 'wayne-digital-ai' },
  ],
};

export function getMockFilterOptions(
  filterId: string,
  depValues: Record<string, unknown>,
): FilterOption[] {
  switch (filterId) {
    case 'marketer':
      return marketerOptions;

    case 'campaign': {
      const marketers = (depValues.marketer ?? []) as string[];
      if (marketers.length === 0) {
        return Object.values(campaignsByMarketer).flat();
      }
      return marketers.flatMap((m) => campaignsByMarketer[m] ?? []);
    }

    case 'lineItem': {
      const campaigns = (depValues.campaign ?? []) as string[];
      if (campaigns.length === 0) {
        return Object.values(lineItemsByCampaign).flat();
      }
      return campaigns.flatMap((c) => lineItemsByCampaign[c] ?? []);
    }

    case 'status':
      return [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
        { label: 'Draft', value: 'draft' },
      ];

    case 'region':
      return [
        { label: 'North America', value: 'na' },
        { label: 'EMEA', value: 'emea' },
        { label: 'APAC', value: 'apac' },
        { label: 'LATAM', value: 'latam' },
      ];

    case 'jobLevel':
      return [
        { label: 'C-Suite', value: 'c-suite' },
        { label: 'VP', value: 'vp' },
        { label: 'Director', value: 'director' },
        { label: 'Manager', value: 'manager' },
        { label: 'Individual Contributor', value: 'ic' },
      ];

    case 'jobFunction':
      return [
        { label: 'IT', value: 'it' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' },
        { label: 'Finance', value: 'finance' },
        { label: 'HR', value: 'hr' },
        { label: 'Operations', value: 'operations' },
        { label: 'Engineering', value: 'engineering' },
      ];

    case 'industry':
      return [
        { label: 'Technology', value: 'technology' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Retail', value: 'retail' },
        { label: 'Education', value: 'education' },
      ];

    case 'companySize':
      return [
        { label: '1-50', value: '1-50' },
        { label: '51-200', value: '51-200' },
        { label: '201-1000', value: '201-1000' },
        { label: '1001-5000', value: '1001-5000' },
        { label: '5000+', value: '5000+' },
      ];

    case 'contentType':
      return [
        { label: 'Whitepaper', value: 'whitepaper' },
        { label: 'Webinar', value: 'webinar' },
        { label: 'eBook', value: 'ebook' },
        { label: 'Infographic', value: 'infographic' },
        { label: 'Case Study', value: 'case-study' },
      ];

    case 'supplier':
      return [
        { label: 'DZone', value: 'dzone' },
        { label: 'TechTarget', value: 'techtarget' },
        { label: 'IDG', value: 'idg' },
        { label: 'Foundry', value: 'foundry' },
        { label: 'NetLine', value: 'netline' },
      ];

    default:
      return [];
  }
}
