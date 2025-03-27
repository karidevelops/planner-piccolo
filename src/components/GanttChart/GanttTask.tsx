
import React, { useState } from 'react';
import { DisplayTask } from '@/models/GanttTask';
import { formatDate } from '@/utils/dateUtils';
import { Calendar, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GanttTaskRowProps {
  task: DisplayTask;
  onToggleCollapse: (taskId: string) => void;
  collapsed: boolean;
  level: number;
  onClick: (task: DisplayTask) => void;
}

const GanttTaskRow: React.FC<GanttTaskRowProps> = ({ 
  task, 
  onToggleCollapse, 
  collapsed, 
  level, 
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine task color based on status
  const getTaskColor = () => {
    switch(task.status) {
      case 'ei aloitettu': return 'bg-gantt-notStarted';
      case 'käynnissä': return 'bg-gantt-inProgress';
      case 'myöhässä': return 'bg-gantt-late';
      case 'valmis': return 'bg-gantt-complete';
      default: return 'bg-gantt-notStarted';
    }
  };
  
  // Determine if task has children
  const hasChildren = task.children && task.children.length > 0;
  
  return (
    <div 
      className={cn(
        "h-10 flex items-center text-sm hover:bg-gray-50 transition-colors duration-150 border-b relative",
        level > 0 && "pl-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ paddingLeft: `${level * 20}px` }}
    >
      <div className="flex-shrink-0 w-64 flex items-center gap-1 overflow-hidden pr-2">
        {hasChildren && (
          <button 
            onClick={() => onToggleCollapse(task.id)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
        <span className="ml-1 truncate font-medium">{task.name}</span>
      </div>
      
      <div 
        className={cn("absolute gantt-task-bar", getTaskColor())}
        style={{ 
          left: `${task.left + 64}px`, // 64px for the task name column
          width: `${task.width}px`,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
        onClick={() => onClick(task)}
      >
        {/* Progress bar */}
        <div 
          className="task-progress-bar"
          style={{ '--progress-percentage': `${task.completePercentage}%` } as React.CSSProperties}
        />
        
        {/* Task label - only show if bar is wide enough */}
        {task.width > 80 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {task.name}
          </div>
        )}
        
        {/* Hover effect tooltip */}
        {isHovered && (
          <div className="gantt-tooltip -top-[4.5rem] left-0 animate-fade-in">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{task.name}</span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                task.status === 'ei aloitettu' && "bg-gray-200 text-gray-700",
                task.status === 'käynnissä' && "bg-green-100 text-green-800",
                task.status === 'myöhässä' && "bg-red-100 text-red-800",
                task.status === 'valmis' && "bg-blue-100 text-blue-800"
              )}>
                {task.status}
              </span>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Info size={12} />
                <span>Kesto: {task.duration} päivää</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Resurssi:</span> {task.resource}
              </div>
              <div className="mt-1 pt-1 border-t">
                <div className="flex justify-between mb-1">
                  <span>Edistyminen:</span>
                  <span>{task.completePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={cn(
                      "h-1.5 rounded-full",
                      getTaskColor()
                    )}
                    style={{ width: `${task.completePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttTaskRow;
