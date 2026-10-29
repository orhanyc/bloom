
import React from 'react';
import BloomLogo from '@/assets/bloom-icon.svg';
import './ScreenBlocker.css';

interface ScreenBlockerProps {
  onContinue: () => void;
}

//Creates screen blocker
const ScreenBlocker = ({ onContinue }: ScreenBlockerProps) => {
  return (
    <div id="screen-blocker">
      <div>
        <img src={BloomLogo} alt="Bloom Logo" />
      </div>
      <h1>Bloom Screen Blocker</h1>
      <button id="continue-button" onClick={onContinue}>
        Continue to Social Media
      </button>
    </div>
  );
};

export default ScreenBlocker;
