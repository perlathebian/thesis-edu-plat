
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001; // Use a different port from your React app



// Replace with your database credentials
// Database connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MySQL@2023',
  database: 'quizzes'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

// Existing Express code...


// Middleware
app.use(cors());
app.use(express.json());


// API endpoint to fetch quiz data
// API endpoint to fetch questions and their answers for a given topic
app.get('/api/quiz/:topic', (req, res) => {
  const topic = req.params.topic;
  // Join questions with answers based on question_id and filter by topic
  const query = `
      SELECT q.id as question_id, q.question_text, a.id as answer_id, a.answer_text, a.is_correct 
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      WHERE q.topic = ?
  `;
  
  db.query(query, [topic], (err, results) => {
    if (err) {
        res.status(500).send('Error fetching questions from database');
        return;
    }
    // Transform results into a structured object keyed by question_id
    const questionsMap = results.reduce((acc, { question_id, question_text, answer_id, answer_text, is_correct }) => {
      if (!acc[question_id]) {
        acc[question_id] = {
          question_id,
          question_text,
          answers: []
        };
      }
      acc[question_id].answers.push({
        answer_id,
        answer_text,
        is_correct: !!is_correct
      });
      return acc;
    }, {});

    // Convert structured object into an array of question objects
    const questionsArray = Object.values(questionsMap);
    res.json(questionsArray);
  });
});

  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});