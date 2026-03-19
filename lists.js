// lists.js — list switcher UI logic
let currentListId = null;

async function loadLists() {
  try {
    const lists = await apiGetLists();

    if (lists.length === 0) {
      // Auto-create a default list for new users
      const defaultList = await apiCreateList('My Tasks', '#e63030');
      lists.push(defaultList);
    }

    renderListSidebar(lists);

    // Select first list by default
    selectList(lists[0].id);
  } catch (err) {
    console.error('Failed to load lists:', err.message);
  }
}

function getCurrentListId() {
  return currentListId;
}

function renderListSidebar(lists) {
  const sidebar = document.getElementById('list-sidebar');
  sidebar.innerHTML = '';

  lists.forEach(function (list) {
    const btn = document.createElement('button');
    btn.className = 'list-btn';
    btn.dataset.listId = list.id;
    btn.innerHTML = `<span class="list-dot" style="background:${list.color}"></span>${list.name}`;
    btn.onclick = function () { selectList(list.id); };

    const delBtn = document.createElement('button');
    delBtn.className = 'list-delete-btn';
    delBtn.textContent = '✕';
    delBtn.title = 'Delete list';
    delBtn.onclick = function (e) {
      e.stopPropagation();
      deleteList(list.id);
    };

    btn.appendChild(delBtn);
    sidebar.appendChild(btn);
  });
}

async function createList() {
  const nameInput = document.getElementById('new-list-input');
  const name = nameInput.value.trim();
  if (!name) return;

  try {
    await apiCreateList(name, '#e63030');
    nameInput.value = '';
    const lists = await apiGetLists();
    renderListSidebar(lists);
  } catch (err) {
    console.error('Failed to create list:', err.message);
  }
}

async function deleteList(id) {
  if (!confirm('Delete this list and all its tasks?')) return;

  try {
    await apiDeleteList(id);
    const lists = await apiGetLists();
    renderListSidebar(lists);

    if (lists.length > 0) {
      selectList(lists[0].id);
    } else {
      currentListId = null;
      document.getElementById('todo-list').innerHTML = '';
      updateEmptyState();
    }
  } catch (err) {
    console.error('Failed to delete list:', err.message);
  }
}

async function selectList(id) {
  currentListId = id;

  // Highlight active list button
  document.querySelectorAll('.list-btn').forEach(function (btn) {
    btn.classList.toggle('active-list', btn.dataset.listId == id);
  });

  // Load tasks for this list
  try {
    const tasks = await apiGetTasks(id);
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    tasks.forEach(function (task) {
      const li = renderTodo(task.text, task.id, task.done === 1);
      list.appendChild(li);
    });

    updateEmptyState();
    updateCounter();
  } catch (err) {
    console.error('Failed to load tasks:', err.message);
  }
}
