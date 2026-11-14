import { Test, TestingModule } from '@nestjs/testing';

// AuthGuardをモックに置き換える
jest.mock('../auth/auth.guard', () => ({
  AuthGuard: class MockAuthGuard {
    canActivate() {
      return true;
    }
  },
}));

import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;
  const mockTodoService = {
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  };
  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('PATCHで正しい引数をServiceに渡す', async () => {
    // ① Serviceが返す値を設定
    const updatedTodo = {
      id: 2,
      completed: true,
    };

    mockTodoService.update.mockResolvedValue(updatedTodo);

    // ② リクエストのモック
    const request = {
      user: {
        userId: 1,
      },
    };

    // ③ Controllerのupdateを実行
    const result = await controller.update('2', { completed: true }, request);

    // ④ Serviceに渡された引数を検証
    expect(mockTodoService.update).toHaveBeenCalledWith(
      '2',
      { completed: true },
      1,
    );

    // ⑤ Controllerの戻り値を検証
    expect(result).toEqual(updatedTodo);
  });

  it('DELETEで正しい引数をServiceに渡す', async () => {
    // ① Serviceの戻り値を設定
    const deletedTodo = {
      id: 2,
      completed: false,
    };

    mockTodoService.delete.mockResolvedValue(deletedTodo);

    // ② リクエストのモック
    const request = {
      user: {
        userId: 1,
      },
    };

    // ③ Controllerのdeleteを実行
    const result = await controller.delete('2', request);

    // ④ Serviceに渡された引数を検証
    expect(mockTodoService.delete).toHaveBeenCalledWith('2', 1);

    // ⑤ 戻り値を検証
    expect(result).toEqual(deletedTodo);
  });

  it('GETで正しい引数をServiceに渡す', async () => {
    const todos = [
      { id: 1, title: '勉強', completed: false },
      { id: 2, title: '筋トレ', completed: true },
    ];

    mockTodoService.findAll.mockResolvedValue(todos);

    const request = {
      user: {
        userId: 1,
      },
    };

    const result = await controller.findAll(request);

    expect(mockTodoService.findAll).toHaveBeenCalledWith(1);

    expect(result).toEqual(todos);
  });

  it('POSTで正しい引数をServiceに渡す', async () => {
    // ① 登録するTodoの情報
    const createTodoDto = {
      title: 'WebSocketの勉強',
    };

    // ② Serviceが返す値
    const createdTodo = {
      id: 3,
      title: 'WebSocketの勉強',
      completed: false,
    };

    mockTodoService.create.mockResolvedValue(createdTodo);

    // ③ リクエストのモック
    const request = {
      user: {
        userId: 1,
      },
    };

    // ④ Controllerのcreateを実行
    const result = await controller.create(createTodoDto, request);

    // ⑤ ここに引数の検証コードを書く
    expect(mockTodoService.create).toHaveBeenCalledWith(createTodoDto, 1);
    // ⑥ 戻り値の検証
    expect(result).toEqual(createdTodo);
  });
});
