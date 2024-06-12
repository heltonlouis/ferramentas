const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const userTodo = JSON.parse(localStorage.getItem("users")) || [];

// Load todos from localStorage
function getTodos() {
  const savedTodos = userTodo[0]?.todos || [];
  savedTodos.forEach((todo) => addTodoElement(todo.text, todo.completed));
}

getTodos();

todoInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText === "") return;

  addTodoElement(todoText);
  saveTodos();

  todoInput.value = "";
}

function addTodoElement(todoText, completed = false) {
  const li = document.createElement("li");
  if (completed) {
    li.classList.add("completed");
  }

  const span = document.createElement("span");
  span.innerText = todoText;

  const input = document.createElement("input");
  input.type = "text";
  input.value = todoText;
  input.style.display = "none";

  const completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fas fa-check complete-icon"></i>';
  completeButton.onclick = function () {
    li.classList.toggle("completed");
    saveTodos();
    sortTodos();
  };

  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fas fa-edit edit-icon"></i>';
  editButton.onclick = function () {
    span.style.display = "none";
    input.style.display = "inline-block";
    input.focus();
  };

  const saveButton = document.createElement("button");
  saveButton.innerHTML = '<i class="fas fa-save edit-icon"></i>';
  saveButton.style.display = "none";
  saveButton.onclick = function () {
    span.innerText = input.value;
    span.style.display = "inline";
    input.style.display = "none";
    saveButton.style.display = "none";
    editButton.style.display = "inline";
    saveTodos();
  };

  input.onkeypress = function (event) {
    if (event.key === "Enter") {
      saveButton.click();
    }
  };

  const removeButton = document.createElement("button");
  removeButton.innerHTML = '<i class="fas fa-trash delete-icon"></i>';
  removeButton.onclick = function () {
    removeTodoElement(li);
  };

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.appendChild(completeButton);
  actions.appendChild(editButton);
  actions.appendChild(saveButton);
  actions.appendChild(removeButton);

  li.appendChild(span);
  li.appendChild(input);
  li.appendChild(actions);

  todoList.appendChild(li);
}

function removeTodoElement(li) {
  todoList.removeChild(li);
  saveTodos();
}

function saveTodos() {
  const todos = [];
  document.querySelectorAll(".todo-list li").forEach((li) => {
    const text = li.querySelector("span").innerText;
    const completed = li.classList.contains("completed");
    todos.push({ text, completed });
  });
  userTodo[0].todos = todos;
  localStorage.setItem("users", JSON.stringify(userTodo));
}

function sortTodos() {
  const completedTodos = [];
  const incompleteTodos = [];

  document.querySelectorAll(".todo-list li").forEach((li) => {
    if (li.classList.contains("completed")) {
      completedTodos.push(li);
    } else {
      incompleteTodos.push(li);
    }
  });

  todoList.innerHTML = "";
  incompleteTodos.concat(completedTodos).forEach((li) => {
    todoList.appendChild(li);
  });
}

// Adiciona a classe 'active' ao menu ativo
document.querySelectorAll("nav ul li a").forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
