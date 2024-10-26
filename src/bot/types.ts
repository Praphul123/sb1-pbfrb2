export interface BotState {
  step: 'initial' | 'awaitingTitle' | 'awaitingDescription' | 'awaitingAssignee' | 'awaitingDate' | 'awaitingTime';
  taskData: Partial<{
    title: string;
    description: string;
    assignee: string;
    date: Date;
    timeSlot: string;
  }>;
}