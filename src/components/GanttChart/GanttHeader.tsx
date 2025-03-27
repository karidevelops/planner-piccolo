
import React from 'react';
import { getDaysInRange, getMonthsInRange, formatDate, getDayName, isWeekend } from '@/utils/dateUtils';

interface GanttHeaderProps {
  startDate: Date;
  endDate: Date;
  columnWidth: number;
}

const GanttHeader: React.FC<GanttHeaderProps> = ({ startDate, endDate, columnWidth }) => {
  const months = getMonthsInRange(startDate, endDate);
  const days = getDaysInRange(startDate, endDate);
  
  return (
    <div className="select-none">
      {/* Months row */}
      <div className="flex date-header">
        <div className="flex-shrink-0 w-64 border-r"></div>
        {months.map((month, index) => {
          const daysInMonth = days.filter(day => 
            day.getMonth() === month.getMonth() && 
            day.getFullYear() === month.getFullYear()
          );
          
          const width = daysInMonth.length * columnWidth;
          
          return (
            <div 
              key={`month-${index}`}
              className="flex-shrink-0 font-medium text-center border-r"
              style={{ width: `${width}px` }}
            >
              {month.toLocaleDateString('fi-FI', { month: 'long', year: 'numeric' })}
            </div>
          );
        })}
      </div>
      
      {/* Days row */}
      <div className="flex date-header">
        <div className="flex-shrink-0 w-64 border-r"></div>
        {days.map((day, index) => (
          <div 
            key={`day-${index}`}
            className={`flex-shrink-0 text-center border-r ${isWeekend(day) ? 'bg-gray-50' : ''}`}
            style={{ width: `${columnWidth}px` }}
          >
            <div>{getDayName(day)}</div>
            <div>{day.getDate()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttHeader;
