import TaskBoard from './components/TaskBoard';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">Task Manager</h1>
      <TaskBoard />
    </main>
  );
}