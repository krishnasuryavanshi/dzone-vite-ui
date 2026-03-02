import { CLR_BLUE_LIGHT } from '@/lib/constants';
import { ProgressProps } from '@/lib/types/uicomponents';
import { Progress } from '@/uicomponents/progress';

const singleColor: ProgressProps['strokeColor'] = `${CLR_BLUE_LIGHT}`;

export const completionProgressIndicator = (value: number) => {
  return (
    <Progress
      className='launch-progress'
      type='circle'
      percent={value}
      strokeColor={singleColor}
      size={30}
    />
  );
};
