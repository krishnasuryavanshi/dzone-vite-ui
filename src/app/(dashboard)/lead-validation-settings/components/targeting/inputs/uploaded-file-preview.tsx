import { FilePreview, MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';

type UploadedFilePreviewProps = {
  value?: DzRecord[];
  isReadonly?: boolean;
  handleRemoveFile: (file: DzRecord) => void;
};

export const UploadedFilePreview = ({
  value,
  isReadonly = false,
  handleRemoveFile,
}: UploadedFilePreviewProps) => {
  const renderFile = (file: DzRecord) => {
    return (
      <FilePreview file={file} handleRemoveFile={!isReadonly ? handleRemoveFile : undefined} />
    );
  };

  if (!value?.length) {
    return null;
  }

  return <MapFunction items={value} renderItem={renderFile} />;
};
