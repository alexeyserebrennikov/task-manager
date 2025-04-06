'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Task } from '@/app/types/task';
import type { TaskStatus } from '@/app/types/task';
import TaskCard from './TaskCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import TaskDetailsModal from './TaskDetailsModal';
import { toast } from 'react-toastify';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '@/redux/services/tasksApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTasks, addTask, updateTask, deleteTask } from '@/redux/slices/tasksSlice';

const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

/**
 * Пропсы для компонента Column
 */
interface ColumnProps {
  tasks: Task[];
  status: TaskStatus;
  title: string;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

/**
 * Компонент Column отображает список задач с одинаковым статусом
 */
function Column({ tasks, status, title, onStatusChange, onDelete, onEdit }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded-lg min-h-[200px]"
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <SortableContext items={tasks.map((task) => task.id)}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </SortableContext>
    </div>
  );
}

interface TaskBoardProps {
  initialTasks: Task[];
}

/**
 * Компонент TaskBoard управляет всей доской задач с функционалом перетаскивания
 */
export default function TaskBoard({ initialTasks }: TaskBoardProps) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: fetchedTasks, isLoading, error } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTaskApi] = useUpdateTaskMutation();
  const [deleteTaskApi] = useDeleteTaskMutation();

  useEffect(() => {
    if (fetchedTasks) {
      dispatch(setTasks(fetchedTasks));
    }
  }, [fetchedTasks, dispatch]);

  useEffect(() => {
    if (!fetchedTasks && initialTasks.length > 0) {
      dispatch(setTasks(initialTasks));
    }
  }, [initialTasks, fetchedTasks, dispatch]);

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, status: newStatus };
    try {
      await updateTaskApi(updatedTask).unwrap();
      dispatch(updateTask(updatedTask));
    } catch (err) {
      toast.error('Ошибка при обновлении статуса');
      console.error('Update status error:', err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle,
      status: 'TODO' as TaskStatus,
    };

    try {
      const addedTask = await createTask(newTask).unwrap();
      dispatch(addTask(addedTask));
      setNewTaskTitle('');
      toast.success('Задача добавлена');
    } catch (err) {
      toast.error('Ошибка при добавлении задачи');
      console.error('Add task error:', err);
    }
  };

  const handleDeleteTask = (id: string) => {
    console.log('Deleting task:', id);
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    console.log('Confirming deletion of task:', taskToDelete);

    try {
      await deleteTaskApi(taskToDelete).unwrap();
      dispatch(deleteTask(taskToDelete));
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
      toast.success('Задача удалена');
    } catch (err) {
      console.error('Delete task error:', err);
      toast.error('Ошибка при удалении задачи');
    }
  };

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      await updateTaskApi(updatedTask).unwrap();
      dispatch(updateTask(updatedTask));
      setIsDetailsModalOpen(false);
    } catch (err) {
      toast.error('Ошибка при сохранении задачи');
      console.error('Save task error:', err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log('DragEnd - active:', activeId, 'over:', overId); // Отладка

    const activeTask = tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    // Если перетаскиваем над другой задачей
    const overTask = tasks.find((task) => task.id === overId);
    if (overTask && activeTask.status === overTask.status) {
      console.log('Moving within column:', activeTask.status);
      const oldIndex = tasks.findIndex((task) => task.id === activeId);
      const newIndex = tasks.findIndex((task) => task.id === overId);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      dispatch(setTasks(newTasks));
    }
    // Если перетаскиваем над колонкой
    else if (TASK_STATUSES.includes(overId as TaskStatus)) {
      console.log('Moving to new column:', overId);
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        const updatedTask = { ...activeTask, status: newStatus };
        try {
          await updateTaskApi(updatedTask).unwrap();
          dispatch(updateTask(updatedTask));
          console.log('Task moved successfully to:', newStatus);
        } catch (err) {
          toast.error('Ошибка при перемещении задачи');
          console.error('Drag-and-drop error:', err);
        }
      }
    } else {
      console.log('No valid drop target found');
    }
  };

  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'Список задач', status: 'TODO' },
    { title: 'В разработке', status: 'IN_PROGRESS' },
    { title: 'Готово', status: 'DONE' },
  ];

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    const errorMessage = 'status' in error ? `Error ${error.status}: ${JSON.stringify(error.data)}` : String(error);
    return <p>Error loading tasks: {errorMessage}</p>;
  }

  return (
    <div className="p-6">
      <form onSubmit={handleAddTask} className="mb-8 flex gap-4">
        <input
          id="new-task-title"
          name="new-task-title"
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Название новой задачи"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Добавить
        </button>
      </form>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={columns.map((col) => col.status)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <Column
                key={column.status}
                tasks={tasks.filter((task) => task.status === column.status)}
                status={column.status}
                title={column.title}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                onEdit={handleOpenDetails}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить эту задачу?"
      />
      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        task={selectedTask}
        onClose={() => setIsDetailsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}