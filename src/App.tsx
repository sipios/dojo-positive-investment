import './App.css';

import React from 'react';

import { Chat } from './components/Chat/Chat';


const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="App__title">Positive Investment</h1>
      <Chat></Chat>
    </div>
  );
}

export default App;
