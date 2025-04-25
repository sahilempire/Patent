
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import Onboarding from '@/components/onboarding/Onboarding';
import Wizard from '@/components/wizard/Wizard';

const Index = () => {
  const { filingType } = useAppContext();
  
  return (
    <AppLayout>
      {!filingType ? <Onboarding /> : <Wizard />}
    </AppLayout>
  );
};

export default Index;
