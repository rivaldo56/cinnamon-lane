import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface MenuGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isBoxMode: boolean;
  onAddToBox: (product: Product) => void;
  itemsInBoxCount: number;
  boxLimit: number;
}

const MenuGrid: React.FC<MenuGridProps> = ({ 
  products, 
  onAddToCart, 
  isBoxMode, 
  onAddToBox, 
  itemsInBoxCount,
  boxLimit 
}) => {
  const activeProducts = products.filter(p => p.isActive);

  return (
    <div id="menu" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-500 ${isBoxMode ? 'pb-40' : ''}`}>
      <div className="text-center mb-16">
        <h3 className="font-serif text-3xl md:text-4xl text-coffee mb-4">
          {isBoxMode ? 'Curate Your Collection' : 'The Morning Harvest'}
        </h3>
        <p className="text-stone-500 max-w-lg mx-auto">
          {isBoxMode 
            ? `Select ${boxLimit - itemsInBoxCount} more pastries to complete your box.` 
            : 'Freshly pulled from the oven. Quantities update in real-time.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart}
            isBoxMode={isBoxMode}
            onAddToBox={onAddToBox}
            boxIsFull={itemsInBoxCount >= boxLimit}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;