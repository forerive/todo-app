import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  findAll() {
    return [];
  };

  create(createTodoDto: CreateTodoDto) {
    return {
      id: 1,
      title: createTodoDto.title,
      completed: false,
    };
  }
}
