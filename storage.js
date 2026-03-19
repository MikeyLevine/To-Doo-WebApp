// Storage Module — handles localStorage read/write

function saveTasks() {
  const items = document.querySelectorAll("#todo-list li");
  const tasks = Array.from(items).map(function (li) {
    return {
      text: li.querySelector("span").textContent,
      done: li.classList.contains("done")
    };
  });
  localStorage.setItem("todos", JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem("todos");
  if (!stored) return;

  const tasks = JSON.parse(stored);
  const input = document.getElementById("todo-input");

  tasks.forEach(function (task) {
    input.value = task.text;
    addTodo();

    if (task.done) {
      const items = document.querySelectorAll("#todo-list li");
      const lastItem = items[items.length - 1];
      lastItem.classList.add("done");
    }
  });

  input.value = "";
}
