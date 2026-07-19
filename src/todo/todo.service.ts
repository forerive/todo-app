import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  findAll() {
    return this.todos;
  }

  create(createTodoDto: CreateTodoDto) {
    const todo: Todo = {
      id: this.todos.length + 1,
      title: createTodoDto.title,
      completed: false,
    };
    this.todos.push(todo);
    return todo;
  }

  update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo = this.todos.find((todo) => todo.id === Number(id));
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.completed = updateTodoDto.completed;
    return todo;
  }

  delete(id: string) {
    const todo = this.todos.find((todo) => todo.id === Number(id));
    if (!todo) {
      throw new Error('Todo not found');
    }
    this.todos = this.todos.filter((todo) => todo.id !== Number(id));
  }
}
