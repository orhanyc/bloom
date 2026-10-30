import React from 'react';
import './ContinueButton.css';

interface ContinueButtonProps {
  onContinue: () => void;
}

//Button that lets the user continue to the blocked site for a short time
const ContinueButton = ({ onContinue }: ContinueButtonProps) => {
  return (
    <button id="continue-button" onClick={onContinue}>
      Continue to Social Media
    </button>
  );
};

export default ContinueButton;
