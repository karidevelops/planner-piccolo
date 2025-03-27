
import React, { useState, useEffect } from 'react';
import { GanttTask } from '@/models/GanttTask';
import { formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Link2, BarChart, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

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
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<GanttTask>({
    defaultValues: task || undefined
  });
  
  // Reset form when task changes
  useEffect(() => {
    if (task) {
      form.reset({
        ...task
      });
    }
  }, [task, form]);
  
  if (!task) return null;
  
  const handleSave = (formData: GanttTask) => {
    try {
      onSave(formData);
      setIsEditing(false);
      toast({
        title: "Tallennettu",
        description: "Tehtävän tiedot on päivitetty onnistuneesti",
      });
    } catch (error) {
      toast({
        title: "Virhe tallennuksessa",
        description: "Tehtävän tietojen tallentaminen epäonnistui",
        variant: "destructive",
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ei aloitettu': return 'bg-gantt-notStarted';
      case 'käynnissä': return 'bg-gantt-inProgress';
      case 'myöhässä': return 'bg-gantt-late';
      case 'valmis': return 'bg-gantt-complete';
      default: return 'bg-gantt-notStarted';
    }
  };
  
  // View mode content
  const ViewContent = () => (
    <div className="grid gap-6 py-4">
      <div className="space-y-2">
        <Label>Tehtävän nimi</Label>
        <div className="p-2 border rounded-md bg-gray-50 font-medium">
          {task.name}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <Label>Alkaa</Label>
          <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
            <Calendar size={16} className="text-gray-500" />
            <span>{formatDate(task.startDate)}</span>
          </div>
        </div>
        
        <div className="space-y-2 flex-1">
          <Label>Päättyy</Label>
          <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
            <Calendar size={16} className="text-gray-500" />
            <span>{formatDate(task.endDate)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <Label>Kesto</Label>
          <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
            <Clock size={16} className="text-gray-500" />
            <span>{task.duration} päivää</span>
          </div>
        </div>
        
        <div className="space-y-2 flex-1">
          <Label>Resurssi</Label>
          <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
            <User size={16} className="text-gray-500" />
            <span>{task.resource}</span>
          </div>
        </div>
      </div>
      
      {task.dependencies.length > 0 && (
        <div className="space-y-2">
          <Label>Riippuvuudet</Label>
          <div className="flex items-start gap-2 p-2 border rounded-md bg-gray-50">
            <Link2 size={16} className="text-gray-500 mt-0.5" />
            <span>{task.dependencies.join(', ')}</span>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Valmiusaste: {task.completePercentage}%</Label>
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            task.status === 'ei aloitettu' && "bg-gray-200 text-gray-700",
            task.status === 'käynnissä' && "bg-green-100 text-green-800",
            task.status === 'myöhässä' && "bg-red-100 text-red-800",
            task.status === 'valmis' && "bg-blue-100 text-blue-800"
          )}>
            {task.status}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={cn("h-2.5 rounded-full", getStatusColor(task.status))}
            style={{ width: `${task.completePercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
  
  // Edit mode content
  const EditContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tehtävän nimi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2 flex-1">
            <Label>Alkaa</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
              <Calendar size={16} className="text-gray-500" />
              <span>{formatDate(task.startDate)}</span>
            </div>
          </div>
          
          <div className="space-y-2 flex-1">
            <Label>Päättyy</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
              <Calendar size={16} className="text-gray-500" />
              <span>{formatDate(task.endDate)}</span>
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="resource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resurssi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="completePercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valmiusaste: {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  max={100}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="flex-1"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={cn("h-2.5 rounded-full", getStatusColor(task.status))}
            style={{ width: `${form.watch('completePercentage')}%` }}
          ></div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2">
            <Save size={16} />
            Tallenna
          </Button>
        </div>
      </form>
    </Form>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-xl">Tehtävän tiedot</DialogTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Peruuta muokkaus' : 'Muokkaa'}
          </Button>
        </DialogHeader>
        
        {isEditing ? <EditContent /> : <ViewContent />}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Sulje</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GanttTaskDetail;
