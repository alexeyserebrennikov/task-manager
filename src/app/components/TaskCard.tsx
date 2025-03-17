'use client';

import { useDraggable } from '@dnd-kit/core';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Task } from '@/app/types/task';
import type { TaskStatus } from '../types/task';
import dayjs from 'dayjs';

/**
 * Пропсы для компонента TaskCard
 */
interface TaskCardProps {
  /** Объект задачи для отображения */
  task: Task;
  /** Функция обратного вызова при изменении статуса задачи */
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  /** Функция обратного вызова при удалении задачи */
  onDelete: (id: string) => void;
  /** Функция обратного вызова при редактировании задачи */
  onEdit: (task: Task) => void;
}

/**
 * Компонент TaskCard отображает отдельную задачу с возможностью перетаскивания
 * @param {TaskCardProps} props - Пропсы компонента
 * @returns {JSX.Element} Отрендеренный компонент
 */
export default function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    disabled: false,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  /**
   * Обрабатывает клик по кнопке редактирования
   * @param {React.MouseEvent} e - Событие мыши
   */
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  /**
   * Обрабатывает клик по кнопке удаления
   * @param {React.MouseEvent} e - Событие мыши
   */
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  /**
   * Проверяет, просрочен ли дедлайн задачи
   * @returns {boolean} True если дедлайн просрочен
   */
  const isDeadlineOverdue = () => {
    if (!task.deadline) return false;
    return dayjs(task.deadline).isBefore(dayjs(), 'day');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={handleEditClick}
        className="flex-1 cursor-grab touch-none"
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
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={handleEditClick}
          className="text-blue-500 hover:text-blue-700"
          aria-label="Редактировать задачу"
        >
          <PencilIcon className="h-6 w-6" />
        </button>
        <button
          onClick={handleDeleteClick}
          className="text-red-500 hover:text-red-700"
          aria-label="Удалить задачу"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}