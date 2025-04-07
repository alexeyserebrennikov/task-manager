import { renderHook, act } from '@testing-library/react';
import { useTaskForm } from './useTaskForm';
import { toast } from 'react-toastify';
import { Task } from '@/app/types/task';

// Мокаем toast
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('useTaskForm', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Desc',
    deadline: '2025-04-10',
    status: 'TODO',
  };
  it('Проверка инициализации с данными', () => {
    const { result } = renderHook(() => useTaskForm(mockTask));
    expect(result.current.title).toBe('Test Task');
    expect(result.current.description).toBe('Test Desc');
    expect(result.current.deadline).toBe('2025-04-10');
  });

  it('Проверка обновления состояния', () => {
    const { result } = renderHook(() => useTaskForm(null));
    act(() => {
      result.current.setTitle('New Title');
      result.current.setDescription('New Desc');
      result.current.setDeadline('2025-05-01');
    });
    expect(result.current.title).toBe('New Title');
    expect(result.current.description).toBe('New Desc');
    expect(result.current.deadline).toBe('2025-05-01');
  });

  it('Валидация с пустым загоовком и отображение ошибки', () => {
    const { result } = renderHook(() => useTaskForm(null));
    act(() => {
      result.current.setTitle('');
    });
    const isValid = result.current.validate();
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Заголовок не может быть пустым!', expect.any(Object));
  });

  it('Валидация с непустым загоовком', () => {
    const { result } = renderHook(() => useTaskForm(mockTask));
    const isValid = result.current.validate();
    expect(isValid).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('Синхронизация с новым initialTask', () => {
    const initialProps: { task: Task | null } = { task: null };
    const { result, rerender } = renderHook(({ task }) => useTaskForm(task), {
      initialProps,
    });
    rerender({ task: mockTask });
    expect(result.current.title).toBe('Test Task');
    expect(result.current.description).toBe('Test Desc');
    expect(result.current.deadline).toBe('2025-04-10');
  });
});