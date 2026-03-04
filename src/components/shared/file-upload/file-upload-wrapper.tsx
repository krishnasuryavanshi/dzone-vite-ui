import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { Spin } from '@/uicomponents/spin';
import { MultipleFilesUpload } from './multiple-files-upload';
import {
  fetchFileMetadata,
  uploadSingleFile,
  uploadMultipleFiles,
} from '@/app/(dashboard)/campaign-management/line-items/services';
import { convertToBytes } from '@/lib/utils';
import { getExtension, getBaseName } from '@/lib/utils/string';
import { UploadFile, UploadProps } from '@/lib/types/uicomponents';
import { showNotification } from '@/services/notification';
import { SingleFileUpload } from './single-file-upload';
import { FileTypeNameEnum } from '@/app/(dashboard)/campaign-management/line-items/lib/enums';

interface Props {
  fileTypeName: string;
  uploadType: 'single' | 'multiple';
  onUploadComplete: (data: any) => void;
  inputProps?: Record<string, any>;
  tenantCode?: string;
  value?: Record<string, any> | undefined;
}

interface ExtendedUploadFile extends UploadFile {
  id?: string;
}

interface IExtendedUploadProps extends UploadProps<any> {
  uploading?: boolean;
  uploadPercent?: number;
}

export const DynamicFileUpload: React.FC<Props> = ({
  fileTypeName,
  uploadType,
  onUploadComplete,
  tenantCode,
  value,
}) => {
  const [fileList, setFileList] = useState<ExtendedUploadFile[]>([]);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  let debounceTimeout: NodeJS.Timeout;

  // TanStack Query: file upload metadata
  const { data: metadataResponse, isLoading: loading } = useQuery({
    queryKey: [...queryKeys.fileUpload.all, 'fileMetadata', fileTypeName],
    queryFn: () => fetchFileMetadata(fileTypeName),
    staleTime: 30 * 60 * 1000,
    enabled: !!fileTypeName,
  });
  const metadata = metadataResponse?.data || undefined;

  const hydrate = () => {
    if (!value) return;

    if (Array.isArray(value)) {
      const firstItem = value[0];
      if (firstItem && typeof firstItem === 'object') {
        setFileList(
          value.map((f: any) => ({
            ...f,
            uid: f.id || f.uid,
            name: f.name || f.filename || `File (${f.id})`,
            status: 'done',
            percent: 100,
          })),
        );
      } else if (typeof firstItem === 'string') {
        const hydrated = value.map((id: string) => ({
          uid: id,
          id,
          name: `File (${id})`,
          status: 'done',
          percent: 100,
        })) as ExtendedUploadFile[];
        setFileList(hydrated);
      }
    } else if (typeof value === 'object' && value !== null) {
      setFileList([
        {
          ...(value as Record<string, any>),
          uid: value.id || value.uid,
          name: value.name || value.filename || `File (${value.id})`,
          status: 'done',
          percent: 100,
        },
      ]);
    }
  };

  useEffect(() => {
    hydrate();
  }, [value]);

  const isValidFile = (info: any, fileMeta: any) => {
    if (!info.file) return false;
    const { name, size } = info.file;
    const extension = getExtension(name);
    const basename = getBaseName(name);
    const allowedFileSize = convertToBytes(fileMeta?.size);
    const fileNameRegex = new RegExp(fileMeta?.file?.regex);

    let errorMsg = '';
    if (basename.length > fileMeta?.name?.length) {
      errorMsg = `File name should be less than ${fileMeta?.name?.length} characters`;
    } else if (!fileNameRegex.test(basename)) {
      errorMsg = `File name is invalid`;
    } else if (!fileMeta?.types.includes(extension.toUpperCase())) {
      errorMsg = `Please upload a file with these extensions: ${fileMeta?.types.join(', ')}`;
    } else if (size > allowedFileSize) {
      errorMsg = `File size should be less than ${fileMeta?.size}`;
    }
    if (errorMsg) {
      showNotification({ type: 'error', message: errorMsg });
      return false;
    }

    return true;
  };

  const handleFileChange = async (info: any, fileMeta: any) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      if (!isValidFile(info, fileMeta)) return;
      const allFiles = info.fileList
        ?.filter((f: any) => f?.originFileObj)
        ?.map((f: any) => f.originFileObj);

      if (!allFiles || allFiles.length === 0) return;

      const newFiles = allFiles.filter((file: File) => {
        return !fileList.find(
          (existing) =>
            existing.originFileObj?.name === file.name &&
            existing.status === 'done',
        );
      });

      if (newFiles.length === 0) return;
      const newUploadingFiles: ExtendedUploadFile[] = newFiles.map(
        (file: File) => ({
          uid: `${file.name}-${file.lastModified}-${Math.random()}`,
          name: file.name,
          status: 'uploading',
          percent: 0,
          originFileObj: file,
        }),
      );

      setFileList((prev) => [...prev, ...newUploadingFiles]);

      try {
        if (
          fileTypeName === FileTypeNameEnum.DeliveryTemplate ||
          fileTypeName === FileTypeNameEnum.IOFileDetails
        ) {
          const first = newFiles[0];
          if (first) {
            await handleUploadSingleFile(first, newUploadingFiles[0]);
          }
        } else {
          await handleUploadMultipleFiles(newFiles, newUploadingFiles);
        }
      } catch (error) {
        setFileList((prev) =>
          prev.filter(
            (f) =>
              !newUploadingFiles.find(
                (nf) => nf.uid === f.uid || nf.name === f.name,
              ),
          ),
        );
      }
    }, 200);
  };

  const handleRemove = (file?: UploadFile) => {
    if (fileTypeName === FileTypeNameEnum.DeliveryTemplate) {
      setFileList([]);
      onUploadComplete(null);
    } else if (fileTypeName === FileTypeNameEnum.Asset && file) {
      const updatedList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(updatedList);
      onUploadComplete(updatedList.filter((f) => f.status === 'done'));
    }
  };

  const getUploadProps = (fileMeta: any): IExtendedUploadProps => ({
    accept: `.${fileMeta?.types?.join(',.')}`,
    multiple: fileTypeName === FileTypeNameEnum.Asset,
    showUploadList: false,
    name: 'file',
    onChange: (info) => handleFileChange(info, fileMeta),
    onRemove: handleRemove,
  });

  const handleUploadMultipleFiles = async (
    files: File[],
    uploadingFiles: ExtendedUploadFile[],
  ) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('fileTypeName', fileTypeName);
    if (tenantCode) formData.append('tenantCode', tenantCode);

    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setFileList((prev) =>
        prev.map((f) =>
          f.status === 'uploading'
            ? { ...f, percent: Math.min(percent, 90) }
            : f,
        ),
      );
      if (percent >= 90) clearInterval(interval);
    }, 200);

    try {
      const data = await uploadMultipleFiles(formData);
      clearInterval(interval);

      if (!data?.data?.length) throw new Error('Upload failed');
      const uploadedFiles = data.data;

      setFileList((prev) => {
        const doneFiles = prev.filter((f) => f.status === 'done');
        const updatedList = uploadedFiles.map((uploaded: any, i: any) => ({
          ...uploadingFiles[i],
          ...uploaded,
          name: uploaded.filename || uploaded.name || uploadingFiles[i].name,
          status: 'done',
          percent: 100,
        }));

        const finalList = [...doneFiles, ...updatedList];
        const seen = new Set();
        const dedupedList = finalList.filter((file) => {
          const key = file.id || file.uid;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        onUploadComplete(dedupedList);
        return dedupedList;
      });

      showNotification({
        type: 'success',
        message: 'Files uploaded successfully.',
      });
    } catch (error) {
      clearInterval(interval);
      setFileList((prev) =>
        prev.map((f) =>
          uploadingFiles.find((u) => u.uid === f.uid)
            ? { ...f, status: 'error', percent: 0 }
            : f,
        ),
      );
    }
  };

  const handleUploadSingleFile = async (
    file: File,
    uploadingFile: ExtendedUploadFile,
  ) => {
    try {
      setIsButtonLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileTypeName', fileTypeName);
      formData.append('tenantCode', tenantCode as string);

      const data = await uploadSingleFile(formData);

      if (data?.data) {
        setFileList([
          {
            ...uploadingFile,
            status: 'done',
            percent: 100,
          },
        ]);
        onUploadComplete(data.data);
        showNotification({
          type: 'success',
          message: `File uploaded successfully.`,
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      showNotification({ type: 'error', message: `Upload failed.` });
      setFileList([]);
    } finally {
      setIsButtonLoading(false);
    }
  };

  if (loading) return <Spin />;
  const uploadProps = getUploadProps(metadata);

  return uploadType === 'multiple' ? (
    <MultipleFilesUpload
      uploadProps={uploadProps}
      maxFiles={metadata?.maxFiles || 10}
      value={fileList}
    />
  ) : (
    <SingleFileUpload
      {...metadata}
      value={fileList[0]}
      uploadProps={uploadProps}
      isButtonLoading={isButtonLoading}
    />
  );
};
