import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}
  async findAll(userId: number) {
    return await this.todoRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async create(createTodoDto: CreateTodoDto, userId: number) {
    const todo = this.todoRepository.create({
      title: createTodoDto.title,
      completed: false,
      user: {
        id: userId,
      },
    });
    await this.todoRepository.save(todo);
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: number) {
    const todo = await this.todoRepository.findOne({
      where: {
        id: Number(id),
        user: {
          id: userId,
        },
      },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    todo.completed = updateTodoDto.completed;
    await this.todoRepository.save(todo);
    return todo;
  }

  async delete(id: string, userId: number) {
    const todo = await this.todoRepository.findOne({
      where: {
        id: Number(id),
        user: {
          id: userId,
        },
      },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    await this.todoRepository.delete({
      id: Number(id),
      user: {
        id: userId,
      },
    });
    return todo;
  }
}
