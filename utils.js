export function getTaskLocalStorage() {
  const tasksJSON = localStorage.getItem('tasks');
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}
export function setTaskLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
export function generateId() {
  const timeStamp = Date.now();
  const randomPart = Math.floor(Math.random() * 10000);
  const randomPartTwo = Math.floor(Math.random() * 10000);
  return timeStamp + randomPart + randomPartTwo;
}
export function updateListTasks() {
  document.querySelector('.output').textContent = '';
  const arrayTasksLocalStorage = getTaskLocalStorage();
  renderTasks(arrayTasksLocalStorage);
}

function renderTasks(tasks) {
  if (!tasks || !tasks.length) return;

  tasks
    .sort((a, b) => {
      if (a.done !== b.done) {
        return a.done ? 1 : -1;
      }
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      return a.position - b.position;
    })
    .forEach((value, i) => {
      const { id, task, pinned, done } = value;
      const item = `
              <div class="task ${done ? 'done' : ''} ${
        pinned ? 'pinned' : ''
      }" data-task-id="${id}" draggable="true">
                  <p class="task__text">${task}</p>
                  <div class="task__btns">
                      <button class="task__done ${done ? 'active' : ''}">ok</button>
                      <button class="task__edit">изменить</button>
                      <button class="task__del">удалить</button>
                  </div>
              </div>
              `;
      document.querySelector('.output').insertAdjacentHTML('beforeend', item);
    });

  //   activationDrag();
}
