
import React from 'react';
import { getDaysInRange, isWeekend } from '@/utils/dateUtils';

interface GanttGridProps {
  startDate: Date;
  endDate: Date;
  rowCount: number;
  rowHeight: number;
  columnWidth: number;
}

const GanttGrid: React.FC<GanttGridProps> = ({ 
  startDate, 
  endDate, 
  rowCount, 
  rowHeight,
  columnWidth 
}) => {
  const days = getDaysInRange(startDate, endDate);
  
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* Vertical lines for days */}
      {days.map((day, index) => (
        <div 
          key={`grid-day-${index}`}
          className={`absolute top-0 h-full border-r border-gantt-gridLine ${isWeekend(day) ? 'bg-gray-50/50' : ''}`}
          style={{ 
            left: `${64 + index * columnWidth}px`,
            width: `${columnWidth}px`
          }}
        />
      ))}
      
      {/* Horizontal lines for rows */}
      {Array.from({ length: rowCount + 1 }).map((_, index) => (
        <div 
          key={`grid-row-${index}`}
          className="absolute left-0 w-full border-b border-gantt-gridLine"
          style={{ top: `${index * rowHeight}px` }}
        />
      ))}
      
      {/* Today vertical line if within range */}
      {(() => {
        const today = new Date();
        if (today >= startDate && today <= endDate) {
          const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div
              className="absolute top-0 h-full border-l-2 border-blue-500 z-10"
              style={{ left: `${64 + diffDays * columnWidth}px` }}
            />
          );
        }
        return null;
      })()}
    </div>
  );
};

export default GanttGrid;
