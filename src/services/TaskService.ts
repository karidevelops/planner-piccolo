
import { GanttTask } from "@/models/GanttTask";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// Example data (used as fallback)
export const SAMPLE_TASKS: GanttTask[] = [
  {
    id: '1',
    parentId: '0',
    name: 'Suunnitteluvaihe',
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-04-07'),
    duration: 5,
    dependencies: [],
    resource: 'Tiimi A',
    completePercentage: 100,
    status: 'valmis',
  },
  {
    id: '2',
    parentId: '0',
    name: 'Toteutus',
    startDate: new Date('2025-04-08'),
    endDate: new Date('2025-04-22'),
    duration: 10,
    dependencies: ['1'],
    resource: 'Tiimi B',
    completePercentage: 45,
    status: 'käynnissä',
  },
  {
    id: '3',
    parentId: '2',
    name: 'Frontend-kehitys',
    startDate: new Date('2025-04-08'),
    endDate: new Date('2025-04-15'),
    duration: 6,
    dependencies: ['1'],
    resource: 'Tiimi C',
    completePercentage: 70,
    status: 'käynnissä',
  },
  {
    id: '4',
    parentId: '2',
    name: 'Backend-kehitys',
    startDate: new Date('2025-04-10'),
    endDate: new Date('2025-04-20'),
    duration: 8,
    dependencies: ['1'],
    resource: 'Tiimi D',
    completePercentage: 30,
    status: 'käynnissä',
  },
  {
    id: '5',
    parentId: '0',
    name: 'Testaus',
    startDate: new Date('2025-04-23'),
    endDate: new Date('2025-04-30'),
    duration: 6,
    dependencies: ['2'],
    resource: 'Tiimi E',
    completePercentage: 0,
    status: 'ei aloitettu',
  },
  {
    id: '6',
    parentId: '5',
    name: 'Yksikkötestaus',
    startDate: new Date('2025-04-23'),
    endDate: new Date('2025-04-26'),
    duration: 4,
    dependencies: ['4', '3'],
    resource: 'Tiimi F',
    completePercentage: 0,
    status: 'ei aloitettu',
  },
  {
    id: '7',
    parentId: '5',
    name: 'Integraatiotestaus',
    startDate: new Date('2025-04-26'),
    endDate: new Date('2025-04-30'),
    duration: 3,
    dependencies: ['6'],
    resource: 'Tiimi G',
    completePercentage: 0,
    status: 'ei aloitettu',
  },
  {
    id: '8',
    parentId: '0',
    name: 'Julkaisu',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-03'),
    duration: 3,
    dependencies: ['5'],
    resource: 'Tiimi H',
    completePercentage: 0,
    status: 'ei aloitettu',
  }
];

export class TaskService {
  private useApi: boolean = true; // Set to true to use Supabase
  private tasks: GanttTask[] = [...SAMPLE_TASKS]; // Add the missing tasks property

