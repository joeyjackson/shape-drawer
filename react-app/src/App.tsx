import React from 'react';
import './App.css';
import DrawingCanvas from './canvas/DrawingCanvas';

export const REACT_APP_BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

function App() {
  return (
    <div className="App">
      <h4>Shape Drawer</h4>
      <p><b>Instructions:</b> Click and drag to draw or click to place vertices of the shape. Press ESC or click off the canvas to cancel the current shape. Pressing ENTER or closing the shape will finish it. Press the Change Color button to cycle through colors. Drawings can be saved and loaded by name using the controls below the canvas.</p>
      <DrawingCanvas />
    </div>
  );
}

export default App;
