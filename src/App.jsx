import React from 'react';
import ChatWindow from './components/ChatWindow';
import Header from './components/Header';
import './styles/chat.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <ChatWindow />
    </div>
  );
}

export default App;
