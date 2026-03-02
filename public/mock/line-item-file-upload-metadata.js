const file = {
  types: ['XLSX', 'XLS', 'CSV', 'PDF'],
  size: '2MB',
  storageLocation: 's3',
  allowedMultiples: false,
  allowedEncryption: false,
  allowedDuplicate: true,
  prefix: 'delivery-template',
  progress: false,
};

export const LineitemFileUploadMetadata = {
  deliveryTemplate: { file },
  jobTitlesList: { file },
  targetAccountsList: { file },
  suppressionsList: { file },
  intentKeywordsList: { file },
  technologiesList: { file },
};
