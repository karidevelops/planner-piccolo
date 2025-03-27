
import React, { useState, useEffect, useRef } from 'react';
import { GanttTask, DisplayTask } from '@/models/GanttTask';
import { daysBetween, addDays } from '@/utils/dateUtils';
import GanttHeader from './GanttHeader';
import GanttTaskRow from './GanttTask';
import GanttGrid from './GanttGrid';
import GanttDependencies from './GanttDependencies';
import GanttTaskDetail from './GanttTaskDetail';
import { taskService } from '@/services/TaskService';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';

const COLUMN_WIDTH = 40; // Width per day
const ROW_HEIGHT = 40; // Height per task row
const MIN_COLUMN_WIDTH = 30;
const MAX_COLUMN_WIDTH = 60;

interface GanttChartProps {
  initialTasks?: GanttTask[];
  onTasksChange?: (tasks: GanttTask[]) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ 
  initialTasks = [],
  onTasksChange
}) => {
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [displayTasks, setDisplayTasks] = useState<DisplayTask[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30));
  const [columnWidth, setColumnWidth] = useState(COLUMN_WIDTH);
  const [collapsedTasks, setCollapsedTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const taskPositionsRef = useRef<Map<string, { left: number; width: number; top: number }>>(new Map());
  
  // Fetch tasks on initial render
  useEffect(() => {
    if (initialTasks.length > 0) {
      setTasks(initialTasks);
    } else {
      const fetchTasks = async () => {
        try {
          const fetchedTasks = await taskService.getTasks();
          setTasks(fetchedTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
      
      fetchTasks();
    }
  }, [initialTasks]); // Only run when initialTasks changes
  
  // Notify parent when tasks change
  useEffect(() => {
    if (onTasksChange && tasks.length > 0) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);
  
  // Calculate start and end dates based on tasks
  useEffect(() => {
    if (tasks.length > 0) {
      // Find earliest start date and latest end date
      let earliestStart = new Date(tasks[0].startDate);
      let latestEnd = new Date(tasks[0].endDate);
      
      tasks.forEach(task => {
        if (new Date(task.startDate) < earliestStart) {
          earliestStart = new Date(task.startDate);
        }
        if (new Date(task.endDate) > latestEnd) {
          latestEnd = new Date(task.endDate);
        }
      });
      
      // Add padding days before and after
      earliestStart.setDate(earliestStart.getDate() - 2);
      latestEnd.setDate(latestEnd.getDate() + 2);
      
      setStartDate(earliestStart);
      setEndDate(latestEnd);
    }
  }, [tasks]); // Only run when tasks change
  
  // Transform GanttTasks to DisplayTasks for rendering
  useEffect(() => {
    const calculateDisplayTasks = () => {
      const totalDays = daysBetween(startDate, endDate);
      const startTime = startDate.getTime();
      
      // Create a map for quick task lookup
      const taskMap = new Map<string, GanttTask>();
      tasks.forEach(task => taskMap.set(task.id, task));
      
      // Build task hierarchy
      const rootTasks: DisplayTask[] = [];
      const taskHierarchy = new Map<string, DisplayTask[]>();
      
      // Prepare the task hierarchy
      tasks.forEach(task => {
        // Calculate position and dimensions
        const taskStartDiff = daysBetween(startDate, new Date(task.startDate));
        const taskDuration = task.duration;
        
        const displayTask: DisplayTask = {
          ...task,
          left: taskStartDiff * columnWidth,
          width: taskDuration * columnWidth,
          top: 0, // Will be calculated later
          level: 0, // Will be calculated later
          isVisible: true,
          children: []
        };
        
        // Add to hierarchy
        if (task.parentId === '0') {
          rootTasks.push(displayTask);
        } else {
          if (!taskHierarchy.has(task.parentId)) {
            taskHierarchy.set(task.parentId, []);
          }
          taskHierarchy.get(task.parentId)!.push(displayTask);
        }
      });
      
      // Function to build the complete hierarchy
      const buildHierarchy = (task: DisplayTask, level: number): DisplayTask => {
        const children = taskHierarchy.get(task.id) || [];
        const updatedTask = { ...task, level, children: [] as DisplayTask[] };
        
        children.forEach(child => {
          updatedTask.children.push(buildHierarchy(child, level + 1));
        });
        
        return updatedTask;
      };
      
      // Build the complete hierarchy
      const hierarchicalTasks = rootTasks.map(task => buildHierarchy(task, 0));
      
      // Function to flatten the hierarchy for rendering
      const flattenHierarchy = (tasks: DisplayTask[], result: DisplayTask[] = [], topOffset = 0, collapsed = new Set<string>()): DisplayTask[] => {
        tasks.forEach(task => {
          const taskWithPosition = { ...task, top: topOffset, isVisible: true };
          result.push(taskWithPosition);
          let newTopOffset = topOffset + ROW_HEIGHT;
          
          // If task has children and is not collapsed, process children
          if (task.children.length > 0 && !collapsed.has(task.id)) {
            flattenHierarchy(task.children, result, newTopOffset, collapsed);
            newTopOffset += task.children.length * ROW_HEIGHT;
          }
        });
        
        return result;
      };
      
      // Flatten hierarchy for rendering, applying collapsed state
      const flattenedTasks = flattenHierarchy(hierarchicalTasks, [], 0, collapsedTasks);
      
      // Update task positions map
      taskPositionsRef.current.clear();
      flattenedTasks.forEach(task => {
        taskPositionsRef.current.set(task.id, {
          left: task.left,
          width: task.width,
          top: task.top
        });
      });
      
      return flattenedTasks;
    };
    
    if (tasks.length > 0) {
      setDisplayTasks(calculateDisplayTasks());
    }
  }, [tasks, startDate, endDate, columnWidth, collapsedTasks]); // Only run when these dependencies change
  
  // Handle toggle task collapse
  const handleToggleCollapse = (taskId: string) => {
    setCollapsedTasks(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(taskId)) {
        newCollapsed.delete(taskId);
      } else {
        newCollapsed.add(taskId);
      }
      return newCollapsed;
    });
  };
  
  // Handle task selection
  const handleTaskClick = (task: DisplayTask) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };
  
  // Handle task update
  const handleTaskUpdate = async (updatedTask: GanttTask) => {
    try {
      // Update status based on completion percentage
      const taskWithUpdatedStatus = taskService.calculateTaskStatus(updatedTask);
      
      // Update local state first (optimistic update)
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? taskWithUpdatedStatus : task
        )
      );
      
      // Save to backend/service
      await taskService.updateTask(taskWithUpdatedStatus);
    } catch (error) {
      console.error('Error updating task:', error);
      // Could revert the optimistic update here if needed
    }
  };
  
  // Zoom in/out
  const handleZoomIn = () => {
    setColumnWidth(prev => Math.min(prev + 5, MAX_COLUMN_WIDTH));
  };
  
  const handleZoomOut = () => {
    setColumnWidth(prev => Math.max(prev - 5, MIN_COLUMN_WIDTH));
  };
  
  // Handle chart export
  const handleExport = () => {
    // Implementation for exporting the chart as PNG or PDF would go here
    alert('Export feature not implemented yet');
  };
  
  // Time period navigation
  const handlePreviousPeriod = () => {
    const daysInView = daysBetween(startDate, endDate);
    setStartDate(addDays(startDate, -daysInView));
    setEndDate(addDays(endDate, -daysInView));
  };
  
  const handleNextPeriod = () => {
    const daysInView = daysBetween(startDate, endDate);
    setStartDate(addDays(startDate, daysInView));
    setEndDate(addDays(endDate, daysInView));
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousPeriod}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextPeriod}>
            <ChevronRight size={16} />
          </Button>
          <span className="flex items-center text-sm gap-2">
            <Calendar size={16} />
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} className="mr-1" />
            Vie
          </Button>
        </div>
      </div>
      
      <div className="relative overflow-auto flex-grow" ref={containerRef}>
        <GanttHeader 
          startDate={startDate} 
          endDate={endDate} 
          columnWidth={columnWidth} 
        />
        
        <div className="relative">
          <GanttGrid 
            startDate={startDate} 
            endDate={endDate} 
            rowCount={displayTasks.length} 
            rowHeight={ROW_HEIGHT}
            columnWidth={columnWidth} 
          />
          
          <div>
            {displayTasks.map(task => (
              <GanttTaskRow 
                key={task.id}
                task={task}
                onToggleCollapse={handleToggleCollapse}
                collapsed={collapsedTasks.has(task.id)}
                level={task.level}
                onClick={handleTaskClick}
              />
            ))}
          </div>
          
          <GanttDependencies 
            tasks={displayTasks} 
            taskPositions={taskPositionsRef.current} 
          />
        </div>
      </div>
      
      <GanttTaskDetail 
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSave={handleTaskUpdate}
      />
    </div>
  );
};

export default GanttChart;
