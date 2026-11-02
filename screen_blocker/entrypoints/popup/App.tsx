import './App.css';
import { useState } from 'react';
import BlockedSites from '@/features/blocked_app/BlockedSites';
import FlowerDisplay from '@/features/flower_display/FlowerDisplay';

function App() {
  const [activeTab, setActiveTab] = useState<'blocked' | 'garden'>('blocked');

  return (
    <div className="popup">
      <nav className="popup-tabs">
        <button
          className={activeTab === 'blocked' ? 'active' : ''}
          onClick={() => setActiveTab('blocked')}
        >
          Blocked Sites
        </button>

        <button
          className={activeTab === 'garden' ? 'active' : ''}
          onClick={() => setActiveTab('garden')}
        >
          Display case
        </button>
      </nav>

      <div className="popup-content">
        {activeTab === 'blocked' ? <BlockedSites /> : <FlowerDisplay />}
      </div>
    </div>
  );
}

export default App;

