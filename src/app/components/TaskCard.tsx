'use client';

import { useDraggable } from '@dnd-kit/core';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Task } from '@/app/types/task';
import type { TaskStatus } from '@/app/types/task';
import dayjs from 'dayjs';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    disabled: false,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: 'transform 0.2s ease',
      }
    : undefined;

  const handleEditClick = (e: React.MouseEvent) => {
    console.log('Edit button clicked for task:', task.id);
    e.preventDefault();
    e.stopPropagation();
    onEdit(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    console.log('Delete button clicked for task:', task.id);
    e.preventDefault();
    e.stopPropagation();
    onDelete(task.id);
  };

  const isDeadlineOverdue = () => {
    if (!task.deadline) return false;
    return dayjs(task.deadline).isBefore(dayjs(), 'day');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow mb-4"
    >
      <div className="flex justify-between items-center">
        <div 
          className="flex-1 cursor-grab touch-none"
          {...listeners}
          {...attributes}
        >
          <h3 className="text-lg font-medium">{task.title}</h3>
          {task.deadline && (
            <p className={`text-sm ${isDeadlineOverdue() ? 'text-red-500' : 'text-gray-500'}`}>
              Дедлайн: {dayjs(task.deadline).format('DD.MM.YYYY')}
            </p>
          )}
          <select
            id={`task-status-${task.id}`}
            name={`task-status-${task.id}`}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            onClick={(e) => e.stopPropagation()}
            className="mt-2 p-1 border rounded"
          >
            <option value="TODO">Список задач</option>
            <option value="IN_PROGRESS">В разработке</option>
            <option value="DONE">Готово</option>
          </select>
        </div>
        <div className="flex items-center gap-2 ml-4 pointer-events-auto">
          <button
            type="button"
            onClick={handleEditClick}
            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 pointer-events-auto"
            aria-label="Редактировать задачу"
          >
            <PencilIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 pointer-events-auto"
            aria-label="Удалить задачу"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}