import React, { useState, useEffect } from 'react';
import ProductSidebar from './components/ProductSidebar';
import HistorySidebar from './components/HistorySidebar';
import RoomVisualizer from './components/RoomVisualizer';
import { HistoryItem, GeneratedImage, LightingColor } from './types';
import { COLORS_TO_GENERATE } from './constants';
import { fileToGenerativePart, generateRoomLighting } from './services/geminiService';

const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle File Upload
  const handleUpload = async (file: File) => {
    try {
      // Clear current session
      setGeneratedImages([]);
      
      // Convert to Base64 for display and API
      const base64 = await fileToGenerativePart(file);
      const fullBase64 = `data:image/jpeg;base64,${base64}`; 
      
      setOriginalImage(fullBase64);
      
    } catch (error) {
      console.error("File reading error:", error);
      alert("Failed to read file.");
    }
  };

  // Handle Generation Process
  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setProgress(0);

    // Prepare Original Image Object for the CoverFlow (Index 0)
    // We add the original as the first item so the user sees "Normal" state too
    const originalObj: GeneratedImage = {
        id: generateId(),
        url: originalImage,
        color: LightingColor.ORIGINAL,
        timestamp: Date.now()
    };
    
    // Start with Original
    let currentResults: GeneratedImage[] = [originalObj];
    
    const rawBase64 = originalImage.split(',')[1];
    const colors = COLORS_TO_GENERATE; // Now includes Red, Orange, Yellow, Green, Blue, Purple
    
    const totalSteps = colors.length;
    let completedSteps = 0;

    // Process sequentially to update UI progressively
    for (const color of colors) {
      const generatedData = await generateRoomLighting(rawBase64, color);
      
      if (generatedData) {
        const newImage = {
          id: generateId(),
          url: `data:image/jpeg;base64,${generatedData}`,
          color: color,
          timestamp: Date.now()
        };
        currentResults = [...currentResults, newImage];
      }
      
      completedSteps++;
      setProgress((completedSteps / totalSteps) * 100);
    }

    setGeneratedImages(currentResults);
    
    // Save to History
    const newHistoryItem: HistoryItem = {
      id: generateId(),
      originalImage: originalImage,
      generatedVariants: currentResults,
      date: new Date().toISOString()
    };
    
    setHistory(prev => [newHistoryItem, ...prev]);
    setIsGenerating(false);
  };

  // Handle History Selection
  const handleSelectHistory = (item: HistoryItem) => {
    setOriginalImage(item.originalImage);
    setGeneratedImages(item.generatedVariants);
  };

  return (
    <div className="flex h-screen w-screen bg-[#f5f5f7] text-gray-900 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-hidden">
      {/* Background Gradient Mesh - Dynamic & Subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[1000px] h-[1000px] bg-blue-100/50 blur-[150px] rounded-full mix-blend-multiply animate-float-slow"></div>
        <div className="absolute bottom-[-30%] right-[-20%] w-[1000px] h-[1000px] bg-purple-100/50 blur-[150px] rounded-full mix-blend-multiply animate-float-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-pink-100/30 blur-[150px] rounded-full mix-blend-multiply animate-float-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Left Panel: Products */}
      <ProductSidebar />

      {/* Center Panel: Visualizer */}
      <RoomVisualizer 
        originalImage={originalImage}
        generatedImages={generatedImages}
        isGenerating={isGenerating}
        progress={progress}
        onUpload={handleUpload}
        onGenerate={handleGenerate}
      />

      {/* Right Panel: History */}
      <HistorySidebar 
        history={history} 
        onSelectHistory={handleSelectHistory}
      />
      
      {/* API Key Warning */}
      {!process.env.API_KEY && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 text-red-500 px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl text-sm font-bold border border-red-100 z-50 flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          Setup Required: Add your API_KEY to environment variables.
        </div>
      )}
    </div>
  );
};

export default App;