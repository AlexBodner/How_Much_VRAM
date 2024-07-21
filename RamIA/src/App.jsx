import './styles/App.css';
import Header from './Components/Header.jsx';
import Button from './Components/Button.jsx';
import { useState } from 'react';
import Basic from './Components/Basic.jsx';


function App() {
  const [modelTypeSelected, setModelTypeSelected] = useState('none');

  const handleButtonClick = (type) => {
    setModelTypeSelected(currentType => {
      if (currentType === type) {
        return 'none';
      } else {
        return type;
      }
    });
  };

  return (
    <main className='app'>
      <Header />
      <section className='mainBtns'>
        <div className='titleContainer'>
          <h2 className='title'>How much VRam do you need?</h2>
        </div>
        <Button
          text={"BASIC CALCULATION"}
          styles={`mainBtn basicBtn 
            ${modelTypeSelected === 'basic' ? 'move-diagonal-right' : ''} 
            ${modelTypeSelected === 'custom' ? 'non-opacity' : ''}`}
          handleClick={() => handleButtonClick('basic')}
        />
        {modelTypeSelected === 'none' && <div className='or'>OR</div>}
        <Button
          text={"CUSTOMIZE YOUR MODEL"}
          styles={`mainBtn customBtn 
            ${modelTypeSelected === 'custom' ? 'move-diagonal-left' : ''} 
            ${modelTypeSelected === 'basic' ? 'non-opacity' : ''}`}
          handleClick={() => handleButtonClick('custom')}
        />
      </section>

      {modelTypeSelected === 'basic' && 
      <div className='basicForm'>
        <Basic/>
      </div>
      }
    </main>
  );
}

export default App;
