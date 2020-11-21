import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {process.env.REACT_APP_CLIENT_ID}|| {process.env.REACT_APP_USER_POOL_ID}
    </div>
  );
}

export default App;
