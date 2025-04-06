export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string; // Описание задачи (опционально)
  deadline?: string; // Дедлайн в формате ISO строки (например, "2025-03-20"), опционально
  createdAt?: string; // Дата создания в формате ISO строки (например, "2025-03-20")
  updatedAt?: string; // Дата обновления в формате ISO строки (например, "2025-03-20")
}