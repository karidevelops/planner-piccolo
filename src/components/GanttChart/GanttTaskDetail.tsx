
import React from 'react';
import { GanttTask } from '@/models/GanttTask';
import { formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Link2, BarChart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface GanttTaskDetailProps {
  task: GanttTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: GanttTask) => void;
}

const GanttTaskDetail: React.FC<GanttTaskDetailProps> = ({ 
  task, 
  isOpen, 
  onClose,
  onSave
}) => {
  const [editedTask, setEditedTask] = React.useState<GanttTask | null>(null);
  
  React.useEffect(() => {
    setEditedTask(task ? { ...task } : null);
  }, [task]);
  
  if (!editedTask) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSliderChange = (value: number[]) => {
    setEditedTask({
      ...editedTask,
      completePercentage: value[0]
    });
  };
  
  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };
  
  const getStatusColor = () => {
    switch(editedTask.status) {
      case 'ei aloitettu': return 'bg-gantt-notStarted';
      case 'käynnissä': return 'bg-gantt-inProgress';
      case 'myöhässä': return 'bg-gantt-late';
      case 'valmis': return 'bg-gantt-complete';
      default: return 'bg-gantt-notStarted';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl">Tehtävän tiedot</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tehtävän nimi</Label>
            <Input
              id="name"
              name="name"
              value={editedTask.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label>Alkaa</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <Calendar size={16} className="text-gray-500" />
                <span>{formatDate(editedTask.startDate)}</span>
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <Label>Päättyy</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <Calendar size={16} className="text-gray-500" />
                <span>{formatDate(editedTask.endDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label>Kesto</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <Clock size={16} className="text-gray-500" />
                <span>{editedTask.duration} päivää</span>
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <Label>Resurssi</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <User size={16} className="text-gray-500" />
                <span>{editedTask.resource}</span>
              </div>
            </div>
          </div>
          
          {editedTask.dependencies.length > 0 && (
            <div className="space-y-2">
              <Label>Riippuvuudet</Label>
              <div className="flex items-start gap-2 p-2 border rounded-md bg-gray-50">
                <Link2 size={16} className="text-gray-500 mt-0.5" />
                <span>{editedTask.dependencies.join(', ')}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Valmiusaste: {editedTask.completePercentage}%</Label>
              <div className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                editedTask.status === 'ei aloitettu' && "bg-gray-200 text-gray-700",
                editedTask.status === 'käynnissä' && "bg-green-100 text-green-800",
                editedTask.status === 'myöhässä' && "bg-red-100 text-red-800",
                editedTask.status === 'valmis' && "bg-blue-100 text-blue-800"
              )}>
                {editedTask.status}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <BarChart size={16} className="text-gray-500" />
              <Slider
                defaultValue={[editedTask.completePercentage]}
                max={100}
                step={1}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={cn("h-2.5 rounded-full", getStatusColor())}
                style={{ width: `${editedTask.completePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Peruuta</Button>
          <Button onClick={handleSave}>Tallenna</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GanttTaskDetail;
