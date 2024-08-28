import { motion } from 'framer-motion';

export default function Button({ text, description, icon, styles, handleClick }) {
  return (
    <motion.button
      className={styles}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <div className="buttonContent">
        <div className="icon">{icon}</div>
        <div className="textContainer">
          <p className="buttonTextStyle">{text}</p>
          <p className="buttonDescription">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}