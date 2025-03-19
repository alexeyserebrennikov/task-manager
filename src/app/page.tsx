import TaskBoard from './components/TaskBoard';
import { Task } from './types/task';

export default async function Home() {
  try {
    console.log('Fetching tasks from /api/tasks...');
    const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/tasks`
      : 'http://localhost:3000/api/tasks'; // Локально используем http
    console.log('API URL:', apiUrl);

    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}: ${await res.text()}`);
    }
    const initialTasks: Task[] = await res.json();
    console.log('Tasks loaded:', initialTasks);

    return (
      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center my-8">Task Manager</h1>
        <TaskBoard initialTasks={initialTasks} />
      </main>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    return (
      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center my-8">Task Manager</h1>
        <p>Ошибка загрузки задач: {String(error)}</p>
      </main>
    );
  }
}