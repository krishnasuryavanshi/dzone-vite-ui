import { useParams } from 'react-router';
import { LeadsContainer } from '@/app/(dashboard)/campaign-management/leads/components';
import React from 'react';

const LeadsByBatch = () => {
  const { batchId } = useParams<{ lineItemId: string; batchId: string }>();
  return <LeadsContainer batchId={batchId!} />;
};

export default LeadsByBatch;
