import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = ({ topic }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/quiz/${topic}`)
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching quiz data:', error);
        setError(error);
        setLoading(false);
      });
  }, [topic]);

  const handleAnswerChange = (event, questionId) => {
    // Make sure we're using the same property names as the server response
    const selectedAnswerId = event.target.value;
  
    setUserAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: selectedAnswerId, // Ensure this matches the server response structure
    }));
  };
  
  
  const handleSubmit = (event) => {
    event.preventDefault();
  
    let score = questions.reduce((accumulator, question) => {
      // Check if there's an answer provided by the user for the current question
      if (userAnswers[question.question_id]) {
        // Find the correct answer object
        const correctAnswer = question.answers.find(answer => answer.is_correct);
        // Convert both IDs to strings for a reliable comparison
        if (correctAnswer && correctAnswer.answer_id.toString() === userAnswers[question.question_id]) {
          // Increment the score if the user's answer matches the correct answer ID
          accumulator += 1;
        }
      }
      return accumulator;
    }, 0);
  
    // Show the score out of the total number of questions
    alert(`Your score is ${score} out of ${questions.length}`);
  };
  
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading quiz data.</div>;

  return (
    <form onSubmit={handleSubmit}>
      {questions.map(question => (
        <div key={question.question_id} style={{ marginBottom: '20px' }}> {/* Ensure question_id is unique */}
          <p>{question.question_text}</p>
          {question.answers.map(answer => (
            <div key={answer.answer_id} style={{ marginLeft: '20px', marginTop: '10px' }}> {/* Ensure answer_id is unique */}
              <input
                type="radio"
                id={`answer_${answer.answer_id}`}
                name={`question_${question.question_id}`}
                value={answer.answer_id}
                checked={userAnswers[question.question_id] === answer.answer_id.toString()}
                onChange={(e) => handleAnswerChange(e, question.question_id)}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor={`answer_${answer.answer_id}`}>{answer.answer_text}</label>
            </div>
          ))}
        </div>
      ))}
      <button type="submit" style={{ marginTop: '20px' }}>Submit Quiz</button>
    </form>
  );
  
};

export default Quiz;