import React from 'react';
import { Toaster } from '@/shared/components/ui/sonner';
import TanstackProvider from './tanstack';

const MainProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <TanstackProvider>
      {children}
      <Toaster position="top-right" />
    </TanstackProvider>
  );
};

export default MainProvider;
