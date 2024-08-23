import React from 'react';
import { motion } from 'framer-motion';
import '../styles/VRAMResult.css';

const VRAMResult = ({ vram }) => {
  const roundedVRAM = parseFloat(vram).toFixed(3);

  return (
    <motion.div 
      className="vram-result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Estimated VRAM</h3>
      <div className="vram-value">
        <span className="vram-number">{roundedVRAM}</span>
        <span className="vram-unit">GB</span>
      </div>
      <p className="vram-description">This is the approximate amount of VRAM required for your model.</p>
    </motion.div>
  );
};

export default VRAMResult;