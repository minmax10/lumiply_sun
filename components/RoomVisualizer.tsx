import React, { useRef, useState, useEffect } from 'react';
import { Upload, Sparkles, X, Move } from 'lucide-react';
import { GeneratedImage, PlacedProduct, Product } from '../types';
import CoverFlow from './CoverFlow';

interface RoomVisualizerProps {
  originalImage: string | null;
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  progress: number;
  onUpload: (file: File) => void;
  onGenerate: () => void;
}

const RoomVisualizer: React.FC<RoomVisualizerProps> = ({
  originalImage,
  generatedImages,
  isGenerating,
  progress,
  onUpload,
  onGenerate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [placedProducts, setPlacedProducts] = useState<PlacedProduct[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // For dragging items within the canvas
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);

  // Clear products when new image uploaded
  useEffect(() => {
    setPlacedProducts([]);
  }, [originalImage]);

  // --- File Upload Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) onUpload(e.target.files[0]);
  };
  const handleDragOverFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };
  const handleDragLeaveFile = () => setIsDraggingFile(false);
  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  // --- Product Drag & Drop Handlers ---
  const handleDropProduct = (e: React.DragEvent) => {
    e.preventDefault();
    if (!containerRef.current || !originalImage) return;

    try {
      const productData = e.dataTransfer.getData('application/json');
      if (!productData) return;
      
      const product: Product = JSON.parse(productData);
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate percentage position
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const newPlacedItem: PlacedProduct = {
        uniqueId: Math.random().toString(36).substr(2, 9),
        product,
        x,
        y
      };

      setPlacedProducts([...placedProducts, newPlacedItem]);
    } catch (err) {
      console.error("Error dropping product", err);
    }
  };

  const handleDragOverProduct = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // --- Move Placed Items Handlers ---
  const handleMouseDownItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggingItemId(id);
  };

  const handleMouseMoveItem = (e: React.MouseEvent) => {
    if (!draggingItemId || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setPlacedProducts(prev => prev.map(item => 
      item.uniqueId === draggingItemId ? { ...item, x, y } : item
    ));
  };

  const handleMouseUpItem = () => {
    setDraggingItemId(null);
  };

  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPlacedProducts(prev => prev.filter(item => item.uniqueId !== id));
  };

  // 1. Empty State (Upload)
  if (!originalImage) {
    return (
      <div className="flex-1 h-full relative flex items-center justify-center p-12 bg-[#f5f5f7]">
        <div 
          className={`
            w-full max-w-4xl aspect-video rounded-[40px] border-[3px] border-dashed 
            flex flex-col items-center justify-center transition-all duration-500 group relative overflow-hidden
            ${isDraggingFile ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-gray-300/50 bg-white/50 hover:bg-white hover:border-gray-300 hover:shadow-2xl'}
          `}
          onDragOver={handleDragOverFile}
          onDragLeave={handleDragLeaveFile}
          onDrop={handleDropFile}
        >
          <div className="relative mb-6 z-10">
            <div className="absolute inset-0 bg-blue-500 blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity rounded-full" />
            <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl shadow-gray-200 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
              <Upload size={40} className="text-gray-900" strokeWidth={1.5} />
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight z-10">Start Your Design</h3>
          <p className="text-gray-400 mb-8 text-center max-w-sm font-medium z-10">
            Drag and drop your room photo here, or click to browse.
          </p>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:scale-105 hover:bg-black transition-all shadow-xl shadow-gray-900/20 active:scale-95 z-10"
          >
            Select Photo
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
      </div>
    );
  }

  // Split view is active if we have results or are generating
  const showSplitView = generatedImages.length > 0 || isGenerating;

  return (
    <div className="flex-1 h-full relative flex flex-col overflow-hidden bg-[#f5f5f7]" onMouseUp={handleMouseUpItem} onMouseMove={handleMouseMoveItem}>
      
      {/* Header Bar */}
      <div className="w-full h-20 flex-shrink-0 flex items-center justify-between px-8 bg-white/50 backdrop-blur-xl border-b border-white/50 z-40 relative">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Lumière<span className="text-gray-400 font-normal">.Studio</span></h2>
        
        <div className="flex items-center gap-4">
          {!isGenerating && generatedImages.length <= 1 && (
            <button 
              onClick={onGenerate}
              className="group flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Sparkles size={16} className="text-yellow-300" />
              <span>Generate Lighting</span>
            </button>
          )}
          
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-all shadow-sm"
            title="Upload New Image"
          >
            <Upload size={18} />
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        
        {/* Left Pane: Canvas (Original + Products) */}
        <div 
          className={`
            relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${showSplitView ? 'w-1/2 translate-x-0' : 'w-full translate-x-0'} 
            h-full flex items-center justify-center p-8 z-10
          `}
          onDrop={handleDropProduct}
          onDragOver={handleDragOverProduct}
        >
           {/* Drop Zone Visual Cue */}
           <div className="absolute inset-4 border-2 border-dashed border-blue-400/50 rounded-3xl bg-blue-50/20 opacity-0 transition-opacity pointer-events-none data-[active=true]:opacity-100" />

           <div 
             ref={containerRef}
             className="relative max-w-full max-h-full shadow-2xl shadow-black/10 rounded-2xl overflow-hidden select-none bg-white ring-1 ring-black/5"
           >
             <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain pointer-events-none" />
             
             {/* Placed Products Layer */}
             {placedProducts.map((item) => (
               <div
                 key={item.uniqueId}
                 className="absolute cursor-move group/item z-20 hover:z-30"
                 style={{ 
                   left: `${item.x}%`, 
                   top: `${item.y}%`,
                   transform: 'translate(-50%, -50%)',
                   width: '140px' 
                 }}
                 onMouseDown={(e) => handleMouseDownItem(e, item.uniqueId)}
               >
                 <div className="relative p-2 transition-transform duration-200 active:scale-95">
                   <img 
                     src={item.product.image} 
                     alt={item.product.name} 
                     className="w-full h-full object-contain drop-shadow-xl filter mix-blend-multiply" 
                     style={{ pointerEvents: 'none' }} 
                   />
                   
                   {/* Selection Ring */}
                   <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
                   
                   <button 
                      onClick={(e) => handleRemoveItem(e, item.uniqueId)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover/item:opacity-100 transition-all scale-75 hover:scale-100 z-30"
                   >
                     <X size={12} strokeWidth={3} />
                   </button>
                 </div>
               </div>
             ))}

             {/* Guidance Tooltip */}
             {placedProducts.length === 0 && !showSplitView && (
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce-subtle">
                 <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/40 flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <Move size={14} className="text-blue-500" />
                    Drop products here
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* Right Pane: AI Results (Apple Music Style) */}
        <div className={`
            absolute top-0 right-0 h-full bg-white/80 backdrop-blur-3xl
            transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${showSplitView ? 'w-1/2 opacity-100 translate-x-0' : 'w-1/2 opacity-0 translate-x-[120%]'}
            border-l border-white/50 shadow-[-10px_0_40px_rgba(0,0,0,0.03)] z-20 flex flex-col
          `}>
             {isGenerating ? (
               <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 mb-8">
                    <svg className="animate-spin text-gray-200" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Sparkles size={24} className="text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Rendering Light</h3>
                  <p className="text-gray-400 text-sm font-medium tracking-wide">Designing atmosphere...</p>
                  
                  <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-8 overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                  </div>
               </div>
             ) : (
               <CoverFlow images={generatedImages} />
             )}
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
    </div>
  );
};

export default RoomVisualizer;