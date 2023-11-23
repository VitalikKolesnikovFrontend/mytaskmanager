'use strict';
import { getTaskLocalStorage, setTaskLocalStorage, generateId, updateListTasks } from './utils.js';

const form = document.querySelector('.form');
const formInput = document.querySelector('.form__input');
const formBtn = document.querySelector('.form__send-btn');
const output = document.querySelector('.output');

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
//---------------------------------------------------------------------------------------

function sendTask(event) {
  event.preventDefault();
  const task = formInput.value.trim();
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
// localStorage -------------------------------------------------------------------------
