export default function Button({ text, description, icon, styles, handleClick }) {
  
    const handleClickAndLog = () => {
      console.log(styles);
      handleClick();
    };
    
    return (
      <button className={styles} onClick={handleClickAndLog}>
        <div className="buttonContent">
          <div className="icon">{icon}</div>
          <div className="textContainer">
            <p className="buttonTextStyle">{text}</p>
            <p className="buttonDescription">{description}</p>
          </div>
        </div>
      </button>
    );
  }
  