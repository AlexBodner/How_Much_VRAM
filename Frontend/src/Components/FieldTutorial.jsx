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
        const viewportHeight = window.innerHeight;
        const tooltipHeight = tooltipElement.offsetHeight;
        let topPosition = fieldRect.bottom + window.scrollY + 10;

        // Check if tooltip would go off-screen
        if (topPosition + tooltipHeight > viewportHeight + window.scrollY) {
          topPosition = fieldRect.top + window.scrollY - tooltipHeight - 10;
        }

        tooltipElement.style.top = `${topPosition}px`;
        tooltipElement.style.left = '50%';
        tooltipElement.style.transform = 'translateX(-50%)';
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
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
      <button onClick={onClose} className="field-tutorial-close" aria-label="Close tutorial">×</button>
    </motion.div>
  );
};

export default FieldTutorial;