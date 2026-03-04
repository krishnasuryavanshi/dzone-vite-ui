import React from 'react';
import { useParams } from 'react-router';
import { ReportPageShell } from './components';

const ReportsPage = () => {
  const { reportId } = useParams<{ reportId: string }>();

  return (
    <>
      <title>Reports | DZ One</title>
      <ReportPageShell reportId={reportId!} />
    </>
  );
};

export default ReportsPage;
