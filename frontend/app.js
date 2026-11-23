const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');

addButton.addEventListener('click', async () => {
  const todoText = todoInput.value.trim();

  if (todoText === '') {
    return;
  }

  await createTodo(todoText);

  todoInput.value = '';
});

const token = prompt('JWTトークンを入力してください');

// GET /todos呼び出し
async function fetchTodos() {
  if (!token) {
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const todos = await response.json();

    console.log('取得したTodo:', todos);

    renderTodos(todos);
  } catch (error) {
    console.error('Todo取得エラー:', error);
  }
}

// POST /todos呼び出し
async function createTodo(title) {
  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    console.log('Todoの追加に成功しました');

    await fetchTodos();
  } catch (error) {
    console.error('Todo追加エラー:', error);
  }
}

// PATCH /todos/{id}呼び出し
async function updateTodo(id, completed) {
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      completed: completed,
    }),
  });

  if (!response.ok) {
    console.error('Todoの更新に失敗しました');
    return;
  }

  console.log('Todoの更新に成功しました');
}

// DELETE /todos/{id}呼び出し
async function deleteTodo(id) {
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Todoの削除に失敗しました');
    return;
  }

  console.log('Todoの削除に成功しました');
}

// GET APIで取得したTodoの一覧をHTML画面に表示する
function renderTodos(todos) {
  todoList.innerHTML = '';

  const sortedTodos = [...todos].sort((a, b) => a.id - b.id);

  console.log(
    '並び替え前:',
    todos.map((todo) => todo.id),
  );
  console.log(
    '並び替え後:',
    sortedTodos.map((todo) => todo.id),
  );

  sortedTodos.forEach((todo) => {
    const li = document.createElement('li');
    const titleSpan = document.createElement('span');
    if (todo.completed) {
      titleSpan.textContent = `✅ ${todo.title}`;
    } else {
      titleSpan.textContent = `⬜ ${todo.title}`;
    }

    titleSpan.addEventListener('click', () => {
      updateTodo(todo.id, !todo.completed);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => {
      deleteTodo(todo.id);
    });
    li.appendChild(titleSpan);
    li.appendChild(deleteButton);

    todoList.appendChild(li);
  });
}

fetchTodos();

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Socket.IO接続成功:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Socket.IO切断:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Socket.IO接続エラー:', error.message);
});

socket.on('hello', (message) => {
  console.log('NestJSから受信:', message);
});

socket.on('todoChanged', () => {
  console.log('Todo変更通知を受信しました');
  fetchTodos();
});
