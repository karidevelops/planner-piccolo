
export const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysBetween(start: Date, end: Date): number {
  const startTime = start.getTime();
  const endTime = end.getTime();
  return Math.ceil((endTime - startTime) / DAY_IN_MS);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('fi-FI', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString('fi-FI', { month: 'long' });
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString('fi-FI', { weekday: 'short' });
}

export function getDaysInRange(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return days;
}

export function getMonthsInRange(startDate: Date, endDate: Date): Date[] {
  const months: Date[] = [];
  let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  
  while (currentDate <= endDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return months;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}
