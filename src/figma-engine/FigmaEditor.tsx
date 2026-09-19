import React from 'react';
import { SidebarLayers } from './SidebarLayers';
import { Canvas } from './Canvas';
import { ArrowLeft } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

export default function FigmaEditor() {
  const setViewMode = useProjectStore((state) => state?.setViewMode);
  
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden font-sans bg-white text-black">
      {/* Mini Topbar */}
      <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('dashboard')}
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm">Absolute Positioning Engine (Figma Prototype)</span>
        </div>
        <div className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium border border-blue-100">
          60FPS Drag & Reparenting Enabled
        </div>
      </div>
      
      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarLayers />
        <Canvas />
      </div>
    </div>
  );
}
