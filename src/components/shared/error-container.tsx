
import React from "react";
import { Space } from "@/uicomponents/layout";
import { ExclamationCircleOutlined } from "@/uicomponents/icons";
import { Title, Text, Button } from "@/uicomponents";
import { Card } from "@/uicomponents/layout/card";


export const ErrorContainer = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <Card bordered={false} style={{ width: "100%", backgroundColor: '#ff5555' }}>
      <Space direction="vertical">
        <Title level={5}>
          <ExclamationCircleOutlined /> An error occurred!
        </Title>
        <Text>{error.message}</Text>
        <Button type="link" onClick={reset}>
          Retry
        </Button>
      </Space>
    </Card>
  );
};
