'use strict';
const form = document.querySelector('.form');
const formInput = document.querySelector('.form__input');
const formBtn = document.querySelector('.form__send-btn');
const output = document.querySelector('.output');
const dateBtn = document.querySelector('.date__btn');
const select = document.querySelector('#select');
const inputDate = document.querySelector('input[type="date"]');

inputDate.valueAsNumber = new Date();

dateBtn.addEventListener('click', () => {
  output.textContent = '';
  const arrayTasksLocalStorage = getTaskLocalStorage();
  arrayTasksLocalStorage.splice(0, arrayTasksLocalStorage.length);
  setTaskLocalStorage(arrayTasksLocalStorage);
});
inputDate.addEventListener('change', () => {});

let editId = null;
let isEditTask = false;
updateListTasks();
form.addEventListener('submit', sendTask);
output.addEventListener('click', (event) => {
  const taskElement = event.target.closest('.task__btns');
  if (!taskElement) return;
  if (event.target.closest('.task__edit')) {
    editTask(event);
  } else if (event.target.closest('.task__del')) {
    delTask(event);
  } else if (event.target.closest('.task__done')) {
    doneTask(event);
  }
});
//-------------------------------------------------------------------------------------------------------------------------------
inputDate.addEventListener('change', () => {
  output.textContent = '';
  const selectedDate = inputDate.value;
  const arrayTasksLocalStorage = getTaskLocalStorage();
  const index = arrayTasksLocalStorage.filter((task) => task.date === selectedDate);
  renderTasks(index);
  console.log(index);
});

function filterTasksByDate(tasks, date) {
  return tasks.filter((task) => task.date === date);
}

function sendTask(event) {
  event.preventDefault();
  const task = formInput.value.trim();
  const selectedDate = inputDate.value;
  if (!task) {
    return alert('инпут пустой!!!');
  }
  if (isEditTask) {
    saveEditedTask(task);
    return;
  }
  const arrayTasksLocalStorage = getTaskLocalStorage();
  arrayTasksLocalStorage.push({
    id: generateId(),
    task: task,
    done: false,
    position: 1000,
    date: selectedDate,
  });
  setTaskLocalStorage(arrayTasksLocalStorage);
  updateListTasks();
  form.reset();
}
function doneTask(event) {
  const task = event.target.closest('.task');
  const id = Number(task.dataset.taskId);
  const arrayTasksLocalStorage = getTaskLocalStorage();
  const index = arrayTasksLocalStorage.findIndex((task) => task.id === id);

  if (index === -1) {
    return alert('Такая задача не найдена!');
  }
  if (arrayTasksLocalStorage[index].done) {
    arrayTasksLocalStorage[index].done = false;
  } else {
    arrayTasksLocalStorage[index].done = true;
  }
  setTaskLocalStorage(arrayTasksLocalStorage);
  updateListTasks();
}
function delTask(event) {
  const task = event.target.closest('.task');
  const id = Number(task.dataset.taskId);
  const arrayTasksLocalStorage = getTaskLocalStorage();
  const newTaskArr = arrayTasksLocalStorage.filter((task) => task.id !== id);
  setTaskLocalStorage(newTaskArr);
  updateListTasks();
}
function editTask(event) {
  const task = event.target.closest('.task');
  const text = task.querySelector('.task__text');
  editId = Number(task.dataset.taskId);
  formInput.value = text.textContent;
  isEditTask = true;
  formBtn.textContent = 'Сохранить';
}
function saveEditedTask(task) {
  const arrayTasksLocalStorage = getTaskLocalStorage();
  const editedTadkIndex = arrayTasksLocalStorage.findIndex((task) => task.id === editId);

  if (editedTadkIndex !== -1) {
    arrayTasksLocalStorage[editedTadkIndex].task = task;
    setTaskLocalStorage(arrayTasksLocalStorage);
    updateListTasks();
  } else {
    alert('Такая задача не надйена!');
  }
  resetSendForm();
}
function resetSendForm() {
  editId = null;
  isEditTask = false;
  formBtn.textContent = 'Добавить';
  form.reset();
}
function getTaskLocalStorage() {
  const tasksJSON = localStorage.getItem('tasks');
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}
function setTaskLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function generateId() {
  const timeStamp = Date.now();
  const randomPart = Math.floor(Math.random() * 10000);
  const randomPartTwo = Math.floor(Math.random() * 10000);
  return timeStamp + randomPart + randomPartTwo;
}
function updateListTasks() {
  document.querySelector('.output').textContent = '';
  const selectedDate = inputDate.value;
  const arrayTasksLocalStorage = getTaskLocalStorage();
  const filteredTasks = filterTasksByDate(arrayTasksLocalStorage, selectedDate);
  renderTasks(filteredTasks);
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
select.addEventListener('change', () => {
  const selectedValue = select.value;
  const arrayTasksLocalStorage = getTaskLocalStorage();

  let filteredTasks;

  if (selectedValue === '1') {
    filteredTasks = arrayTasksLocalStorage.filter((task) => task.done === true);
  } else if (selectedValue === '2') {
    filteredTasks = arrayTasksLocalStorage.filter((task) => task.done === false);
  } else if (selectedValue === '3') {
    filteredTasks = arrayTasksLocalStorage.filter((task) => task.position === 1000);
  }
  if (filteredTasks.length === 0) {
    alert('Тaкой задачи нет!');
    location.reload();
  }
  output.textContent = '';
  renderTasks(filteredTasks);
  console.log(filteredTasks);
});
