import React, { useState, useRef, useEffect } from 'react';
import { useStore } from 'zustand';
import { useProjectStore } from '../store/projectStore';
import { useBuilderStore } from '../store/builderStore';
import { ArrowLeft, Send, Sparkles, Code, Layout, MousePointer2, Paperclip, X, FileText, Terminal, ChevronDown, Settings, Square, Brain, Undo2, Plus, ArrowUp, Mic, Command } from 'lucide-react';
import { AiProgressDisplay, Action } from './AiProgressDisplay';


export default function VibeMode() {
  const setViewMode = useProjectStore((state) => state?.setViewMode);
  const nodes = useBuilderStore((state) => state?.nodes) || {};
  const rootNodeId = useBuilderStore((state) => state?.rootNodeId);
  const setIsAiGenerating = useBuilderStore((state) => state?.setIsAiGenerating);
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string; attachments?: {name: string, content: string}[]; hasAppliedActions?: boolean; isAction?: boolean }[]>([]);
  const undo = useStore(useBuilderStore.temporal as any, (state: any) => state?.undo);
  const pastStatesLength = useStore(useBuilderStore.temporal as any, (state: any) => state?.pastStates?.length ?? 0);
  const canUndo = pastStatesLength > 0;
  const [input, setInput] = useState('');
  const [actions, setActions] = useState<Action[]>([]);
  const [currentTask, setCurrentTask] = useState<string>('Thinking...');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [inspectMode, setInspectMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('vibe');
  const [customAgents, setCustomAgents] = useState<{id: string, name: string, prompt: string}[]>([]);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [openRouterKeyInput, setOpenRouterKeyInput] = useState('');
  const [openRouterModelInput, setOpenRouterModelInput] = useState('anthropic/claude-3.5-sonnet');
  const [openRouterModels, setOpenRouterModels] = useState<{id: string, name: string}[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  
  useEffect(() => {
    const key = localStorage.getItem('openrouter_api_key');
    if (key) setOpenRouterKeyInput(key);
    const model = localStorage.getItem('openrouter_model');
    if (model) setOpenRouterModelInput(model);
  }, []);
  
  useEffect(() => {
    const saved = localStorage.getItem('custom_agents');
    if (saved) {
      try {
        setCustomAgents(JSON.parse(saved));
      } catch(e){}
    }
  }, []);
  
  useEffect(() => {
    if (showSettings && openRouterModels.length === 0) {
      setIsLoadingModels(true);
      fetch('/api/openrouter/models')
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            const models = data.data.map((m: any) => ({ id: m.id, name: m.name }));
            // Optional: sort alphabetically by name
            models.sort((a: any, b: any) => a.name.localeCompare(b.name));
            setOpenRouterModels(models);
          }
        })
        .catch(err => console.error('Failed to fetch OpenRouter models:', err))
        .finally(() => setIsLoadingModels(false));
    }
  }, [showSettings, openRouterModels.length]);

  const saveCustomAgent = () => {
    if(!newAgentName.trim() || !newAgentPrompt.trim()) return;
    const newAgent = { id: 'custom_' + Date.now(), name: newAgentName, prompt: newAgentPrompt };
    const updated = [...customAgents, newAgent];
    setCustomAgents(updated);
    localStorage.setItem('custom_agents', JSON.stringify(updated));
    setSelectedAgent(newAgent.id);
    setShowAddAgent(false);
    setNewAgentName('');
    setNewAgentPrompt('');
  };
  const selectedElementId = useBuilderStore((state) => state?.selectedNodeId);
  const setSelectedElementId = useBuilderStore((state) => state?.selectNode);
  const [attachedFiles, setAttachedFiles] = useState<{name: string, content: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

    const stopGenerating = () => {
    if (abortControllerRef.current) {
       abortControllerRef.current.abort();
       abortControllerRef.current = null;
       setIsGenerating(false);
       setIsTyping(false);
       setIsAiGenerating(false);
    }
  };

  const handleSend = async () => {
    if (isGenerating) return;
    if (!input.trim() && attachedFiles.length === 0) return;
    
    const userMessage = input;
    const currentFiles = [...attachedFiles];
    setInput('');
    setAttachedFiles([]);
    
    let textWithAttachments = userMessage;
    if (currentFiles.length > 0) {
      textWithAttachments += '\n\n[Attachments]:\n' + currentFiles.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n');
    }
    
    setMessages(prev => [...prev, { role: 'user', text: userMessage, attachments: currentFiles }]);
    setIsTyping(true);
    setIsAiGenerating(true);

    let context = '';
    if (selectedElementId && nodes[selectedElementId]) {
       context = `[Selected Element Context]: The user clicked on element with ID "${selectedElementId}", Type "${nodes[selectedElementId].type}", Name "${nodes[selectedElementId].name}". Target your modifications to this element.\n\n`;
    }

    try {
      abortControllerRef.current = new AbortController();
      setIsGenerating(true);
      const customAgentMatch = customAgents.find(a => a.id === selectedAgent);
      let systemInstruction = '';
      
      if (customAgentMatch) {
         systemInstruction = customAgentMatch.prompt;
      } else if (selectedAgent === 'opencode') {
         systemInstruction = `Anda adalah "OpenCode AI", seorang Software Engineer Senior, Arsitek Sistem, dan pakar React/TypeScript.
Tugas Utama Anda:
1. Membantu user membangun logika aplikasi yang kompleks, algoritma efisien, dan komponen fungsional yang robust.
2. Fokus pada arsitektur kode, integrasi API, state management (Zustand), dan clean code principles.
3. Jika user meminta perubahan UI/layout, WAJIB berikan output JSON dengan format actions array (bukan replace seluruh nodes): \`\`\`json { "actions": [{ "type": "ADD_NODE", "id": "...", "parentId": "...", "node": {...} }] } \`\`\`.

Aturan Interaksi:
- Berikan analisis singkat atau rencana teknis sebelum menulis kode.
- Fokus pada fungsionalitas dan reusability kode.
- Jika ada konteks "Selected Element", fokuslah pada elemen tersebut.`;
      } else {
         systemInstruction = `Anda adalah "AI Agent Website Designer Profesional" untuk Visual Editor Drag-and-Drop berbasis React, Vite, dan TailwindCSS.

Tugas Utama Anda:
1. Anda memegang kendali atas struktur Abstract Syntax Tree (AST) dari kanvas user.
2. Anda akan diberikan status [CURRENT CANVAS STATE] untuk membaca elemen desain yang ada di layar user.
3. JANGAN PERNAH menampilkan blok kode React/Tailwind mentah. Jelaskan saja apa yang Anda kerjakan atau ubah dalam bahasa santai dan singkat.
4. Anda HANYA diperbolehkan mengubah AST melalui instruksi JSON actions array. JANGAN PERNAH me-replace seluruh nodes/rootNodeId kecuali diminta.
Gunakan format "actions" array di bagian paling akhir pesan Anda:

\`\`\`json
{
  "actions": [
    {
      "type": "ADD_NODE",
      "id": "new-uuid-1",
      "parentId": "target-parent-id",
      "node": {
        "id": "new-uuid-1",
        "type": "Frame",
        "name": "Navbar",
        "parentId": "target-parent-id",
        "childrenIds": ["text-logo-1", "btn-1"],
        "props": {},
        "responsiveStyles": { "base": { "display": "flex", "flexDirection": "row", "justifyContent": "space-between", "padding": { "top": 16, "right": 32, "bottom": 16, "left": 32 }, "backgroundColor": "#ffffff" } }
      }
    },
    {
      "type": "ADD_NODE",
      "id": "text-logo-1",
      "parentId": "new-uuid-1",
      "node": {
         "id": "text-logo-1",
         "type": "Text",
         "name": "Logo",
         "parentId": "new-uuid-1",
         "childrenIds": [],
         "props": { "text": "MyLogo" },
         "responsiveStyles": { "base": { "fontSize": 24, "fontWeight": "bold", "color": "#000000" } }
      }
    },
    {
      "type": "UPDATE_NODE",
      "id": "existing-node-id",
      "updates": {
        "props": { "text": "Teks Baru" }
      }
    }
  ]
}
\`\`\`

Aturan Interaksi (Sangat Penting):
- Gunakan type: "Frame" atau "Stack" untuk container. "Text", "Button", "Image", "Video", "Masonry" untuk elemen. JANGAN gunakan tag HTML.
- Selalu cantumkan properties AST lengkap (id, type, name, parentId, childrenIds, props, responsiveStyles.base) ketika menambahkan node (ADD_NODE).
- Ingat, untuk ADD, node baru wajib di-register pada childrenIds miliki parent, TETAPI sistem akan melakukannya otomatis untuk Anda! Anda hanya perlu assign "parentId" di dalam Action "ADD_NODE". Namun pastikan jika node yang Anda buat memiliki child baru, masukkan id child tersebut ke "childrenIds" si node baru.
- Jika ada [Selected Element Context], modifikasi elemen tersebut sebagai root dari perubahan Anda.`;
      }

      let reply = '';
      const currentCanvasState = "\n\n[CURRENT CANVAS STATE]:\nRoot Node ID: " + rootNodeId + "\nNodes JSON (AST):\n" + JSON.stringify(nodes, null, 2);
      const systemInstructionWithContext = systemInstruction + currentCanvasState;

      const storedKey = localStorage.getItem('openrouter_api_key');
      if (storedKey) {
         
      const res = await fetch('/api/openrouter/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: abortControllerRef.current?.signal,
            body: JSON.stringify({
              apiKey: storedKey,
              model: localStorage.getItem('openrouter_model') || 'anthropic/claude-3.5-sonnet',
              messages: [
                 { role: 'system', content: systemInstructionWithContext },
                 { role: 'user', content: context + textWithAttachments }
              ]
            })
         });
         
         if (!res.ok) {
            const errorText = await res.text();
            throw new Error('OpenRouter API Error: ' + errorText);
         }
         
         const reader = res.body?.getReader();
         const decoder = new TextDecoder();
         
         setMessages(prev => [...prev, { role: 'agent', text: '' }]);
         
         if (reader) {
            while (true) {
               const { done, value } = await reader.read();
               if (done) break;
               
               const chunk = decoder.decode(value, { stream: true });
               const lines = chunk.split('\n');
               
               for (const line of lines) {
                  if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                     try {
                        const parsedData = JSON.parse(line.slice(6));
                        const delta = parsedData.choices[0]?.delta?.content || '';
                        
                        reply += delta;
                        
                        setMessages(prev => {
                           const newMsgs = [...prev];
                           newMsgs[newMsgs.length - 1].text = reply;
                           return newMsgs;
                        });
                     } catch (err) {
                     }
                  }
               }
            }
         }
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortControllerRef.current?.signal,
          body: JSON.stringify({
            prompt: context + textWithAttachments,
            systemInstruction: systemInstructionWithContext,
            model: 'gemini-3.1-flash-lite' // Ensure we use the requested model
          })
        });
        const response = await res.json();
        if (!res.ok) throw new Error(response.error || 'Server error');
        reply = response.text || 'No response generated.';
        // For non-streaming, append the final message
        setMessages(prev => [...prev, { role: 'agent', text: reply }]);
      }
      
      const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);
      let actionsApplied = false;
      let affectedIds: string[] = [];
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.actions && Array.isArray(parsed.actions)) {
             useBuilderStore.getState().applyAiActions(parsed.actions);
             actionsApplied = true;
             affectedIds = parsed.actions.map((a: any) => a.id).filter(Boolean);
          } else if (parsed.nodes && parsed.rootNodeId) {
             useBuilderStore.setState({ nodes: parsed.nodes, rootNodeId: parsed.rootNodeId });
             actionsApplied = true;
          }
          
          if (affectedIds.length > 0) {
             useBuilderStore.getState().setHighlightedNodeIds(affectedIds);
             
             // Scroll to the first affected element
             setTimeout(() => {
                const el = document.getElementById(`canvas-node-${affectedIds[0]}`);
                if (el) {
                   el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
             }, 100);
             
             // Remove highlight after 2.5 seconds
             setTimeout(() => {
                useBuilderStore.getState().setHighlightedNodeIds([]);
             }, 2500);
          }
        } catch (e) {
          console.error("Failed to parse AI action from JSON", e);
        }
      }
      
      setMessages(prev => {
         const newMsgs = [...prev];
         newMsgs[newMsgs.length - 1].hasAppliedActions = actionsApplied;
         return newMsgs;
      });

    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.toLowerCase().includes('aborted')) {
         console.log('AI Generation stopped by user.');
      } else {
         let friendlyMessage = 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
         const errorStr = error?.message || '';
         
         if (errorStr.includes('429') || errorStr.toLowerCase().includes('rate limit') || errorStr.toLowerCase().includes('quota')) {
            friendlyMessage = 'Maaf, model AI saat ini sedang sibuk atau batas kuota/limit API telah tercapai. Silakan tunggu beberapa saat lagi atau ganti ke model API lain di menu pengaturan.';
         } else if (errorStr.includes('401') || errorStr.toLowerCase().includes('unauthorized')) {
            friendlyMessage = 'Maaf, API Key OpenRouter Anda tidak valid atau belum disetel. Silakan periksa pengaturan API Key Anda.';
         } else if (errorStr.includes('Failed to fetch')) {
            friendlyMessage = 'Gagal terhubung ke server. Periksa koneksi internet Anda atau coba muat ulang halaman.';
         } else if (errorStr.includes('{')) {
            // It's likely a JSON error blob, let's just show a generic but friendly message
            friendlyMessage = 'Maaf, API penyedia AI sedang mengalami gangguan sementara. Silakan coba lagi sebentar lagi atau ganti model AI.';
         } else {
            friendlyMessage = `Maaf, terjadi kesalahan: ${errorStr}`;
         }

         setMessages(prev => [...prev, { role: 'agent', text: friendlyMessage }]);
      }
    } finally {
      setIsTyping(false);
      setIsGenerating(false);
      setIsAiGenerating(false);
      abortControllerRef.current = null;
      setInspectMode(false);
      setSelectedElementId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      if (file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAttachedFiles(prev => [...prev, {
              name: file.name,
              content: event.target!.result as string
            }]);
          }
        };
        reader.readAsText(file);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      
      
      {showSettings && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#333] rounded-xl w-[400px] shadow-2xl flex flex-col">
            <div className="p-4 border-b border-zinc-200 dark:border-[#222] flex items-center justify-between">
              <h3 className="font-medium text-zinc-900 dark:text-white">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <label className="text-xs text-zinc-600 dark:text-[#888] mb-1 block">OpenRouter API Key</label>
                <input 
                  type="password" 
                  value={openRouterKeyInput}
                  onChange={e => setOpenRouterKeyInput(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-zinc-100 dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-purple-500 outline-none"
                />
                <p className="text-xs text-zinc-500 dark:text-[#666] mt-2">
                  If provided, requests will be sent to OpenRouter instead of the default server-side AI. The key is stored locally in your browser.
                </p>
              </div>
              <div>
                <label className="text-xs text-zinc-600 dark:text-[#888] mb-1 block">OpenRouter Model</label>
                <select 
                  value={openRouterModelInput}
                  onChange={e => setOpenRouterModelInput(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-purple-500 outline-none cursor-pointer"
                  disabled={isLoadingModels}
                >
                  {openRouterModels.length === 0 ? (
                    <option value={openRouterModelInput}>{isLoadingModels ? "Loading models..." : openRouterModelInput}</option>
                  ) : (
                    openRouterModels.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-[#222] flex justify-end gap-2">
              <button onClick={() => setShowSettings(false)} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white cursor-pointer">Cancel</button>
              <button 
                onClick={() => {
                  localStorage.setItem('openrouter_api_key', openRouterKeyInput);
                  localStorage.setItem('openrouter_model', openRouterModelInput);
                  setShowSettings(false);
                }} 
                className="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-md cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddAgent && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#333] rounded-xl w-[400px] shadow-2xl flex flex-col">
            <div className="p-4 border-b border-zinc-200 dark:border-[#222] flex items-center justify-between">
              <h3 className="font-medium text-zinc-900 dark:text-white">Add Custom Agent</h3>
              <button onClick={() => setShowAddAgent(false)} className="text-zinc-400 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <label className="text-xs text-zinc-600 dark:text-[#888] mb-1 block">Agent Name</label>
                <input 
                  type="text" 
                  value={newAgentName}
                  onChange={e => setNewAgentName(e.target.value)}
                  placeholder="e.g. SEO Copywriter"
                  className="w-full bg-zinc-100 dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-600 dark:text-[#888] mb-1 block">System Instruction (Prompt)</label>
                <textarea 
                  value={newAgentPrompt}
                  onChange={e => setNewAgentPrompt(e.target.value)}
                  placeholder="Paste CLI prompt or write custom instructions here..."
                  rows={6}
                  className="w-full bg-zinc-100 dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-purple-500 outline-none resize-none custom-scrollbar"
                />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-[#222] flex justify-end gap-2">
              <button onClick={() => setShowAddAgent(false)} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white cursor-pointer">Cancel</button>
              <button onClick={saveCustomAgent} disabled={!newAgentName.trim() || !newAgentPrompt.trim()} className="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-md cursor-pointer">Save Agent</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-[350px] border-l border-zinc-200 dark:border-[#222] flex flex-col bg-white dark:bg-[#0A0A0C] shrink-0 z-40 relative h-full transition-colors">
        {/* Header */}
        <div className="h-14 border-b border-zinc-200 dark:border-[#222] flex items-center px-4 justify-between bg-zinc-50/50 dark:bg-transparent">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => useProjectStore.getState().setAiPanelOpen(false)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-[#222] rounded-md text-zinc-500 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
            <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white dark:text-white ml-1" />
            <span className="font-semibold text-sm text-zinc-900 dark:text-white">AI Agent</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="appearance-none bg-zinc-100 dark:bg-[#222] border border-zinc-200 dark:border-[#333] text-zinc-900 dark:text-white text-xs pl-2 pr-6 py-1 rounded-md outline-none hover:border-zinc-300 dark:hover:border-[#444] cursor-pointer"
              >
                <option value="default">Vibe Designer</option>
                <option value="opencode">OpenCode AI</option>
                {customAgents.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-zinc-500 dark:text-[#888] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button 
              onClick={() => setShowAddAgent(true)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-[#222] rounded-md text-zinc-500 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white transition-colors cursor-pointer"
              title="Add Custom Agent"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-[#222] rounded-md text-zinc-500 hover:text-zinc-900 dark:text-[#888] dark:hover:text-white transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-60">
              <Sparkles className="w-8 h-8 text-zinc-900 dark:text-white dark:text-white mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-gray-300">How can I help you design today?</p>
              <p className="text-xs text-zinc-500 dark:text-gray-500 mt-2">I can build components, change colors, layout, and more.</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-xl text-[13px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-br-xs' 
                  : 'bg-zinc-100 dark:bg-[#222] text-zinc-900 dark:text-gray-200 rounded-bl-xs border border-zinc-200 dark:border-[#333]'
              }`}>
                {msg.text}
                {msg.isAction && (
                  <button 
                    onClick={() => {
                      if (canUndo && typeof undo === 'function') {
                        undo();
                      }
                    }}
                    disabled={!canUndo}
                    className={`mt-2 flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors border ${
                      canUndo 
                        ? 'bg-white hover:bg-zinc-100 dark:bg-[#333] dark:hover:bg-[#444] text-zinc-800 dark:text-white border-zinc-200 dark:border-[#444] cursor-pointer' 
                        : 'bg-zinc-100 dark:bg-[#2a2a2a] text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-[#333] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Undo2 className="w-3 h-3" />
                    Undo AI Edit
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <AiProgressDisplay currentTask={currentTask} actions={actions} />
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-zinc-200 dark:border-[#222] bg-zinc-50 dark:bg-[#111]">
          {selectedElementId && nodes[selectedElementId] && (
            <div className="mb-3 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600/30 rounded-md flex items-center justify-between">
              <span className="text-xs text-zinc-900 dark:text-white dark:text-blue-300 truncate max-w-[200px]">Targeting: {nodes[selectedElementId].name || selectedElementId}</span>
              <button onClick={() => setSelectedElementId(null)} className="text-zinc-400 hover:text-zinc-700 dark:text-[#888] dark:hover:text-white text-xs cursor-pointer">Clear</button>
            </div>
          )}
          
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-zinc-200 dark:bg-[#222] border border-zinc-300 dark:border-[#333] rounded-md px-2 py-1 text-xs text-zinc-800 dark:text-gray-300">
                  <FileText className="w-3 h-3 text-zinc-900 dark:text-white dark:text-white" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button onClick={() => removeAttachment(i)} className="text-zinc-500 hover:text-red-500 ml-1 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
            <div className="relative bg-white dark:bg-[#222] border border-zinc-200 dark:border-[#333] rounded-[12px] shadow-sm flex flex-col p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe what you want to create... (use / to reference skills)"
                disabled={isTyping}
                className="w-full bg-transparent border-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-[#666] outline-none resize-none text-[14px] leading-relaxed pt-2 pb-8 px-2 custom-scrollbar"
                rows={Math.max(2, Math.min(input.split('\n').length, 5))}
              />

              <div className="flex items-center justify-between mt-1 px-1">
                <div className="flex items-center gap-1">
                    <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg text-zinc-600 dark:text-[#AAA] hover:bg-zinc-200 dark:hover:bg-[#333] transition-colors cursor-pointer" title="Attach file">
                      <Plus size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg text-zinc-600 dark:text-[#AAA] hover:bg-zinc-200 dark:hover:bg-[#333] transition-colors cursor-pointer" title="Record Audio">
                      <Mic size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg text-zinc-600 dark:text-[#AAA] hover:bg-zinc-200 dark:hover:bg-[#333] transition-colors cursor-pointer" title="Use Command">
                      <Command size={16} />
                    </button>
                </div>
                
                {isGenerating ? (
                  <button 
                    onClick={stopGenerating}
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    title="Stop Generating"
                  >
                    <Square size={14} className="fill-current" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSend}
                    disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
                    className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center disabled:opacity-50 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ArrowUp size={16} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
