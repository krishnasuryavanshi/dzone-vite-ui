import React, { FC } from 'react';
import { TemplateListContainer } from './components';

interface IPageProps {}

const Templates: FC<IPageProps> = ({}) => {
  return (
    <>
      <title>Templates | DZ One</title>
      <TemplateListContainer />
    </>
  );
};

export default Templates;
