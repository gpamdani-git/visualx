import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Search, 
  ChevronDown, 
  Check, 
  Image as ImageIcon, 
  Pipette, 
  ChevronLeft, 
  Sun, 
  Moon, 
  Crop, 
  Sparkles, 
  Upload, 
  Link as LinkIcon, 
  Layers 
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { ColorToken } from '../../types/project';
import { hexToHsv, hsvToHex } from '../../utils/colorUtils';

export type FillConfig = {
  type: 'solid' | 'linear' | 'radial' | 'conic' | 'image';
  color?: string;
  stops?: {color: string; position: number}[];
  handles?: {x: number; y: number}[];
  imageSrc?: string;
  imageAlt?: string;
  imageType?: 'fill' | 'fit' | 'stretch' | 'tile';
  imagePosition?: string;
  imageResolution?: string;
  imageTilePreset?: string;
  imageTileScale?: number;
};

interface ColorPopoverProps {
  color: string;
  fillConfig?: FillConfig;
  onChange: (color: string, config?: FillConfig) => void;
  onClose: () => void;
  top?: number;
  singleOnly?: boolean;
}

const PRESET_STOCK_IMAGES = [
  { name: 'Abstract Gradient Flow', category: 'Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Modern Minimalist Architecture', category: 'Architecture', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Contemporary Warm Interior', category: 'Interior', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Deep Space Holographic Dark', category: 'Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Evergreen Pine Forest Fog', category: 'Nature', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Futuristic Cyber Neon City', category: 'Urban', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Minimal Geometric Shapes', category: 'Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&auto=format&fit=crop&q=80' },
  { name: 'Studio Portrait Lighting', category: 'People', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80' }
];

const POSITION_OPTIONS = [
  'Top Left', 'Top', 'Top Right',
  'Left', 'Center', 'Right',
  'Bottom Left', 'Bottom', 'Bottom Right'
];

export default function ColorPopover({ color, fillConfig, onChange, onClose, top, singleOnly }: ColorPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        const isTrigger = (e.target as HTMLElement)?.closest?.('[data-fill-trigger="true"]');
        if (!isTrigger) {
          onClose();
        }
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const [activeTab, setActiveTab] = useState<'solid' | 'linear' | 'radial' | 'conic' | 'image'>(() => {
    if (fillConfig?.type) return fillConfig.type;
    if (color && color.startsWith('url(')) return 'image';
    if (color && color.includes('gradient')) {
      if (color.includes('radial-gradient')) return 'radial';
      if (color.includes('conic-gradient')) return 'conic';
      return 'linear';
    }
    return 'solid';
  });
  
  // Main color state (active stop or solid color)
  const [hsv, setHsv] = useState({ h: 0, s: 0, v: 1, a: 1 });
  
  // Gradient stops
  const [stops, setStops] = useState<{color: string; position: number}[]>(fillConfig?.stops || [
    { color: '#FFFFFF', position: 0 },
    { color: 'rgba(255,255,255,0)', position: 100 }
  ]);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  
  // Image properties state
  const [imageSrc, setImageSrc] = useState<string>(() => {
    if (fillConfig?.imageSrc) return fillConfig.imageSrc;
    if (color && color.startsWith('url(')) {
      return color.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
    }
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
  });
  const [imageAlt, setImageAlt] = useState<string>(fillConfig?.imageAlt || 'Design Asset');
  const [imageResolution, setImageResolution] = useState<string>(fillConfig?.imageResolution || 'Auto');
  const [imageType, setImageType] = useState<'fill' | 'fit' | 'stretch' | 'tile'>(fillConfig?.imageType || 'fill');
  const [imagePosition, setImagePosition] = useState<string>(fillConfig?.imagePosition || 'Center');
  const [imageUrlInput, setImageUrlInput] = useState<string>(imageSrc);
  const [showPluginsDrawer, setShowPluginsDrawer] = useState<boolean>(false);
  const [stockSearchQuery, setStockSearchQuery] = useState<string>('');

  // Creation mode state for Color Tokens
  const [isCreatingStyle, setIsCreatingStyle] = useState(false);
  const [newStyleName, setNewStyleName] = useState('');
  const [styleThemeMode, setStyleThemeMode] = useState<'light'|'dark'>('light');
  const [styleTokens, setStyleTokens] = useState({ light: { h: 0, s: 0, v: 1, a: 1 }, dark: { h: 0, s: 0, v: 1, a: 1 } });

  // Input states (synced with active HSV)
  const [hexInput, setHexInput] = useState('FFFFFF');
  const [opacityInput, setOpacityInput] = useState('100%');
  
  // Search styles
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeProjectId = useProjectStore(s => s.activeProjectId);
  const projects = useProjectStore(s => s.projects);
  const addColorToken = useProjectStore(s => s.addColorToken);

  const colorTokens = React.useMemo(() => {
    return projects?.find(p => p.id === activeProjectId)?.colorTokens || [];
  }, [projects, activeProjectId]);

  // Initialize from color/fillConfig
  useEffect(() => {
    if (activeTab === 'solid') {
      if (color && (color.startsWith('#') || color.startsWith('rgba') || color.startsWith('rgb'))) {
         const parsed = hexToHsv(color.startsWith('#') ? color : '#FFFFFF');
         setHsv(parsed);
         setHexInput(color.replace('#', '').substring(0, 6));
         setOpacityInput(Math.round(parsed.a * 100) + '%');
      }
    } else if (activeTab !== 'image') {
      const stopColor = stops[activeStopIndex]?.color || '#FFFFFF';
      const parsed = hexToHsv(stopColor.startsWith('#') ? stopColor : '#FFFFFF');
      setHsv(parsed);
      setHexInput(stopColor.replace('#', '').substring(0, 6));
      setOpacityInput(Math.round(parsed.a * 100) + '%');
    }
  }, [color, activeTab, activeStopIndex, stops]);

  const activeHsv = isCreatingStyle ? (styleThemeMode === 'light' ? styleTokens.light : styleTokens.dark) : hsv;

  // Sync inputs when switching theme modes in create view
  useEffect(() => {
    if (isCreatingStyle) {
      const current = styleThemeMode === 'light' ? styleTokens.light : styleTokens.dark;
      const newHex = hsvToHex(current.h, current.s, current.v, current.a);
      setHexInput(newHex.replace('#', '').substring(0, 6).toUpperCase());
      setOpacityInput(Math.round(current.a * 100) + '%');
    }
  }, [styleThemeMode, isCreatingStyle, styleTokens]);

  const generateGradientCss = (type: string, stps: {color: string, position: number}[], hndls?: {x: number, y: number}[]) => {
    const stopsStr = stps.map(s => `${s.color} ${s.position}%`).join(', ');
    if (type === 'linear') {
      let angle = 180;
      if (hndls && hndls.length === 2) {
        const dx = hndls[1].x - hndls[0].x;
        const dy = hndls[1].y - hndls[0].y;
        angle = Math.atan2(dx, -dy) * 180 / Math.PI;
      }
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    } else if (type === 'radial') {
      return `radial-gradient(circle, ${stopsStr})`;
    } else if (type === 'conic') {
      return `conic-gradient(from 0deg, ${stopsStr})`;
    }
    return '';
  };

  const updateColor = (newHsv: { h: number, s: number, v: number, a: number }) => {
    const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v, newHsv.a);
    
    if (isCreatingStyle) {
       setStyleTokens(prev => ({ ...prev, [styleThemeMode]: newHsv }));
    } else {
       setHsv(newHsv);
       
       if (activeTab === 'solid') {
         onChange(newHex, { type: 'solid', color: newHex });
       } else if (activeTab !== 'image') {
         const newStops = [...stops];
         newStops[activeStopIndex] = { ...newStops[activeStopIndex], color: newHex };
         setStops(newStops);
         const css = generateGradientCss(activeTab, newStops, fillConfig?.handles);
         onChange(css, { type: activeTab, stops: newStops, handles: fillConfig?.handles });
       }
    }
    
    setHexInput(newHex.replace('#', '').substring(0, 6).toUpperCase());
    setOpacityInput(Math.round(newHsv.a * 100) + '%');
  };

  const updateImageSettings = (partial: {
    src?: string;
    alt?: string;
    resolution?: string;
    type?: 'fill' | 'fit' | 'stretch' | 'tile';
    position?: string;
  }) => {
    const nextSrc = partial.src !== undefined ? partial.src : imageSrc;
    const nextAlt = partial.alt !== undefined ? partial.alt : imageAlt;
    const nextRes = partial.resolution !== undefined ? partial.resolution : imageResolution;
    const nextType = partial.type !== undefined ? partial.type : imageType;
    const nextPos = partial.position !== undefined ? partial.position : imagePosition;

    if (partial.src !== undefined) {
      setImageSrc(nextSrc);
      setImageUrlInput(nextSrc);
    }
    if (partial.alt !== undefined) setImageAlt(nextAlt);
    if (partial.resolution !== undefined) setImageResolution(nextRes);
    if (partial.type !== undefined) setImageType(nextType);
    if (partial.position !== undefined) setImagePosition(nextPos);

    const cssVal = nextSrc ? `url('${nextSrc}')` : 'transparent';
    onChange(cssVal, {
      type: 'image',
      imageSrc: nextSrc,
      imageAlt: nextAlt,
      imageResolution: nextRes,
      imageType: nextType,
      imagePosition: nextPos,
    });
  };

  // Draggable logic for SV Box
  const svBoxRef = useRef<HTMLDivElement>(null);
  const handleSvMouseDown = (e: React.MouseEvent) => {
    const startHsv = activeHsv;
    const handleMove = (e: MouseEvent) => {
      if (!svBoxRef.current) return;
      const rect = svBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      updateColor({ ...startHsv, s: x, v: 1 - y });
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    handleMove(e.nativeEvent);
  };

  // Draggable logic for Hue Slider
  const hueRef = useRef<HTMLDivElement>(null);
  const handleHueMouseDown = (e: React.MouseEvent) => {
    const startHsv = activeHsv;
    const handleMove = (e: MouseEvent) => {
      if (!hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      updateColor({ ...startHsv, h: x * 360 });
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    handleMove(e.nativeEvent);
  };

  // Draggable logic for Alpha Slider
  const alphaRef = useRef<HTMLDivElement>(null);
  const handleAlphaMouseDown = (e: React.MouseEvent) => {
    const startHsv = activeHsv;
    const handleMove = (e: MouseEvent) => {
      if (!alphaRef.current) return;
      const rect = alphaRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      updateColor({ ...startHsv, a: x });
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    handleMove(e.nativeEvent);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       const reader = new FileReader();
       reader.onload = (ev) => {
          if (ev.target?.result) {
             const dataUrl = ev.target.result as string;
             updateImageSettings({ src: dataUrl });
             const toast = document.createElement('div');
             toast.className = 'fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-4 py-2 rounded-lg shadow-xl border border-[#333] text-xs z-[9999] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5';
             toast.innerHTML = `<div class="w-4 h-4 bg-zinc-100 dark:bg-zinc-9000 rounded-full flex items-center justify-center text-[10px] mr-1">✓</div> <span><b>${file.name}</b> loaded.</span>`;
             document.body.appendChild(toast);
             setTimeout(() => toast.remove(), 3000);
          }
       };
       reader.readAsDataURL(file);
    }
  };

  const handleCropClick = () => {
    if (imageSrc) {
      window.dispatchEvent(new CustomEvent('openImageCrop', { detail: { src: imageSrc } }));
    }
  };

  const filteredTokens = colorTokens.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleTabChange = (t: 'solid' | 'linear' | 'radial' | 'conic' | 'image') => {
    setActiveTab(t);
    if (t === 'solid') {
      const hex = hsvToHex(hsv.h, hsv.s, hsv.v, hsv.a);
      onChange(hex, { type: 'solid', color: hex });
    } else if (t === 'image') {
      const defaultImg = imageSrc || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
      if (!imageSrc) {
        setImageSrc(defaultImg);
        setImageUrlInput(defaultImg);
      }
      onChange(`url('${imageSrc || defaultImg}')`, {
        type: 'image',
        imageSrc: imageSrc || defaultImg,
        imageAlt: imageAlt || 'Design Asset',
        imageResolution,
        imageType,
        imagePosition
      });
    } else {
      let defaultHandles = [{x: 0.5, y: 0}, {x: 0.5, y: 1}];
      if (t === 'radial' || t === 'conic') {
        defaultHandles = [{x: 0.5, y: 0.5}, {x: 1, y: 0.5}];
      }
      const css = generateGradientCss(t, stops, defaultHandles);
      onChange(css, { type: t, stops, handles: defaultHandles });
    }
  };

  // SVG Icons for tabs
  const SolidIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
  
  const LinearIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="linear" x1="7" y1="2" x2="7" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor"/>
          <stop offset="1" stopColor="currentColor" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <circle cx="7" cy="7" r="5" fill="url(#linear)"/>
    </svg>
  );

  const RadialIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="radial" cx="7" cy="7" r="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor"/>
          <stop offset="1" stopColor="currentColor" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="7" cy="7" r="5" fill="url(#radial)"/>
    </svg>
  );

  const ConicIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M7 2 A 5 5 0 0 1 12 7 L 7 7 Z" fill="currentColor"/>
       <path d="M12 7 A 5 5 0 0 1 7 12 L 7 7 Z" fill="currentColor" fillOpacity="0.6"/>
       <path d="M7 12 A 5 5 0 0 1 2 7 L 7 7 Z" fill="currentColor" fillOpacity="0.3"/>
       <path d="M2 7 A 5 5 0 0 1 7 2 L 7 7 Z" fill="currentColor" fillOpacity="0.1"/>
    </svg>
  );

  const renderColorControls = () => {
    const pureHue = hsvToHex(activeHsv.h, 1, 1, 1);
    return (
      <>
        {/* SV Box */}
        <div 
          ref={svBoxRef}
          onMouseDown={handleSvMouseDown}
          className="h-[140px] rounded-lg mb-3 relative cursor-crosshair overflow-hidden border border-zinc-300 dark:border-[#222]"
          style={{ backgroundColor: pureHue }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #fff, rgba(255,255,255,0))' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, #000, rgba(0,0,0,0))' }} />
          <div 
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-[0_0_2px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${activeHsv.s * 100}%`, top: `${(1 - activeHsv.v) * 100}%` }}
          />
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-3 mb-4">
          <div 
            ref={hueRef}
            onMouseDown={handleHueMouseDown}
            className="h-3 rounded-full relative cursor-pointer border border-zinc-300 dark:border-[#222]"
            style={{ backgroundImage: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
          >
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#ccc] rounded-full shadow-sm pointer-events-none"
              style={{ left: `max(0px, min(100% - 16px, ${activeHsv.h / 360 * 100}%))` }}
            />
          </div>

          <div 
            ref={alphaRef}
            onMouseDown={handleAlphaMouseDown}
            className="h-3 rounded-full relative cursor-pointer border border-zinc-300 dark:border-[#222]"
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\'%3E%3Crect width=\'4\' height=\'4\' fill=\'%23444\'/%3E%3Crect x=\'4\' y=\'4\' width=\'4\' height=\'4\' fill=\'%23444\'/%3E%3Crect x=\'4\' width=\'4\' height=\'4\' fill=\'%23222\'/%3E%3Crect y=\'4\' width=\'4\' height=\'4\' fill=\'%23222\'/%3E%3C/svg%3E")' 
            }}
          >
            <div className="absolute inset-0 rounded-full" style={{ backgroundImage: `linear-gradient(to right, transparent, ${pureHue})` }} />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#ccc] rounded-full shadow-sm pointer-events-none"
              style={{ left: `max(0px, min(100% - 16px, ${activeHsv.a * 100}%))` }}
            />
          </div>
        </div>

        {/* Inputs */}
        <div className="flex gap-2 mb-1">
          <input 
            type="text" 
            value={hexInput}
            onChange={(e) => {
              setHexInput(e.target.value);
              if (e.target.value.length === 6) {
                const parsed = hexToHsv('#' + e.target.value);
                updateColor({...parsed, a: activeHsv.a});
              }
            }}
            className="w-[60%] bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-2 rounded-md outline-none focus:border-[#5e5ce6] font-mono transition-colors"
          />
          <input 
            type="text" 
            value={opacityInput}
            onChange={(e) => {
              setOpacityInput(e.target.value);
              const num = parseInt(e.target.value.replace('%', ''));
              if (!isNaN(num)) {
                updateColor({...activeHsv, a: Math.min(100, Math.max(0, num)) / 100});
              }
            }}
            className="w-[40%] bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-2 rounded-md outline-none focus:border-[#5e5ce6] font-mono transition-colors"
          />
        </div>
      </>
    );
  };

  const filteredStockImages = PRESET_STOCK_IMAGES.filter(img => 
    img.name.toLowerCase().includes(stockSearchQuery.toLowerCase()) || 
    img.category.toLowerCase().includes(stockSearchQuery.toLowerCase())
  );

  return (
    <div 
      ref={popoverRef}
      style={{ top: top ?? 120 }}
      className="fixed right-[288px] w-[290px] bg-white dark:bg-[#141414] border border-zinc-200 dark:border-[#222] rounded-xl shadow-2xl z-[100] p-3.5 select-none animate-in fade-in zoom-in-95 duration-100 max-h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar"
    >
      
      {/* Header Tabs */}
      {!singleOnly ? (
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#1E1E1E] pb-3 mb-3">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleTabChange('solid')}
              className={`p-1.5 rounded-md transition-colors ${activeTab === 'solid' ? 'bg-zinc-100 dark:bg-[#222] text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-[#666] hover:text-zinc-600 dark:hover:text-[#999]'}`}
              title="Solid Color"
            >
              <SolidIcon />
            </button>
            <button 
              onClick={() => handleTabChange('linear')}
              className={`p-1.5 rounded-md transition-colors ${activeTab === 'linear' ? 'bg-zinc-100 dark:bg-[#222] text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-[#666] hover:text-zinc-600 dark:hover:text-[#999]'}`}
              title="Linear Gradient"
            >
              <LinearIcon />
            </button>
            <button 
              onClick={() => handleTabChange('radial')}
              className={`p-1.5 rounded-md transition-colors ${activeTab === 'radial' ? 'bg-zinc-100 dark:bg-[#222] text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-[#666] hover:text-zinc-600 dark:hover:text-[#999]'}`}
              title="Radial Gradient"
            >
              <RadialIcon />
            </button>
            <button 
              onClick={() => handleTabChange('conic')}
              className={`p-1.5 rounded-md transition-colors ${activeTab === 'conic' ? 'bg-zinc-100 dark:bg-[#222] text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-[#666] hover:text-zinc-600 dark:hover:text-[#999]'}`}
              title="Conic Gradient"
            >
              <ConicIcon />
            </button>
            <button 
              onClick={() => handleTabChange('image')}
              className={`p-1.5 rounded-md transition-colors ${activeTab === 'image' ? 'bg-zinc-100 dark:bg-[#222] text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-[#666] hover:text-zinc-600 dark:hover:text-[#999]'}`}
              title="Image Fill"
            >
              <ImageIcon size={14} />
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:text-[#666] dark:hover:text-white p-1 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#1E1E1E] pb-2 mb-3">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Color Picker</span>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:text-[#666] dark:hover:text-white p-1 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {isCreatingStyle ? (
        /* Create New Color Style View */
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
             <button 
               onClick={() => setIsCreatingStyle(false)}
               className="text-zinc-400 hover:text-zinc-900 dark:text-[#666] dark:hover:text-white p-0.5 rounded transition-colors"
             >
                <ChevronLeft size={16} />
             </button>
             <span className="text-xs font-medium text-zinc-900 dark:text-white">Create Color Style</span>
          </div>

          <div className="flex bg-zinc-100 dark:bg-[#222] p-0.5 rounded-lg mb-3 border border-zinc-200 dark:border-transparent hover:dark:border-[#333]">
            <button 
              onClick={() => setStyleThemeMode('light')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs rounded-md font-medium transition-all ${
                styleThemeMode === 'light' 
                  ? 'bg-white dark:bg-[#2A2A2A] text-zinc-900 dark:text-white shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white'
              }`}
            >
              <Sun size={12} /> Light
            </button>
            <button 
              onClick={() => setStyleThemeMode('dark')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs rounded-md font-medium transition-all ${
                styleThemeMode === 'dark' 
                  ? 'bg-white dark:bg-[#2A2A2A] text-zinc-900 dark:text-white shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white'
              }`}
            >
              <Moon size={12} /> Dark
            </button>
          </div>

          {renderColorControls()}

          <div className="mt-3 flex flex-col gap-2">
            <input 
              type="text" 
              placeholder="Style name (e.g. Brand / Primary)" 
              value={newStyleName}
              onChange={(e) => setNewStyleName(e.target.value)}
              className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-2 rounded-md outline-none focus:border-[#5e5ce6]"
            />
            <button 
              onClick={() => {
                if (!newStyleName.trim()) return;
                const lightHex = hsvToHex(styleTokens.light.h, styleTokens.light.s, styleTokens.light.v, styleTokens.light.a);
                const darkHex = hsvToHex(styleTokens.dark.h, styleTokens.dark.s, styleTokens.dark.v, styleTokens.dark.a);
                addColorToken({
                  name: newStyleName.trim(),
                  lightValue: lightHex,
                  darkValue: darkHex
                });
                setIsCreatingStyle(false);
              }}
              className="w-full py-2 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white text-xs font-medium rounded-md transition-colors"
            >
              Save Style
            </button>
          </div>
        </div>
      ) : (
        /* Main Normal Popover View */
        <>
          {activeTab !== 'solid' && activeTab !== 'image' && (
            /* Gradient Stops Bar */
            <div className="relative h-6 bg-zinc-100 dark:bg-[#222] rounded-lg mb-3 border border-zinc-200 dark:border-transparent hover:dark:border-[#333] p-1 flex items-center">
              <div 
                className="absolute inset-1 rounded"
                style={{ backgroundImage: generateGradientCss('linear', stops) }}
              />
              {stops.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveStopIndex(idx)}
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer shadow-md -translate-x-1/2 transition-transform ${activeStopIndex === idx ? 'border-zinc-300 dark:border-zinc-600 scale-125 z-10' : 'border-white'}`}
                  style={{ left: `${s.position}%`, backgroundColor: s.color }}
                />
              ))}
            </div>
          )}

          <div>
            {activeTab !== 'image' && (
              <>
                {renderColorControls()}

                {/* Color Styles Section */}
                <div className="border-t border-zinc-200 dark:border-[#222] pt-3 mt-3">
                  <div className="relative mb-2">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#666]" />
                    <input 
                      type="text" 
                      placeholder="Search color styles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs pl-7 pr-2 py-1.5 rounded-md outline-none placeholder-zinc-400 dark:placeholder-zinc-600"
                    />
                  </div>

                  <div className="max-h-24 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredTokens.map(token => (
                      <button
                        key={token.id}
                        onClick={() => {
                          onChange(`var(--project-color-${token.id})`, { type: 'solid', color: token.lightValue });
                        }}
                        className="w-full flex items-center justify-between p-1.5 hover:bg-zinc-100 dark:hover:bg-[#1A1A1A] rounded-md group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: token.lightValue }} />
                          <span className="text-xs text-zinc-700 dark:text-[#CCC]">{token.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-[#666] font-mono">{token.lightValue}</span>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setStyleTokens({ light: hsv, dark: hsv });
                      setIsCreatingStyle(true);
                    }}
                    className="w-full mt-2 py-1.5 bg-zinc-100 dark:bg-[#222] hover:bg-zinc-200 dark:hover:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-800 dark:text-[#AAA] hover:text-zinc-900 dark:hover:text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    + New Style
                  </button>
                </div>
              </>
            )}

            {activeTab === 'image' && (
              <div className="flex flex-col">
                {/* Image Preview Canvas Card */}
                <div className="h-32 bg-zinc-100 dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded-lg mb-3 flex items-center justify-center relative overflow-hidden group">
                  {imageSrc ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105 duration-300" 
                      style={{ backgroundImage: `url('${imageSrc}')` }} 
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" />
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative z-10 px-3 py-1.5 bg-white/90 dark:bg-[#2A2A2A]/90 hover:bg-white dark:hover:bg-[#333] backdrop-blur-xs border border-zinc-300 dark:border-[#444] text-zinc-900 dark:text-white text-xs font-medium rounded-lg shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
                  >
                    <Upload size={12} /> Choose Image...
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                {/* Direct Image URL input */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-600 dark:text-[#A0A0A0] flex items-center gap-1">
                      <LinkIcon size={10} /> Image URL
                    </span>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={imageUrlInput}
                      onChange={(e) => {
                        setImageUrlInput(e.target.value);
                        updateImageSettings({ src: e.target.value });
                      }}
                      placeholder="https://..." 
                      className="w-full bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2.5 py-1.5 rounded-md outline-none focus:border-zinc-400 dark:focus:border-zinc-500 placeholder-zinc-400 dark:placeholder-zinc-600 truncate font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 mb-3">
                  {/* Resolution */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Resolution</span>
                    <div className="relative w-32">
                      <select 
                        value={imageResolution}
                        onChange={(e) => updateImageSettings({ resolution: e.target.value })}
                        className="w-full appearance-none bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-1.5 rounded-md outline-none cursor-pointer"
                      >
                        <option value="Auto">Auto</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#888] pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Type / Fit */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Type</span>
                    <div className="relative w-32">
                      <select 
                        value={imageType}
                        onChange={(e) => updateImageSettings({ type: e.target.value as any })}
                        className="w-full appearance-none bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-1.5 rounded-md outline-none cursor-pointer"
                      >
                        <option value="fill">Fill (Cover)</option>
                        <option value="fit">Fit (Contain)</option>
                        <option value="stretch">Stretch</option>
                        <option value="tile">Tile</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#888] pointer-events-none" />
                    </div>
                  </div>

                  {/* Position selector with 9-dot grid and dropdown */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Position</span>
                    <div className="relative w-32 flex items-center bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] rounded-md overflow-hidden pl-1.5">
                      {/* 9-dot grid visualizer */}
                      <div className="w-3.5 h-3.5 grid grid-cols-3 grid-rows-3 gap-[1px] opacity-80 shrink-0">
                        {POSITION_OPTIONS.map((pos) => {
                          const isSelected = imagePosition.toLowerCase() === pos.toLowerCase();
                          return (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => updateImageSettings({ position: pos })}
                              className={`rounded-[0.5px] transition-colors ${
                                isSelected 
                                  ? 'bg-[#0099FF] scale-125 z-10' 
                                  : 'bg-zinc-400 dark:bg-[#666] hover:bg-zinc-600'
                              }`}
                              title={pos}
                            />
                          );
                        })}
                      </div>

                      <select 
                        value={imagePosition}
                        onChange={(e) => updateImageSettings({ position: e.target.value })}
                        className="w-full appearance-none bg-transparent border-none text-zinc-900 dark:text-white text-xs px-2 py-1.5 outline-none cursor-pointer"
                      >
                        {POSITION_OPTIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#888] pointer-events-none" />
                    </div>
                  </div>

                  {/* Alt Text (Image Description) */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Alt Text</span>
                    <input 
                      type="text" 
                      value={imageAlt}
                      onChange={(e) => updateImageSettings({ alt: e.target.value })}
                      placeholder="Describe Image..." 
                      className="w-32 bg-white dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-1.5 rounded-md outline-none focus:border-zinc-400 dark:focus:border-zinc-500 placeholder-zinc-400 dark:placeholder-zinc-600 truncate"
                    />
                  </div>
                </div>

                {/* Actions: Crop & Plugins (Unsplash) */}
                <div className="flex gap-2">
                  <button 
                    onClick={handleCropClick}
                    className="flex-1 py-1.5 bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Crop size={12} /> Crop
                  </button>
                  <button 
                    onClick={() => setShowPluginsDrawer(!showPluginsDrawer)}
                    className={`flex-1 py-1.5 border text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                      showPluginsDrawer 
                        ? 'bg-[#0099FF] border-[#0099FF] text-white' 
                        : 'bg-white dark:bg-[#222] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white'
                    }`}
                  >
                    <Sparkles size={12} /> Stock Photos
                  </button>
                </div>

                {/* Plugins / Unsplash Drawer */}
                {showPluginsDrawer && (
                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-transparent hover:dark:border-[#333] animate-in fade-in slide-in-from-top-2">
                    <div className="relative mb-2">
                      <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input 
                        type="text" 
                        placeholder="Search stock images..." 
                        value={stockSearchQuery}
                        onChange={(e) => setStockSearchQuery(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs pl-7 pr-2 py-1 rounded-md outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredStockImages.map((stock, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            updateImageSettings({ src: stock.url, alt: stock.name });
                          }}
                          className="group relative h-14 rounded-md overflow-hidden border border-zinc-200 dark:border-transparent hover:dark:border-[#333] hover:border-[#0099FF] transition-all"
                        >
                          <img src={stock.url} alt={stock.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-1">
                            <span className="text-[10px] text-white font-medium truncate">{stock.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
