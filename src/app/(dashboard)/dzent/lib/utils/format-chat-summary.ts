import { DzRecord } from '@/lib/types';

export function formatChatSummary(summary: DzRecord | null) {
  const campaign = Object.keys(summary?.campaign || {}).length
    ? summary?.campaign
    : null;
  const lineItems = Object.keys(summary?.lineItems || {}).length
    ? summary?.lineItems
    : null;

  const chatSummary = campaign || lineItems ? { campaign, lineItems } : null;

  return chatSummary;
}
