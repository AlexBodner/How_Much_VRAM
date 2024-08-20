import './styles/App.css';
import Header from './Components/Header.jsx';
import Button from './Components/Button.jsx';
import { useState } from 'react';
import Basic from './Components/Basic.jsx';
import ModelSummary from './Components/ModelSummary.jsx';

function App() {
  const [modelTypeSelected, setModelTypeSelected] = useState('none');

  const handleButtonClick = (type) => {
    setModelTypeSelected((currentType) => {
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
          <h2 className='title'>How much VRAM do you need?</h2>
        </div>
        <Button
          text={"Simple calculation"}
          description={"Specify parameter count and find out how much memory you will need. This is a less precise way that doesn't account for intermediate activations."}
          icon={"🧮"} // Replace with actual icon image

          styles={`mainBtn basicBtn 
            ${modelTypeSelected === 'basic' ? 'move-diagonal-right' : ''} 
            ${modelTypeSelected === 'custom' || modelTypeSelected === 'build' ? 'non-opacity' : ''}`}
          handleClick={() => handleButtonClick('basic')}
        />
               <Button
          text={"Model summary"}
          description={"Input a summary of the architecture from your favorite library and get a precise estimate of the needed memory for your model."}
          icon={"📑"} // Replace with actual icon image
          styles={`mainBtn modelSummaryBtn ${modelTypeSelected === 'modelSummary' ? 'selected' : ''}`}
          handleClick={() => handleButtonClick('modelSummary')}
        />
        <Button
          text={"Build your model"}
          description={"Build your model with our UI and get the code for it and its memory usage."}
          icon={"🧩"} // Replace with actual icon image
          styles={`mainBtn buildModelBtn ${modelTypeSelected === 'buildModel' ? 'selected' : ''}`}
          handleClick={() => handleButtonClick('buildModel')}
        />
      </section>

      {modelTypeSelected === 'basic' && (
        <div className='basicForm'>
          <Basic />
        </div>
      )}
       {modelTypeSelected === 'modelSummary' && (
        <div className='modelSummaryForm'>
          <ModelSummary />
        </div>
      )}
    </main>
  );
}

export default App;
