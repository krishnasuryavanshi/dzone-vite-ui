import { IJob, IJobSSEUpdate } from '../types';

/**
 * Merges SSE update data into an existing job object.
 * Extracted from the former useJobsStore.updateJobWithSteps method.
 */
export function mergeJobWithSSEUpdate(job: IJob, update: IJobSSEUpdate): IJob {
  const { step: newStep } = update;

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

  if (newStep) {
    const existingSteps = [...(job.steps || [])];
    const existingIndex = existingSteps.findIndex((s) => s.stepId === newStep.stepId);

    if (existingIndex >= 0) {
      existingSteps[existingIndex] = {
        ...existingSteps[existingIndex],
        ...newStep,
      };
    } else {
      existingSteps.unshift(newStep);
    }

    updatedJob.steps = existingSteps;
  }

  return updatedJob;
}
