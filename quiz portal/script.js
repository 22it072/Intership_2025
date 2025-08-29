document.addEventListener('DOMContentLoaded', () => {
    // Determine which page is currently loaded
    const isLoginPage = document.querySelector('.auth-container');
    const isQuizPage = document.querySelector('.quiz-container');
    const isCreatorPage = document.querySelector('.creator-card');

    // --- MOCK DATABASE & SHARED DATA ---
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];
    let allQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // --- DEFAULT INBUILT QUIZ DATA ---
   const defaultQuiz = {
    id: 'default-gk-quiz',
    title: 'General Knowledge',
    createdBy: 'Quiz Portal',
    questions: [
        // --- Original 25 Questions ---
        { question: "What is the capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], answer: "Tokyo" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
        { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answer: "William Shakespeare" },
        { question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: "Pacific Ocean" },
        { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Go", "Gd"], answer: "Au" },
        { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
        { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], answer: "Leonardo da Vinci" },
        { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: "Diamond" },
        { question: "Which country is home to the kangaroo?", options: ["South Africa", "India", "Australia", "Brazil"], answer: "Australia" },
        { question: "What is the tallest mountain in the world?", options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"], answer: "Mount Everest" },
        { question: "Who invented the telephone?", options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"], answer: "Alexander Graham Bell" },
        { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Lime"], answer: "Avocado" },
        { question: "Which is the longest river in the world?", options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"], answer: "Nile River" },
        { question: "What is the currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Yen"], answer: "Pound Sterling" },
        { question: "In which year did the Titanic sink?", options: ["1905", "1912", "1918", "1923"], answer: "1912" },
        { question: "What is the primary language spoken in Brazil?", options: ["Spanish", "English", "Portuguese", "French"], answer: "Portuguese" },
        { question: "Who was the first person to walk on the moon?", options: ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins", "Neil Armstrong"], answer: "Neil Armstrong" },
        { question: "What is the largest animal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"], answer: "Blue Whale" },
        { question: "Which of these is a primary color?", options: ["Green", "Orange", "Blue", "Purple"], answer: "Blue" },
        { question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], answer: "Ottawa" },
        { question: "How many players are there in a standard soccer team?", options: ["9", "10", "11", "12"], answer: "11" },
        { question: "What is the boiling point of water at sea level?", options: ["90°C", "100°C", "110°C", "120°C"], answer: "100°C" },
        { question: "Which element does 'O' represent on the periodic table?", options: ["Osmium", "Oxygen", "Gold", "Oganesson"], answer: "Oxygen" },
        { question: "What is the name of the galaxy we live in?", options: ["Andromeda", "Triangulum", "Whirlpool", "Milky Way"], answer: "Milky Way" },
        { question: "Who is the author of the Harry Potter series?", options: ["J.R.R. Tolkien", "George R.R. Martin", "J.K. Rowling", "Suzanne Collins"], answer: "J.K. Rowling" },
        
        // --- New 5 Questions ---
        { question: "Which is the smallest continent by land area?", options: ["Europe", "Antarctica", "South America", "Australia"], answer: "Australia" },
        { question: "What is the most spoken language in the world by number of native speakers?", options: ["English", "Mandarin Chinese", "Spanish", "Hindi"], answer: "Mandarin Chinese" },
        { question: "Which artist is known for cutting off his own ear?", options: ["Pablo Picasso", "Vincent van Gogh", "Salvador Dalí", "Claude Monet"], answer: "Vincent van Gogh" },
        { question: "The Great Wall of China was primarily built to protect against which group?", options: ["The Mongols", "The Japanese", "The Russians", "The Koreans"], answer: "The Mongols" },
        { question: "What is the chemical formula for table salt?", options: ["H2O", "CO2", "NaCl", "C6H12O6"], answer: "NaCl" }
    ]
};

    // --- INITIALIZE DATA ---
    // Ensure default user exists
    if (allUsers.length === 0) {
        allUsers.push({ id: 1, name: 'Demo User', email: 'user@test.com', password: 'password123' });
        localStorage.setItem('users', JSON.stringify(allUsers));
    }
    // Ensure the inbuilt quiz always exists
    if (!allQuizzes.find(quiz => quiz.id === 'default-gk-quiz')) {
        allQuizzes.unshift(defaultQuiz); // Add to the beginning of the list
        localStorage.setItem('quizzes', JSON.stringify(allQuizzes));
    }

    // =================================================================
    // LOGIN & REGISTRATION PAGE LOGIC
    // =================================================================
    if (isLoginPage) {
        if (loggedInUser) {
            window.location.href = 'quiz.html';
            return;
        }

        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');

        showRegisterLink.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('login-form-container').classList.add('hidden');
            document.getElementById('register-form-container').classList.remove('hidden');
        });

        showLoginLink.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('register-form-container').classList.add('hidden');
            document.getElementById('login-form-container').classList.remove('hidden');
        });

        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const user = allUsers.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify({ id: user.id, name: user.name }));
                window.location.href = 'quiz.html';
            } else {
                alert('Invalid credentials.');
            }
        });

        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            if (allUsers.some(u => u.email === email)) {
                alert('Email already exists.');
                return;
            }
            const newUser = { id: Date.now(), name, email, password };
            allUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(allUsers));
            alert('Registration successful! Please log in.');
            showLoginLink.click();
        });
    }

    // =================================================================
    // QUIZ CREATOR PAGE LOGIC
    // =================================================================
    if (isCreatorPage) {
        if (!loggedInUser) { window.location.href = 'index.html'; return; }

        const questionsContainer = document.getElementById('questions-container');
        const addQuestionBtn = document.getElementById('add-question-btn');
        const createQuizForm = document.getElementById('create-quiz-form');

        addQuestionBtn.addEventListener('click', () => {
            const questionCount = questionsContainer.children.length + 1;
            const newQuestionEditor = document.createElement('div');
            newQuestionEditor.classList.add('question-editor');
            newQuestionEditor.innerHTML = `
                <h4>Question ${questionCount}</h4>
                <div class="input-group">
                    <input type="text" class="question-input" placeholder="Enter your question" required>
                </div>
                <div class="options-creator">
                    <input type="text" class="option-input" placeholder="Option A (Correct Answer)" required>
                    <input type="text" class="option-input" placeholder="Option B" required>
                    <input type="text" class="option-input" placeholder="Option C" required>
                    <input type="text" class="option-input" placeholder="Option D" required>
                </div>
            `;
            questionsContainer.appendChild(newQuestionEditor);
        });

        createQuizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newQuiz = {
                id: `quiz-${Date.now()}`,
                title: document.getElementById('quiz-title').value,
                createdBy: loggedInUser.name,
                questions: []
            };

            const questionEditors = document.querySelectorAll('.question-editor');
            questionEditors.forEach(editor => {
                const questionText = editor.querySelector('.question-input').value;
                const optionInputs = editor.querySelectorAll('.option-input');
                const options = Array.from(optionInputs).map(input => input.value);
                const answer = options[0]; // First option is always the correct one

                newQuiz.questions.push({ question: questionText, options, answer });
            });
            
            allQuizzes.push(newQuiz);
            localStorage.setItem('quizzes', JSON.stringify(allQuizzes));
            
            alert('Quiz created successfully!');
            window.location.href = 'quiz.html';
        });
    }

    // =================================================================
    // QUIZ PAGE LOGIC
    // =================================================================
    if (isQuizPage && !isCreatorPage) {
        if (!loggedInUser) { window.location.href = 'index.html'; return; }

        // --- DOM Elements ---
        const scoreDisplay = document.getElementById('score-display');
        const timerDisplay = document.getElementById('timer-display');
        const userNameDisplay = document.getElementById('user-name');
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        const welcomeScreen = document.getElementById('welcome-screen');
        const quizScreen = document.getElementById('quiz-screen');
        const resultsScreen = document.getElementById('results-screen');
        const restartQuizBtn = document.getElementById('restart-quiz-btn');
        const questionNumber = document.getElementById('question-number');
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const nextBtn = document.getElementById('next-btn');
        const profileModal = document.getElementById('profile-modal');
        const settingsModal = document.getElementById('settings-modal');
        const quizListContainer = document.getElementById('quiz-list-container');
        
        // --- Quiz State ---
        let currentQuiz = null;
        let currentQuestionIndex = 0;
        let score = 0;
        let timer;
        let timeLeft = 1800; // 30 minutes

        // --- Functions ---
        function init() {
            userNameDisplay.textContent = loggedInUser.name;
            loadQuizList();
        }
        
        function loadQuizList() {
            quizListContainer.innerHTML = '';
            allQuizzes.forEach(quiz => {
                const quizItem = document.createElement('div');
                quizItem.classList.add('quiz-list-item');
                quizItem.dataset.quizId = quiz.id;
                quizItem.innerHTML = `
                    <div class="quiz-info">
                        <h4>${quiz.title}</h4>
                        <span>${quiz.questions.length} Questions | By: ${quiz.createdBy}</span>
                    </div>
                    <button class="btn btn-secondary">Start</button>
                `;
                quizListContainer.appendChild(quizItem);
            });
        }
        
        function startQuiz(quizId) {
            currentQuiz = allQuizzes.find(q => q.id === quizId);
            if (!currentQuiz) return;
            
            welcomeScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            currentQuestionIndex = 0;
            score = 0;
            scoreDisplay.textContent = score;
            startTimer();
            showQuestion();
        }

        function startTimer() {
            timeLeft = 1800;
            timerDisplay.textContent = "30:00";
            timer = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    showResults();
                }
            }, 1000);
        }

        function showQuestion() {
            const question = currentQuiz.questions[currentQuestionIndex];
            questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${currentQuiz.questions.length}`;
            questionText.textContent = question.question;
            optionsContainer.innerHTML = '';
            // Randomize options for display
            const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option-btn');
                button.addEventListener('click', () => selectAnswer(button, option));
                optionsContainer.appendChild(button);
            });
            nextBtn.classList.add('hidden');
            nextBtn.textContent = 'Next Question';
        }

        function selectAnswer(button, selectedOption) {
            const correctAnswer = currentQuiz.questions[currentQuestionIndex].answer;
            const options = optionsContainer.querySelectorAll('.option-btn');
            
            options.forEach(btn => {
                btn.disabled = true;
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                } else if (btn.textContent === selectedOption) {
                    btn.classList.add('wrong');
                }
            });

            if (selectedOption === correctAnswer) {
                score++;
                scoreDisplay.textContent = score;
            }
            
            nextBtn.classList.remove('hidden');
            if (currentQuestionIndex === currentQuiz.questions.length - 1) {
                nextBtn.textContent = 'Show Results';
            }
        }

        function showResults() {
            clearInterval(timer);
            quizScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
            document.getElementById('final-score').textContent = score;
            document.getElementById('correct-answers').textContent = score;
            document.getElementById('wrong-answers').textContent = currentQuiz.questions.length - score;
        }
        
        function openModal(modal) {
            if (modal === profileModal) {
                document.getElementById('profile-name').textContent = loggedInUser.name;
                const user = allUsers.find(u => u.id === loggedInUser.id);
                document.getElementById('profile-email').textContent = user.email;
            }
            modal.classList.remove('hidden');
        }

        // --- Event Listeners ---
        quizListContainer.addEventListener('click', (e) => {
            const quizItem = e.target.closest('.quiz-list-item');
            if (quizItem) {
                startQuiz(quizItem.dataset.quizId);
            }
        });
        
        restartQuizBtn.addEventListener('click', () => {
            resultsScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
            loadQuizList();
        });

        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < currentQuiz.questions.length) {
                showQuestion();
            } else {
                showResults();
            }
        });

        userMenuBtn.addEventListener('click', () => userDropdown.classList.toggle('hidden'));
        
        userDropdown.addEventListener('click', e => {
            e.preventDefault();
            if (e.target.id === 'logout-btn') {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            } else if (e.target.id === 'profile-link') {
                openModal(profileModal);
            } else if (e.target.id === 'settings-link') {
                openModal(settingsModal);
            }
            userDropdown.classList.add('hidden');
        });

        document.querySelectorAll('.modal .close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.add('hidden');
            });
        });

        window.addEventListener('click', e => {
            if (userMenuBtn && !userMenuBtn.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
        
        // --- Initialize ---
        init();
    }
});