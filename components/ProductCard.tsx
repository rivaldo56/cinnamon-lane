import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getPairingSuggestion } from '../services/groqService';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isBoxMode?: boolean;
  onAddToBox?: (product: Product) => void;
  boxIsFull?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  isBoxMode = false, 
  onAddToBox,
  boxIsFull = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pairing, setPairing] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPairing = async () => {
      setLoadingAI(true);
      const suggestion = await getPairingSuggestion(product.name, product.description);
      if (isMounted) {
        setPairing(suggestion);
        setLoadingAI(false);
      }
    };
    
    // Simple intersection observer or just fetch on mount with delay to stagger
    const timeout = setTimeout(fetchPairing, Math.random() * 2000); 
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [product.name, product.description]);

  const handleAction = () => {
    if (product.stock === 0) return;
    if (isBoxMode && onAddToBox) {
      if (!boxIsFull) onAddToBox(product);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <div 
      className={`group relative flex flex-col gap-3 p-4 rounded-2xl transition-all duration-500 hover:shadow-xl ${
        isBoxMode && !boxIsFull ? 'hover:bg-cinnamon/5 ring-1 ring-cinnamon/20 bg-white' : 'hover:bg-white'
      } ${isBoxMode && boxIsFull ? 'opacity-50 grayscale' : 'opacity-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with "Peek Inside" Effect */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-200">
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src={product.hoverImage}
          alt={`${product.name} detail`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out scale-110 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Scarcity Badge */}
        {product.stock > 0 && product.stock < 5 && (
          <div className="absolute top-3 left-3 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-red-100 animate-pulse">
            Only {product.stock} left in oven
          </div>
        )}
        
        {product.stock === 0 && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
             <span className="bg-stone-800 text-white px-4 py-2 text-sm font-serif italic">Sold Out</span>
           </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-xl text-coffee">{product.name}</h3>
          <span className="font-mono text-sm text-stone-500">KES {product.price}</span>
        </div>
        
        <p className="text-sm text-stone-600 mt-2 font-light leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* AI Pairing Section - Only show in normal mode to reduce clutter in Box mode */}
        {!isBoxMode && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <p className="text-xs text-cinnamon/90 italic flex items-center gap-1 min-h-[20px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6 20.25a.75.75 0 01.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008a.75.75 0 01-.75-.75h-.008a.75.75 0 01-.75-.75v-.008a.75.75 0 01.75-.75h.008z" clipRule="evenodd" />
              </svg>
              {loadingAI ? <span className="animate-pulse">Consulting Sommelier...</span> : pairing}
            </p>
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAction}
          disabled={product.stock === 0 || (isBoxMode && boxIsFull)}
          className={`mt-4 w-full py-3 text-sm font-medium tracking-wide uppercase border transition-all duration-300 ${
            product.stock === 0 
            ? 'opacity-50 cursor-not-allowed text-stone-400 border-stone-200' 
            : isBoxMode 
              ? boxIsFull 
                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                : 'bg-white text-cinnamon border-cinnamon hover:bg-cinnamon hover:text-white'
              : 'border-coffee hover:bg-coffee hover:text-white text-coffee'
          }`}
        >
          {product.stock === 0 
            ? 'Sold Out' 
            : isBoxMode 
              ? 'Add to Box'
              : 'Add to Box'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;