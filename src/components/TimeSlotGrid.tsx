import React, { useState, useMemo } from 'react';
import { Clock, User, FileText } from 'lucide-react';
import { Task, TimeSlot, TimeRange } from '../types';

interface TimeSlotGridProps {
  date: Date;
  timeRange: TimeRange;
  tasks: Task[];
  onTaskAdd: (task: Omit<Task, 'id'>) => void;
}

const generateTimeSlots = (startTime: string, endTime: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayTime = `${displayHour}:00 ${period}`;
    
    slots.push({
      id: `slot-${hour}`,
      time: `${formattedHour}:00`,
      displayTime,
      isBooked: false,
    });
  }
  
  return slots;
};

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ date, timeRange, tasks, onTaskAdd }) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
  });

  const timeSlots = useMemo(
    () => generateTimeSlots(timeRange.startTime, timeRange.endTime),
    [timeRange]
  );

  const handleSlotClick = (time: string) => {
    const isBooked = tasks.some((task) => task.timeSlot === time);
    if (!isBooked) {
      setSelectedSlot(time);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlot && newTask.title && newTask.assignee) {
      onTaskAdd({
        ...newTask,
        date,
        timeSlot: selectedSlot,
      });
      setSelectedSlot(null);
      setNewTask({ title: '', description: '', assignee: '' });
    }
  };

  return (
    <div className="mt-6">
      <div className="grid gap-4">
        {timeSlots.map(({ time, displayTime }) => {
          const task = tasks.find((t) => t.timeSlot === time);
          const isBooked = Boolean(task);

          return (
            <div
              key={time}
              className={`p-4 rounded-lg border transition-colors ${
                isBooked
                  ? 'bg-gray-50 border-gray-200'
                  : 'hover:border-blue-500 cursor-pointer border-gray-200'
              }`}
              onClick={() => handleSlotClick(time)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{displayTime}</span>
                </div>
                {isBooked ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{task.title}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Available</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Book Time Slot: {selectedSlot}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Book Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotGrid;