import React, { useState, useEffect } from 'react';
import { ViewMode, Page } from '../types';

interface NavigationProps {
  cartCount: number;
  toggleCart: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  cartCount, 
  toggleCart, 
  viewMode, 
  setViewMode,
  currentPage,
  onNavigate
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = !isScrolled && (currentPage === 'HOME' || currentPage === 'MENU');
  
  // If menu is open, force solid background
  const navClasses = (isTransparent && !isMenuOpen)
    ? 'bg-transparent border-transparent py-6' 
    : 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-stone-200 py-4';
    
  // If Home + Not Scrolled + Menu Closed -> White Text
  // Otherwise -> Coffee Text
  const shouldUseWhiteText = currentPage === 'HOME' && !isScrolled && !isMenuOpen;

  const textColor = shouldUseWhiteText ? 'text-white' : 'text-coffee';
  const logoAccent = shouldUseWhiteText ? 'text-white/90' : 'text-cinnamon';
  const buttonHover = shouldUseWhiteText ? 'hover:text-white/80' : 'hover:text-cinnamon';
  const badgeColors = shouldUseWhiteText ? 'bg-white text-coffee' : 'bg-cinnamon text-cream';
  
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative">
          
          {/* Left: Hamburger (Always Visible) */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 -ml-2 transition-colors ${textColor} ${buttonHover}`}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                // Close Icon (X)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon (Three Dashes)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Center: Brand */}
          <div className="flex-shrink-0 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <h1 className={`font-serif text-3xl tracking-tighter cursor-pointer transition-colors ${textColor}`} onClick={() => onNavigate('HOME')}>
              Cinnamon <span className={`italic transition-colors ${logoAccent}`}>Lane</span>
            </h1>
          </div>

          {/* Right: Cart / Order Icon */}
          <div className="flex items-center space-x-4">
            {viewMode === 'CUSTOMER' && (
              <button 
                onClick={toggleCart}
                className={`relative p-2 transition-colors group flex items-center gap-2 ${textColor} ${buttonHover}`}
              >
                <span className="sr-only">Order Now</span>
                {/* Shopping Bag Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none rounded-full transition-colors ${badgeColors}`}>
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Menu Dropdown (Absolute Positioned) */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-cream border-t border-stone-100 shadow-xl animate-in fade-in slide-in-from-top-2 z-40">
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center space-y-6">
              <button 
                onClick={() => { onNavigate('HOME'); setIsMenuOpen(false); }}
                className="text-lg tracking-[0.2em] uppercase text-coffee font-medium hover:text-cinnamon transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => { onNavigate('MENU'); setIsMenuOpen(false); }}
                className="text-lg tracking-[0.2em] uppercase text-coffee font-medium hover:text-cinnamon transition-colors"
              >
                Menu
              </button>
              <div className="w-12 h-px bg-stone-200 my-2"></div>
              <button 
                onClick={() => { setViewMode(viewMode === 'CUSTOMER' ? 'ADMIN' : 'CUSTOMER'); setIsMenuOpen(false); }}
                className="text-xs tracking-widest uppercase text-stone-400 font-medium hover:text-coffee transition-colors"
              >
                {viewMode === 'CUSTOMER' ? 'Staff Login' : 'Exit Staff Mode'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;