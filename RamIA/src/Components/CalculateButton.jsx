import React from 'react';
import { motion } from 'framer-motion';
import '../styles/CalculateButton.css';

const CalculateButton = ({ onClick }) => {
  return (
    <motion.button
      className="calculate-button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span className="button-text">Calculate VRAM</span>
      <motion.span
        className="button-icon"
        initial={{ x: -5 }}
        animate={{ x: 5 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.6 }}
      >
        →
      </motion.span>
    </motion.button>
  );
};

export default CalculateButton;