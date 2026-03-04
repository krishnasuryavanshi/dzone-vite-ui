import { Translate } from '@/components/i18n';
import { Link, Modal } from '@/uicomponents/index';
import { List, ListItem } from '@/uicomponents/layout/list';
import { FC, useState } from 'react';
import { TruncatedText } from './truncated-text';

interface IListViewProps {
  value: string[] | Record<string, any>[];
  label: string;
}

export const ListView: FC<IListViewProps> = ({ value, label }) => {
  const [showModal, setShowModal] = useState(false);
  const hasChildren = value.some((item: any) => item?.children?.length);
  const handleExpand = () => {
    setShowModal(true);
  };
  if (hasChildren) {
    return (
      <>
        <Link onClick={handleExpand}>Show All</Link>
        <ShowList
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
      <TruncatedText lines={2} handleExpand={handleExpand}>
        {value.join(', ')}
      </TruncatedText>
      <ShowList
        label={label}
        show={showModal}
        list={value}
        hasChildren={hasChildren}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};

export const ShowList = ({
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
    <Modal
      title={<Translate i18nKey={label} />}
      onCancel={handleClose}
      centered
      footer={null}
      open={show}
    >
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
    </Modal>
  );
};
