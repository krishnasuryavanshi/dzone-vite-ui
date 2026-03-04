import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect } from 'react';
import { useTemplateStore } from '../../stores';
import { CreateTemplateContainer } from './create-template-container';
import { TemplateBreadcrumb } from './template-breadcrumb';
import { TemplateHeader } from './template-header';

interface ICreateTemplateProps {
  templateId?: string;
  existingTemplate: boolean;
  userDetails?: any;
  isDzoneUser?: boolean;
  tenantCode?: string | string[];
}

export const CreateTemplate: FC<ICreateTemplateProps> = ({
  templateId,
  existingTemplate,
  userDetails,
  isDzoneUser,
  tenantCode,
}) => {
  const { resetStore } = useTemplateStore();

  // Reset store when component unmounts or when navigating away
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, []);

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fixed Header Section */}
      <DzBox
        style={{
          borderBottom: '1px solid #f0f0f0',
          padding: '0.5rem 0',
        }}
      >
        <TemplateBreadcrumb existingTemplate={existingTemplate} />
        <TemplateHeader existingTemplate={existingTemplate} templateId={templateId} />
      </DzBox>

      {/* Scrollable Content Section */}
      <DzBox
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '0',
        }}
      >
        <CreateTemplateContainer
          templateId={templateId}
          existingTemplate={existingTemplate}
          userId={userDetails?.userId}
          isDzoneUser={isDzoneUser}
          tenantCode={tenantCode ?? ''}
        />
      </DzBox>
    </Flex>
  );
};
