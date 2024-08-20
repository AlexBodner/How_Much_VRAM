import '../styles/Header.css';

export default function Header({ activePage, onNavClick }) {
  return (
    <header className='header'>
      <p className="headerTitle">How much VRam?</p>
      <nav className="headerNav">
        <button 
          className={`navButton ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => onNavClick('home')}
        >
          Home
        </button>
        <button 
          className={`navButton ${activePage === 'authors' ? 'active' : ''}`}
          onClick={() => onNavClick('authors')}
        >
          Authors
        </button>
      </nav>
    </header>
  );
}