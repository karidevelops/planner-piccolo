
import React, { useState } from 'react';
import GanttChart from './GanttChart/GanttChart';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/services/TaskService';

const GanttChartContainer: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      // In a real application, you would gather all unsaved changes and send them to the server
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Tallennettu",
        description: "Kaikki muutokset on tallennettu onnistuneesti",
      });
    } catch (error) {
      toast({
        title: "Virhe tallennuksessa",
        description: "Muutosten tallentaminen epäonnistui",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      // Simulate fetching fresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Päivitetty",
        description: "Tiedot on päivitetty onnistuneesti",
      });
    } catch (error) {
      toast({
        title: "Virhe päivityksessä",
        description: "Tietojen päivittäminen epäonnistui",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] glass-panel rounded-lg overflow-hidden shadow-lg border border-gray-100">
      <div className="flex justify-end gap-2 p-2 border-b bg-white/50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Päivitä
        </Button>
        <Button
          size="sm"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save size={14} />
          {isSaving ? "Tallennetaan..." : "Tallenna kaikki"}
        </Button>
      </div>
      <GanttChart />
    </div>
  );
};

export default GanttChartContainer;
