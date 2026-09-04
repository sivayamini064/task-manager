const taskList = document.getElementById('taskList');
const titleInput = document.getElementById('titleInput');
const descInput = document.getElementById('descInput');
const addBtn = document.getElementById('addBtn');

// Function to fetch and display all tasks
async function loadTasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();

  taskList.innerHTML = ''; // clear the list first

  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = task.status === 'done' ? 'task-item done' : 'task-item';
    div.innerHTML = `
      <span>${task.title}</span>
      <div>
        <button onclick="markDone('${task._id}')">Done</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
    taskList.appendChild(div);
  });
}

// Load tasks as soon as the page opens
loadTasks();
// Add a new task
addBtn.addEventListener('click', async () => {
  const title = titleInput.value;
  const description = descInput.value;

  if (title.trim() === '') {
    alert('Please enter a task title');
    return;
  }

  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  titleInput.value = '';
  descInput.value = '';
  loadTasks(); // refresh the list to show the new task
});

// Mark a task as done
async function markDone(id) {
  await fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'done' })
  });
  loadTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`/tasks/${id}`, {
    method: 'DELETE'
  });
  loadTasks();
}