import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/FieldTutorial.css';

const FieldTutorial = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const currentField = document.getElementById(steps[currentStep].fieldId);
    if (currentField) {
      currentField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentField.classList.add('tutorial-focus');

      // Position the tooltip
      const fieldRect = currentField.getBoundingClientRect();
      const tooltipElement = tooltipRef.current;
      if (tooltipElement) {
        tooltipElement.style.top = `${fieldRect.top + window.scrollY}px`;
        tooltipElement.style.left = `${fieldRect.right + 10}px`;
      }
    }

    return () => {
      if (currentField) {
        currentField.classList.remove('tutorial-focus');
      }
    };
  }, [currentStep, steps]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      className="field-tutorial-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="field-tutorial-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={tooltipRef}
      >
        <h3>{steps[currentStep].title}</h3>
        <p>{steps[currentStep].content}</p>
        <div className="field-tutorial-navigation">
          {currentStep > 0 && (
            <button onClick={prevStep} className="field-tutorial-button">Previous</button>
          )}
          <button onClick={nextStep} className="field-tutorial-button">
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </motion.div>
      <button onClick={onClose} className="field-tutorial-close">×</button>
    </motion.div>
  );
};

export default FieldTutorial;