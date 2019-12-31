import React from 'react';
import PitDisplay from './PitDisplay';
import './index.css';

let eventKey = (window.location.pathname.replace(/\//g,'') || 'null');
if (eventKey.split('-').length == 2) eventKey = '1920-' + eventKey;

const App: React.FC = () => {
  return <PitDisplay eventKey={eventKey} />;
};

export default App;