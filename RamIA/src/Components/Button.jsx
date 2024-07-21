export default function Button({ text, styles, handleClick }) {
    
    const handleClickAndLog = () => {
        console.log(styles);
        handleClick();
    }
    
    return (
        <button className={styles} onClick={handleClickAndLog} >
            <p className="buttonTextStyle">{text}</p>
        </button>
    )
}