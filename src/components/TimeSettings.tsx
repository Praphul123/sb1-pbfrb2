import React from 'react';
import { Clock } from 'lucide-react';
import { TimeRange } from '../types';

interface TimeSettingsProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const TimeSettings: React.FC<TimeSettingsProps> = ({ timeRange, onTimeRangeChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Time Settings
      </h3>
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={timeRange.startTime}
            onChange={(e) =>
              onTimeRangeChange({ ...timeRange, startTime: e.target.value })
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={timeRange.endTime}
            onChange={(e) =>
              onTimeRangeChange({ ...timeRange, endTime: e.target.value })
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default TimeSettings;