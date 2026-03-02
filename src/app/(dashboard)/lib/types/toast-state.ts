export interface IToastState {
  isToastOpen: boolean;
  toastType: 'Progress' | 'Success' | 'Error';
  progress: number;
  message: string;
  header: string;
  info?: Record<string, string | number | boolean>;
  statusCode: number;
}
