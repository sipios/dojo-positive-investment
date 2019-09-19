import './App.css';

import React from 'react';

import { Chat } from './components/Chat';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="title">Positive Investment</h1>
      <Chat />
    </div>
  );
};

export default App;

