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

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  findAll(@Req() request) {
    return this.todoService.findAll(request.user.userId);
  }
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() request) {
    return this.todoService.create(createTodoDto, request.user.userId);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Req() request) {
    return this.todoService.update(id, updateTodoDto, request.user.userId);
  }
  @Delete(':id')
  delete(@Param('id') id: string, @Req() request) {
    return this.todoService.delete(id, request.user.userId);
  }
}
