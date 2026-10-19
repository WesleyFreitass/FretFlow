import React, { useState, useEffect } from 'react';
import { 
  KANBAN_COLUMNS, 
  KANBAN_PRIORITIES, 
  KANBAN_AUTHORS, 
  KANBAN_CATEGORIES,
  KANBAN_TAGS, 
  INITIAL_IDEAS 
} from '../data/ideiasKanban';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  X, 
  Check, 
  Sparkles, 
  Download, 
  Upload, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Filter, 
  Kanban,
  Tag,
  User,
  Clock,
  Layers,
  Flame,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

const KANBAN_VERSION_KEY = 'fretflow_kanban_version_v9';
const KANBAN_DATA_KEY = 'fretflow_kanban_data_v9';

export default function KanbanBoardTab() {
  // 1. Persistent Ideas State with definitive version check & purge
  const [ideas, setIdeas] = useState(() => {
    try {
      // Definitive purge of all previous cache versions
      const legacyKeys = [
        'fretflow_kanban_ideas_v1', 
        'fretflow_kanban_ideas_v2', 
        'fretflow_kanban_ideas_v3',
        'fretflow_kanban_version_v5',
        'fretflow_kanban_data_v5',
        'fretflow_kanban_version_v6',
        'fretflow_kanban_data_v6',
        'fretflow_kanban_version_v7',
        'fretflow_kanban_data_v7',
        'fretflow_kanban_version_v8',
        'fretflow_kanban_data_v8'
      ];
      legacyKeys.forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });

      const savedVersion = localStorage.getItem(KANBAN_VERSION_KEY);
      const savedData = localStorage.getItem(KANBAN_DATA_KEY);

      // If version is missing or outdated, load fresh INITIAL_IDEAS directly from code
      if (savedVersion !== '9' || !savedData) {
        localStorage.setItem(KANBAN_VERSION_KEY, '9');
        localStorage.setItem(KANBAN_DATA_KEY, JSON.stringify(INITIAL_IDEAS));
        return INITIAL_IDEAS;
      }

      const parsed = JSON.parse(savedData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (_) {}
    return INITIAL_IDEAS;
  });

  const [isBridgeSynced, setIsBridgeSynced] = useState(false);

  // Auto-sync state to local disk (/api/kanban) in real-time
  useEffect(() => {
    try {
      localStorage.setItem(KANBAN_VERSION_KEY, '9');
      localStorage.setItem(KANBAN_DATA_KEY, JSON.stringify(ideas));

      // Post to Vite Bridge API
      fetch('/api/kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideas, null, 2)
      })
      .then(res => {
        if (res.ok) setIsBridgeSynced(true);
      })
      .catch(() => {});
    } catch (_) {}
  }, [ideas]);

  // 2. Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterAuthor, setFilterAuthor] = useState('todos');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [filterTag, setFilterTag] = useState('todos');

  // 3. Drag & Drop State
  const [draggedIdeaId, setDraggedIdeaId] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);

  // 4. Modal State (Add / Edit Idea)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdeaId, setEditingIdeaId] = useState(null); // null = new, id = edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gains: '',
    category: 'melhoria',
    author: 'wesley',
    status: 'novas',
    priority: 'media',
    tags: []
  });

  // 5. JSON Sync Modal State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [syncError, setSyncError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Filtered Ideas logic
  const filteredIdeas = ideas.filter(idea => {
    // Search text
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      idea.title.toLowerCase().includes(query) || 
      idea.description.toLowerCase().includes(query) ||
      (idea.gains && idea.gains.toLowerCase().includes(query)) ||
      idea.tags?.some(t => t.toLowerCase().includes(query));

    // Category
    const matchesCategory = filterCategory === 'todos' || (idea.category || 'melhoria') === filterCategory;

    // Author
    const matchesAuthor = filterAuthor === 'todos' || idea.author === filterAuthor;

    // Priority
    const matchesPriority = filterPriority === 'todos' || idea.priority === filterPriority;

    // Tag
    const matchesTag = filterTag === 'todos' || idea.tags?.includes(filterTag);

    return matchesSearch && matchesCategory && matchesAuthor && matchesPriority && matchesTag;
  });

  // Open Modal to Add Idea
  const handleOpenAddModal = (defaultStatus = 'novas') => {
    setEditingIdeaId(null);
    setFormData({
      title: '',
      description: '',
      gains: '',
      category: 'melhoria',
      author: 'wesley',
      status: defaultStatus,
      priority: 'media',
      tags: ['NOVA GUIA']
    });
    setIsModalOpen(true);
  };

  // Open Modal to Edit Idea
  const handleOpenEditModal = (idea) => {
    setEditingIdeaId(idea.id);
    setFormData({
      title: idea.title,
      description: idea.description,
      gains: idea.gains || '',
      category: idea.category || 'melhoria',
      author: idea.author || 'wesley',
      status: idea.status || 'novas',
      priority: idea.priority || 'media',
      tags: Array.isArray(idea.tags) ? [...idea.tags] : []
    });
    setIsModalOpen(true);
  };

  // Save Idea (Create or Update)
  const handleSaveIdea = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingIdeaId) {
      // Update
      setIdeas(prev => prev.map(item => {
        if (item.id === editingIdeaId) {
          return {
            ...item,
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim(),
            gains: (formData.gains || '').trim(),
            category: formData.category || 'melhoria'
          };
        }
        return item;
      }));
    } else {
      // Create New
      const newIdea = {
        id: `idea_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        gains: (formData.gains || '').trim(),
        category: formData.category || 'melhoria',
        author: formData.author,
        status: formData.status,
        priority: formData.priority,
        tags: formData.tags,
        createdAt: new Date().toISOString()
      };
      setIdeas(prev => [newIdea, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Delete Idea
  const handleDeleteIdea = (id) => {
    setIdeas(prev => prev.filter(item => item.id !== id));
  };

  // Move Idea Column
  const handleMoveColumn = (ideaId, direction) => {
    const colIds = KANBAN_COLUMNS.map(c => c.id);
    setIdeas(prev => prev.map(item => {
      if (item.id === ideaId) {
        const currentIdx = colIds.indexOf(item.status);
        const nextIdx = currentIdx + direction;
        if (nextIdx >= 0 && nextIdx < colIds.length) {
          return { ...item, status: colIds[nextIdx] };
        }
      }
      return item;
    }));
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, ideaId) => {
    setDraggedIdeaId(ideaId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ideaId);
  };

  const handleDragOverColumn = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleDropOnColumn = (e, targetColumnId) => {
    e.preventDefault();
    const ideaId = e.dataTransfer.getData('text/plain') || draggedIdeaId;
    if (ideaId) {
      setIdeas(prev => prev.map(item => {
        if (item.id === ideaId) {
          return { ...item, status: targetColumnId };
        }
        return item;
      }));
    }
    setDraggedIdeaId(null);
    setDragOverColumnId(null);
  };

  const handleDragEnd = () => {
    setDraggedIdeaId(null);
    setDragOverColumnId(null);
  };

  // Toggle Tag in Form
  const handleToggleTag = (tag) => {
    setFormData(prev => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
      };
    });
  };

  // Reset to Default Initial Ideas (Direct sync with code)
  const handleResetDefaults = () => {
    setIdeas(INITIAL_IDEAS);
    try {
      localStorage.setItem(KANBAN_VERSION_KEY, '6');
      localStorage.setItem(KANBAN_DATA_KEY, JSON.stringify(INITIAL_IDEAS));
    } catch (_) {}
  };

  // Copy Full JSON to Clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(ideas, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Import JSON
  const handleConfirmImportJson = (e) => {
    e.preventDefault();
    setSyncError('');
    try {
      let cleanText = importJsonText.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```[a-z]*\r?\n/, '').replace(/\r?\n```$/, '');
      }
      const parsed = JSON.parse(cleanText);
      if (!Array.isArray(parsed)) {
        throw new Error('O JSON deve ser uma lista de ideias (Array de objetos).');
      }

      setIdeas(parsed);
      setSyncSuccess(true);
      setTimeout(() => {
        setIsSyncModalOpen(false);
        setImportJsonText('');
        setSyncSuccess(false);
      }, 600);
    } catch (err) {
      setSyncError(`Erro ao importar JSON: ${err.message || 'Formato inválido'}`);
    }
  };

  // Stats calculation
  const totalCount = ideas.length;
  const inProgressCount = ideas.filter(i => ['em_analise', 'em_desenvolvimento', 'polimento'].includes(i.status)).length;
  const completedCount = ideas.filter(i => i.status === 'concluido').length;
  const canceledCount = ideas.filter(i => i.status === 'cancelada').length;

  return (
    <div className="h-full w-full flex flex-col space-y-4 p-4 lg:p-6 overflow-hidden select-none font-sans max-w-[1900px] mx-auto animate-fadeIn">
      
      {/* 1. HEADER & CONTROLS TOOLBAR */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4 shrink-0">
        
        {/* Main Title Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm shadow-inner">
              <Kanban className="w-5 h-5 text-oficina-terracotta" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-oficina-darkText uppercase tracking-wide">
                  Kanban de Ideias &amp; Roadmap
                </h2>
                <span className="font-mono text-[10px] font-bold bg-oficina-surface border border-oficina-border px-2 py-0.5 rounded text-oficina-terracotta">
                  Colaborativo (Wesley &amp; Antigravity AI)
                </span>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border transition flex items-center gap-1 ${
                  isBridgeSynced 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' 
                    : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isBridgeSynced ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
                  <span>{isBridgeSynced ? 'Sincronizado em Tempo Real (IA)' : 'Salvando...'}</span>
                </span>
              </div>
              <p className="text-xs text-oficina-bodyText">
                Gerenciamento visual do ciclo de vida de ideias, novas features e melhorias do FretFlow
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAddModal('novas')}
              className="px-3.5 py-2 bg-oficina-terracotta hover:brightness-110 text-white font-mono font-bold text-xs rounded-sm transition shadow-sm flex items-center gap-1.5"
              title="Cadastrar uma nova ideia no Kanban"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Ideia</span>
            </button>

            <button
              onClick={() => {
                setImportJsonText(JSON.stringify(ideas, null, 2));
                setIsSyncModalOpen(true);
              }}
              className="px-3 py-2 bg-oficina-surface hover:bg-oficina-card border border-oficina-border hover:border-oficina-darkText font-mono font-bold text-xs text-oficina-darkText rounded-sm transition shadow-sm flex items-center gap-1.5"
              title="Importar ou exportar os dados em JSON para a IA ler ou salvar"
            >
              <Download className="w-3.5 h-3.5 text-oficina-olive" />
              <span>Sincronizar JSON</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="p-2 bg-oficina-surface hover:bg-rose-500/10 border border-oficina-border hover:border-rose-400 text-oficina-mutedText hover:text-rose-500 rounded-sm transition shadow-sm"
              title="Restaurar ideias padrão"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 pt-2 border-t border-oficina-border font-mono text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-oficina-mutedText absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar ideias, termos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-oficina-surface border border-oficina-border rounded-sm text-xs text-oficina-darkText placeholder:text-oficina-mutedText focus:outline-none focus:border-oficina-darkText"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-oficina-mutedText hover:text-oficina-darkText"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category / Type Filter */}
          <div className="flex items-center gap-1.5 bg-oficina-surface border border-oficina-border rounded-sm px-2 py-1">
            <span className="text-oficina-mutedText text-[11px] font-bold shrink-0">Tipo:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-oficina-darkText focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Tipos</option>
              {KANBAN_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div className="flex items-center gap-1.5 bg-oficina-surface border border-oficina-border rounded-sm px-2 py-1">
            <span className="text-oficina-mutedText text-[11px] font-bold shrink-0">Autor:</span>
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-oficina-darkText focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Autores</option>
              {KANBAN_AUTHORS.map(a => (
                <option key={a.id} value={a.id}>{a.icon} {a.name} ({a.role})</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-oficina-surface border border-oficina-border rounded-sm px-2 py-1">
            <span className="text-oficina-mutedText text-[11px] font-bold shrink-0">Prioridade:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-oficina-darkText focus:outline-none cursor-pointer"
            >
              <option value="todos">Todas as Prioridades</option>
              {KANBAN_PRIORITIES.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-1.5 bg-oficina-surface border border-oficina-border rounded-sm px-2 py-1">
            <span className="text-oficina-mutedText text-[11px] font-bold shrink-0">Guia:</span>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-oficina-darkText focus:outline-none cursor-pointer"
            >
              <option value="todos">Todas as Guias</option>
              {KANBAN_TAGS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Stats Strip */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-oficina-bodyText pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-oficina-terracotta"></span>
            <span>Total: <strong className="text-oficina-darkText">{totalCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Em Andamento: <strong className="text-oficina-darkText">{inProgressCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Concluídas: <strong className="text-oficina-darkText">{completedCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Canceladas: <strong className="text-oficina-darkText">{canceledCount}</strong></span>
          </div>
        </div>

      </div>

      {/* 2. KANBAN 6-COLUMNS SWIMLANES (HORIZONTAL SCROLL ON MOBILE / FLEX GRID ON DESKTOP) */}
      <div className="flex-1 min-h-0 overflow-x-auto custom-scrollbar">
        <div className="grid grid-cols-6 gap-3.5 h-full min-w-[1300px] pb-2">
          
          {KANBAN_COLUMNS.map((column, colIdx) => {
            const columnIdeas = filteredIdeas.filter(i => i.status === column.id);
            const isDragOver = dragOverColumnId === column.id;

            return (
              <div
                key={column.id}
                onDragOver={(e) => handleDragOverColumn(e, column.id)}
                onDrop={(e) => handleDropOnColumn(e, column.id)}
                className={`flex flex-col rounded-sm border bg-oficina-card transition-all duration-200 overflow-hidden shadow-xs ${
                  isDragOver ? 'ring-2 ring-oficina-terracotta bg-oficina-surface scale-[1.005]' : 'border-oficina-border'
                }`}
              >
                {/* Column Header */}
                <div 
                  className="p-3 border-b border-oficina-border flex items-center justify-between shrink-0 bg-oficina-surface"
                  style={{ borderTop: `3px solid ${column.color}` }}
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-xs text-oficina-darkText uppercase tracking-wider truncate">
                        {column.title}
                      </h3>
                      <span 
                        className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded border"
                        style={{ backgroundColor: `${column.color}15`, color: column.color, borderColor: `${column.color}40` }}
                      >
                        {columnIdeas.length}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-oficina-mutedText block truncate mt-0.5">
                      {column.subtitle}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenAddModal(column.id)}
                    className="p-1 rounded text-oficina-mutedText hover:text-oficina-darkText hover:bg-black/10 transition shrink-0"
                    title={`Adicionar ideia em ${column.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards Container */}
                <div className="flex-1 p-2 space-y-2.5 overflow-y-auto custom-scrollbar min-h-0">
                  {columnIdeas.map((idea) => {
                    const categoryObj = KANBAN_CATEGORIES.find(c => c.id === (idea.category || 'melhoria')) || KANBAN_CATEGORIES[0];
                    const priorityObj = KANBAN_PRIORITIES.find(p => p.id === idea.priority) || KANBAN_PRIORITIES[1];
                    const authorObj = KANBAN_AUTHORS.find(a => a.id === idea.author) || KANBAN_AUTHORS[0];

                    return (
                      <div
                        key={idea.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, idea.id)}
                        onDragEnd={handleDragEnd}
                        onDoubleClick={() => handleOpenEditModal(idea)}
                        className="p-3 bg-oficina-surface hover:bg-[#ded9cc] border border-oficina-border hover:border-oficina-darkText/60 rounded-sm shadow-xs transition cursor-grab active:cursor-grabbing space-y-2 group relative hover:shadow-md"
                        title="Dê um duplo clique para abrir o detalhamento completo"
                      >
                        {/* Card Top Row: Category + Priority + Author */}
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <div className="flex items-center gap-1">
                            <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${categoryObj.badgeClass}`}>
                              <span>{categoryObj.icon}</span>
                              <span>{categoryObj.label}</span>
                            </span>

                            <span 
                              className="font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider"
                              style={{ backgroundColor: `${priorityObj.color}18`, color: priorityObj.color, borderColor: `${priorityObj.color}40` }}
                            >
                              {priorityObj.label}
                            </span>
                          </div>

                          <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${authorObj.badgeClass}`}>
                            <span>{authorObj.icon}</span>
                            <span>{authorObj.name}</span>
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="font-extrabold text-xs text-oficina-darkText leading-snug">
                            {idea.title}
                          </h4>
                          {idea.description && (
                            <p className="text-[11px] text-oficina-bodyText mt-1 line-clamp-3 leading-relaxed">
                              {idea.description}
                            </p>
                          )}
                        </div>

                        {/* Tags & Gains Indicator */}
                        <div className="space-y-1.5 pt-1">
                          {idea.tags && idea.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {idea.tags.map(t => {
                                const isNovaGuia = t === 'NOVA GUIA';
                                return (
                                  <span 
                                    key={t} 
                                    className={`font-mono text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                                      isNovaGuia
                                        ? 'bg-oficina-terracotta/15 text-oficina-terracotta border-oficina-terracotta/40 font-black tracking-wide shadow-2xs'
                                        : 'bg-black/5 text-oficina-darkText border-black/10'
                                    }`}
                                  >
                                    #{t}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {idea.gains && (
                            <div className="flex items-center gap-1 text-[9px] font-mono text-oficina-terracotta font-bold">
                              <TrendingUp className="w-2.5 h-2.5 text-oficina-terracotta shrink-0" />
                              <span className="truncate">Ganhos &amp; ROI mapeados</span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Date & Quick Actions */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-oficina-border/60 text-[10px] font-mono text-oficina-mutedText">
                          <div className="flex items-center gap-1 truncate text-[9px]">
                            <Clock className="w-2.5 h-2.5 opacity-60" />
                            <span>{new Date(idea.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>

                          <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition">
                            {/* Move Left */}
                            {colIdx > 0 && (
                              <button
                                onClick={() => handleMoveColumn(idea.id, -1)}
                                className="p-1 hover:bg-black/10 rounded text-oficina-darkText"
                                title={`Mover para ${KANBAN_COLUMNS[colIdx - 1].title}`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {/* Edit / Details */}
                            <button
                              onClick={() => handleOpenEditModal(idea)}
                              className="p-1 hover:bg-black/10 rounded text-oficina-darkText"
                              title="Abrir Detalhes (ou duplo clique no card)"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteIdea(idea.id)}
                              className="p-1 hover:bg-rose-500/20 rounded text-rose-500"
                              title="Excluir Ideia"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>

                            {/* Move Right */}
                            {colIdx < KANBAN_COLUMNS.length - 1 && (
                              <button
                                onClick={() => handleMoveColumn(idea.id, 1)}
                                className="p-1 hover:bg-black/10 rounded text-oficina-darkText"
                                title={`Mover para ${KANBAN_COLUMNS[colIdx + 1].title}`}
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {columnIdeas.length === 0 && (
                    <div className="text-center py-10 text-oficina-mutedText font-mono text-xs border border-dashed border-oficina-border/70 rounded-sm p-3">
                      Nenhuma ideia nesta coluna.
                    </div>
                  )}
                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL AMPLIADO DE DETALHAMENTO & EDIÇÃO DE IDEIAS (SPACIOUS 2-COLUMNS) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 lg:p-6 animate-fadeIn">
          <form 
            onSubmit={handleSaveIdea} 
            className="bg-oficina-card border border-oficina-border rounded-sm max-w-4xl xl:max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl font-sans overflow-hidden"
          >
            
            {/* Modal Header */}
            <div className="p-4 lg:px-6 lg:py-4 border-b border-oficina-border flex items-center justify-between shrink-0 bg-oficina-surface">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-oficina-card text-oficina-darkText border border-oficina-border rounded shadow-inner">
                  <Sparkles className="w-5 h-5 text-oficina-terracotta" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm lg:text-base text-oficina-darkText uppercase tracking-wider">
                      {editingIdeaId ? 'Detalhamento da Ideia' : 'Nova Ideia no Roadmap'}
                    </h3>
                    {editingIdeaId && (
                      <span className="font-mono text-[10px] text-oficina-mutedText">
                        ID: {editingIdeaId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-oficina-bodyText font-mono">
                    {editingIdeaId ? 'Visualize, edite e acompanhe os detalhes técnicos e o progresso da ideia' : 'Cadastre uma nova ideia ou funcionalidade no quadro Kanban'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-oficina-mutedText hover:text-oficina-darkText hover:bg-black/10 rounded transition"
                  title="Fechar (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: 2-Column Spacious Grid */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 custom-scrollbar min-h-0">
              
              {/* Left Column: Title & Extended Content */}
              <div className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-bold text-oficina-darkText uppercase tracking-wider block">
                    Título da Ideia / Funcionalidade:
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Ex: Novo afinador estroboscópico de alta precisão..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-oficina-surface border border-oficina-border rounded-sm font-sans text-sm font-bold text-oficina-darkText focus:outline-none focus:border-oficina-darkText shadow-inner"
                  />
                </div>

                {/* Extended Description & Technical Specifications */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <label className="font-bold text-oficina-darkText uppercase tracking-wider block">
                      Detalhamento &amp; Especificações Técnicas:
                    </label>
                    <span className="text-[10px] text-oficina-mutedText">
                      Suporta textos longos, notas e passos
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    placeholder="Descreva em detalhes o propósito, comportamento de áudio/DSP, regras de negócio, passos de implementação e referências..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3.5 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs leading-relaxed text-oficina-darkText focus:outline-none focus:border-oficina-darkText resize-none custom-scrollbar shadow-inner"
                  />
                </div>

                {/* Editable Gains, Impact & Strategic Value Box */}
                <div className="space-y-2 p-3.5 bg-gradient-to-b from-oficina-surface to-oficina-card border-2 border-oficina-terracotta/40 rounded-sm shadow-xs">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <label className="font-extrabold text-oficina-darkText uppercase tracking-wider flex items-center gap-1.5 text-oficina-terracotta">
                      <TrendingUp className="w-4 h-4 text-oficina-terracotta shrink-0" />
                      <span>Ganhos Esperados, Impacto &amp; Proposta de Valor:</span>
                    </label>
                    <span className="text-[10px] font-bold text-oficina-terracotta bg-oficina-terracotta/10 px-2 py-0.5 rounded-sm border border-oficina-terracotta/30">
                      Priorização &amp; ROI
                    </span>
                  </div>
                  <p className="text-[11px] text-oficina-bodyText font-mono">
                    Registre os benefícios pedagógicos, facilidades de uso, diferencial de mercado e impacto técnico desta tarefa:
                  </p>
                  <textarea
                    rows={7}
                    placeholder="• Ganho de Aprendizado: ...&#10;• Ganho de UX/Retenção: ...&#10;• Diferencial de Mercado: ...&#10;• Impacto na Priorização: ..."
                    value={formData.gains}
                    onChange={(e) => setFormData(prev => ({ ...prev, gains: e.target.value }))}
                    className="w-full p-3 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs leading-relaxed text-oficina-darkText focus:outline-none focus:border-oficina-terracotta resize-none custom-scrollbar shadow-inner"
                  />
                </div>

              </div>

              {/* Right Column: Metadata, Categorization & Stage Controls */}
              <div className="space-y-4 bg-oficina-surface border border-oficina-border rounded-sm p-4 h-fit font-mono text-xs">
                
                {/* Quadro / Status Column */}
                <div className="space-y-1.5">
                  <label className="font-bold text-oficina-darkText uppercase tracking-wider block">
                    Quadro Atual (Status):
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 bg-oficina-card border border-oficina-border rounded-sm font-bold text-xs text-oficina-darkText focus:outline-none cursor-pointer"
                  >
                    {KANBAN_COLUMNS.map(c => (
                      <option key={c.id} value={c.id}>
                        ● {c.title} — ({c.subtitle})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Category Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-oficina-darkText uppercase tracking-wider block">
                    Categoria da Task:
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 bg-oficina-card border border-oficina-border rounded-sm font-bold text-xs text-oficina-darkText focus:outline-none cursor-pointer"
                  >
                    {KANBAN_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-oficina-darkText uppercase tracking-wider block">
                    Autor da Ideia:
                  </label>
                  <select
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full p-2 bg-oficina-card border border-oficina-border rounded-sm font-bold text-xs text-oficina-darkText focus:outline-none cursor-pointer"
                  >
                    {KANBAN_AUTHORS.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.icon} {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-oficina-darkText uppercase tracking-wider block">
                    Nível de Prioridade:
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2 bg-oficina-card border border-oficina-border rounded-sm font-bold text-xs text-oficina-darkText focus:outline-none cursor-pointer"
                  >
                    {KANBAN_PRIORITIES.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags / Categories */}
                <div className="space-y-1.5 pt-2 border-t border-oficina-border">
                  <label className="font-bold text-oficina-darkText uppercase tracking-wider block">
                    Categorias / Tags:
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {KANBAN_TAGS.map(tag => {
                      const isSelected = formData.tags.includes(tag);
                      const isNovaGuia = tag === 'NOVA GUIA';
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`px-2 py-1 rounded-[2px] text-[9px] font-bold border transition ${
                            isSelected
                              ? isNovaGuia
                                ? 'bg-oficina-terracotta text-white border-oficina-terracotta shadow-xs font-black'
                                : 'bg-oficina-chassis text-white border-oficina-chassis shadow-xs'
                              : isNovaGuia
                                ? 'bg-oficina-terracotta/10 border-oficina-terracotta/30 text-oficina-terracotta hover:bg-oficina-terracotta/20 font-bold'
                                : 'bg-oficina-card border-oficina-border text-oficina-bodyText hover:border-oficina-darkText'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions / Delete */}
                {editingIdeaId && (
                  <div className="pt-3 border-t border-oficina-border flex items-center justify-between">
                    <span className="text-[10px] text-oficina-mutedText">Exclusão permanente:</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja excluir esta ideia do Kanban?')) {
                          handleDeleteIdea(editingIdeaId);
                          setIsModalOpen(false);
                        }
                      }}
                      className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded text-[10px] font-bold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Excluir</span>
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 lg:px-6 border-t border-oficina-border flex items-center justify-between shrink-0 bg-oficina-surface font-mono text-xs">
              <span className="text-[11px] text-oficina-bodyText">
                As alterações serão salvas automaticamente e refletidas no quadro Kanban.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-oficina-card border border-oficina-border text-oficina-bodyText font-bold rounded-sm hover:border-oficina-borderDark transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-oficina-terracotta hover:brightness-110 text-white font-bold rounded-sm shadow-sm flex items-center gap-1.5 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingIdeaId ? 'Salvar Alterações' : 'Criar Ideia'}</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL DE SINCRONIZAÇÃO / IMPORTAÇÃO & EXPORTAÇÃO JSON */}
      {/* ========================================================================= */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleConfirmImportJson} className="bg-oficina-card border border-oficina-border rounded-sm max-w-xl w-full shadow-2xl p-6 space-y-4 font-sans">
            
            <div className="flex items-center justify-between border-b border-oficina-border pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-oficina-olive" />
                <h3 className="font-extrabold text-sm text-oficina-darkText uppercase tracking-wider">
                  Sincronização JSON (Usuário &amp; IA)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSyncModalOpen(false);
                  setSyncError('');
                }}
                className="text-oficina-mutedText hover:text-oficina-darkText"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-bold text-oficina-darkText block">
                  Estrutura JSON do Quadro Kanban:
                </label>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="font-mono text-[11px] text-oficina-terracotta hover:underline font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedJson ? 'Copiado para a área de transferência!' : 'Copiar JSON Atual'}</span>
                </button>
              </div>

              <textarea
                required
                rows={10}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-3 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs text-oficina-darkText placeholder:text-oficina-mutedText focus:outline-none focus:border-oficina-darkText resize-none custom-scrollbar"
                placeholder="Cole o array de objetos JSON gerado ou editado..."
              />

              {syncError && (
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono text-xs rounded-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{syncError}</span>
                </div>
              )}

              {syncSuccess && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-mono text-xs rounded-sm flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Kanban atualizado com sucesso a partir do JSON!</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-oficina-border font-mono text-xs">
              <span className="text-[11px] text-oficina-bodyText">
                Aceita lista direta de ideias ou blocos markdown.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSyncModalOpen(false)}
                  className="px-4 py-2 bg-oficina-surface border border-oficina-border text-oficina-bodyText font-bold rounded-sm hover:border-oficina-borderDark"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-oficina-olive hover:brightness-110 text-white font-bold rounded-sm shadow-sm flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Carregar JSON</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
