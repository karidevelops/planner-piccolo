
import React from 'react';
import Header from '@/components/Header';
import GanttChartContainer from '@/components/GanttChartContainer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow p-6">
        <GanttChartContainer />
      </main>
    </div>
  );
};

export default Index;
