
import React from 'react';
import GanttChart from './GanttChart/GanttChart';

const GanttChartContainer: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] glass-panel rounded-lg overflow-hidden shadow-lg border border-gray-100">
      <GanttChart />
    </div>
  );
};

export default GanttChartContainer;
