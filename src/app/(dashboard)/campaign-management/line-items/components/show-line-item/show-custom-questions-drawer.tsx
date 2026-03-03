import { Drawer, Button, Title, Text } from '@/uicomponents';
import { ICustomQuestion } from '../../lib/types';
import { Translate } from '@/components/i18n';
import { List, ListItem } from '@/uicomponents/layout/list';
import { CloseOutlined } from '@/uicomponents/icons';

export const ShowCustomQuestionsDrawer = ({
  label,
  show,
  questions,
  handleClose,
}: {
  label: string;
  show: boolean;
  questions: ICustomQuestion[];
  handleClose: () => void;
}) => {
  if (!show) return null;
  const commonTextCss: React.CSSProperties = {
    overflowWrap: 'break-word',
    padding: '0.5rem 0.5rem 0.5rem 2rem',
    border: '2px solid #f0f0f0',
  };
  return (
    <Drawer
      title={<Translate i18nKey={'Custom Questions'} />}
      closeIcon={null} // Hide the default close icon
      onClose={handleClose}
      placement='right'
      width='50vw'
      footer={null}
      open={show}>
      {/* Custom Close Button */}
      <Button
        icon={<CloseOutlined />}
        onClick={handleClose}
        className='custom-drawer-close-button'
      />
      <List
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
        size='small'
        itemLayout='vertical'
        dataSource={questions}
        renderItem={(item, index) => (
          <ListItem
            style={{
              padding: '0.5rem',
            }}>
            <Title
              level={5}
              style={{
                ...commonTextCss,
                marginBottom: '0.2rem',
                padding: '0.5rem',
                fontSize: '16px',
                background: '#f0f0f0',
              }}>
              {index + 1}. {item.question}
            </Title>
            <div
              style={{
                ...commonTextCss,
                marginBottom: '0.2rem',
              }}>
              <Text strong>Accepted Answers:</Text> {item.acceptedAnswer}
            </div>
            <div style={commonTextCss}>
              <Text strong>Rejected Answers:</Text> {item.rejectedAnswer}
            </div>
          </ListItem>
        )}
      />
    </Drawer>
  );
};
