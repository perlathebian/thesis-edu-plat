import React from 'react';
import { useParams } from 'react-router-dom';
import Quiz from './Quiz';

const TopicPage = () => {
  const { topic } = useParams(); // Get the topic from the URL parameter

  return (
    <div>
      <h1>Topic: {topic}</h1>
      <Quiz topic={topic} />
    </div>
  );
};

export default TopicPage;
