import { Modal, Text } from "@/uicomponents";
import { ICustomQuestion } from "../../lib/types";
import { Translate } from "@/components/i18n";
import { List, ListItem } from "@/uicomponents/layout/list";

export const ExpandCustomQuestions = ({
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
    return (
      <Modal
        title={<Translate i18nKey={label} />}
        onCancel={handleClose}
        centered
        width="95vw"
        footer={null}
        open={show}>
        <List
          bordered
          style={{ maxHeight: '85vh', overflow: 'auto' }}
          size="small"
          itemLayout="horizontal"
          dataSource={questions}
          renderItem={(item, index) => (
            <>
              <ListItem>
                <Text strong>{index + 1}.</Text> {item.question}
              </ListItem>
              <ListItem style={{ paddingLeft: '2rem' }}>
                <Text strong>Accepted Answers:</Text> {item.acceptedAnswer}
              </ListItem>
              <ListItem style={{ paddingLeft: '2rem' }}>
                <Text strong>Rejected Answers:</Text> {item.rejectedAnswer}
              </ListItem>
            </>
          )}
        />
      </Modal>
    );
  };