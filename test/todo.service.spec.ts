
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodoService } from '../src/todo/todo.service';
import { Todo } from '../src/todo/todo.entity';

describe('TodoService', () => {
  let service: TodoService;

  const mockTodoRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  // テスト① 他人のTodoは更新できない
  it('他人のTodoは更新できない', async () => {
    mockTodoRepository.findOne.mockResolvedValue(null);

    await expect(
      service.update('2', { completed: true }, 1),
    ).rejects.toThrow(NotFoundException);

    expect(mockTodoRepository.save).not.toHaveBeenCalled();

    expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: 2,
        user: { id: 1 },
      },
    });
  });

  // テスト② 自分のTodoを更新できる
  it('自分のTodoを更新できる', async () => {
    const todo = {
      id: 2,
      completed: false,
      user: { id: 1 },
    };

    mockTodoRepository.findOne.mockResolvedValue(todo);
    mockTodoRepository.save.mockImplementation(
      async (savedTodo) => savedTodo,
    );

    const result = await service.update(
      '2',
      { completed: true },
      1,
    );

    expect(result.completed).toBe(true);

    expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: 2,
        user: { id: 1 },
      },
    });

    expect(mockTodoRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        completed: true,
      }),
    );
  });

  // テスト③ 存在しないTodoは更新できない
  it('存在しないTodoは更新できない', async () => {
    mockTodoRepository.findOne.mockResolvedValue(null);

    await expect(
      service.update('999', { completed: true }, 1),
    ).rejects.toThrow(
      new NotFoundException('Todo not found'),
    );

    expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: 999,
        user: { id: 1 },
      },
    });

    expect(mockTodoRepository.save).not.toHaveBeenCalled();
  });

  // テスト④ completedをtrueからfalseに変更できる
  it('completedをtrueからfalseに変更できる', async () => {
    const todo = {
      id: 2,
      completed: true,
      user: { id: 1 },
    };

    mockTodoRepository.findOne.mockResolvedValue(todo);
    mockTodoRepository.save.mockImplementation(
      async (savedTodo) => savedTodo,
    );

    const result = await service.update(
      '2',
      { completed: false },
      1,
    );

    expect(result.completed).toBe(false);

    expect(mockTodoRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        completed: false,
      }),
    );
  });
});
