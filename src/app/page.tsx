'use client';

import TaskBoard from '@/app/components/TaskBoard';
import { useGetTasksQuery } from '@/redux/services/tasksApi';

export default function Home() {
  const { data: initialTasks, error, isLoading } = useGetTasksQuery();

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error loading tasks: {String(error)}</p>;
  }

  return (
    <main className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Task Manager</h1>
      <TaskBoard initialTasks={initialTasks || []} />
    </main>
  );
}