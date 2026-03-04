export function getMockWidgetData(widgetId: string): Record<string, unknown>[] {
  switch (widgetId) {
    case 'accountEngagement':
      return [
        { account: 'TechCorp Solutions', impressions: 45200, clicks: 3200, conversions: 180, spend: 12400, ctr: 7.08 },
        { account: 'DataDriven Inc', impressions: 38900, clicks: 2800, conversions: 152, spend: 10800, ctr: 7.2 },
        { account: 'CloudFirst Systems', impressions: 34500, clicks: 2100, conversions: 98, spend: 8900, ctr: 6.09 },
        { account: 'AI Dynamics', impressions: 31200, clicks: 1950, conversions: 87, spend: 7600, ctr: 6.25 },
        { account: 'SecureNet Global', impressions: 28700, clicks: 1800, conversions: 76, spend: 6800, ctr: 6.27 },
        { account: 'InnovateTech Labs', impressions: 25400, clicks: 1650, conversions: 64, spend: 5900, ctr: 6.5 },
        { account: 'Digital Frontier', impressions: 22100, clicks: 1400, conversions: 52, spend: 4800, ctr: 6.33 },
        { account: 'SmartScale Corp', impressions: 19800, clicks: 1200, conversions: 45, spend: 4200, ctr: 6.06 },
        { account: 'NextGen Systems', impressions: 17500, clicks: 1050, conversions: 38, spend: 3600, ctr: 6.0 },
        { account: 'Quantum Enterprises', impressions: 15200, clicks: 920, conversions: 32, spend: 3100, ctr: 6.05 },
        { account: 'Apex Digital', impressions: 13800, clicks: 840, conversions: 28, spend: 2700, ctr: 6.09 },
        { account: 'Pinnacle IT', impressions: 11500, clicks: 720, conversions: 24, spend: 2200, ctr: 6.26 },
      ];

    case 'leadsByJobLevel':
      return [
        { jobLevel: 'C-Suite', count: 120 },
        { jobLevel: 'VP', count: 280 },
        { jobLevel: 'Director', count: 450 },
        { jobLevel: 'Manager', count: 620 },
        { jobLevel: 'Individual Contributor', count: 380 },
        { jobLevel: 'Other', count: 150 },
      ];

    case 'leadsByCompanySize':
      return [
        { companySize: '1-50', count: 180 },
        { companySize: '51-200', count: 340 },
        { companySize: '201-500', count: 520 },
        { companySize: '501-1000', count: 680 },
        { companySize: '1001-5000', count: 890 },
        { companySize: '5001+', count: 420 },
      ];

    case 'leadsByJobFunction':
      return [
        { jobFunction: 'IT', count: 520 },
        { jobFunction: 'Marketing', count: 380 },
        { jobFunction: 'Sales', count: 290 },
        { jobFunction: 'Engineering', count: 410 },
        { jobFunction: 'Finance', count: 180 },
        { jobFunction: 'Operations', count: 220 },
        { jobFunction: 'HR', count: 120 },
      ];

    case 'leadsByIndustry':
      return [
        { industry: 'Technology', count: 680 },
        { industry: 'Financial Services', count: 420 },
        { industry: 'Healthcare', count: 350 },
        { industry: 'Manufacturing', count: 280 },
        { industry: 'Retail', count: 220 },
        { industry: 'Education', count: 180 },
      ];

    case 'totalLeads':
      return [{ value: 12450, change: 12.5 }];

    case 'totalSpend':
      return [{ value: 84320, change: 8.3 }];

    case 'avgCtr':
      return [{ value: 6.42, change: -2.1 }];

    case 'conversions':
      return [{ value: 876, change: 18.7 }];

    case 'campaignPerformance':
      return [
        { campaign: 'Cloud Security Guide', status: 'Active', leads: 1240, spend: 18600, cpl: 15.0, pacing: 92 },
        { campaign: 'AI/ML Whitepaper', status: 'Active', leads: 980, spend: 14700, cpl: 15.0, pacing: 87 },
        { campaign: 'DevOps Best Practices', status: 'Active', leads: 860, spend: 11180, cpl: 13.0, pacing: 105 },
        { campaign: 'Data Analytics eBook', status: 'Paused', leads: 720, spend: 10080, cpl: 14.0, pacing: 68 },
        { campaign: 'Cybersecurity Report', status: 'Active', leads: 650, spend: 9750, cpl: 15.0, pacing: 78 },
        { campaign: 'Digital Transformation', status: 'Active', leads: 540, spend: 7020, cpl: 13.0, pacing: 95 },
        { campaign: 'IoT Solutions Brief', status: 'Completed', leads: 480, spend: 7200, cpl: 15.0, pacing: 100 },
        { campaign: 'SaaS Buyer Guide', status: 'Active', leads: 420, spend: 5460, cpl: 13.0, pacing: 82 },
        { campaign: 'Edge Computing WP', status: 'Active', leads: 380, spend: 5700, cpl: 15.0, pacing: 74 },
        { campaign: '5G Infrastructure', status: 'Paused', leads: 310, spend: 4030, cpl: 13.0, pacing: 55 },
      ];

    case 'leadsByRegion':
      return [
        { region: 'North America', count: 4820 },
        { region: 'Europe', count: 3150 },
        { region: 'Asia Pacific', count: 2480 },
        { region: 'Latin America', count: 1200 },
        { region: 'Middle East & Africa', count: 800 },
      ];

    case 'spendByMonth':
      return [
        { month: 'Oct', spend: 12400 },
        { month: 'Nov', spend: 14200 },
        { month: 'Dec', spend: 11800 },
        { month: 'Jan', spend: 15600 },
        { month: 'Feb', spend: 16100 },
        { month: 'Mar', spend: 14220 },
      ];

    case 'topSuppliers':
      return [
        { supplier: 'TechTarget', leadsDelivered: 2840, acceptRate: 94.2, avgCpl: 14.5, spend: 41180 },
        { supplier: 'NetLine', leadsDelivered: 2100, acceptRate: 91.8, avgCpl: 13.8, spend: 28980 },
        { supplier: 'Madison Logic', leadsDelivered: 1650, acceptRate: 89.5, avgCpl: 15.2, spend: 25080 },
        { supplier: 'Bombora', leadsDelivered: 1420, acceptRate: 92.1, avgCpl: 14.0, spend: 19880 },
        { supplier: 'DemandBase', leadsDelivered: 1180, acceptRate: 90.3, avgCpl: 15.8, spend: 18644 },
        { supplier: 'Integrate', leadsDelivered: 980, acceptRate: 88.7, avgCpl: 13.5, spend: 13230 },
        { supplier: 'LeadG2', leadsDelivered: 750, acceptRate: 93.4, avgCpl: 12.8, spend: 9600 },
        { supplier: 'PureB2B', leadsDelivered: 620, acceptRate: 87.9, avgCpl: 14.2, spend: 8804 },
      ];

    default:
      return [];
  }
}
