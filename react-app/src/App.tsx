import React from 'react';
import './App.css';
import DrawingCanvas from './canvas/DrawingCanvas';

function App() {
  return (
    <div className="App">
      <h5>Shape Drawer</h5>
      <DrawingCanvas width={600} height={300}/>
    </div>
  );
}

export default App;
