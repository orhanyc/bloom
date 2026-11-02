import React from 'react';
import './ContinueButton.css';

interface ContinueButtonProps {
  onContinue: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

//Button that lets the user continue to the blocked site for a short time
const ContinueButton = ({ onContinue, children, disabled }: ContinueButtonProps) => {
  return (
    <button id="continue-button" onClick={onContinue} disabled={disabled}>
      {children ?? 'Continue to Social Media'}
    </button>
  );
};

export default ContinueButton;
