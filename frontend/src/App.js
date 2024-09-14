
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopicPage from './TopicPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/topic/:topic" element={<TopicPage />} />
      </Routes>
    </Router>
  );
};

export default App;


