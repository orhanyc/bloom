import React from 'react';
import BloomLogo from '@/assets/uhhhh.svg';
import './ScreenBlocker.css'

const ScreenBlocker = () => {
  return (
    <div id = "screen-blocker">
      <div>
        <img src={BloomLogo} alt="Bloom Logo"/>
      </div>
      <h1>Bloom Screen Blocker</h1>
    </div>
  );
};

export default ScreenBlocker;