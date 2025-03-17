'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { Task } from '@/app/types/task';
import type { TaskStatus } from '../types/task';
import TaskCard from './TaskCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import TaskDetailsModal from './TaskDetailsModal';

const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

/**
 * Пропсы для компонента Column
 */
interface ColumnProps {
  /** Массив задач в колонке */
  tasks: Task[];
  /** Текущий статус колонки */
  status: TaskStatus;
  /** Заголовок колонки */
  title: string;
  /** Функция обратного вызова при изменении статуса задачи */
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  /** Функция обратного вызова при удалении задачи */
  onDelete: (id: string) => void;
  /** Функция обратного вызова при редактировании задачи */
  onEdit: (task: Task) => void;
}

/**
 * Компонент Column отображает список задач с одинаковым статусом
 * @param {ColumnProps} props - Пропсы компонента
 * @returns {JSX.Element} Отрендеренный компонент
 */
function Column({ tasks, status, title, onStatusChange, onDelete, onEdit }: ColumnProps) {
  const { setNodeRef } = useSortable({ id: status });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg min-h-[200px]">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <SortableContext items={tasks.map(task => task.id)}>
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

/**
 * Компонент TaskBoard управляет всей доской задач с функционалом перетаскивания
 * @returns {JSX.Element} Отрендеренный компонент
 */
export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Создать дизайн', status: 'TODO' },
    { id: '2', title: 'Написать код', status: 'IN_PROGRESS' },
    { id: '3', title: 'Тестирование', status: 'DONE' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  /**
   * Обрабатывает изменение статуса задачи
   * @param {string} id - ID задачи
   * @param {TaskStatus} newStatus - Новый статус задачи
   */
  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  /**
   * Обрабатывает добавление новой задачи
   * @param {React.FormEvent} e - Событие отправки формы
   */
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'TODO',
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  /**
   * Обрабатывает запрос на удаление задачи
   * @param {string} id - ID задачи для удаления
   */
  const handleDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /**
   * Подтверждает удаление задачи
   */
  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  /**
   * Обрабатывает открытие модального окна с деталями задачи
   * @param {Task} task - Задача для отображения деталей
   */
  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  /**
   * Обрабатывает сохранение изменений задачи
   * @param {Task} updatedTask - Обновленные данные задачи
   */
  const handleSaveTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  /**
   * Обрабатывает события перетаскивания
   * @param {DragEndEvent} event - Событие окончания перетаскивания
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(task => task.id === activeId);
    const overTask = tasks.find(task => task.id === overId);

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const oldIndex = tasks.findIndex(task => task.id === activeId);
      const newIndex = tasks.findIndex(task => task.id === overId);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    } else if (activeTask && TASK_STATUSES.includes(overId as TaskStatus)) {
      const newStatus = overId as TaskStatus;
      setTasks(tasks.map(task => 
        task.id === activeId ? { ...task, status: newStatus } : task
      ));
    }
  };

  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'Список задач', status: 'TODO' },
    { title: 'В разработке', status: 'IN_PROGRESS' },
    { title: 'Готово', status: 'DONE' },
  ];

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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Добавить
        </button>
      </form>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={columns.map(col => col.status)}>
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