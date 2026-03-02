import { Upload as AntdUpload, UploadProps } from 'antd';
import { FC } from 'react';

const { Dragger } = AntdUpload;
interface IUploadProps extends UploadProps {}

export const Upload: FC<IUploadProps> = ({ children, ...rest }) => {
  return <AntdUpload {...rest}>{children}</AntdUpload>;
};

export const DraggerUpload: FC<IUploadProps> = ({ children, ...rest }) => {
  return <Dragger {...rest}>{children}</Dragger>;
};
