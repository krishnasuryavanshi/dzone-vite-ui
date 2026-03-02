import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC, PropsWithChildren } from 'react';

interface ILeadMetaRowProps extends PropsWithChildren {
  className?: string;
  label?: string;
}

export const LeadMetaRow: FC<ILeadMetaRowProps> = ({
  children,
  className,
  label,
}) => {
  return (
    <Flex className={className} vertical gap={'0.25rem'}>
      <Text strong>{label}</Text>
      {children}
    </Flex>
  );
};
