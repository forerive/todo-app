import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [TypeOrmModule.forFeature([Todo])],
})
export class TodoModule {}
