import React, { useEffect, useState } from 'react';

interface HeroProps {
  onOpenBoxBuilder: () => void;
  onNavigateToMenu: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBoxBuilder, onNavigateToMenu }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll. Starts at 0.4, increases to 0.9 as we scroll 500px.
  const overlayOpacity = Math.min(0.4 + (scrollY / 800), 0.9);
  
  // Parallax translation for text (moves slightly faster/slower than scroll)
  const textTranslate = scrollY * 0.2;

  return (
    <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-20 z-0">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=60&w=1600&auto=format&fit=crop" 
          alt="Fresh Cinnamon Rolls on Wooden Table" 
          className="w-full h-full object-cover"
        />
        
        {/* Dynamic Darker Overlay for Text Readability & Scroll Transition */}
        <div 
          className="absolute inset-0 bg-deep-walnut backdrop-blur-[1px] transition-opacity duration-100 ease-out"
          style={{ opacity: overlayOpacity }}
        ></div>
        
        {/* Top Gradient for Navigation Visibility */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-deep-walnut/70 to-transparent"></div>
        
        {/* Bottom Gradient for smooth transition */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-deep-walnut/80 to-transparent"></div>
      </div>

      {/* Top Text Decoration */}
      <div 
        className="w-full text-center z-10 pt-8 animate-float"
        style={{ transform: `translateY(-${textTranslate * 0.5}px)` }}
      >
        <p className="text-cream-dark text-xs md:text-sm font-sans tracking-[0.3em] uppercase font-medium drop-shadow-md">
          Open Everyday 9am - 8pm
        </p>
      </div>

      {/* Main Center Content */}
      <div 
        className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-10 md:-mt-20"
        style={{ transform: `translateY(-${textTranslate}px)` }}
      >
        
        {/* Massive Headline */}
        <div className="relative text-center select-none">
          <h1 className="font-sans font-black text-cream text-[20vw] md:text-[18vw] leading-[0.8] tracking-tighter uppercase drop-shadow-2xl scale-y-110">
            Cinnamon Lane
          </h1>
          
          {/* Script Accent */}
          <div className="absolute top-[60%] right-[10%] md:right-[5%] transform -rotate-6 z-20 pointer-events-none">
             <span className="font-serif italic text-cinnamon-light text-4xl md:text-8xl drop-shadow-lg whitespace-nowrap">
               Freshly Baked
             </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 md:mt-16 flex flex-col md:flex-row gap-4 md:gap-6 items-center w-full justify-center px-4">
          <button 
            onClick={onNavigateToMenu}
            className="w-full md:w-auto px-10 py-4 bg-cream text-deep-walnut rounded-full font-bold text-sm tracking-widest uppercase shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300"
          >
            Order Now
          </button>
          <button 
            onClick={onOpenBoxBuilder}
            className="w-full md:w-auto px-10 py-4 border border-cream/60 text-cream bg-deep-walnut/30 backdrop-blur-md rounded-full font-bold text-sm tracking-widest uppercase hover:bg-cream hover:text-deep-walnut transition-all duration-300"
          >
            Build Custom Box
          </button>
        </div>

      </div>

      {/* Bottom Corner Info (Desktop Only) */}
      <div 
        className="absolute bottom-8 left-8 hidden md:block z-20 max-w-xs text-left"
        style={{ opacity: Math.max(0, 1 - scrollY / 300) }} // Fade out on scroll
      >
         <h4 className="text-cream font-bold text-lg mb-2 drop-shadow-md">100% Handmade & Organic</h4>
         <p className="text-cream-dark text-sm leading-relaxed font-light drop-shadow-md">
           Baked by hand with traditional techniques,<br/>from clean, natural, and organic sources.
         </p>
      </div>

      <div 
        className="absolute bottom-8 right-8 hidden md:block z-20"
        style={{ opacity: Math.max(0, 1 - scrollY / 300) }} // Fade out on scroll
      >
         <span className="text-cream/60 font-sans tracking-widest text-sm drop-shadow-md">©2024 CINNAMON LANE</span>
      </div>

    </div>
  );
};

export default Hero;