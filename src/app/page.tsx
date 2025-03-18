import TaskBoard from './components/TaskBoard';
import { Task } from './types/task';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/tasks`, {
    cache: 'no-store', // Отключаем кэширование для актуальных данных
  });
  const initialTasks: Task[] = await res.json();

  return (
    <main className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Task Manager</h1>
      <TaskBoard initialTasks={initialTasks} />
    </main>
  );
}