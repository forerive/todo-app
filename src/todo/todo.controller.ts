import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { request } from 'http';
import { TodoGateway } from './todo.gateway';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly todoGateway: TodoGateway,
  ) {}
  @Get()
  findAll(@Req() request) {
    return this.todoService.findAll(request.user.userId);
  }
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Req() request) {
    const todo = await this.todoService.create(
      createTodoDto,
      request.user.userId,
    );
    this.todoGateway.notifyTodoChanged();
    return todo;
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() request,
  ) {
    const todo = await this.todoService.update(
      id,
      updateTodoDto,
      request.user.userId,
    );
    this.todoGateway.notifyTodoChanged();
    return todo;
  }
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() request) {
    const result = await this.todoService.delete(id, request.user.userId);
    this.todoGateway.notifyTodoChanged();
    return result;
  }
}
