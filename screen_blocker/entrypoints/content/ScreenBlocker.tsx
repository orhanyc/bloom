import React from 'react';
import BloomLogo from '@/assets/bloom-icon.svg';
import ContinueButton from '../../features/social_media/ContinueButton';
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
      <ContinueButton onContinue={onContinue} />
    </div>
  );
};

export default ScreenBlocker;
