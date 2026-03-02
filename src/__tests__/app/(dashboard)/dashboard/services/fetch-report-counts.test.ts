import nock from 'nock';
import { fetchReportCountsData } from '@/app/(dashboard)/dashboard/services/fetch-report-counts';
import { ApiResources } from '@/lib/enums';
import { PerformanceCountsType, ExecutiveReportType } from '@/app/(dashboard)/dashboard/lib/enums';

const server = `${import.meta.env.VITE_API_URL}/api/reporting-service`;

describe('fetchReportCountsData', () => {
  // Ensure all nock mocks are cleared before each test
  beforeEach(() => {
    nock.cleanAll();
  });

  // Ensure we don't have any unused nock mocks
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  it('should fetch report counts with performance type', async () => {
    const mockFilters = {
      range: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      },
      clients: [
        {
          uuid: 'client-1',
          campaigns: [
            {
              uuid: 'campaign-1',
              lineItems: [{ uuid: 'lineitem-1' }],
            },
          ],
        },
      ],
    };
    const mockType = PerformanceCountsType.NumberOfContactsGenerated;
    const mockResponse = { count: 42 };

    // Mock the API endpoint
    nock(server)
      .post(`/${ApiResources.DashboardStatsNoOfCantacts}`)
      .reply(200, mockResponse);

    const result = await fetchReportCountsData(mockFilters, mockType);
    expect(result).toEqual(mockResponse);
  });

  it('should fetch report counts with executive type', async () => {
    const mockExecutiveFilters = {
      unit: 'Revenue',
      timeframe: '6 Months',
    };
    const mockType = ExecutiveReportType.Bookings;
    const mockResponse = { count: 100 };

    // Mock the API endpoint
    nock(server)
      .post(`/${ApiResources.DashboardExecutiveBookings}`)
      .reply(200, mockResponse);

    const result = await fetchReportCountsData(mockExecutiveFilters, mockType);
    expect(result).toEqual(mockResponse);
  });
});
