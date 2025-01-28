import React, { ReactNode } from 'react';

export const Background = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-t from-amber-600 to-amber-300">
      {/* Content padding to account for fixed navbar */}
      <div className="pt-16 flex items-center justify-center h-screen w-full">
        {children}
      </div>
    </div>
  );
};
