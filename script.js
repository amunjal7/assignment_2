const taskList = document.getElementById('taskList');
const addTaskForm = document.getElementById('addTaskForm');
const filterSelect = document.getElementById('filter');
const sortButton = document.getElementById('sortButton');
let tasks = [];


window.addEventListener('load', () => {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  renderTaskList();
});


function addTask(task) {
  tasks.push(task);
  renderTaskList();
  saveTasksToLocalStorage(); 
}


function renderTaskList() {
  taskList.innerHTML = ''; 

 
  const filter = filterSelect.value;
  let filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.completed === (filter === 'completed'));


  if (sortButton.textContent === 'Sort by Due Date') {
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  filteredTasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const taskTitle = document.createElement('span');
    taskTitle.classList.add('task-title');
    taskTitle.textContent = task.title;

   
    if (task.completed) {
      taskTitle.classList.add('completed');
    }

    const taskDueDate = document.createElement('span');
    taskDueDate.textContent = `(Due: ${task.dueDate})`;

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    const completeButton = document.createElement('button');
    completeButton.classList.add('task-action');
    completeButton.textContent = task.completed ? 'Mark Incomplete' : 'Complete';
    completeButton.addEventListener('click', () => {
    
      const taskIndex = tasks.indexOf(task);

    
      tasks[taskIndex].completed = !tasks[taskIndex].completed;

      renderTaskList();
      saveTasksToLocalStorage(); 
    });

    const editButton = document.createElement('button');
    editButton.classList.add('task-action');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
     
      const newTitle = prompt("Enter new task title:", task.title);
      const newDescription = prompt("Enter new task description:", task.description);
      const newDueDate = prompt("Enter new due date (YYYY-MM-DD):", task.dueDate);

    
      if (newTitle !== null) {
        task.title = newTitle;
      }
      if (newDescription !== null) {
        task.description = newDescription;
      }
      if (newDueDate !== null) {
        task.dueDate = newDueDate;
      }

      
      renderTaskList();
      saveTasksToLocalStorage(); 
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('task-action');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter(t => t !== task);
      renderTaskList();
      saveTasksToLocalStorage(); 
    });

    taskActions.appendChild(completeButton);
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    taskElement.appendChild(taskTitle);
    taskElement.appendChild(taskDueDate);
    taskElement.appendChild(taskActions);

    taskList.appendChild(taskElement);
  });
}


function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const dueDate = document.getElementById('dueDate').value;

  const newTask = {
    title: title,
    description: description,
    dueDate: dueDate,
    completed: false
  };

  addTask(newTask);

  addTaskForm.reset(); 
});


filterSelect.addEventListener('change', renderTaskList);


sortButton.addEventListener('click', () => {
  
  if (sortButton.textContent === 'Sort by Due Date') {
    sortButton.textContent = 'Unsort';
  } else {
    sortButton.textContent = 'Sort by Due Date';
  }
  renderTaskList(); 
});


renderTaskList();