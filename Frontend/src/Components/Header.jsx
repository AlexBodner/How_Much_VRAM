import '../styles/Header.css';

export default function Header({ activePage, onNavClick }) {
  const githubUrl = "https://github.com/AlexBodner/How_Much_VRAM";

  return (
    <header className='header'>
      <div className="headerContent">
        <h1 className="headerTitle">
          How much VRAM will your AI model need?
        </h1>
        <nav className="headerNav" aria-label="Main Navigation">
          <button 
            className={`navButton ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => onNavClick('home')}
            aria-current={activePage === 'home' ? 'page' : undefined}
          >
            Home
          </button>
          <button 
            className={`navButton ${activePage === 'authors' ? 'active' : ''}`}
            onClick={() => onNavClick('authors')}
            aria-current={activePage === 'authors' ? 'page' : undefined}
          >
            Authors
          </button>
          <a 
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="navButton githubLink"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}