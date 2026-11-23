import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { AuthModule } from '../auth/auth.module';
import { TodoGateway } from './todo.gateway';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoGateway],
  imports: [TypeOrmModule.forFeature([Todo]), AuthModule],
})
export class TodoModule {}
