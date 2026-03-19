// UI Module — handles DOM rendering

function renderTodo(text, taskId, done = false) {
  const li = document.createElement("li");
  li.dataset.taskId = taskId;
  if (done) li.classList.add("done");

  const span = document.createElement("span");
  span.textContent = text;
  span.onclick = function () {
    const newDone = !li.classList.contains("done");
    li.classList.toggle("done");
    
    apiUpdateTask(taskId, { done: newDone }).then(() => {
      updateCounter();
      const activeFilter = document.querySelector(".filter-btn.active-filter");
      if (activeFilter) {
        filterTasks(activeFilter.dataset.filter);
      }
    }).catch(err => {
      console.error('Failed to update task:', err.message);
      li.classList.toggle("done"); // Revert on error
    });
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "✎";
  editBtn.className = "edit-btn";
  editBtn.onclick = function () {
    const currentText = span.textContent;
    const newText = prompt("Edit task:", currentText);
    if (newText === null) return;
    const trimmed = newText.trim();
    if (trimmed === "") return;
    
    apiUpdateTask(taskId, { text: trimmed }).then(() => {
      span.textContent = trimmed;
    }).catch(err => {
      console.error('Failed to edit task:', err.message);
    });
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = function () {
    apiDeleteTask(taskId).then(() => {
      li.remove();
      updateEmptyState();
      updateCounter();
      const activeFilter = document.querySelector(".filter-btn.active-filter");
      if (activeFilter) {
        filterTasks(activeFilter.dataset.filter);
      }
    }).catch(err => {
      console.error('Failed to delete task:', err.message);
    });
  };

  const btnGroup = document.createElement("div");
  btnGroup.className = "btn-group";
  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(btnGroup);

  return li;
}
