interface DataEntry {
  marketer_code: string;
  marketer_name: string;
  campaign_external_id: string;
  campaign_name: string;
  line_item_external_id: string;
  line_item_name: string;
  supplier_code: string;
  supplier_name: string;
}

export interface Marketer {
  marketer_code: string;
  marketer_name: string;
}

export interface Campaign {
  campaign_external_id: string;
  campaign_name: string;
}

export interface LineItem {
  line_item_external_id: string;
  line_item_name: string;
}

export interface Supplier {
  supplier_code: string;
  supplier_name: string;
}

export interface SupplierFilter {
  key: string;
  label: string;
  marketers: Marketer[];
  campaigns: Campaign[];
  line_items: LineItem[];
}
export interface LineItemFilter {
  key: string;
  label: string;
  marketers: Marketer[];
  campaigns: Campaign[];
  supplier: Supplier[];
}
export interface MarketerFilter {
  key: string;
  label: string;
  line_items: LineItem[];
  campaigns: Campaign[];
  supplier: Supplier[];
}
export interface CampaignFilter {
  key: string;
  label: string;
  line_items: LineItem[];
  marketers: Marketer[];
  supplier: Supplier[];
}

function buildSupplierData(data: DataEntry[]): SupplierFilter[] {
  const suppliersMap: Record<string, SupplierFilter> = {};
  data.forEach((entry) => {
    const supCode = entry.supplier_code;
    // Initialize supplier object if not present
    if (!suppliersMap[supCode]) {
      suppliersMap[supCode] = {
        key: supCode,
        label: entry.supplier_name,
        marketers: [],
        campaigns: [],
        line_items: [],
      };
    }
    const supplier = suppliersMap[supCode];
    // Add marketer uniquely
    if (
      !supplier.marketers.some((m) => m.marketer_code === entry.marketer_code)
    ) {
      supplier.marketers.push({
        marketer_code: entry.marketer_code,
        marketer_name: entry.marketer_name,
      });
    }
    // Add campaign uniquely
    if (
      !supplier.campaigns.some(
        (c) => c.campaign_external_id === entry.campaign_external_id,
      )
    ) {
      supplier.campaigns.push({
        campaign_external_id: entry.campaign_external_id,
        campaign_name: entry.campaign_name,
      });
    }
    // Add line item uniquely
    if (
      !supplier.line_items.some(
        (l) => l.line_item_external_id === entry.line_item_external_id,
      )
    ) {
      supplier.line_items.push({
        line_item_external_id: entry.line_item_external_id,
        line_item_name: entry.line_item_name,
      });
    }
  });
  // Convert suppliersMap to array
  return Object.values(suppliersMap);
}
function buildLineItemData(data: DataEntry[]): LineItemFilter[] {
  const lineItemsMap: Record<string, LineItemFilter> = {};
  data.forEach((entry) => {
    const supCode = entry.line_item_external_id;
    // Initialize line item object if not present
    if (!lineItemsMap[supCode]) {
      lineItemsMap[supCode] = {
        key: supCode,
        label: entry.line_item_name,
        marketers: [],
        campaigns: [],
        supplier: [],
      };
    }
    const lineItem = lineItemsMap[supCode];
    // Add marketer uniquely
    if (
      !lineItem.marketers.some((m) => m.marketer_code === entry.marketer_code)
    ) {
      lineItem.marketers.push({
        marketer_code: entry.marketer_code,
        marketer_name: entry.marketer_name,
      });
    }
    // Add campaign uniquely
    if (
      !lineItem.campaigns.some(
        (c) => c.campaign_external_id === entry.campaign_external_id,
      )
    ) {
      lineItem.campaigns.push({
        campaign_external_id: entry.campaign_external_id,
        campaign_name: entry.campaign_name,
      });
    }
    // Add supplier uniquely
    if (
      !lineItem.supplier.some((l) => l.supplier_code === entry.supplier_code)
    ) {
      lineItem.supplier.push({
        supplier_code: entry.supplier_code,
        supplier_name: entry.supplier_name,
      });
    }
  });
  // Convert lineItemMap to array
  return Object.values(lineItemsMap);
}
function buildCampaignData(data: DataEntry[]): CampaignFilter[] {
  const campaignsMap: Record<string, CampaignFilter> = {};
  data.forEach((entry) => {
    const supCode = entry.campaign_external_id;
    // Initialize campaign object if not present
    if (!campaignsMap[supCode]) {
      campaignsMap[supCode] = {
        key: supCode,
        label: entry.campaign_name,
        marketers: [],
        line_items: [],
        supplier: [],
      };
    }
    const campaign = campaignsMap[supCode];
    // Add marketer uniquely
    if (
      !campaign.marketers.some((m) => m.marketer_code === entry.marketer_code)
    ) {
      campaign.marketers.push({
        marketer_code: entry.marketer_code,
        marketer_name: entry.marketer_name,
      });
    }
    // Add line item uniquely
    if (
      !campaign.line_items.some(
        (c) => c.line_item_external_id === entry.line_item_external_id,
      )
    ) {
      campaign.line_items.push({
        line_item_external_id: entry.line_item_external_id,
        line_item_name: entry.line_item_name,
      });
    }
    // Add supplier uniquely
    if (
      !campaign.supplier.some((l) => l.supplier_code === entry.supplier_code)
    ) {
      campaign.supplier.push({
        supplier_code: entry.supplier_code,
        supplier_name: entry.supplier_name,
      });
    }
  });
  // Convert campaignMap to array
  return Object.values(campaignsMap);
}
function buildMarketerData(data: DataEntry[]): MarketerFilter[] {
  const marketersMap: Record<string, MarketerFilter> = {};
  data.forEach((entry) => {
    const supCode = entry.marketer_code;
    // Initialize marketer object if not present
    if (!marketersMap[supCode]) {
      marketersMap[supCode] = {
        key: supCode,
        label: entry.marketer_name,
        campaigns: [],
        line_items: [],
        supplier: [],
      };
    }
    const marketer = marketersMap[supCode];
    // Add campaign uniquely
    if (
      !marketer.campaigns.some(
        (m) => m.campaign_external_id === entry.campaign_external_id,
      )
    ) {
      marketer.campaigns.push({
        campaign_external_id: entry.campaign_external_id,
        campaign_name: entry.campaign_name,
      });
    }
    // Add lineitem uniquely
    if (
      !marketer.line_items.some(
        (c) => c.line_item_external_id === entry.line_item_external_id,
      )
    ) {
      marketer.line_items.push({
        line_item_external_id: entry.line_item_external_id,
        line_item_name: entry.line_item_name,
      });
    }
    // Add lsupplier uniquely
    if (
      !marketer.supplier.some((l) => l.supplier_code === entry.supplier_code)
    ) {
      marketer.supplier.push({
        supplier_code: entry.supplier_code,
        supplier_name: entry.supplier_name,
      });
    }
  });
  // Convert marketerMap to array
  return Object.values(marketersMap);
}

export {
  buildSupplierData,
  buildLineItemData,
  buildCampaignData,
  buildMarketerData,
};
