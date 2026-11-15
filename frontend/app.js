const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');

addButton.addEventListener('click', () => {
  const todoText = todoInput.value.trim();

  if (todoText === '') {
    return;
  }

  const li = document.createElement('li');
  li.textContent = todoText;

  todoList.appendChild(li);

  todoInput.value = '';
});


async function fetchTodos() {
  const token = prompt('JWTトークンを入力してください');

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

function renderTodos(todos) {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');

    li.textContent = todo.title;

    todoList.appendChild(li);
  });
}

fetchTodos();