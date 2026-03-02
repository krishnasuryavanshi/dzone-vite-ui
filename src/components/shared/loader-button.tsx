import { LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Spin } from '../uicomponents';

export const LoaderButton = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <Button
      type='primary'
      htmlType='submit'
      style={{ width: '4.5rem', ...style }} // Merge default and provided styles
    >
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />
        }
      />
    </Button>
  );
};
