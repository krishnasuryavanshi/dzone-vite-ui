import { create } from 'zustand';
import { IJob, IJobSSEUpdate } from '../lib/types';

interface JobsStore {
  // Jobs list
  jobs: IJob[];
  setJobs: (jobs: IJob[]) => void;

  // Total records
  total: number;
  setTotal: (total: number) => void;

  // Update a single job (for websocket updates)
  updateJob: (job: IJob) => void;

  // Update job with steps handling (for SSE updates)
  updateJobWithSteps: (update: IJobSSEUpdate) => void;

  // Reset store
  reset: () => void;
}

export const useJobsStore = create<JobsStore>((set) => ({
  jobs: [],
  total: 0,

  setJobs: (jobs) => set({ jobs }),

  setTotal: (total) => set({ total }),

  updateJob: (updatedJob) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === updatedJob.id ? { ...job, ...updatedJob } : job,
      ),
    })),

  updateJobWithSteps: (update) =>
    set((state) => {
      const { jobId, step: newStep } = update;

      const updatedJobs = state.jobs.map((job) => {
        if (job.jobId !== jobId) {
          return job;
        }

        // Merge only updatable job fields
        const updatedJob: IJob = {
          ...job,
          status: update.status ?? job.status,
          totalSteps: update.totalSteps ?? job.totalSteps,
          totalCount: update.totalCount ?? job.totalCount,
          successCount: update.successCount ?? job.successCount,
          skippedCount: update.skippedCount ?? job.skippedCount,
          invalidCount: update.invalidCount ?? job.invalidCount,
          startedAt: update.startedAt ?? job.startedAt,
          completedAt: update.completedAt ?? job.completedAt,
          updatedAt: update.updatedAt ?? job.updatedAt,
          errorMessage: update.errorMessage ?? job.errorMessage,
        };

        // Handle step if provided (single step from SSE)
        if (newStep) {
          const existingSteps = [...(job.steps || [])];
          const existingIndex = existingSteps.findIndex(
            (s) => s.stepId === newStep.stepId,
          );

          if (existingIndex >= 0) {
            // Update existing step
            existingSteps[existingIndex] = {
              ...existingSteps[existingIndex],
              ...newStep,
            };
          } else {
            // Add new step to beginning
            existingSteps.unshift(newStep);
          }

          updatedJob.steps = existingSteps;
        }

        return updatedJob;
      });

      return { jobs: updatedJobs };
    }),

  reset: () => set({ jobs: [], total: 0 }),
}));
