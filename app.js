// Todo App Logic

function addTodo() {
  const input = document.getElementById("todo-input");
  const text = input.value.trim();
  if (text === "") return;

  const listId = getCurrentListId();
  if (!listId) return;

  apiCreateTask(listId, text).then(task => {
    const list = document.getElementById("todo-list");
    const li = renderTodo(task.text, task.id, task.done === 1);
    list.appendChild(li);

    input.value = "";
    filterTasks("all");
    updateEmptyState();
    updateCounter();
  }).catch(err => {
    console.error('Failed to add task:', err.message);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Check if user already has a valid session
  async function initApp() {
    try {
      const user = await apiGetMe();
      showMainScreen(user);
      await loadLists();
    } catch (err) {
      showAuthScreen();
    }
  }

  initApp();

  document.getElementById("todo-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addTodo();
    }
  });
});

function updateEmptyState() {
  const list = document.getElementById("todo-list");
  const msg = document.getElementById("empty-msg");
  msg.style.display = list.children.length === 0 ? "block" : "none";
}

function updateCounter() {
  const items = document.querySelectorAll("#todo-list li");
  const doneItems = document.querySelectorAll("#todo-list li.done");
  const counter = document.getElementById("task-counter");
  const total = items.length;
  const done = doneItems.length;

  if (total === 0) {
    counter.textContent = "";
  } else {
    counter.textContent = done + " of " + total + " completed";
  }
}

function clearAll() {
  const list = document.getElementById("todo-list");
  const listId = getCurrentListId();
  
  // Delete all tasks in the current list
  const tasks = list.querySelectorAll('li');
  tasks.forEach(li => {
    const taskId = li.dataset.taskId;
    if (taskId) {
      apiDeleteTask(parseInt(taskId)).catch(err => console.error(err));
    }
  });
  
  list.innerHTML = "";
  updateEmptyState();
  updateCounter();
}

function filterTasks(filter) {
  const items = document.querySelectorAll("#todo-list li");

  items.forEach(function (li) {
    const isDone = li.classList.contains("done");

    if (filter === "all") {
      li.style.display = "";
    } else if (filter === "active") {
      li.style.display = isDone ? "none" : "";
    } else if (filter === "done") {
      li.style.display = isDone ? "" : "none";
    }
  });

  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(function (btn) {
    btn.classList.remove("active-filter");
    if (btn.dataset.filter === filter) {
      btn.classList.add("active-filter");
    }
  });
}
