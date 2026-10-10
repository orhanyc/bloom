import { useState } from 'react';
import flowerBoyThingLogo from '@/assets/uhhhh.svg';
import './App.css';

function App() {
  return (
    <>
      <div>
        
        <a href="https://youtu.be/dQw4w9WgXcQ?si=oRwb7YJE5dNchq_T" target="_blank">
          <img src={flowerBoyThingLogo} className="flower-boy-thing" alt="Flower Boy Thing logo" />
        </a>
      </div>
      <h1>Bloom</h1>
      <div className="card">
        <button className="cont-to-blocked">
          Continue To Site
        </button>
      </div>
    </>
  );
}

export default App;
