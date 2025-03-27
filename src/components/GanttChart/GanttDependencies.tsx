
import React from 'react';
import { DisplayTask } from '@/models/GanttTask';

interface GanttDependenciesProps {
  tasks: DisplayTask[];
  taskPositions: Map<string, { left: number; width: number; top: number }>;
}

const GanttDependencies: React.FC<GanttDependenciesProps> = ({ tasks, taskPositions }) => {
  const allVisibleTasks = tasks.filter(task => task.isVisible);
  
  const renderDependencyLine = (fromTaskId: string, toTaskId: string) => {
    const fromTask = taskPositions.get(fromTaskId);
    const toTask = taskPositions.get(toTaskId);
    
    if (!fromTask || !toTask) return null;
    
    // Starting point - right middle of the "from" task
    const startX = fromTask.left + fromTask.width + 64; // Add offset for the task name column
    const startY = fromTask.top + 20; // Middle of the task
    
    // Ending point - left middle of the "to" task
    const endX = toTask.left + 64; // Add offset for the task name column
    const endY = toTask.top + 20; // Middle of the task
    
    // Control points for the curved line
    const controlPointX = (startX + endX) / 2;
    
    // Create curve path
    const path = `
      M ${startX} ${startY}
      C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}
    `;
    
    return (
      <path
        key={`dep-${fromTaskId}-${toTaskId}`}
        d={path}
        fill="none"
        className="gantt-dependency-line"
        markerEnd="url(#arrowhead)"
      />
    );
  };
  
  const dependencies: React.ReactNode[] = [];
  
  allVisibleTasks.forEach(task => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach(depId => {
        if (taskPositions.has(depId)) {
          dependencies.push(renderDependencyLine(depId, task.id));
        }
      });
    }
  });
  
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 L0,0" fill="#AAAAAA" />
        </marker>
      </defs>
      {dependencies}
    </svg>
  );
};

export default GanttDependencies;
