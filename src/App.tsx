import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Calendar from './components/Calendar';
import { Task } from './types';

const socket = io('http://localhost:3001');

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    socket.on('newTask', (task: Task) => {
      setTasks(prevTasks => [...prevTasks, task]);
    });

    return () => {
      socket.off('newTask');
    };
  }, []);

  const handleTaskAdd = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks([...tasks, task]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Calendar tasks={tasks} onTaskAdd={handleTaskAdd} />
      </div>
    </div>
  );
}

export default App;