const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const remainingCount = document.getElementById('remainingCount');
const clearCompleted = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('taskFlowTasks') || '[]');
let activeFilter = 'all';

const saveTasks = () => {
  localStorage.setItem('taskFlowTasks', JSON.stringify(tasks));
};

const formatTaskCount = count => `${count} task${count === 1 ? '' : 's'}`;

const updateSummary = () => {
  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent = formatTaskCount(tasks.length);
  remainingCount.textContent = `${remaining} remaining`;
};

const setActiveFilter = filter => {
  activeFilter = filter;
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  renderTasks();
};

const createTaskItem = task => {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = task.id;

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const check = document.createElement('button');
  check.className = `task-check${task.completed ? ' active' : ''}`;
  check.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');
  check.innerHTML = task.completed ? '✓' : '';
  check.addEventListener('click', () => toggleComplete(task.id));

  const title = document.createElement('p');
  title.className = `task-title${task.completed ? ' completed' : ''}`;
  title.textContent = task.title;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => removeTask(task.id));

  meta.append(check, title);
  li.append(meta, deleteBtn);
  return li;
};

const renderTasks = () => {
  taskList.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (activeFilter === 'active') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'task-item';
    empty.style.justifyContent = 'center';
    empty.textContent = 'No tasks yet — add one to get started.';
    taskList.append(empty);
  } else {
    filtered.forEach(task => taskList.append(createTaskItem(task)));
  }

  updateSummary();
};

const addTask = () => {
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.unshift({
    id: Date.now().toString(),
    title,
    completed: false,
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
  taskInput.focus();
};

const toggleComplete = id => {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  renderTasks();
};

const removeTask = id => {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
};

const clearCompletedTasks = () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
};

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') addTask();
});
clearCompleted.addEventListener('click', clearCompletedTasks);
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => setActiveFilter(btn.dataset.filter));
});

renderTasks();
