
const apiUrl = 'https://jsonplaceholder.typicode.com/todos'; // Open API URL for todos
const todoListElem = document.getElementById('todo-list');
const fetchTodosBtn = document.getElementById('fetch-todos-btn');
// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(err => {
                console.error('Service Worker registration failed:', err);
            });
    });
}

// Fetch To-Dos from API and display them
fetchTodosBtn.addEventListener('click', () => {
    fetch(apiUrl)
        .then(response => response.json())
        .then(todos => {
            displayTodos(todos);
        })
        .catch(err => {
            console.error('Failed to fetch todos:', err);
        });
});

// Function to display todos in the DOM
function displayTodos(todos) {
    todoListElem.innerHTML = ''; // Clear existing todos
    todos.slice(0, 10).forEach(todo => { // Limit to 10 items
        const listItem = document.createElement('li');
        listItem.textContent = todo.title;
        listItem.classList.toggle('completed', todo.completed);
        todoListElem.appendChild(listItem);
    });
}