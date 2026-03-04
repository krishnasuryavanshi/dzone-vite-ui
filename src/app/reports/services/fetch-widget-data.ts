import { getMockWidgetData } from '../mocks/widget-data';

export async function fetchWidgetData(
  widgetId: string,
  _filters: Record<string, unknown>,
): Promise<Record<string, unknown>[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400));
  return getMockWidgetData(widgetId);
}
