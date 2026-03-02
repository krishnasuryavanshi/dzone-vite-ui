import { DzRecord } from '@/lib/types';
import { convertToBytes } from '@/lib/utils';
import { uploadFile } from '@/services/file-upload';
import { showNotification } from '@/services/notification';

export const fileSortAndUpload = async (
  fileObject: DzRecord,
  fileValidationMetadata: DzRecord,
  tenantCode: string,
  fileTypeName: string,
) => {
  try {
    const files = fileObject.fileList;
    const [valid, invalid] = files.reduce(
      (acc: any, file: DzRecord) => {
        const size = file.size;
        if (size <= convertToBytes(fileValidationMetadata?.size)) {
          acc[0].push(file.originFileObj);
        } else {
          acc[1].push(file);
        }
        return acc;
      },
      [[], []] as [Blob[], DzRecord[]],
    );

    if (invalid?.length) {
      const errorMessage = `Upload unsuccessful. One or more files you selected exceeds the ${fileValidationMetadata?.size} size limit. Please choose smaller files.`;
      showNotification({
        type: 'error',
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }

    let validFiles = [] as DzRecord[];
    let invalidFiles = [] as DzRecord[];

    if (valid.length) {
      const formData = new FormData();
      formData.append('tenantCode', tenantCode);
      formData.append('fileTypeName', fileTypeName);
      valid.forEach((file: Blob, index: number) => {
        formData.append('files', valid[index]);
      });

      const { data } = await uploadFile(formData);

      if (data?.length) {
        validFiles = data;
      }
    }

    // Cant show error message for some of the files, if any file failed to upload from the valid files,
    // BE is not uploading all other files also. Not sure what error has to be shown for valid but unsuccessful files

    // if (invalid.length) {
    //   invalid.forEach((file: DzRecord) => {
    //     invalidFiles.push({
    //       id: Math.random().toString(36).substring(2, 15), // Generate a random ID for the file
    //       fileName: file.name,
    //       fileSize: file.size,
    //       fileType: file.type,
    //       variant: 'error',
    //       error: `Upload unsuccessful. The file you selected exceeds the ${fileValidationMetadata?.size} size limit. Please choose a smaller file.`,
    //     });
    //   });
    // }

    return [...validFiles, ...invalidFiles];
  } catch (error) {
    throw error;
  }
};
