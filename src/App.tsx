import React from 'react';
import PitDisplay from './PitDisplay';
import './index.css';

const eventKey = (window.location.pathname.substr(1) || 'null');

const App: React.FC = () => {
  return <PitDisplay eventKey={eventKey} />;
};

export default App;