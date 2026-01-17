import React from 'react';
import { Product, BoxSize } from '../types';

interface BoxBuilderProps {
  items: Product[];
  size: BoxSize;
  onRemoveItem: (index: number) => void;
  onCompleteBox: () => void;
  onCancel: () => void;
}

const BoxBuilder: React.FC<BoxBuilderProps> = ({ items, size, onRemoveItem, onCompleteBox, onCancel }) => {
  const isFull = items.length === size;
  const currentTotal = items.reduce((sum, item) => sum + item.price, 0);

  // Helper to create empty slots
  const slots = Array.from({ length: size }).map((_, i) => items[i] || null);

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t-4 border-cinnamon shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out transform translate-y-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Info Side */}
          <div className="flex-shrink-0 text-center lg:text-left">
            <h3 className="font-serif text-xl text-coffee">Build Your Box</h3>
            <p className="text-sm text-stone-500">
              {isFull ? 'Box complete!' : `Select ${size - items.length} more items`}
            </p>
          </div>

          {/* Slots */}
          <div className="flex gap-3 overflow-x-auto pb-2 px-2 max-w-full hide-scrollbar">
            {slots.map((item, index) => (
              <div 
                key={index}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 flex items-center justify-center transition-all ${
                  item 
                    ? 'border-coffee bg-white' 
                    : 'border-dashed border-stone-300 bg-stone-50'
                }`}
              >
                {item ? (
                  <>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md opacity-80" />
                    <button 
                      onClick={() => onRemoveItem(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-sm"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="text-stone-300 text-xs font-bold">{index + 1}</span>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right mr-2 hidden md:block">
              <span className="block text-xs text-stone-400 uppercase tracking-widest">Total</span>
              <span className="block font-bold text-coffee text-lg">KES {currentTotal}</span>
            </div>
            
            <button 
              onClick={onCancel}
              className="text-stone-400 hover:text-stone-600 text-sm font-medium px-2"
            >
              Cancel
            </button>
            
            <button
              onClick={onCompleteBox}
              disabled={!isFull}
              className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all shadow-md ${
                isFull 
                  ? 'bg-cinnamon text-white hover:bg-orange-800 hover:scale-105' 
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isFull ? 'Add Box to Cart' : 'Fill Box'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoxBuilder;