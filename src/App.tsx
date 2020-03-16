import React from 'react';
import PitDisplay from './PitDisplay';
import './index.css';

const path = window.location.pathname;
let eventKey = path.split('/').length >= 3 ? path.split('/')[2] : path.replace(/\//g, '');
if (eventKey.split('-').length === 2) eventKey = '1920-' + eventKey;

if (window.location.pathname !== `/${eventKey}`) {
  window.location.pathname = `/${eventKey}`;
}

const App: React.FC = () => {
  return <PitDisplay eventKey={eventKey} />;
};

export default App;