document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    if (localStorage.getItem('loggedInUser')) {
        window.location.href = 'document.html';
        return;
    }

    // --- MOCK USER DATABASE ---
    // In a real app, this would be in a database.
    if (!localStorage.getItem('users')) {
        const adminUser = {
            id: 1,
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'password123', // In a real app, this would be hashed
            role: 'admin'
        };
        localStorage.setItem('users', JSON.stringify([adminUser]));
    }
    
    // --- FORM TOGGLING ---
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

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

    // --- LOGIN LOGIC ---
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // "Log in" the user by saving their info to localStorage
            localStorage.setItem('loggedInUser', JSON.stringify({ id: user.id, name: user.name, role: user.role }));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password.');
        }
    });

    // --- REGISTRATION LOGIC ---
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            alert('An account with this email already exists.');
            return;
        }
        
        // Create new employee user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password, // Again, should be hashed
            role: 'employee'
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! Please log in.');
        showLoginLink.click(); // Switch to login form
        loginForm.reset();
        registerForm.reset();
    });
});