
export interface GanttTask {
  id: string;
  parentId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  duration: number; // päivissä
  dependencies: string[]; // tehtävien id:t, joihin tämä tehtävä on sidoksissa
  resource: string; // henkilö tai tiimi
  completePercentage: number; // valmiusaste
  status: 'ei aloitettu' | 'käynnissä' | 'valmis' | 'myöhässä';
}

export interface DisplayTask extends GanttTask {
  left: number;
  width: number;
  top: number;
  level: number;
  isVisible: boolean;
  children: DisplayTask[];
}
