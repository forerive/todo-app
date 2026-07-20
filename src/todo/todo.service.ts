import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}
  async findAll() {
    return await this.todoRepository.find();
  }

  async create(createTodoDto: CreateTodoDto) {
    const todo = this.todoRepository.create({
      title: createTodoDto.title,
      completed: false,
    });
    await this.todoRepository.save(todo);
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoRepository.findOne({
      where: { id: Number(id) },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    todo.completed = updateTodoDto.completed;
    await this.todoRepository.save(todo);
    return todo;
  }

  async delete(id: string) {
    const todo = await this.todoRepository.findOne({
      where: { id: Number(id) },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    await this.todoRepository.delete({ id: Number(id) });
    return todo;
  }
}
