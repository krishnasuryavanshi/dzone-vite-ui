import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../utils';

export interface IDashboardReportContext {
  progress: Record<string, 'loading' | 'loaded'>;
  updateProgress: (data: Record<string, 'loading' | 'loaded'>) => void;
  filters: IFilterDataPayload | IExecutiveFilterDataPayload;
  updateFilters: (data: IFilterDataPayload | IExecutiveFilterDataPayload) => void;
  resetProgress: () => void;
}
