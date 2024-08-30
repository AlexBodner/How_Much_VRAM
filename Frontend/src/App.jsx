import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Components/Header.jsx';
import Button from './Components/Button.jsx';
import Basic from './Components/Basic.jsx';
import ModelSummary from './Components/ModelSummary.jsx';
import Authors from './Components/Authors.jsx';
import './styles/App.css';

export default function App() {
  const [modelTypeSelected, setModelTypeSelected] = useState('none');
  const [activePage, setActivePage] = useState('home');
  const contentRef = useRef(null);

  const handleButtonClick = (type) => {
    setModelTypeSelected((currentType) => currentType === type ? 'none' : type);
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setModelTypeSelected('none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (modelTypeSelected !== 'none' && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [modelTypeSelected]);

  return (
    <div className='app'>
      <Header activePage={activePage} onNavClick={handleNavClick} />
      <main className='main-content'>
        <AnimatePresence mode="wait">
          {activePage === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <section className='mainBtns' aria-labelledby="main-title">
                <div className='titleContainer'>
                  <h1 className='title'>How much VRAM do you need?</h1>
                </div>
                <Button
                  text="Simple calculation"
                  description="Specify parameter count and find out how much memory you will need. This is a less precise way that doesn't account for intermediate activations."
                  icon="🧮"
                  styles={`mainBtn basicBtn ${modelTypeSelected === 'basic' ? 'selected' : ''}`}
                  handleClick={() => handleButtonClick('basic')}
                />
                <Button
                  text="Model summary"
                  description="Input a summary of the architecture from your favorite library and get a precise estimate of the needed memory for your model."
                  icon="📝"
                  styles={`mainBtn modelSummaryBtn ${modelTypeSelected === 'modelSummary' ? 'selected' : ''}`}
                  handleClick={() => handleButtonClick('modelSummary')}
                />
                <Button
                  text="Build your model (Coming Soon)"
                  description="Build your model with our UI and get the code for it and its memory usage."
                  icon="🧩"
                  styles={`mainBtn buildModelBtn ${modelTypeSelected === 'buildModel' ? 'selected' : ''} disabled`}
                  handleClick={() => {}}
                />
              </section>
              <div ref={contentRef}>
                <AnimatePresence mode="wait">
                  {modelTypeSelected === 'basic' && (
                    <motion.div
                      key="basic"
                      className='contentSection'
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Basic />
                    </motion.div>
                  )}
                  {modelTypeSelected === 'modelSummary' && (
                    <motion.div
                      key="modelSummary"
                      className='contentSection'
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ModelSummary />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="authors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Authors />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="site-footer">
        <p>&copy; 2024 VRAM Calculator</p>
      </footer>
    </div>
  );
}