import React, { useRef, useState, useEffect } from 'react';
import { Upload, Sparkles, X, Move, Box, Maximize2 } from 'lucide-react';
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

  // --- Product Drag & Drop Handlers (From Sidebar) ---
  const handleDropProduct = (e: React.DragEvent) => {
    e.preventDefault();
    if (!containerRef.current || !originalImage) return;

    try {
      const productData = e.dataTransfer.getData('application/json');
      if (!productData) return;
      
      const product: Product = JSON.parse(productData);
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate percentage position
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      const newPlacedItem: PlacedProduct = {
        uniqueId: Math.random().toString(36).substr(2, 9),
        product,
        x,
        y
      };

      setPlacedProducts(prev => [...prev, newPlacedItem]);
    } catch (err) {
      console.error("Error dropping product", err);
    }
  };

  const handleDragOverProduct = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // --- Move Placed Items Handlers (On Canvas) ---
  const handleMouseDownItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent default text selection
    setDraggingItemId(id);
  };

  // We attach mouse move to the whole container to prevent losing focus if moving fast
  const handleMouseMoveGlobal = (e: React.MouseEvent) => {
    if (!draggingItemId || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate new percentage based on mouse position relative to container
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setPlacedProducts(prev => prev.map(item => 
      item.uniqueId === draggingItemId ? { ...item, x, y } : item
    ));
  };

  const handleMouseUpGlobal = () => {
    setDraggingItemId(null);
  };

  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPlacedProducts(prev => prev.filter(item => item.uniqueId !== id));
  };

  // 1. Empty State (Upload)
  if (!originalImage) {
    return (
      <div className="flex-1 h-full relative flex items-center justify-center p-12 bg-[#f5f5f7] overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[100px] animate-pulse delay-700" />

        <div 
          className={`
            w-full max-w-4xl aspect-video rounded-[40px] border-[3px] border-dashed 
            flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group relative overflow-hidden backdrop-blur-xl
            ${isDraggingFile ? 'border-blue-500 bg-blue-50/50 scale-[1.01] shadow-2xl shadow-blue-500/10' : 'border-gray-300/50 bg-white/40 hover:bg-white/60 hover:border-blue-300 hover:shadow-2xl hover:shadow-gray-200/50'}
          `}
          onDragOver={handleDragOverFile}
          onDragLeave={handleDragLeaveFile}
          onDrop={handleDropFile}
        >
          <div className="relative mb-8 z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-400 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
            <div className="relative w-28 h-28 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-xl shadow-gray-200/50 flex items-center justify-center group-hover:-translate-y-4 transition-transform duration-500 border border-white">
              <Upload size={48} className="text-gray-900 opacity-80" strokeWidth={1.5} />
            </div>
          </div>
          
          <h3 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight z-10 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600">LumiPly Studio</h3>
          <p className="text-gray-500 mb-10 text-center max-w-md font-medium z-10 text-lg leading-relaxed">
            Drag and drop your room photo to begin.<br/>
            Experience your space in a new light.
          </p>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:scale-105 hover:bg-black transition-all duration-300 shadow-xl shadow-gray-900/20 active:scale-95 z-10"
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
    <div 
      className="flex-1 h-full relative flex flex-col overflow-hidden bg-[#f5f5f7]" 
      onMouseUp={handleMouseUpGlobal} 
      onMouseMove={handleMouseMoveGlobal}
      onMouseLeave={handleMouseUpGlobal}
    >
      
      {/* Header Bar */}
      <div className="w-full h-20 flex-shrink-0 flex items-center justify-between px-8 bg-white/50 backdrop-blur-xl border-b border-white/40 z-40 relative">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tighter">LumiPly</h2>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Interactive Room Visualizer</span>
        </div>
        
        <div className="flex items-center gap-4">
          {!isGenerating && generatedImages.length <= 1 && (
            <button 
              onClick={onGenerate}
              className="group flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:bg-black"
            >
              <Sparkles size={16} className="text-yellow-300 animate-pulse" />
              <span>Generate Lighting</span>
            </button>
          )}
          
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-all shadow-sm hover:rotate-90 duration-500"
            title="Upload New Image"
          >
            <Upload size={18} />
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        
        {/* Left Pane: Canvas (Original + Products) - Acts as Editor */}
        <div 
          className={`
            relative transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)]
            ${showSplitView ? 'w-1/2 translate-x-0' : 'w-full translate-x-0'} 
            h-full flex items-center justify-center p-8 z-10
          `}
          onDrop={handleDropProduct}
          onDragOver={handleDragOverProduct}
        >
           {/* Drop Zone Visual Cue */}
           <div className={`
              absolute inset-6 border-2 border-dashed border-blue-400/30 rounded-[30px] bg-blue-50/10 pointer-events-none transition-opacity duration-300
              ${placedProducts.length === 0 ? 'opacity-100' : 'opacity-0'}
           `} />

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
                   width: '160px',
                   height: '160px',
                   touchAction: 'none'
                 }}
                 onMouseDown={(e) => handleMouseDownItem(e, item.uniqueId)}
               >
                 <div className={`
                   relative w-full h-full p-2 transition-transform duration-300 active:scale-95 ease-apple
                   ${draggingItemId === item.uniqueId ? 'scale-110 opacity-90' : 'scale-100'}
                 `}>
                   {/* Product Image */}
                   <img 
                     src={item.product.image} 
                     alt={item.product.name} 
                     className="w-full h-full object-contain drop-shadow-2xl filter mix-blend-multiply transition-all duration-300" 
                     style={{ pointerEvents: 'none' }} 
                   />
                   
                   {/* Selection Indicator */}
                   <div className="absolute inset-0 border-2 border-blue-500/30 rounded-3xl opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
                   
                   {/* Handle Indicator */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover/item:opacity-100 transition-all">
                      <Move size={12} className="text-gray-500" />
                   </div>

                   {/* Remove Button */}
                   <button 
                      onClick={(e) => handleRemoveItem(e, item.uniqueId)}
                      className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full p-1.5 shadow-lg opacity-0 group-hover/item:opacity-100 transition-all scale-75 hover:scale-100 z-30 cursor-pointer border border-gray-100 hover:bg-red-50"
                   >
                     <X size={14} strokeWidth={2.5} />
                   </button>
                 </div>
               </div>
             ))}

             {/* Guidance Tooltip - Only show if empty */}
             {placedProducts.length === 0 && !showSplitView && (
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none animate-float-slow">
                 <div className="bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl border border-white flex items-center gap-3 text-gray-600 text-sm font-bold uppercase tracking-wide">
                    <Box size={16} className="text-blue-500" />
                    Drop Furniture Here
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* Right Pane: AI Results (Apple Music Style) - Viewer */}
        <div className={`
            absolute top-0 right-0 h-full bg-white/70 backdrop-blur-[40px]
            transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)]
            ${showSplitView ? 'w-1/2 opacity-100 translate-x-0' : 'w-1/2 opacity-0 translate-x-[120%]'}
            border-l border-white/50 shadow-[-20px_0_50px_rgba(0,0,0,0.03)] z-20 flex flex-col
          `}>
             {isGenerating ? (
               <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-purple-50/50 animate-pulse" />
                  
                  <div className="relative w-28 h-28 mb-8">
                    <svg className="animate-spin text-gray-200" viewBox="0 0 24 24">
                        <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Sparkles size={32} className="text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Rendering Light</h3>
                  <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">LumiPly Engine Processing</p>
                  
                  <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-10 overflow-hidden">
                    <div 
                        className="h-full bg-gray-900 transition-all duration-300 ease-out"
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