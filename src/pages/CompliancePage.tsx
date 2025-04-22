
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ComplianceChecker from '@/components/compliance/ComplianceChecker';

const CompliancePage = () => {
  return (
    <AppLayout>
      <ComplianceChecker />
    </AppLayout>
  );
};

export default CompliancePage;
