import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.entity'
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
}
