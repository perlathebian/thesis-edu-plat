function showDefaultContent() {
    var contents = document.querySelectorAll('.content');
    // Hide all content areas
    contents.forEach(function(content) {
        content.style.display = 'none';
    });
    // Show the default content area
    var defaultContent = document.getElementById('default-content');
    defaultContent.style.display = 'block';
    // If the titles menu is open, close it and unshift the content
    var titles = document.getElementById('titles');
    if (titles.classList.contains('show-titles')) {
        titles.classList.remove('show-titles');
        defaultContent.classList.remove('shift-content');
    }
}


// Toggle the titles menu and shift the default content
function toggleTitles() {
    var titles = document.getElementById('titles');
    var contentArea = document.getElementById('default-content');

    titles.classList.toggle('show-titles'); // Toggle the .titles in and out
    contentArea.classList.toggle('shift-content'); // Shift the contentArea
}



// Show content based on clicked title
function showContent(contentId) {
    var titles = document.getElementById('titles');
    var contentAreas = document.querySelectorAll('.content');

    // Hide all content areas
    contentAreas.forEach(function(content) {
        content.style.display = 'none';
        content.classList.remove('shift-content'); // Reset any shifted content
    });

    // Show the clicked content area
    var contentToShow = document.getElementById(contentId);
    contentToShow.style.display = 'block';

    // If the titles menu is visible, shift the content
    if (titles.classList.contains('show-titles')) {
        contentToShow.classList.add('shift-content');
    }
}



// The DOMContentLoaded event listener can be removed if it's not needed for other initialization purposes


function toggleTheme() {
    const body = document.body;
    body.classList.toggle('bright-theme');

    // Select the theme icon element
    const themeIcon = document.querySelector('.theme-icon');
    
    // Update the icon based on the current theme
    if (body.classList.contains('bright-theme')) {
        themeIcon.innerHTML = '🌙'; // dark mode icon
    } else {
        themeIcon.innerHTML = '☀️'; // light mode icon
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const questionsContainer = document.getElementById('questions-container');

    // Function to create a question element
    function createQuestionElement(question) {
        const questionEl = document.createElement('div');
        questionEl.className = 'question';

        const questionTitle = document.createElement('h3');
        questionTitle.innerText = question.question_text;
        questionEl.appendChild(questionTitle);

        // Create a radio input for each possible answer
        question.answers.forEach(answer => {
            const answerEl = document.createElement('label');
            answerEl.className = 'answer';
            answerEl.innerText = answer.answer_text;
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question_${question.id}`;
            radioInput.value = answer.id; // or answer.answer_text depending on how you store it
            
            // Insert the radio button before the label's text
            answerEl.insertBefore(radioInput, answerEl.firstChild);
            
            // Append the answer element to the question element
            questionEl.appendChild(answerEl);
        });

        // Append the question element to the questions container
        questionsContainer.appendChild(questionEl);
    }

    // Function to load questions from the server
    function loadQuestions() {
        fetch('http://localhost:3000/get-questions?topic=Operators')
            .then(response => response.json())
            .then(questions => {
                questions.forEach(question => {
                    createQuestionElement(question);
                });
            });
    }

    // Load questions when the DOM is ready
    loadQuestions();

    // Function to check answers
    // Function to check answers by sending them to the server
function checkAnswers() {
    // Gather the selected answers from the quiz
    const selectedAnswers = questionsContainer.querySelectorAll('input[type="radio"]:checked');
    const answers = Array.from(selectedAnswers).map(input => {
        return {
            questionId: input.name.split('_')[1],
            selectedAnswer: input.value // The ID of the chosen answer
        };
    });

    // Send the answers to the server for validation
    fetch('/validate-quiz', { // The server endpoint that validates answers
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: answers })
    })
    .then(response => response.json())
    .then(result => {
        // Process server response here
        // The server should respond with an array indicating which answers are correct
        result.forEach(item => {
            const questionEl = document.querySelector(`[name="question_${item.questionId}"]`).closest('.question');
            if (item.correct) {
                questionEl.classList.add('correct'); // Add correct class if the answer was correct
            } else {
                questionEl.classList.add('wrong'); // Add wrong class if the answer was incorrect
            }
        });
    });
}


    // Event listener for the submit button
    document.getElementById('submit-quiz').addEventListener('click', function() {
        checkAnswers();
    });
});


