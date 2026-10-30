import React from 'react';
import './ContinueButton.css';

interface ContinueButtonProps {
  onContinue: () => void;
}

const ContinueButton = ({ onContinue }: ContinueButtonProps) => {
  return (
    <button id="continue-button" onClick={onContinue}>
      Continue to Social Media
    </button>
  );
};

export default ContinueButton;
