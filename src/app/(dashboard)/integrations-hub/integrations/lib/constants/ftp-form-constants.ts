export const FTP_FORM_CONSTANTS = {
  DEFAULT_PORT: 22,
  FILE_TYPE_NAME: 'private-key-file',
  ACCEPTED_FILE_EXTENSIONS: '.pem,.ppk,.key',
  MAX_PATH_LENGTH: 255,
  MAX_NAME_LENGTH: 255,
} as const;

export const FTP_INPUT_STYLES = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
} as const;
