export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  date: Date;
  timeSlot: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  displayTime: string;
  isBooked: boolean;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}