  async getTasks(): Promise<GanttTask[]> {
    if (this.useApi) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*');
        
        if (error) {
          console.error('Error fetching tasks:', error);
          toast.error('Tehtävien hakeminen epäonnistui');
          // Fallback to sample tasks
          return [...SAMPLE_TASKS];
        }
        
        if (!data || data.length === 0) {
          console.log('No tasks found in Supabase, using sample tasks');
          return [...SAMPLE_TASKS];
        }
        
        // Transform dates from strings to Date objects
        return data.map((task: any) => ({
          ...task,
          startDate: new Date(task.startDate),
          endDate: new Date(task.endDate),
          dependencies: task.dependencies || []
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Tehtävien hakeminen epäonnistui');
        // Fallback to sample tasks
        return [...SAMPLE_TASKS];
      }
    }
    
    return Promise.resolve([...this.tasks]);
  }

  async updateTask(updatedTask: GanttTask): Promise<GanttTask> {
    if (this.useApi) {
      try {
        console.log('Updating task in Supabase:', updatedTask);
        
        // Prepare task for database (convert Date objects to ISO strings)
        const taskForDb = {
          ...updatedTask,
          startDate: updatedTask.startDate.toISOString(),
          endDate: updatedTask.endDate.toISOString()
        };
        
        const { data, error } = await supabase
          .from('tasks')
          .update(taskForDb)
          .eq('id', updatedTask.id)
          .select();
        
        if (error) {
          console.error('Error updating task:', error);
          toast.error('Tehtävän päivittäminen epäonnistui');
          throw error;
        }
        
        if (!data || data.length === 0) {
          // If task doesn't exist in DB, create it
          console.log('Task not found, creating new task');
          return this.createTask(updatedTask);
        }
        
        // Update local cache
        const taskIndex = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask;
        }
        
        toast.success('Tehtävä päivitetty');
        
        // Transform back to GanttTask with Date objects
        return {
          ...data[0],
          startDate: new Date(data[0].startDate),
          endDate: new Date(data[0].endDate),
          dependencies: data[0].dependencies || []
        };
      } catch (error) {
        console.error('Error updating task:', error);
        toast.error('Tehtävän päivittäminen epäonnistui');
        throw error;
      }
    }
    
    // Local update
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask };
    }
    return Promise.resolve({ ...updatedTask });
  }

  // Helper method to create a new task if it doesn't exist
  private async createTask(task: GanttTask): Promise<GanttTask> {
    if (this.useApi) {
      try {
        const taskForDb = {
          ...task,
          startDate: task.startDate.toISOString(),
          endDate: task.endDate.toISOString()
        };
        
        const { data, error } = await supabase
          .from('tasks')
          .insert(taskForDb)
          .select();
        
        if (error) {
          console.error('Error creating task:', error);
          toast.error('Tehtävän luominen epäonnistui');
          throw error;
        }
        
        // Add to local cache
        this.tasks.push(task);
        
        toast.success('Tehtävä luotu');
        
        return {
          ...data[0],
          startDate: new Date(data[0].startDate),
          endDate: new Date(data[0].endDate),
          dependencies: data[0].dependencies || []
        };
      } catch (error) {
        console.error('Error creating task:', error);
        toast.error('Tehtävän luominen epäonnistui');
        throw error;
      }
    }
    
    // Local mode
    this.tasks.push(task);
    return Promise.resolve(task);
  }

  // Function to save all tasks at once
  async saveAllTasks(tasks: GanttTask[]): Promise<boolean> {
    if (this.useApi) {
      try {
        // Prepare tasks for database
        const tasksForDb = tasks.map(task => ({
          ...task,
          startDate: task.startDate.toISOString(),
          endDate: task.endDate.toISOString()
        }));
        
        console.log('Saving tasks to Supabase:', tasksForDb);
        
        // Use upsert to handle both inserts and updates
        const { error } = await supabase
          .from('tasks')
          .upsert(tasksForDb, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });
        
        if (error) {
          console.error('Error saving tasks:', error);
          toast.error('Tehtävien tallentaminen epäonnistui');
          return false;
        }
        
        toast.success('Kaikki tehtävät tallennettu');
        return true;
      } catch (error) {
        console.error('Error saving tasks:', error);
        toast.error('Tehtävien tallentaminen epäonnistui');
        return false;
      }
    }
    
    // In the local mode, just update the internal tasks array
    this.tasks = [...tasks];
    return Promise.resolve(true);
  }

  // Function to calculate if a task is late based on current date and progress
  calculateTaskStatus(task: GanttTask): GanttTask {
    const now = new Date();
    const copy = { ...task };
    
    // If already completed, keep status as is
    if (copy.completePercentage === 100) {
      copy.status = 'valmis';
      return copy;
    }
    
    // If end date is in the past and task is not completed
    if (copy.endDate < now && copy.completePercentage < 100) {
      copy.status = 'myöhässä';
      return copy;
    }
    
    // If task has started
    if (copy.completePercentage > 0) {
      copy.status = 'käynnissä';
      return copy;
    }
    
    // If no progress yet
    copy.status = 'ei aloitettu';
    return copy;
  }
}

export const taskService = new TaskService();
