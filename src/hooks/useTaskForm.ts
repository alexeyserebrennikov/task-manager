import { useState, useEffect } from 'react';
import { Task } from '@/app/types/task';
import { toast } from 'react-toastify';

/**
 * Хук для управления состоянием и валидацией формы задачи.
 * Предоставляет поля формы (заголовок, описание, дедлайн), их сеттеры и функцию валидации.
 *
 * @param initialTask - Начальные данные задачи или null, если задача не предоставлена.
 * @returns Объект с полями формы, их сеттерами и функцией валидации.
 * @returns {string} title - Заголовок задачи.
 * @returns {string} description - Описание задачи.
 * @returns {string} deadline - Дедлайн задачи в формате строки (например, '2025-04-06').
 * @returns {function} setTitle - Функция для обновления заголовка.
 * @returns {function} setDescription - Функция для обновления описания.
 * @returns {function} setDeadline - Функция для обновления дедлайна.
 * @returns {function} validate - Функция для проверки корректности данных формы. Возвращает true, если данные валидны, иначе false.
 *
 * @example
 * ```tsx
 * const { title, setTitle, validate } = useTaskForm(task);
 * <Input value={title} onChange={setTitle} />
 * if (validate()) {
 *   // Сохранить задачу
 * }
 * ```
 */
export function useTaskForm(initialTask: Task | null) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [deadline, setDeadline] = useState(initialTask?.deadline || '');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setDeadline(initialTask.deadline || '');
    }
  }, [initialTask]);

  const validate = () => {
    if (!title.trim()) {
      toast.error('Заголовок не может быть пустым!', { position: 'top-right', autoClose: 3000 });
      return false;
    }
    return true;
  };

  return { title, description, deadline, setTitle, setDescription, setDeadline, validate };
}