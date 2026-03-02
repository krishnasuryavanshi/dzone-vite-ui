import nock from 'nock';
import { fetchExecutiveGrid } from '@/app/(dashboard)/dashboard/services/fetch-executive-grid';
import { ApiResources } from '@/lib/enums';
import { IExcecutiveGrids } from '@/app/(dashboard)/dashboard/components/reporting-tabs/executive/types/executive-grid';
import { Filters } from '@/lib/utils/table';

const server = `${import.meta.env.VITE_API_URL}/api/reporting-service`;

describe('fetchExecutiveGrid', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  it('should fetch executive grid data without status filter', async () => {
    const mockResponse = {
      data: [],
      total: 0,
      page: 1,
    };

    const page = 1;
    const size = 10;

    nock(server)
      .post(`/${ApiResources.DashboardExecutiveGrid}`, {
        page,
        size,
      })
      .reply(200, mockResponse);

    const result = await fetchExecutiveGrid(page, size, null);
    expect(result).toEqual(mockResponse);
  });

  it('should fetch executive grid data with status filter', async () => {
    const mockResponse = {
      data: [],
      total: 0,
      page: 1,
    };

    const page = 1;
    const size = 10;
    const status: Filters<IExcecutiveGrids> = {
      clientName: ['Client1'],
      campaignName: ['Campaign1'],
      status: ['active'],
      ioNumber: ['IO123'],
      bookedRevenue: [1000],
      leadsGoal: [500],
      leadsDelivered: [400],
      valueAddLeads: [50],
      invoiced: [900],
    };

    const requestData: any = { page, size };
    if (status && Object.keys(status).length > 0) {
      requestData.status = status;
    }

    nock(server)
      .post(`/${ApiResources.DashboardExecutiveGrid}`, requestData)
      .reply(200, mockResponse);

    const result = await fetchExecutiveGrid(page, size, status);
    expect(result).toEqual(mockResponse);
  });

  it('should handle API errors', async () => {
    const page = 1;
    const size = 10;

    nock(server)
      .post(`/${ApiResources.DashboardExecutiveGrid}`)
      .reply(500, { message: 'Internal Server Error' });

    const result = await fetchExecutiveGrid(page, size, null);
    expect(result).toBeUndefined();
  });
});
