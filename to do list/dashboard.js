document.addEventListener('DOMContentLoaded', () => {
    // Determine which page is currently loaded
    const isLoginPage = document.querySelector('.auth-container');
    const isDashboardPage = document.querySelector('.dashboard-container');

    // --- MOCK DATABASE & SHARED DATA ---
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];
    let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // --- INITIALIZE ADMIN USER (if it's the first time) ---
    if (allUsers.length === 0) {
        const adminUser = {
            id: 1,
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        };
        allUsers.push(adminUser);
        localStorage.setItem('users', JSON.stringify(allUsers));
    }

    // =================================================================
    // LOGIN & REGISTRATION PAGE LOGIC
    // =================================================================
    if (isLoginPage) {
        // Redirect if already logged in
        if (loggedInUser) {
            window.location.href = 'document.html';
            return;
        }

        // --- DOM Element References (Login Page) ---
        const loginFormContainer = document.getElementById('login-form-container');
        const registerFormContainer = document.getElementById('register-form-container');
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        // --- Event Listeners (Login Page) ---
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormContainer.classList.add('hidden');
            registerFormContainer.classList.remove('hidden');
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerFormContainer.classList.add('hidden');
            loginFormContainer.classList.remove('hidden');
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const user = allUsers.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify({ id: user.id, name: user.name, role: user.role }));
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password.');
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            if (allUsers.some(u => u.email === email)) {
                alert('An account with this email already exists.');
                return;
            }

            const newUser = { id: Date.now(), name, email, password, role: 'employee' };
            allUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(allUsers));

            alert('Registration successful! Please log in.');
            showLoginLink.click();
            registerForm.reset();
        });
    }

    // =================================================================
    // DASHBOARD PAGE LOGIC
    // =================================================================
    if (isDashboardPage) {
        // Route Protection: Redirect if not logged in
        if (!loggedInUser) {
            window.location.href = 'index.html';
            return;
        }

        // --- DOM Element References (Dashboard) ---
        const userNameEl = document.getElementById('user-name');
        const dashboardTitleEl = document.getElementById('dashboard-title');
        const taskListEl = document.getElementById('task-list');
        const addTaskBtn = document.getElementById('add-task-btn');
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        // Modals
        const taskModal = document.getElementById('task-modal');
        const closeModalBtn = document.querySelector('.close-btn');
        const taskDetailsModal = document.getElementById('task-details-modal');
        const profileModal = document.getElementById('profile-modal');
        const closeProfileBtn = document.querySelector('.close-profile-btn');
        
        // Task Form
        const taskForm = document.getElementById('task-form');
        const modalTitle = document.getElementById('modal-title');
        const assignToGroup = document.getElementById('assign-to-group');
        const assigneeSelect = document.getElementById('task-assignee');

        let countdownIntervals = {};

        // --- Functions (Dashboard) ---

        // Find and replace this entire function in your JS file

function initializeDashboard() {
    const assignToGroup = document.getElementById('assign-to-group');
    const assigneeSelect = document.getElementById('task-assignee');

    userNameEl.textContent = `Welcome, ${loggedInUser.name}`;
    
    if (loggedInUser.role === 'admin') {
        dashboardTitleEl.textContent = 'All Tasks';
        assignToGroup.style.display = 'block';
        assigneeSelect.required = true; // Add 'required' for admins
        populateAssigneeDropdown();
    } else {
        dashboardTitleEl.textContent = 'My Tasks';
        assignToGroup.style.display = 'none';
        assigneeSelect.required = false; // Remove 'required' for employees
    }
    renderTasks();
}

        function populateAssigneeDropdown() {
            assigneeSelect.innerHTML = '';
            allUsers.filter(u => u.role === 'employee').forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.id;
                option.textContent = emp.name;
                assigneeSelect.appendChild(option);
            });
        }

        function renderTasks() {
            taskListEl.innerHTML = '';
            stopAllCountdowns();
            const tasksToDisplay = loggedInUser.role === 'admin' ? allTasks : allTasks.filter(task => task.assignedTo === loggedInUser.id);

            if (tasksToDisplay.length === 0) {
                taskListEl.innerHTML = '<p>No tasks found.</p>';
                return;
            }

            tasksToDisplay.forEach(task => {
                const assignee = allUsers.find(u => u.id === task.assignedTo);
                const taskCard = document.createElement('div');
                taskCard.className = 'task-card';
                taskCard.dataset.taskId = task.id;
                let assigneeHTML = loggedInUser.role === 'admin' && assignee ? `<p class="task-assignee"><strong>Assigned to:</strong> ${assignee.name}</p>` : '';

                taskCard.innerHTML = `
                    <div class="task-header">
                        <h3>${task.title}</h3>
                        <span class="task-status ${task.status.replace(' ', '-')}">${task.status}</span>
                    </div>
                    <p class="task-description">${task.description}</p>
                    ${assigneeHTML}
                    <div class="task-footer">
                        <div class="task-deadline">
                            <span class="countdown-timer" data-deadline="${task.deadline}"></span>
                        </div>
                        <div class="task-actions">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                `;
                taskListEl.appendChild(taskCard);
                startCountdown(task.id, task.deadline);
            });
        }

        function startCountdown(taskId, deadline) {
            const timerEl = document.querySelector(`.task-card[data-task-id='${taskId}'] .countdown-timer`);
            if (!timerEl) return;
            const updateTimer = () => {
                const distance = new Date(deadline).getTime() - new Date().getTime();
                if (distance < 0) {
                    timerEl.textContent = 'Overdue';
                    timerEl.className = 'countdown-timer red';
                    clearInterval(countdownIntervals[taskId]);
                    return;
                }
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                timerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                timerEl.className = `countdown-timer ${days < 1 ? 'red' : days < 3 ? 'yellow' : 'green'}`;
            };
            updateTimer();
            countdownIntervals[taskId] = setInterval(updateTimer, 1000);
        }

        function stopAllCountdowns() {
            Object.values(countdownIntervals).forEach(clearInterval);
            countdownIntervals = {};
        }

        function openTaskFormModal(task = null) {
            taskForm.reset();
            if (task) {
                modalTitle.textContent = 'Edit Task';
                document.getElementById('task-id').value = task.id;
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-description').value = task.description;
                document.getElementById('task-deadline').value = task.deadline.slice(0, 16);
                document.getElementById('task-status').value = task.status;
                if (loggedInUser.role === 'admin') assigneeSelect.value = task.assignedTo;
            } else {
                modalTitle.textContent = 'Add New Task';
                document.getElementById('task-id').value = '';
            }
            taskModal.classList.remove('hidden');
        }

        function openDetailsModal(task) {
            const assignee = allUsers.find(u => u.id === task.assignedTo);
            const deadlineDate = new Date(task.deadline).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            document.getElementById('details-title').textContent = task.title;
            document.getElementById('details-description').textContent = task.description;
            const statusEl = document.getElementById('details-status');
            statusEl.textContent = task.status;
            statusEl.className = `task-status ${task.status.replace(' ', '-')}`;
            document.getElementById('details-assignee').textContent = assignee ? assignee.name : 'N/A';
            document.getElementById('details-deadline').textContent = deadlineDate;
            
            taskDetailsModal.classList.remove('hidden');
        }
        
        function openProfileModal() {
            document.getElementById('profile-name').textContent = loggedInUser.name;
            document.getElementById('profile-email').textContent = allUsers.find(u => u.id === loggedInUser.id).email;
            document.getElementById('profile-role').textContent = loggedInUser.role;
            profileModal.classList.remove('hidden');
        }

        // --- Event Listeners (Dashboard) ---

        addTaskBtn.addEventListener('click', () => openTaskFormModal());
        closeModalBtn.addEventListener('click', () => taskModal.classList.add('hidden'));
        closeProfileBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskId = document.getElementById('task-id').value;
            const taskData = {
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-description').value,
                deadline: document.getElementById('task-deadline').value,
                status: document.getElementById('task-status').value,
                assignedTo: loggedInUser.role === 'admin' ? parseInt(assigneeSelect.value) : loggedInUser.id
            };
            if (taskId) {
                const taskIndex = allTasks.findIndex(t => t.id == taskId);
                allTasks[taskIndex] = { ...allTasks[taskIndex], ...taskData };
            } else {
                taskData.id = Date.now();
                allTasks.push(taskData);
            }
            localStorage.setItem('tasks', JSON.stringify(allTasks));
            renderTasks();
            taskModal.classList.add('hidden');
        });

        taskListEl.addEventListener('click', (e) => {
            const card = e.target.closest('.task-card');
            if (!card) return;
            const taskId = card.dataset.taskId;
            const task = allTasks.find(t => t.id == taskId);
            if (e.target.closest('.edit-btn')) {
                openTaskFormModal(task);
            } else if (e.target.closest('.delete-btn')) {
                if (confirm('Are you sure you want to delete this task?')) {
                    allTasks = allTasks.filter(t => t.id != taskId);
                    localStorage.setItem('tasks', JSON.stringify(allTasks));
                    renderTasks();
                }
            } else {
                openDetailsModal(task);
            }
        });

        userMenuBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
            userMenuBtn.classList.toggle('open');
        });

        userDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target;
            if (target.id === 'logout-btn') {
                localStorage.removeItem('loggedInUser');
                stopAllCountdowns();
                window.location.href = 'index.html';
            } else if (target.textContent === 'Profile') {
                openProfileModal();
                userDropdown.classList.add('hidden');
                userMenuBtn.classList.remove('open');
            }
        });

        window.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
                userMenuBtn.classList.remove('open');
            }
            if (e.target === taskModal) taskModal.classList.add('hidden');
            if (e.target === taskDetailsModal) taskDetailsModal.classList.add('hidden');
            if (e.target === profileModal) profileModal.classList.add('hidden');
        });
        
        // --- Initialize ---
        initializeDashboard();
    }
});