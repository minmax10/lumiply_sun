import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelectHistory }) => {
  return (
    <div className="w-72 h-full flex-shrink-0 flex flex-col border-l border-gray-200 bg-white/70 backdrop-blur-xl relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-8 pb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">History</h2>
        <div className="bg-gray-100 p-2 rounded-full">
          <Clock size={18} className="text-gray-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center mt-20 text-gray-400 text-sm">
            <p className="font-medium">No history yet.</p>
            <p className="mt-2 text-xs opacity-70">Designs you create will appear here.</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-100"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                <img 
                  src={item.originalImage} 
                  alt="Room" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Room Design</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;