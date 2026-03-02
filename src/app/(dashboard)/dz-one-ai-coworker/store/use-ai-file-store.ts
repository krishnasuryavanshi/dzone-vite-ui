import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FileAttachment, FileUploadStatus } from '../lib/types';
import { FILE_UPLOAD } from '../lib/constants';

export interface AiFileState {
  attachments: FileAttachment[];
  isUploading: boolean;
  uploadProgress: number;
  isDraggingOver: boolean;
}

export interface AiFileActions {
  addAttachment: (attachment: FileAttachment) => void;
  updateAttachmentProgress: (id: string, progress: number) => void;
  updateAttachmentStatus: (
    id: string,
    status: FileUploadStatus,
    error?: string,
  ) => void;
  updateAttachmentId: (tempId: string, realId: string) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
  setUploading: (isUploading: boolean) => void;
  setDraggingOver: (isDragging: boolean) => void;
  getSuccessfulAttachments: () => FileAttachment[];
}

export type AiFileStore = AiFileState & AiFileActions;

const initialFileState: AiFileState = {
  attachments: [],
  isUploading: false,
  uploadProgress: 0,
  isDraggingOver: false,
};

export const useAiFileStore = create<AiFileStore>()(
  immer((set, get) => ({
    ...initialFileState,

    addAttachment: (attachment: FileAttachment) => {
      set((state) => {
        state.attachments.push(attachment);
      });
    },

    updateAttachmentProgress: (id: string, progress: number) => {
      set((state) => {
        const index = state.attachments.findIndex((a) => a.id === id);
        if (index !== -1) {
          state.attachments[index].progress = progress;
        }
        // Calculate overall progress
        const total = state.attachments.reduce(
          (acc, a) => acc + (a.progress || 0),
          0,
        );
        state.uploadProgress = Math.round(total / state.attachments.length);
      });
    },

    updateAttachmentStatus: (
      id: string,
      status: FileUploadStatus,
      error?: string,
    ) => {
      set((state) => {
        const index = state.attachments.findIndex((a) => a.id === id);
        if (index !== -1) {
          state.attachments[index].status = status;
          if (error) {
            state.attachments[index].error = error;
          }
          if (status === FileUploadStatus.SUCCESS) {
            state.attachments[index].progress = FILE_UPLOAD.PROGRESS_COMPLETE;
          }
        }
      });
    },

    updateAttachmentId: (tempId: string, realId: string) => {
      set((state) => {
        const index = state.attachments.findIndex((a) => a.id === tempId);
        if (index !== -1) {
          state.attachments[index].id = realId;
        }
      });
    },

    removeAttachment: (id: string) => {
      set((state) => {
        state.attachments = state.attachments.filter((a) => a.id !== id);
        // Recalculate overall progress
        if (state.attachments.length > 0) {
          const total = state.attachments.reduce(
            (acc, a) => acc + (a.progress || 0),
            0,
          );
          state.uploadProgress = Math.round(total / state.attachments.length);
        } else {
          state.uploadProgress = 0;
        }
      });
    },

    clearAttachments: () => {
      set((state) => {
        state.attachments = [];
        state.uploadProgress = 0;
        state.isUploading = false;
      });
    },

    setUploading: (isUploading: boolean) => {
      set((state) => {
        state.isUploading = isUploading;
      });
    },

    setDraggingOver: (isDragging: boolean) => {
      set((state) => {
        state.isDraggingOver = isDragging;
      });
    },

    getSuccessfulAttachments: () => {
      return get().attachments.filter(
        (a) => a.status === FileUploadStatus.SUCCESS,
      );
    },
  })),
);
