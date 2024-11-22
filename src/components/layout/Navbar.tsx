import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import PullDownMenu from './PullDownMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          R&D Status Tracker
        </Link>
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          Menu
          <ChevronDown className={`transform transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {isMenuOpen && (
        <PullDownMenu onClose={() => setIsMenuOpen(false)} />
      )}
    </nav>
  );
}