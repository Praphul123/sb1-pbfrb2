import React from 'react';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, TimeRange } from '../types';
import TimeSlotGrid from './TimeSlotGrid';
import TimeSettings from './TimeSettings';

interface CalendarProps {
  tasks: Task[];
  onTaskAdd: (task: Omit<Task, 'id'>) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, onTaskAdd }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [timeRange, setTimeRange] = React.useState<TimeRange>({
    startTime: '09:00',
    endTime: '21:00',
  });

  const startDate = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handlePrevDay = () => {
    setSelectedDate((prev) => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  return (
    <div className="space-y-6">
      <TimeSettings timeRange={timeRange} onTimeRangeChange={setTimeRange} />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Team Task Calendar
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevDay}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm text-gray-500">
              {format(selectedDate, 'MMMM d, yyyy')}
            </div>
            <button
              onClick={handleNextDay}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`text-center p-2 rounded-lg cursor-pointer transition-colors
                ${
                  format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="font-medium">{format(day, 'EEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        <TimeSlotGrid
          date={selectedDate}
          timeRange={timeRange}
          tasks={tasks.filter(
            (task) => format(task.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
          )}
          onTaskAdd={onTaskAdd}
        />
      </div>
    </div>
  );
};

export default Calendar;