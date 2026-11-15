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

// GET APIで取得したTodoの一覧をHTML画面に表示する
function renderTodos(todos) {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');

    li.textContent = todo.title;

    todoList.appendChild(li);
  });
}

fetchTodos();