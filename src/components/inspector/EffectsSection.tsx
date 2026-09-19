import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import SectionContextMenu from './SectionContextMenu';
import { NodeStyleProps, EffectsConfig, AppearEffectConfig, TransitionSpring, TransitionEase } from '../../types/builder';
import { 
  ChevronDown, 
  Plus, 
  X, 
  Sparkles, 
  Search, 
  Sliders, 
  Activity, 
  MousePointer, 
  RotateCw,
  Hand,
  TrendingUp
} from 'lucide-react';

interface EffectsSectionProps {
  effectiveStyles: NodeStyleProps;
}

export default function EffectsSection({ effectiveStyles }: EffectsSectionProps) {
  const selectedNodeId = useBuilderStore((state) => state?.selectedNodeId);
  const activeBreakpoint = useBuilderStore((state) => state?.activeBreakpoint ?? 'lg');
  const updateNodeStyle = useBuilderStore((state) => state?.updateNodeStyle);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnterEffectModal, setShowEnterEffectModal] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [transitionTab, setTransitionTab] = useState<'spring' | 'ease'>('spring');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedNodeId) return null;

  const effects: EffectsConfig = effectiveStyles.effects || {};
  const appear = effects.appear;

  const handleAddEffect = (type: 'appear' | 'hover' | 'press' | 'loop') => {
    setShowAddMenu(false);
    if (type === 'appear') {
      const defaultAppear: AppearEffectConfig = {
        enabled: true,
        trigger: 'On Appear',
        preset: 'Fade In',
        enter: {
          opacity: 0,
          scale: 0.95,
          rotate: { is3d: false, val: 0, x: 0, y: 0, z: 0 },
          skew: { x: 0, y: 0 },
          offset: { x: 0, y: 20 },
          transition: {
            type: 'spring',
            spring: { basedOn: 'Time', time: 0.8, bounce: 0.2, delay: 0 },
            ease: { easeType: 'Ease In Out', bezier: '0.44, 0, 0.56, 1', time: 0.6, delay: 0 }
          }
        }
      };
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        effects: { ...effects, appear: defaultAppear }
      });
    } else if (type === 'hover') {
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        effects: { ...effects, hover: { enabled: true, scale: 1.05, opacity: 1, y: -4 } }
      });
    } else if (type === 'press') {
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        effects: { ...effects, press: { enabled: true, scale: 0.95 } }
      });
    } else if (type === 'loop') {
      updateNodeStyle(selectedNodeId, activeBreakpoint, {
        effects: { ...effects, loop: { enabled: true, type: 'pulse', duration: 2 } }
      });
    }
  };

  const handleRemoveEffect = (type: keyof EffectsConfig) => {
    const updated = { ...effects };
    delete updated[type];
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      effects: Object.keys(updated).length > 0 ? updated : null
    });
  };

  const updateAppear = (updates: Partial<AppearEffectConfig>) => {
    if (!appear) return;
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      effects: {
        ...effects,
        appear: { ...appear, ...updates }
      }
    });
  };

  const updateEnter = (updates: Partial<AppearEffectConfig['enter']>) => {
    if (!appear) return;
    updateNodeStyle(selectedNodeId, activeBreakpoint, {
      effects: {
        ...effects,
        appear: {
          ...appear,
          enter: { ...appear.enter, ...updates }
        }
      }
    });
  };

  const effectOptions = [
    { id: 'appear', label: 'Appear', icon: <Sparkles size={13} className="text-zinc-900 dark:text-white" /> },
    { id: 'hover', label: 'Hover', icon: <MousePointer size={13} className="text-zinc-900 dark:text-white" /> },
    { id: 'press', label: 'Press', icon: <Hand size={13} className="text-zinc-900 dark:text-white" /> },
    { id: 'loop', label: 'Loop', icon: <RotateCw size={13} className="text-zinc-900 dark:text-white" /> },
  ].filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="border-b border-zinc-200 dark:border-[#1E1E1E] py-2.5 px-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-white font-bold tracking-wider capitalize">Effects</span>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="p-1 rounded text-zinc-500 dark:text-[#777] hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#252525] transition-colors"
            title="Add Effect"
          >
            <Plus size={13} />
          </button>

          {showAddMenu && (
            <div className="absolute right-0 top-6 z-50 w-48 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-lg shadow-2xl py-1 text-xs">
              <div className="px-2 py-1.5 border-b border-zinc-200 dark:border-transparent hover:dark:border-[#333]">
                <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-[#111] px-2 py-1 rounded border border-zinc-200 dark:border-[#333]">
                  <Search size={11} className="text-zinc-400 dark:text-[#666]" />
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search effects..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-zinc-900 dark:text-white text-xs outline-none placeholder-zinc-400 dark:placeholder-zinc-600"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="py-1">
                {effectOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleAddEffect(opt.id as any)}
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-[#252525] text-zinc-700 dark:text-[#DDD] flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                    <Plus size={11} className="text-zinc-400 dark:text-[#666]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* APPEAR EFFECT ROW (Images 12, 13) */}
      {appear && (
        <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-[#161616] p-2.5 rounded border border-zinc-200 dark:border-[#242424] mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-zinc-900 dark:text-white" />
              <span className="text-xs font-medium text-zinc-900 dark:text-white">Appear</span>
            </div>
            <button
              onClick={() => handleRemoveEffect('appear')}
              className="p-0.5 text-zinc-400 dark:text-[#666] hover:text-red-500 transition-colors"
            >
              <X size={12} />
            </button>
          </div>

          {/* Trigger */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Trigger</span>
            <div className="relative">
              <select
                value={appear.trigger}
                onChange={(e) => updateAppear({ trigger: e.target.value as any })}
                className="appearance-none bg-white dark:bg-[#111] hover:bg-zinc-50 dark:hover:bg-[#1A1A1A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-0.5 pr-5 rounded outline-none cursor-pointer transition-colors"
              >
                <option value="On Appear">On Appear</option>
                <option value="On Scroll">On Scroll</option>
              </select>
              <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>

          {/* Preset */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-[#A0A0A0]">Preset</span>
            <div className="relative">
              <select
                value={appear.preset}
                onChange={(e) => updateAppear({ preset: e.target.value as any })}
                className="appearance-none bg-white dark:bg-[#111] hover:bg-zinc-50 dark:hover:bg-[#1A1A1A] border border-zinc-200 dark:border-transparent hover:dark:border-[#333] text-zinc-900 dark:text-white text-xs px-2 py-0.5 pr-5 rounded outline-none cursor-pointer transition-colors"
              >
                <option value="Fade In">Fade In</option>
                <option value="Scale In">Scale In</option>
                <option value="Slide In">Slide In</option>
                <option value="Custom">Custom</option>
              </select>
              <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-[#777] pointer-events-none" />
            </div>
          </div>

          {/* Enter Effect Launcher Button (Image 13) */}
          <button
            onClick={() => setShowEnterEffectModal(true)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white dark:bg-[#202020] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] text-zinc-900 dark:text-white text-xs rounded border border-zinc-200 dark:border-[#333] transition-colors mt-1"
          >
            <Sparkles size={12} className="text-zinc-900 dark:text-white" />
            <span>Enter Effect</span>
          </button>
        </div>
      )}

      {/* HOVER EFFECT ROW */}
      {effects.hover && (
        <div className="flex items-center justify-between bg-zinc-50 dark:bg-[#161616] p-2 rounded border border-zinc-200 dark:border-[#242424] mb-2 text-xs">
          <div className="flex items-center gap-2">
            <MousePointer size={12} className="text-zinc-900 dark:text-white" />
            <span className="text-zinc-900 dark:text-white">Hover Scale: {effects.hover.scale}x</span>
          </div>
          <button onClick={() => handleRemoveEffect('hover')} className="text-zinc-400 dark:text-[#666] hover:text-red-500 transition-colors">
            <X size={12} />
          </button>
        </div>
      )}

      {/* PRESS EFFECT ROW */}
      {effects.press && (
        <div className="flex items-center justify-between bg-zinc-50 dark:bg-[#161616] p-2 rounded border border-zinc-200 dark:border-[#242424] mb-2 text-xs">
          <div className="flex items-center gap-2">
            <Hand size={12} className="text-zinc-900 dark:text-white" />
            <span className="text-zinc-900 dark:text-white">Press Scale: {effects.press.scale}x</span>
          </div>
          <button onClick={() => handleRemoveEffect('press')} className="text-zinc-400 dark:text-[#666] hover:text-red-500 transition-colors">
            <X size={12} />
          </button>
        </div>
      )}

      {/* ENTER EFFECT MODAL (Image 14) */}
      {showEnterEffectModal && appear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-80 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-xl shadow-2xl p-4 flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-transparent hover:dark:border-[#333] pb-2">
              <span className="font-semibold text-zinc-900 dark:text-white">Enter Effect Configuration</span>
              <button onClick={() => setShowEnterEffectModal(false)} className="text-zinc-400 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Opacity */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-600 dark:text-[#A0A0A0]">Opacity</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={appear.enter.opacity}
                  onChange={(e) => updateEnter({ opacity: Number(e.target.value) })}
                  className="w-20 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded"
                />
                <input
                  type="number"
                  value={Math.round(appear.enter.opacity * 100)}
                  onChange={(e) => updateEnter({ opacity: Number(e.target.value) / 100 })}
                  className="w-12 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] text-zinc-900 dark:text-white text-right px-1 py-0.5 rounded outline-none"
                />
                <span className="text-zinc-400 dark:text-[#666] text-[10px]">%</span>
              </div>
            </div>

            {/* Scale */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-600 dark:text-[#A0A0A0]">Scale</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={appear.enter.scale}
                  onChange={(e) => updateEnter({ scale: Number(e.target.value) })}
                  className="w-20 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded"
                />
                <input
                  type="number"
                  step="0.05"
                  value={appear.enter.scale}
                  onChange={(e) => updateEnter({ scale: Number(e.target.value) })}
                  className="w-12 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] text-zinc-900 dark:text-white text-right px-1 py-0.5 rounded outline-none"
                />
              </div>
            </div>

            {/* Offset (X, Y) */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-600 dark:text-[#A0A0A0]">Offset X / Y</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={appear.enter.offset.x}
                  onChange={(e) => updateEnter({ offset: { ...appear.enter.offset, x: Number(e.target.value) } })}
                  className="w-12 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] text-zinc-900 dark:text-white text-center px-1 py-0.5 rounded outline-none"
                />
                <input
                  type="number"
                  value={appear.enter.offset.y}
                  onChange={(e) => updateEnter({ offset: { ...appear.enter.offset, y: Number(e.target.value) } })}
                  className="w-12 bg-zinc-50 dark:bg-[#222] border border-zinc-200 dark:border-[#222] hover:dark:border-[#333] text-zinc-900 dark:text-white text-center px-1 py-0.5 rounded outline-none"
                />
              </div>
            </div>

            {/* Transition Launcher Button */}
            <button
              onClick={() => setShowTransitionModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white font-medium rounded transition-colors mt-2"
            >
              <Sliders size={13} />
              <span>Transition Settings ({appear.enter.transition.type})</span>
            </button>
          </div>
        </div>
      )}

      {/* TRANSITION SPRING & EASE MODAL (Images 15, 16) */}
      {showTransitionModal && appear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-88 bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-xl shadow-2xl p-4 flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-transparent hover:dark:border-[#333] pb-2">
              <span className="font-semibold text-zinc-900 dark:text-white">Transition Dynamics</span>
              <button onClick={() => setShowTransitionModal(false)} className="text-zinc-400 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Tab Switcher (Spring vs Ease) */}
            <div className="flex bg-zinc-100 dark:bg-[#111] p-0.5 rounded border border-zinc-200 dark:border-[#333]">
              <button
                onClick={() => {
                  setTransitionTab('spring');
                  updateEnter({
                    transition: { ...appear.enter.transition, type: 'spring' }
                  });
                }}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  transitionTab === 'spring' ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white font-medium shadow-xs' : 'text-zinc-500 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                〰️ Spring
              </button>
              <button
                onClick={() => {
                  setTransitionTab('ease');
                  updateEnter({
                    transition: { ...appear.enter.transition, type: 'ease' }
                  });
                }}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  transitionTab === 'ease' ? 'bg-white dark:bg-[#333] text-zinc-900 dark:text-white font-medium shadow-xs' : 'text-zinc-500 dark:text-[#888] hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Ease Curve
              </button>
            </div>

            {/* SPRING TAB (Image 15) */}
            {transitionTab === 'spring' && (
              <div className="flex flex-col gap-2.5">
                {/* Interactive SVG Spring Curve */}
                <div className="w-full h-24 bg-zinc-50 dark:bg-[#111] rounded border border-zinc-200 dark:border-transparent hover:dark:border-[#333] flex items-center justify-center relative overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 200 80" className="stroke-[#0099FF] fill-none">
                    <path
                      d="M 10 70 Q 50 10 90 65 T 140 68 T 190 70"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute bottom-1 right-2 text-[9px] text-zinc-400 dark:text-[#666]">Spring Physics Simulation</span>
                </div>

                {/* Time slider */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-[#A0A0A0]">Time</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={appear.enter.transition.spring.time}
                      onChange={(e) => updateEnter({
                        transition: {
                          ...appear.enter.transition,
                          spring: { ...appear.enter.transition.spring, time: Number(e.target.value) }
                        }
                      })}
                      className="w-24 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded"
                    />
                    <span className="text-zinc-900 dark:text-white w-10 text-right">{appear.enter.transition.spring.time}s</span>
                  </div>
                </div>

                {/* Bounce slider */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-[#A0A0A0]">Bounce</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={appear.enter.transition.spring.bounce}
                      onChange={(e) => updateEnter({
                        transition: {
                          ...appear.enter.transition,
                          spring: { ...appear.enter.transition.spring, bounce: Number(e.target.value) }
                        }
                      })}
                      className="w-24 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded"
                    />
                    <span className="text-zinc-900 dark:text-white w-10 text-right">{Math.round(appear.enter.transition.spring.bounce * 100)}%</span>
                  </div>
                </div>

                {/* Delay */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-[#A0A0A0]">Delay</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={appear.enter.transition.spring.delay}
                      onChange={(e) => updateEnter({
                        transition: {
                          ...appear.enter.transition,
                          spring: { ...appear.enter.transition.spring, delay: Number(e.target.value) }
                        }
                      })}
                      className="w-24 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded"
                    />
                    <span className="text-zinc-900 dark:text-white w-10 text-right">{appear.enter.transition.spring.delay}s</span>
                  </div>
                </div>
              </div>
            )}

            {/* EASE TAB (Image 16) */}
            {transitionTab === 'ease' && (
              <div className="flex flex-col gap-2.5">
                {/* Interactive SVG Bezier Curve */}
                <div className="w-full h-24 bg-zinc-50 dark:bg-[#111] rounded border border-zinc-200 dark:border-transparent hover:dark:border-[#333] flex items-center justify-center relative overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 200 80" className="stroke-[#0099FF] fill-none">
                    <path
                      d="M 10 70 C 60 70 140 10 190 10"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute bottom-1 right-2 text-[9px] text-zinc-400 dark:text-[#666]">Cubic Bezier (0.44, 0, 0.56, 1)</span>
                </div>

                {/* Ease Type */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-[#A0A0A0]">Ease</span>
                  <select
                    value={appear.enter.transition.ease.easeType}
                    onChange={(e) => updateEnter({
                      transition: {
                        ...appear.enter.transition,
                        ease: { ...appear.enter.transition.ease, easeType: e.target.value as any }
                      }
                    })}
                    className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#333] text-zinc-900 dark:text-white px-2 py-1 rounded outline-none"
                  >
                    <option value="Ease In Out">Ease In Out</option>
                    <option value="Ease In">Ease In</option>
                    <option value="Ease Out">Ease Out</option>
                    <option value="Linear">Linear</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-[#A0A0A0]">Duration</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={appear.enter.transition.ease.time}
                      onChange={(e) => updateEnter({
                        transition: {
                          ...appear.enter.transition,
                          ease: { ...appear.enter.transition.ease, time: Number(e.target.value) }
                        }
                      })}
                      className="w-24 accent-[#0099FF] h-1.5 bg-zinc-200 dark:bg-[#252525] rounded"
                    />
                    <span className="text-zinc-900 dark:text-white w-10 text-right">{appear.enter.transition.ease.time}s</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowTransitionModal(false)}
              className="w-full py-2 bg-zinc-100 dark:bg-[#252525] hover:bg-zinc-200 dark:hover:bg-[#333] text-zinc-900 dark:text-white font-medium rounded mt-2 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
