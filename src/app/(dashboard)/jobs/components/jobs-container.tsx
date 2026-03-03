
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { JobMonitoringService } from '@/lib/constants';
import { useQueryState } from '@/lib/hooks';
import { Filters, Sorter } from '@/lib/utils/table';
import {
  connectSSE,
  disconnectAllSSE,
  disconnectSSE,
} from '@/services/sse-service';
import { SimplePagination } from '@/uicomponents';
import { useSession } from '@/lib/hooks/use-session';
import { FC, useEffect, useRef, useState } from 'react';
import { IJob, IJobSSEUpdate } from '../lib/types';
import { fetchJobMonitoringJobs } from '../services';
import { useJobsStore } from '../store';
import { JobStepsDrawer } from './job-steps-drawer';
import { JobsHeader } from './jobs-header';
import { JobsList } from './jobs-list';

const TERMINAL_STATUSES = ['SUCCESS', 'FAILED', 'CANCELLED'];

interface JobsContainerProps {
  lineItemId?: string;
  showHeader?: boolean;
  hideLineItemColumn?: boolean;
}

export const JobsContainer: FC<JobsContainerProps> = ({
  lineItemId,
  showHeader,
  hideLineItemColumn = false,
}) => {
  // Get session for auth token
  const { data: session } = useSession();

  // Get store methods and state
  const {
    jobs,
    total: totalRecords,
    setJobs,
    setTotal,
    updateJobWithSteps,
    reset: resetStore,
  } = useJobsStore();

  // Local state for pagination and loading
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<Filters<IJob>>({});
  const [sorterInfo, setSorterInfo] = useState<Sorter<IJob>>({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Get selected job from store (will update when store updates)
  const selectedJob = selectedJobId
    ? jobs.find((j) => j.jobId === selectedJobId) || null
    : null;
  const filterInfoRef = useRef(filterInfo);
  const sorterInfoRef = useRef(sorterInfo);
  const initialFetchDoneRef = useRef(false);
  const prevQueryRef = useRef<{ page: string; pageSize: string } | null>(null);

  const useUrlState = !lineItemId;
  const { queryState, setQueryState } = useQueryState();

  // Initial fetch - runs once on mount
  useEffect(() => {
    if (initialFetchDoneRef.current) return;
    initialFetchDoneRef.current = true;

    if (useUrlState) {
      // URL-based pagination (for standalone page)
      const page = Number(queryState?.page) || 1;
      const size = Number(queryState?.pageSize) || 25;

      setCurrentPage(page);
      setPageSize(size);
      prevQueryRef.current = {
        page: String(page),
        pageSize: String(size),
      };

      // Set URL params if not present
      if (!queryState?.page || !queryState?.pageSize) {
        setQueryState([
          { name: 'page', value: page },
          { name: 'pageSize', value: size },
        ]);
      }

      fetchJobsList(page, size);
    } else {
      // Local state pagination (for embedded tab)
      fetchJobsList(1, 25);
    }
  }, []);

  // Handle URL query state changes (for pagination from URL)
  useEffect(() => {
    if (!useUrlState || !initialFetchDoneRef.current) return;

    const page = queryState?.page;
    const size = queryState?.pageSize;

    // Only fetch if values actually changed from previous
    if (
      page &&
      size &&
      (page !== prevQueryRef.current?.page ||
        size !== prevQueryRef.current?.pageSize)
    ) {
      prevQueryRef.current = { page, pageSize: size };
      const pageNum = Number(page);
      const sizeNum = Number(size);
      setCurrentPage(pageNum);
      setPageSize(sizeNum);
      fetchJobsList(pageNum, sizeNum);
    }
  }, [queryState?.page, queryState?.pageSize, useUrlState]);

  const handlePageChange = (page: number, size: number) => {
    if (useUrlState) {
      setQueryState([
        { name: 'page', value: page },
        { name: 'pageSize', value: size },
      ]);
    } else {
      setCurrentPage(page);
      setPageSize(size);
      fetchJobsList(page, size);
    }
  };

  const filterSorterMountRef = useRef(true);

  const handleFiltersChange = (filters: Filters<IJob>) => {
    filterInfoRef.current = filters;
    setFilterInfo(filters);
  };

  const handleSorterChange = (sorter: Sorter<IJob>) => {
    sorterInfoRef.current = sorter;
    setSorterInfo(sorter);
  };

  // Handle filter/sorter changes
  useEffect(() => {
    // Skip first render
    if (filterSorterMountRef.current) {
      filterSorterMountRef.current = false;
      return;
    }

    fetchJobsList(1, pageSize, filterInfo, sorterInfo);
    setCurrentPage(1);
    if (useUrlState) {
      setQueryState([
        { name: 'page', value: 1 },
        { name: 'pageSize', value: pageSize },
      ]);
    }
  }, [filterInfo, sorterInfo]);

  const fetchJobsList = async (
    page: number,
    size: number,
    overrideFilters?: Filters<IJob>,
    overrideSorter?: Sorter<IJob>,
  ) => {
    setIsLoading(true);
    try {
      // Use override filters if provided, otherwise use ref
      const filters =
        overrideFilters !== undefined ? overrideFilters : filterInfoRef.current;
      const sorterRaw =
        overrideSorter !== undefined ? overrideSorter : sorterInfoRef.current;
      const sorter = Array.isArray(sorterRaw) ? sorterRaw[0] : sorterRaw;

      const params: Record<string, unknown> = {};

      // Add sort params
      if (sorter?.field && sorter?.order) {
        params.sort = `${sorter.field},${sorter.order === 'ascend' ? 'ASC' : 'DESC'}`;
      }

      // Add filter params
      Object.entries(filters).forEach(([key, value]) => {
        // Only skip lineItemId if it's already being passed as a prop
        if (key === 'lineItemId' && lineItemId) return; // handled separately via props

        if (key === 'startedAt' || key === 'completedAt') {
          // Handle date range filters - they come as array with single object [{from, to}]
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === 'object'
          ) {
            const dateRange = value[0] as { from?: string; to?: string };
            if (dateRange.from) params[`${key}From`] = String(dateRange.from);
            if (dateRange.to) params[`${key}To`] = String(dateRange.to);
          }
          return; // Don't process date ranges further
        } else if (Array.isArray(value) && value.length > 0) {
          // Check if it's a date range array (contains objects)
          if (
            typeof value[0] === 'object' &&
            'from' in value[0] &&
            'to' in value[0]
          ) {
            // Skip - this shouldn't happen as we handle date ranges above
            return;
          }
          // Handle searchable columns (single string in array) or multi-select filters
          if (value.length === 1 && typeof value[0] === 'string') {
            // For searchable columns like email or lineItemId (when not hidden)
            params[key] = value[0];
          } else {
            // Pass multi-select filter arrays as comma-separated strings for backend
            params[key] = value.join(',');
          }
        } else if (value && typeof value !== 'object') {
          // Only add non-object values directly
          params[key] = value;
        }
      });

      const response = await fetchJobMonitoringJobs(
        page - 1,
        size,
        lineItemId,
        params,
      );
      if (response?.data) {
        const jobsWithKeys = response.data.map((job: IJob) => ({
          ...job,
          key: job.id,
        }));
        setJobs(jobsWithKeys);
        setTotal(response.total || 0);
      }
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (job: IJob) => {
    setSelectedJobId(job.jobId);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedJobId(null);
  };

  // Track connected job IDs to prevent duplicate connections
  const connectedJobsRef = useRef<Set<string>>(new Set());

  // SSE connections for active jobs
  useEffect(() => {
    if (!session) return;

    // Get current job IDs in the list
    const currentJobIds = new Set(jobs.map((job) => job.jobId));

    // Disconnect SSE for jobs no longer in the list
    connectedJobsRef.current.forEach((connectedJobId) => {
      if (!currentJobIds.has(connectedJobId)) {
        disconnectSSE(connectedJobId);
        connectedJobsRef.current.delete(connectedJobId);
      }
    });

    // Disconnect SSE for jobs that became terminal (via API refresh)
    jobs.forEach((job) => {
      const isTerminal = TERMINAL_STATUSES.includes(job.status);
      const isConnected = connectedJobsRef.current.has(job.jobId);

      if (isTerminal && isConnected) {
        disconnectSSE(job.jobId);
        connectedJobsRef.current.delete(job.jobId);
      }
    });

    // Connect SSE for active jobs that aren't already connected
    jobs.forEach((job) => {
      const isActiveJob = !TERMINAL_STATUSES.includes(job.status);
      const alreadyTracked = connectedJobsRef.current.has(job.jobId);

      if (isActiveJob && !alreadyTracked) {
        connectedJobsRef.current.add(job.jobId);

        const endpoint = `${JobMonitoringService}/sse/jobs/${job.jobId}/stream`;

        connectSSE<IJobSSEUpdate>(job.jobId, endpoint, {
          onMessage: (data) => {
            updateJobWithSteps(data);

            // Disconnect if job reached terminal status
            if (data.status && TERMINAL_STATUSES.includes(data.status)) {
              disconnectSSE(data.jobId);
              connectedJobsRef.current.delete(data.jobId);
            }
          },
        });
      }
    });
  }, [jobs, session, updateJobWithSteps]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      disconnectAllSSE();
      connectedJobsRef.current.clear();
      resetStore();
    };
  }, []);

  return (
    <>
      <TableWithPaginationLayout
        header={
          <JobsHeader
            filterInfo={filterInfo}
            onFiltersChange={handleFiltersChange}
            showHeader={showHeader}
          />
        }
        table={
          <JobsList
            jobs={jobs}
            filterInfo={filterInfo}
            sorterInfo={sorterInfo}
            handleFiltersChange={handleFiltersChange}
            handleSorterChange={handleSorterChange}
            onRowClick={handleRowClick}
            hideLineItemColumn={hideLineItemColumn}
          />
        }
        pagination={
          <Hideable show={totalRecords > 0}>
            <SimplePagination
              current={currentPage}
              pageSize={pageSize}
              total={totalRecords}
              onChange={handlePageChange}
            />
          </Hideable>
        }
      />
      <JobStepsDrawer
        job={selectedJob}
        open={drawerOpen}
        onClose={handleDrawerClose}
      />
    </>
  );
};
