import '../styles/Header.css';

export default function Header({ activePage, onNavClick }) {
  return (
    <header className='header'>
      <div className="headerContent">
        <h1 className="headerTitle">How much VRAM will your model need?</h1>
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
      </div>
    </header>
  );
}