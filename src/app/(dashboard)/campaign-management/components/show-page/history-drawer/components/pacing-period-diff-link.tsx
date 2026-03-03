
import { FC, useState } from 'react';
import { Button, Link } from '@/uicomponents';
import { EyeOutlined } from '@/uicomponents/icons';
import { PacingPeriodDiffModal } from './pacing-period-diff-modal';
import { CLR_BLUE_PRIMARY } from '@/lib/constants';

interface PacingPeriodDiffLinkProps {
  previousValue: any;
  newValue: any;
}

export const PacingPeriodDiffLink: FC<PacingPeriodDiffLinkProps> = ({
  previousValue,
  newValue,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Link onClick={handleOpenModal} style={{ color: '#4D59D8' }}>
        See the difference in period
      </Link>

      <PacingPeriodDiffModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        previousValue={previousValue}
        newValue={newValue}
      />
    </>
  );
};
