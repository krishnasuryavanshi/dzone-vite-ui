import { Translate } from '@/components/i18n';
import { Link, Drawer, Button } from '@/uicomponents/index';
import { List, ListItem } from '@/uicomponents/layout/list';
import { FC, useState } from 'react';
import { TruncatedText } from './truncated-text';
import { CloseOutlined } from '@/uicomponents/icons';

interface IListViewProps {
  value: string[] | Record<string, any>[];
  label: string;
  lines?: number;
}

export const DrawerListView: FC<IListViewProps> = ({ value, label, lines = 2 }) => {
  const [showModal, setShowModal] = useState(false);
  const hasChildren = value.some((item: any) => item?.children?.length);
  const handleExpand = () => {
    setShowModal(true);
  };
  if (hasChildren) {
    return (
      <>
        <Link onClick={handleExpand}>Show All</Link>
        <DrawerShowList
          label={label}
          show={showModal}
          list={value}
          hasChildren={hasChildren}
          handleClose={() => setShowModal(false)}
        />
      </>
    );
  }
  return (
    <>
      <TruncatedText lines={lines} handleExpand={handleExpand}>
        {value.join(', ')}
      </TruncatedText>
      <DrawerShowList
        label={label}
        show={showModal}
        list={value}
        hasChildren={hasChildren}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};

export const DrawerShowList = ({
  label,
  show,
  list,
  hasChildren,
  handleClose,
}: {
  show: boolean;
  list: any[];
  label: string;
  hasChildren: boolean;
  handleClose: () => void;
}) => {
  if (!show) return null;
  return (
    <Drawer
      title={<Translate i18nKey={label} />}
      closeIcon={null} // Hide the default close icon
      onClose={handleClose}
      placement='right'
      footer={null}
      open={show}
    >
      {/* Custom Close Button */}
      <Button
        icon={<CloseOutlined />}
        onClick={handleClose}
        className='custom-drawer-close-button'
      />
      <List
        bordered
        style={{ maxHeight: '85vh', overflow: 'auto' }}
        size='small'
        itemLayout='horizontal'
        dataSource={list}
        renderItem={(item, index) => (
          <>
            <ListItem>
              {index + 1}. {hasChildren ? item.label : item}
            </ListItem>
            {hasChildren
              ? item.children.map((child: string, idNumber: number) => (
                  <ListItem key={idNumber + 1} style={{ paddingLeft: '2rem' }}>
                    {idNumber + 1}. {child}
                  </ListItem>
                ))
              : null}
          </>
        )}
      />
    </Drawer>
  );
};
