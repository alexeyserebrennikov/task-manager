'use client';

import { Task } from '@/app/types/task';
import { toast } from 'react-toastify';
import { useTaskForm } from '@/hooks/useTaskForm';
import { Modal } from './ui/Modal';

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export default function TaskDetailsModal({ isOpen, task, onClose, onSave }: TaskDetailsModalProps) {
  const { title, description, deadline, setTitle, setDescription, setDeadline, validate } = useTaskForm(task);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (!validate()) return;

    onSave({ ...task, title, description, deadline: deadline || undefined });
    toast.success('Задача успешно обновлена!', {
      position: 'top-right',
      autoClose: 3000,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Подробности задачи</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Заголовок</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Введите заголовок"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Введите описание"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Дедлайн</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
        >
          Закрыть
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Сохранить
        </button>
      </div>
    </Modal>
  );
}