
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
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { IJob, IJobSSEUpdate } from '../lib/types';
import { useJobsQuery } from '../hooks/use-jobs-query';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { JobStepsDrawer } from './job-steps-drawer';
import { JobsHeader } from './jobs-header';
import { JobsList } from './jobs-list';
import { mergeJobWithSSEUpdate } from '../lib/utils/merge-job-with-sse-update';

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
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [filterInfo, setFilterInfo] = useState<Filters<IJob>>({});
  const [sorterInfo, setSorterInfo] = useState<Sorter<IJob>>({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const filterInfoRef = useRef(filterInfo);
  const sorterInfoRef = useRef(sorterInfo);

  const useUrlState = !lineItemId;
  const { queryState, setQueryState } = useQueryState();

  // Build sort params from sorter state
  const sortParams = useMemo(() => {
    const sorter = Array.isArray(sorterInfoRef.current)
      ? sorterInfoRef.current[0]
      : sorterInfoRef.current;
    const params: Record<string, unknown> = {};

    if (sorter?.field && sorter?.order) {
      params.sort = `${sorter.field},${sorter.order === 'ascend' ? 'ASC' : 'DESC'}`;
    }

    // Add filter params
    Object.entries(filterInfoRef.current).forEach(([key, value]) => {
      if (key === 'lineItemId' && lineItemId) return;

      if (key === 'startedAt' || key === 'completedAt') {
        if (
          Array.isArray(value) &&
          value.length > 0 &&
          typeof value[0] === 'object'
        ) {
          const dateRange = value[0] as { from?: string; to?: string };
          if (dateRange.from) params[`${key}From`] = String(dateRange.from);
          if (dateRange.to) params[`${key}To`] = String(dateRange.to);
        }
        return;
      } else if (Array.isArray(value) && value.length > 0) {
        if (
          typeof value[0] === 'object' &&
          'from' in value[0] &&
          'to' in value[0]
        ) {
          return;
        }
        if (value.length === 1 && typeof value[0] === 'string') {
          params[key] = value[0];
        } else {
          params[key] = value.join(',');
        }
      } else if (value && typeof value !== 'object') {
        params[key] = value;
      }
    });

    return params;
  }, [filterInfo, sorterInfo, lineItemId]);

  const hasValidPagination = currentPage > 0 && pageSize > 0;

  const { data: jobsResult } = useJobsQuery(
    currentPage - 1,
    pageSize,
    lineItemId,
    sortParams,
    hasValidPagination,
  );

  const jobs = useMemo(
    () => (jobsResult?.data ?? []).map((job: IJob) => ({ ...job, key: job.id })),
    [jobsResult],
  );
  const totalRecords = jobsResult?.total ?? 0;

  const selectedJob = selectedJobId
    ? jobs.find((j: IJob) => j.jobId === selectedJobId) || null
    : null;

  // Sync URL state to local pagination
  useEffect(() => {
    if (!useUrlState) return;
    if (queryState) {
      const page = Number(queryState.page);
      const size = Number(queryState.pageSize);
      if (page && size) {
        setCurrentPage(page);
        setPageSize(size);
      } else {
        setQueryState([
          { name: 'page', value: page || 1 },
          { name: 'pageSize', value: size || 25 },
        ]);
      }
    }
  }, [queryState]);

  const handlePageChange = (page: number, size: number) => {
    if (useUrlState) {
      setQueryState([
        { name: 'page', value: page },
        { name: 'pageSize', value: size },
      ]);
    } else {
      setCurrentPage(page);
      setPageSize(size);
    }
  };

  const handleFiltersChange = (filters: Filters<IJob>) => {
    filterInfoRef.current = filters;
    setFilterInfo(filters);
    setCurrentPage(1);
    if (useUrlState) {
      setQueryState([
        { name: 'page', value: 1 },
        { name: 'pageSize', value: pageSize },
      ]);
    }
  };

  const handleSorterChange = (sorter: Sorter<IJob>) => {
    sorterInfoRef.current = sorter;
    setSorterInfo(sorter);
    setCurrentPage(1);
    if (useUrlState) {
      setQueryState([
        { name: 'page', value: 1 },
        { name: 'pageSize', value: pageSize },
      ]);
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

  // SSE connections for active jobs - update query cache directly
  useEffect(() => {
    if (!session) return;

    const currentJobIds = new Set(jobs.map((job: IJob) => job.jobId));

    // Disconnect SSE for jobs no longer in the list
    connectedJobsRef.current.forEach((connectedJobId) => {
      if (!currentJobIds.has(connectedJobId)) {
        disconnectSSE(connectedJobId);
        connectedJobsRef.current.delete(connectedJobId);
      }
    });

    // Disconnect SSE for jobs that became terminal
    jobs.forEach((job: IJob) => {
      const isTerminal = TERMINAL_STATUSES.includes(job.status);
      const isConnected = connectedJobsRef.current.has(job.jobId);

      if (isTerminal && isConnected) {
        disconnectSSE(job.jobId);
        connectedJobsRef.current.delete(job.jobId);
      }
    });

    // Connect SSE for active jobs
    jobs.forEach((job: IJob) => {
      const isActiveJob = !TERMINAL_STATUSES.includes(job.status);
      const alreadyTracked = connectedJobsRef.current.has(job.jobId);

      if (isActiveJob && !alreadyTracked) {
        connectedJobsRef.current.add(job.jobId);

        const endpoint = `${JobMonitoringService}/sse/jobs/${job.jobId}/stream`;

        connectSSE<IJobSSEUpdate>(job.jobId, endpoint, {
          onMessage: (update) => {
            // Update query cache directly
            const currentQueryKey = queryKeys.jobs.list({
              page: currentPage - 1,
              size: pageSize,
              lineItemId,
              ...sortParams,
            });
            queryClient.setQueryData(currentQueryKey, (old: any) => {
              if (!old?.data) return old;
              return {
                ...old,
                data: old.data.map((j: IJob) =>
                  j.jobId === update.jobId
                    ? mergeJobWithSSEUpdate(j, update)
                    : j,
                ),
              };
            });

            // Disconnect if job reached terminal status
            if (update.status && TERMINAL_STATUSES.includes(update.status)) {
              disconnectSSE(update.jobId);
              connectedJobsRef.current.delete(update.jobId);
            }
          },
        });
      }
    });
  }, [jobs, session]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectAllSSE();
      connectedJobsRef.current.clear();
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
