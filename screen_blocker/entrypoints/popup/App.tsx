import { useState } from 'react';
import flowerBoyThingLogo from '@/assets/uhhhh.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        
        <a href="https://youtu.be/dQw4w9WgXcQ?si=oRwb7YJE5dNchq_T" target="_blank">
          <img src={flowerBoyThingLogo} className="flower-boy-thing" alt="Flower Boy Thing logo" />
        </a>
      </div>
      <h1>Bloom</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          ball count is {count}
        </button>
        <button onClick={() => setCount(0)}>Reset</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the balls logos to learn more
      </p>
    </>
  );
}

export default App;
