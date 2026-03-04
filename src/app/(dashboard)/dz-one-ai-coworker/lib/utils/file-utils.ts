/**
 * File utility functions for the AI Agent chat
 */

/**
 * Get MIME type from filename extension
 */
export const getFileTypeFromName = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    txt: 'text/plain',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * File icon types for display
 */
export type FileIconType = 'image' | 'pdf' | 'doc' | 'xls' | 'csv' | 'txt' | 'file';

/**
 * Get appropriate icon type for file based on extension
 */
export const getFileIconType = (filename: string): FileIconType => {
  const ext = getFileExtension(filename);
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx'].includes(ext)) return 'xls';
  if (ext === 'csv') return 'csv';
  if (ext === 'txt') return 'txt';
  return 'file';
};

/**
 * Get document label for display
 */
export const getDocumentLabel = (filename?: string): string => {
  if (!filename) return 'FILE';

  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'docx':
    case 'doc':
      return 'DOC';
    case 'xlsx':
    case 'xls':
      return 'XLS';
    case 'csv':
      return 'CSV';
    case 'txt':
      return 'TXT';
    case 'png':
      return 'PNG';
    case 'jpg':
    case 'jpeg':
      return 'JPG';
    case 'gif':
      return 'GIF';
    case 'webp':
      return 'WEBP';
    default:
      return 'FILE';
  }
};

/**
 * Check if file is an image type
 */
export const isImageFile = (type?: string, name?: string): boolean => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  if (type && imageTypes.includes(type.toLowerCase())) {
    return true;
  }

  if (name) {
    const extension = `.${name.split('.').pop()?.toLowerCase()}`;
    return imageExtensions.includes(extension);
  }

  return false;
};
