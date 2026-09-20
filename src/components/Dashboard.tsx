import React, { useState, useRef } from 'react';
import { 
  Folder as FolderIcon, 
  FolderPlus, 
  Archive, 
  LayoutGrid, 
  Search, 
  Plus, 
  ChevronDown, 
  MoreHorizontal, 
  Copy, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles, 
  ExternalLink,
  Mail,
  Layers,
  ArrowRight,
  Filter,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useProjectStore, SortFilter, DashboardTab } from '../store/projectStore';
import { showToast } from '../store/toastStore';
import { ProjectCardPreview } from './ProjectCardPreview';
import { Project } from '../types/project';

export default function Dashboard() {
  const {
    projects,
    folders,
    currentTab,
    searchQuery,
    sortBy,
    openProject,
    createProject,
    duplicateProject,
    archiveProject,
    unarchiveProject,
    deleteProject,
    renameProject,
    exportProjectJson,
    importProjectJson,
    addFolder,
    deleteFolder,
    setCurrentTab,
    setSearchQuery,
    setSortBy,
    setViewMode,
  } = useProjectStore();

  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [newFolderInputOpen, setNewFolderInputOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter projects by tab, folder, archive status, and search query
  const filteredProjects = projects.filter((project) => {
    // Search match
    if (searchQuery.trim()) {
      const match = project.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
    }

    // Tab filter
    if (currentTab === 'all') {
      return !project.isArchived;
    }
    if (currentTab === 'archive') {
      return !!project.isArchived;
    }
    // Specific folder
    return project.folderId === currentTab && !project.isArchived;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'last_viewed') {
      return (b.lastViewedTimestamp || 0) - (a.lastViewedTimestamp || 0);
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleCopyInviteLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setNewFolderInputOpen(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importProjectJson(content);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameTarget && renameTarget.title.trim()) {
      renameProject(renameTarget.id, renameTarget.title);
      showToast(`Renamed project to '${renameTarget.title.trim()}'`, undefined, 'success');
      setRenameTarget(null);
    }
  };

  const getActiveTabTitle = () => {
    if (currentTab === 'all') return 'All';
    if (currentTab === 'archive') return 'Archive';
    const folder = folders.find((f) => f.id === currentTab);
    return folder ? folder.name : 'Projects';
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-50 dark:bg-[#0F0F11] text-zinc-900 dark:text-[#E5E7EB] font-sans overflow-hidden select-none transition-colors">
      {/* LEFT SIDEBAR */}
      <aside className="w-[260px] flex-shrink-0 bg-white dark:bg-[#141416] border-r border-zinc-200 dark:border-[#222226] flex flex-col justify-between p-3.5 z-20">
        <div className="flex flex-col gap-4">
          {/* Workspace info */}
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1C1C20] cursor-pointer transition-colors group">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-[#27272A] border border-zinc-300 dark:border-[#3F3F46] flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-white shadow-sm">
                D
              </div>
              <span className="text-[13px] font-semibold text-zinc-800 group-hover:text-zinc-900 dark:text-gray-200 dark:group-hover:text-white">
                denis&apos; Workspace
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors" />
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-[#1A1A1E] border border-zinc-200 dark:border-[#27272D] rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-800 dark:text-gray-200 placeholder-zinc-400 dark:placeholder-gray-500 focus:outline-none focus:border-zinc-300 dark:border-zinc-600 transition-colors"
            />
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-[11px] font-semibold text-zinc-500 dark:text-gray-400 px-2 py-1 uppercase tracking-wider">
              Projects
            </div>

            {/* All */}
            <button
              onClick={() => setCurrentTab('all')}
              className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'all'
                  ? 'bg-zinc-200 dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-gray-200 hover:bg-zinc-100 dark:hover:bg-[#1A1A1E]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 text-zinc-500 dark:text-gray-400" />
                <span>All</span>
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-gray-500">
                {projects.filter((p) => !p.isArchived).length}
              </span>
            </button>

            {/* Archive */}
            <button
              onClick={() => setCurrentTab('archive')}
              className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'archive'
                  ? 'bg-zinc-200 dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-gray-200 hover:bg-zinc-100 dark:hover:bg-[#1A1A1E]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Archive className="w-4 h-4 text-zinc-500 dark:text-gray-400" />
                <span>Archive</span>
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-gray-500">
                {projects.filter((p) => p.isArchived).length}
              </span>
            </button>

            {/* Folders List */}
            {folders.map((folder) => {
              const folderCount = projects.filter(
                (p) => p.folderId === folder.id && !p.isArchived
              ).length;
              const isSelected = currentTab === folder.id;

              return (
                <div
                  key={folder.id}
                  className={`group flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-zinc-200 dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-gray-200 hover:bg-zinc-100 dark:hover:bg-[#1A1A1E]'
                  }`}
                >
                  <button
                    onClick={() => setCurrentTab(folder.id)}
                    className="flex items-center gap-2.5 flex-1 text-left truncate"
                  >
                    <FolderIcon className="w-4 h-4 text-zinc-500 dark:text-gray-400" />
                    <span className="truncate">{folder.name}</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-zinc-400 dark:text-gray-500">{folderCount}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-opacity p-0.5"
                      title="Delete folder"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add New Folder form / trigger */}
            {newFolderInputOpen ? (
              <form onSubmit={handleCreateFolderSubmit} className="mt-1 px-1">
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-[#1A1A1E] border border-zinc-300 dark:border-zinc-600/50 rounded-md p-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full bg-transparent px-1.5 py-0.5 text-xs text-zinc-800 dark:text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-zinc-100 dark:bg-zinc-9000 text-white p-1 rounded text-[10px]"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setNewFolderInputOpen(true)}
                className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-xs text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-gray-200 hover:bg-zinc-100 dark:hover:bg-[#1A1A1E] transition-colors mt-1"
              >
                <FolderPlus className="w-4 h-4 text-zinc-500 dark:text-gray-400" />
                <span>+ New Folder...</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 border-t border-zinc-200 dark:border-[#222226] flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-gray-300">
            <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
            <span className="text-[11.5px]">Invite your team</span>
          </div>
          <button
            onClick={handleCopyInviteLink}
            className="px-2.5 py-1 text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1F1F24] dark:hover:bg-[#282830] text-zinc-700 hover:text-zinc-900 dark:text-gray-200 dark:hover:text-white border border-zinc-200 dark:border-[#30303A] rounded transition-colors flex items-center gap-1"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-zinc-900 dark:text-white dark:text-white" />
                <span className="text-zinc-900 dark:text-white dark:text-white">Copied</span>
              </>
            ) : (
              'Copy Link'
            )}
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-zinc-50 dark:bg-[#0F0F11] transition-colors">
        {/* Top Header */}
        <header className="min-h-20 px-6 lg:px-10 py-4 flex items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-[#1E1E24] bg-white/90 dark:bg-[#0F0F11]/90 backdrop-blur flex-shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-zinc-950 dark:text-white tracking-tight">
                {getActiveTabTitle()}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#1C1C22] border border-zinc-200 dark:border-[#2B2B36] text-zinc-500 dark:text-gray-400">
                {sortedProjects.length} {sortedProjects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Create, refine, and publish your next site.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-[#18181D] hover:bg-zinc-100 dark:hover:bg-[#22222A] border border-zinc-200 dark:border-[#272730] rounded-md transition-colors"
              >
                <span>
                  {sortBy === 'last_viewed' && 'Last viewed by me'}
                  {sortBy === 'newest' && 'Newest created'}
                  {sortBy === 'oldest' && 'Oldest created'}
                  {sortBy === 'alphabetical' && 'Alphabetical (A-Z)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
              </button>

              {filterDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setFilterDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-[#18181D] border border-zinc-200 dark:border-[#2A2A34] rounded-lg shadow-2xl p-1 z-40 text-xs">
                    <button
                      onClick={() => {
                        setSortBy('last_viewed');
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#252530] transition-colors ${
                        sortBy === 'last_viewed' ? 'text-zinc-900 dark:text-white dark:text-white font-medium' : 'text-zinc-700 dark:text-gray-300'
                      }`}
                    >
                      Last viewed by me
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('newest');
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#252530] transition-colors ${
                        sortBy === 'newest' ? 'text-zinc-900 dark:text-white dark:text-white font-medium' : 'text-zinc-700 dark:text-gray-300'
                      }`}
                    >
                      Newest created
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('oldest');
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#252530] transition-colors ${
                        sortBy === 'oldest' ? 'text-zinc-900 dark:text-white dark:text-white font-medium' : 'text-zinc-700 dark:text-gray-300'
                      }`}
                    >
                      Oldest created
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('alphabetical');
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#252530] transition-colors ${
                        sortBy === 'alphabetical' ? 'text-zinc-900 dark:text-white dark:text-white font-medium' : 'text-zinc-700 dark:text-gray-300'
                      }`}
                    >
                      Alphabetical (A-Z)
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Hidden JSON file input for project import */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />

            {/* Import Project Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-[#1C1C22] hover:bg-zinc-100 dark:hover:bg-[#25252E] border border-zinc-200 dark:border-[#2D2D38] rounded-lg transition-colors cursor-pointer"
              title="Import project from backup JSON file"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            {/* Figma Engine Button */}
            <button
              onClick={() => setViewMode('figma')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-md shadow-sm transition-colors cursor-pointer mr-2"
            >
              <Layers className="w-4 h-4" />
              <span>Try Figma Engine</span>
            </button>
            {/* New Project Button */}
            <button
              onClick={() => setNewProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:bg-[#0077DD] rounded-md shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </header>

        {/* 3-COLUMN PROJECT GRID */}
        <div className="p-8 flex-1">
          {sortedProjects.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-300 dark:border-[#262630] rounded-xl text-center p-6">
              <Layers className="w-10 h-10 text-zinc-400 dark:text-gray-600 mb-2" />
              <p className="text-sm font-medium text-zinc-600 dark:text-gray-400">No projects found</p>
              <p className="text-xs text-zinc-400 dark:text-gray-600 mt-1">
                {searchQuery ? 'Try clearing your search query' : 'Create your first project to get started'}
              </p>
              <button
                onClick={() => createProject('My First Canvas')}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-md transition-colors"
              >
                + New Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => openProject(project.id)}
                  className="group relative flex flex-col bg-white dark:bg-[#141418] border border-zinc-200 dark:border-[#22222A] hover:border-zinc-300 dark:hover:border-[#383848] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  {/* Thumbnail / Screen preview */}
                  <div className="w-full aspect-[16/10] bg-zinc-100 dark:bg-[#0C0C0E] border-b border-zinc-200 dark:border-[#202028] overflow-hidden relative">
                    <ProjectCardPreview project={project} />

                    {/* Hover overlay hint */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1">
                        Open Project <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Card Metadata */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-800 group-hover:text-zinc-900 dark:text-gray-200 dark:group-hover:text-white truncate">
                          {project.title}
                        </span>
                        {project.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-[#202026] text-zinc-600 dark:text-gray-400 border border-zinc-200 dark:border-[#2E2E38]">
                            {project.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 dark:text-gray-500">
                        {project.lastViewed}
                      </span>
                    </div>

                    {/* 3-Dot Options Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuProjectId(
                            activeMenuProjectId === project.id ? null : project.id
                          );
                        }}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#24242E] transition-colors"
                        title="Project options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuProjectId === project.id && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuProjectId(null);
                            }}
                          />
                          <div className="absolute right-0 bottom-full mb-2 w-40 bg-white dark:bg-[#1C1C22] border border-zinc-200 dark:border-[#2D2D38] rounded-lg shadow-2xl p-1 z-40 text-xs">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuProjectId(null);
                                openProject(project.id);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#282834] text-zinc-700 dark:text-gray-200 flex items-center gap-2"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
                              <span>Open in Editor</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuProjectId(null);
                                setRenameTarget({ id: project.id, title: project.title });
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#282834] text-zinc-700 dark:text-gray-200 flex items-center gap-2"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuProjectId(null);
                                duplicateProject(project.id);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#282834] text-zinc-700 dark:text-gray-200 flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
                              <span>Duplicate</span>
                            </button>
                            {project.isArchived ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuProjectId(null);
                                  unarchiveProject(project.id);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#282834] text-zinc-700 dark:text-gray-200 flex items-center gap-2"
                              >
                                <Archive className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
                                <span>Unarchive</span>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuProjectId(null);
                                  archiveProject(project.id);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#282834] text-zinc-700 dark:text-gray-200 flex items-center gap-2"
                              >
                                <Archive className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
                                <span>Archive</span>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuProjectId(null);
                                exportProjectJson(project.id);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-[#282834] text-zinc-700 dark:text-gray-200 flex items-center gap-2"
                            >
                              <Download className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
                              <span>Export JSON</span>
                            </button>
                            <div className="h-px bg-zinc-200 dark:bg-[#282834] my-1" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuProjectId(null);
                                setProjectToDelete({ id: project.id, title: project.title });
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-500/10 text-red-500 dark:text-red-400 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* NEW PROJECT MODAL */}
      {newProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-[#2B2B36] rounded-xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">Create New Project</h3>
            <p className="text-xs text-zinc-500 dark:text-gray-400 mb-4">
              Choose a starter canvas template or start blank.
            </p>

            <div className="flex flex-col gap-2 mb-6">
              <button
                onClick={() => {
                  setNewProjectModalOpen(false);
                  createProject('New Canvas', 'blank');
                }}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-[#1F1F26] dark:hover:bg-[#282834] border border-zinc-200 dark:border-[#2E2E3E] text-left transition-colors group"
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Blank Starter Canvas</div>
                  <div className="text-[11px] text-zinc-500 dark:text-gray-400">Fresh responsive page with hero container</div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  setNewProjectModalOpen(false);
                  createProject('Scalable SaaS (New)', 'saas');
                }}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-[#1F1F26] dark:hover:bg-[#282834] border border-zinc-200 dark:border-[#2E2E3E] text-left transition-colors group"
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">SaaS Landing Page Template</div>
                  <div className="text-[11px] text-zinc-500 dark:text-gray-400">Dark mode hero, analytics preview, metrics & navbar</div>
                </div>
                <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setNewProjectModalOpen(false);
                  createProject('Portfolio (New)', 'portfolio');
                }}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-[#1F1F26] dark:hover:bg-[#282834] border border-zinc-200 dark:border-[#2E2E3E] text-left transition-colors group"
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">System Interface Template</div>
                  <div className="text-[11px] text-zinc-500 dark:text-gray-400">System Interface Dashboard Section for product showcases</div>
                </div>
                <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNewProjectModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white bg-transparent rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRenameSubmit}
            className="w-full max-w-sm bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-[#2B2B36] rounded-xl shadow-2xl p-5"
          >
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Rename Project</h3>
            <input
              type="text"
              autoFocus
              value={renameTarget.title}
              onChange={(e) =>
                setRenameTarget({ ...renameTarget, title: e.target.value })
              }
              className="w-full bg-zinc-100 dark:bg-[#202028] border border-zinc-300 dark:border-[#323242] rounded-md px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-300 dark:border-zinc-600 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-md transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-[#2B2B36] rounded-xl shadow-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Delete Project</h3>
                <p className="text-xs text-zinc-500 dark:text-gray-400">Permanently remove this project</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-5 leading-relaxed">
              Are you sure you want to delete <strong className="text-zinc-900 dark:text-white">"{projectToDelete.title}"</strong>? All pages, components, and design canvas data will be permanently deleted. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-[#22222A] dark:hover:bg-[#2A2A34] rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProject(projectToDelete.id);
                  showToast(`Project '${projectToDelete.title}' deleted`, 'The project was permanently deleted', 'info');
                  setProjectToDelete(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
