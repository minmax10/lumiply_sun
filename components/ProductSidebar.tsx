import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Plus, GripVertical, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

const ProductSidebar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.dataTransfer.setData('application/json', JSON.stringify(product));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a custom drag image that looks like the product
    const dragImg = document.createElement("img");
    dragImg.src = product.image;
    dragImg.style.width = "150px";
    dragImg.style.height = "150px";
    dragImg.style.objectFit = "contain";
    // Place off-screen to generate bitmap then remove
    dragImg.style.position = "absolute";
    dragImg.style.top = "-9999px";
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 75, 75);
    setTimeout(() => document.body.removeChild(dragImg), 0);
  };

  return (
    <div className="w-80 h-full flex-shrink-0 flex flex-col border-r border-white/20 bg-white/60 backdrop-blur-xl relative z-30 shadow-[4px_0_40px_rgba(0,0,0,0.03)] ease-apple duration-500">
      {/* Header */}
      <div className="p-8 pb-6 bg-gradient-to-b from-white/40 to-transparent sticky top-0 z-20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 drop-shadow-sm">Products</h2>
          <div className="bg-white/80 p-2.5 rounded-full shadow-sm ring-1 ring-black/5">
            <ShoppingBag size={18} className="text-gray-800" />
          </div>
        </div>
        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500/80 pl-1">IKEA Collection</p>
      </div>
      
      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-32">
        {MOCK_PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            className="group relative bg-white/40 hover:bg-white/90 rounded-[24px] p-4 cursor-grab active:cursor-grabbing transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-xl hover:shadow-blue-900/5 ring-1 ring-white/50 hover:ring-blue-500/10 hover:-translate-y-1.5 overflow-visible"
          >
            {/* Image Container - Simulated "Cutout" */}
            <div className="aspect-square w-full rounded-2xl mb-2 relative flex items-center justify-center bg-transparent transition-transform duration-500 group-hover:scale-105">
              {/* Product Background Glow on Hover */}
              <div className="absolute inset-4 bg-gradient-to-tr from-gray-200 to-white rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
              
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-500 relative z-10 drop-shadow-sm group-hover:drop-shadow-2xl"
              />
              
              {/* Floating Grip Indicator */}
              <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hover:scale-110 shadow-lg border border-white z-20">
                <GripVertical size={14} className="text-gray-600" />
              </div>
            </div>

            <div className="flex justify-between items-end px-1 relative z-10">
              <div className="flex flex-col">
                <h3 className="text-[17px] font-bold text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">{product.category}</p>
              </div>
              <span className="text-sm font-bold text-gray-900 bg-white/80 px-3 py-1.5 rounded-full shadow-sm ring-1 ring-black/5 backdrop-blur-sm group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom Fade Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7]/80 to-transparent pointer-events-none z-20" />
    </div>
  );
};

export default ProductSidebar;