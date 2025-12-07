import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Plus, GripVertical } from 'lucide-react';
import { Product } from '../types';

const ProductSidebar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.dataTransfer.setData('application/json', JSON.stringify(product));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a custom drag image that looks like the sticker
    const dragImg = document.createElement("img");
    dragImg.src = product.image;
    dragImg.style.width = "100px";
    dragImg.style.height = "100px";
    dragImg.style.objectFit = "contain";
    // Place off-screen to generate bitmap then remove
    dragImg.style.position = "absolute";
    dragImg.style.top = "-9999px";
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 50, 50);
    setTimeout(() => document.body.removeChild(dragImg), 0);
  };

  return (
    <div className="w-80 h-full flex-shrink-0 flex flex-col border-r border-white/40 bg-white/70 backdrop-blur-3xl relative z-30 shadow-[4px_0_40px_rgba(0,0,0,0.02)]">
      <div className="p-8 pb-6 bg-gradient-to-b from-white/50 to-transparent">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Lighting</h2>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mt-2">IKEA Collection</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide pb-20">
        {MOCK_PRODUCTS.map((product) => (
          <div 
            key={product.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            className="group relative bg-white/60 hover:bg-white rounded-[28px] p-5 cursor-grab active:cursor-grabbing transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] border border-transparent hover:border-blue-100 ring-1 ring-black/5 hover:ring-blue-100/50 hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="aspect-square w-full overflow-hidden rounded-2xl mb-4 relative flex items-center justify-center bg-gradient-to-br from-gray-50/50 to-white/50">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-3/4 h-3/4 object-contain mix-blend-multiply relative z-10 group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] drop-shadow-xl"
              />
              
              {/* Floating Grip Indicator */}
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm">
                <GripVertical size={14} className="text-gray-400" />
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">{product.name}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{product.category}</p>
              </div>
              <span className="text-sm font-bold text-gray-900 bg-white/80 px-2.5 py-1 rounded-lg shadow-sm ring-1 ring-black/5">{product.price}</span>
            </div>

            {/* Hover Decoration */}
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-blue-500/30 scale-75 group-hover:scale-100 pointer-events-none">
              <Plus size={16} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#f5f5f7] to-transparent pointer-events-none" />
    </div>
  );
};

export default ProductSidebar;