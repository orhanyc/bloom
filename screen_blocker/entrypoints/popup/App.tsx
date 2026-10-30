import './App.css';
import { useState } from 'react';
import BlockedSites from '@/features/blocked_app/BlockedSites';
import FlowerDisplay from '@/features/flower_display/FlowerDisplay';

function App() {
  const [activeTab, setActiveTab] = useState<'blocked' | 'garden'>('blocked');

  return (
    <div>
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

      {activeTab === 'blocked' ? <BlockedSites /> : <FlowerDisplay />}
    </div>
  );
}

export default App;

