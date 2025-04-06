// /app/api/tasks/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/app/types/task';

// Один экземпляр Prisma для всего сервера
const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newTask: Task = await req.json();
    if (!newTask.title || !newTask.status) {
      return NextResponse.json({ error: 'Заголовок и статус обязательны' }, { status: 400 });
    }
    const task = await prisma.task.create({ 
      data: {
        ...newTask,
        id: Date.now().toString()
      }
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedTask: Task = await req.json();
    const task = await prisma.task.update({
      where: { id: updatedTask.id },
      data: updatedTask,
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error);
    return NextResponse.json({ error: 'Задача не найдена или ошибка сервера' }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID задачи не указан' }, { status: 400 });
    }
    await prisma.task.delete({ where: { id: body.id } });
    return NextResponse.json({ message: 'Задача удалена' });
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
    return NextResponse.json({ error: 'Задача не найдена или ошибка сервера' }, { status: 404 });
  }
}