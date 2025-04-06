import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task } from '@/app/types/task';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
      : 'http://localhost:3000/api',
  }),
  tagTypes: ['Tasks'], // Для инвалидации кэша
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: ['Tasks'],
    }),
    createTask: builder.mutation<Task, Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTask: builder.mutation<Task, Task>({
      query: (task) => ({
        url: '/tasks',
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: '/tasks',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;