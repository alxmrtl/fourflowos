'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CuriosityItem {
  id: string;
  text: string;
  source: string;
}

interface Intersection {
  id: string;
  itemIds: string[];
  description: string;
}

interface CuriosityPoolProps {
  items: CuriosityItem[];
  intersections: Intersection[];
  onAddItem: (text: string) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, text: string) => void;
  onAddIntersection: (itemIds: string[], description: string) => void;
  onRemoveIntersection: (id: string) => void;
}

const AMETHYST = '#7A4DA4';

const SOURCE_TINTS: Record<string, string> = {
  freeform: '#7A4DA4',
  strengths: '#8B4DA0',
  timeless: '#6A5DAA',
  sparks: '#8A55B5',
  secret: '#6B3D94',
};

function SourceIcon({ source }: { source: string }) {
  const size = 14;
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (source) {
    case 'freeform':
      return (
        <svg {...common}>
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case 'strengths':
      return (
        <svg {...common}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'timeless':
      return (
        <svg {...common}>
          <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-5.095-8 0-8zM5.822 8c5.096 0 5.096 8 0 8-5.095 0-5.095-8 0-8z" strokeWidth={1.5} />
          <path d="M12 8c2.5 0 4 2 4 4s-1.5 4-4 4-4-2-4-4 1.5-4 4-4z" strokeWidth={1.5} />
        </svg>
      );
    case 'sparks':
      return (
        <svg {...common}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'secret':
      return (
        <svg {...common}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

// Pill dimensions for position calculations
const PILL_W = 140;
const PILL_H = 40;
const PILL_PAD = 10;

function calculatePositions(count: number, containerWidth: number, containerHeight: number) {
  const cols = Math.max(1, Math.floor(containerWidth / (PILL_W + PILL_PAD)));
  const rows = Math.max(1, Math.floor(containerHeight / (PILL_H + PILL_PAD)));

  const positions: { x: number; y: number }[] = [];
  const usedCells = new Set<string>();

  for (let i = 0; i < count; i++) {
    let placed = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      const col = Math.floor(Math.random() * cols);
      const row = Math.floor(Math.random() * rows);
      const key = `${col}-${row}`;
      if (!usedCells.has(key)) {
        usedCells.add(key);
        const jitterX = (Math.random() - 0.5) * PILL_PAD * 2;
        const jitterY = (Math.random() - 0.5) * PILL_PAD * 2;
        positions.push({
          x: Math.max(0, Math.min(containerWidth - PILL_W, col * (PILL_W + PILL_PAD) + jitterX)),
          y: Math.max(0, Math.min(containerHeight - PILL_H, row * (PILL_H + PILL_PAD) + jitterY)),
        });
        placed = true;
        break;
      }
    }
    if (!placed) {
      positions.push({
        x: (i % cols) * (PILL_W + PILL_PAD),
        y: Math.floor(i / cols) * (PILL_H + PILL_PAD),
      });
    }
  }
  return positions;
}


export default function CuriosityPool({
  items,
  intersections,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onAddIntersection,
  onRemoveIntersection,
}: CuriosityPoolProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [intersectionInput, setIntersectionInput] = useState('');
  const [addInput, setAddInput] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIntersection, setHoveredIntersection] = useState<string | null>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 350 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (poolRef.current && !isMobile) {
      const rect = poolRef.current.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: Math.max(350, Math.min(450, items.length * 28)) });
    }
  }, [items.length, isMobile]);

  const positions = useMemo(
    () => calculatePositions(items.length, containerSize.w, containerSize.h),
    [items.length, containerSize.w, containerSize.h]
  );

  // Map item id → index for position lookups
  const idToIndex = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item, i) => map.set(item.id, i));
    return map;
  }, [items]);

  const toggleSelect = useCallback((id: string) => {
    if (editMode) return;
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, [editMode]);

  const handleSaveIntersection = () => {
    if (selectedIds.length < 2 || !intersectionInput.trim()) return;
    onAddIntersection(selectedIds, intersectionInput.trim());
    setSelectedIds([]);
    setIntersectionInput('');
  };

  const handleAddItem = () => {
    if (!addInput.trim()) return;
    onAddItem(addInput.trim());
    setAddInput('');
  };

  const startEdit = (item: CuriosityItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdateItem(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  const handleDiscoverConnection = () => {
    if (items.length < 3) return;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setSelectedIds(shuffled.slice(0, 3).map(i => i.id));
  };

  const connectedItems = new Set(intersections.flatMap(ix => ix.itemIds));

  const renderPill = (item: CuriosityItem) => {
    const isSelected = selectedIds.includes(item.id);
    const isConnected = connectedItems.has(item.id);
    const isEditing = editingId === item.id;
    const tint = SOURCE_TINTS[item.source] || AMETHYST;
    // Highlight pills that belong to the hovered intersection
    const isHighlightedByHover = hoveredIntersection
      ? intersections.find(ix => ix.id === hoveredIntersection)?.itemIds.includes(item.id)
      : false;

    const active = isSelected || isHighlightedByHover;

    return (
      <div
        className="rounded-full border transition-all duration-200 flex items-center whitespace-nowrap"
        style={{
          padding: active ? '8px 14px' : '5px 10px',
          fontSize: active ? '0.875rem' : '0.75rem',
          gap: active ? '6px' : '4px',
          background: active
            ? `${tint}30`
            : isConnected
              ? `${tint}10`
              : `${tint}06`,
          borderColor: active
            ? tint
            : isConnected
              ? `${tint}30`
              : 'rgba(255,255,255,0.06)',
          color: active ? '#e0d0f0' : '#999',
        }}
      >
        <span className={`flex-shrink-0 ${active ? 'opacity-60' : 'opacity-30'}`}><SourceIcon source={item.source} /></span>
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setEditingId(null); } }}
            className="bg-transparent outline-none text-white min-w-[80px]"
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span>{item.text}</span>
        )}
        {editMode && !isEditing && (
          <button
            onClick={e => { e.stopPropagation(); onRemoveItem(item.id); }}
            className="ml-1 w-4 h-4 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center text-xs flex-shrink-0"
          >
            &times;
          </button>
        )}
      </div>
    );
  };

  // Live-track connection lines to follow drifting pills via RAF
  useEffect(() => {
    if (isMobile || intersections.length === 0) return;

    const update = () => {
      const pool = poolRef.current;
      const svg = svgRef.current;
      if (pool && svg) {
        const poolRect = pool.getBoundingClientRect();

        intersections.forEach(ix => {
          const groupEl = svg.querySelector(`[data-conn-id="${ix.id}"]`);
          if (!groupEl) return;

          const centers: { cx: number; cy: number }[] = [];
          ix.itemIds.forEach(id => {
            const el = pillRefs.current.get(id);
            if (!el) return;
            const r = el.getBoundingClientRect();
            centers.push({
              cx: r.left + r.width / 2 - poolRect.left,
              cy: r.top + r.height / 2 - poolRect.top,
            });
          });

          let lineIdx = 0;
          for (let a = 0; a < centers.length; a++) {
            for (let b = a + 1; b < centers.length; b++) {
              const visLine = groupEl.querySelector(`[data-line="${lineIdx}"]`) as SVGLineElement | null;
              const hitLine = groupEl.querySelector(`[data-hit="${lineIdx}"]`) as SVGLineElement | null;
              if (visLine) {
                visLine.setAttribute('x1', String(centers[a].cx));
                visLine.setAttribute('y1', String(centers[a].cy));
                visLine.setAttribute('x2', String(centers[b].cx));
                visLine.setAttribute('y2', String(centers[b].cy));
              }
              if (hitLine) {
                hitLine.setAttribute('x1', String(centers[a].cx));
                hitLine.setAttribute('y1', String(centers[a].cy));
                hitLine.setAttribute('x2', String(centers[b].cx));
                hitLine.setAttribute('y2', String(centers[b].cy));
              }
              lineIdx++;
            }
          }

          if (centers.length >= 2) {
            const midX = centers.reduce((s, c) => s + c.cx, 0) / centers.length;
            const midY = centers.reduce((s, c) => s + c.cy, 0) / centers.length;
            const tooltip = pool.querySelector(`[data-tooltip="${ix.id}"]`) as HTMLElement | null;
            if (tooltip) {
              tooltip.style.left = `${midX}px`;
              tooltip.style.top = `${midY}px`;
            }
          }
        });
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isMobile, intersections]);

  // Pre-compute line pair counts for rendering SVG elements
  const connectionLineData = useMemo(() => {
    return intersections.map(ix => {
      const validCount = ix.itemIds.filter(id => idToIndex.has(id)).length;
      if (validCount < 2) return null;
      const pairCount = (validCount * (validCount - 1)) / 2;
      return { id: ix.id, description: ix.description, pairCount };
    }).filter(Boolean) as { id: string; description: string; pairCount: number }[];
  }, [intersections, idToIndex]);

  const MAX_SPARKS = 7;
  const emptySlots = Math.max(0, MAX_SPARKS - intersections.length);

  return (
    <div>
      {/* Top bar: Discover + intersection input + Edit toggle */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          onClick={handleDiscoverConnection}
          disabled={items.length < 3}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${AMETHYST}, ${AMETHYST}cc)`,
            boxShadow: `0 2px 12px ${AMETHYST}30`,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Discover
        </button>

        {/* Inline intersection input area */}
        <div className="flex-1 min-w-0">
          {selectedIds.length >= 2 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-shrink-0">
                {selectedIds.map(id => {
                  const item = items.find(i => i.id === id);
                  return item ? (
                    <span
                      key={id}
                      className="px-2 py-0.5 rounded-full text-[11px]"
                      style={{ background: `${AMETHYST}30`, color: '#d0b8f0' }}
                    >
                      {item.text}
                    </span>
                  ) : null;
                })}
              </div>
              <input
                type="text"
                value={intersectionInput}
                onChange={e => setIntersectionInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveIntersection(); }}
                placeholder="What connects these?"
                className="flex-1 min-w-[120px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                autoFocus
              />
              <button
                onClick={handleSaveIntersection}
                disabled={!intersectionInput.trim()}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-white transition-all disabled:opacity-30 flex-shrink-0"
                style={{ background: AMETHYST }}
              >
                Save
              </button>
              <button
                onClick={() => { setSelectedIds([]); setIntersectionInput(''); }}
                className="text-gray-500 hover:text-white text-xs flex-shrink-0"
              >
                &times;
              </button>
            </div>
          ) : (
            <span className="text-xs text-gray-600">click 3 items or hit Discover</span>
          )}
        </div>

        <button
          onClick={() => { setEditMode(!editMode); setEditingId(null); setSelectedIds([]); }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex-shrink-0 ${
            editMode
              ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
              : 'border-white/10 text-gray-500 hover:text-white hover:border-white/20'
          }`}
        >
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Pool + Sparks sidebar */}
      <div className={isMobile ? '' : 'flex gap-4'}>
      {/* Pool of items */}
      <div className={isMobile ? '' : 'flex-1 min-w-0'}>
      {isMobile ? (
        <div className="flex flex-wrap gap-2.5 mb-6">
          <AnimatePresence>
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: isSelected ? 1.05 : 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    if (editingId === item.id) return;
                    if (editMode) startEdit(item);
                    else toggleSelect(item.id);
                  }}
                  className="cursor-pointer"
                >
                  {renderPill(item)}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {!editMode && (
            showAddInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={addInput}
                  onChange={e => setAddInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddItem();
                    if (e.key === 'Escape') { setShowAddInput(false); setAddInput(''); }
                  }}
                  placeholder="New curiosity..."
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                  autoFocus
                />
                <button onClick={handleAddItem} className="px-3 py-2 rounded-full text-sm font-medium" style={{ background: `${AMETHYST}30`, color: AMETHYST }}>Add</button>
                <button onClick={() => { setShowAddInput(false); setAddInput(''); }} className="text-gray-500 hover:text-white text-sm">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddInput(true)}
                className="px-3.5 py-2 rounded-full text-sm border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-colors"
              >
                + Add more
              </button>
            )
          )}
        </div>
      ) : (
        <div
          ref={poolRef}
          className="relative mb-4 rounded-xl border border-white/5 overflow-hidden"
          style={{
            height: containerSize.h,
            background: 'radial-gradient(ellipse at center, rgba(122,77,164,0.04) 0%, transparent 70%)',
          }}
        >
          {/* SVG connection lines - live tracked */}
          {connectionLineData.length > 0 && (
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            >
              {connectionLineData.map(conn => (
                <g key={conn.id} data-conn-id={conn.id}>
                  {Array.from({ length: conn.pairCount }).map((_, li) => (
                    <line
                      key={li}
                      data-line={li}
                      x1={0} y1={0} x2={0} y2={0}
                      stroke={hoveredIntersection === conn.id ? `${AMETHYST}90` : `${AMETHYST}25`}
                      strokeWidth={hoveredIntersection === conn.id ? 2 : 1}
                      strokeDasharray={hoveredIntersection === conn.id ? 'none' : '4 6'}
                      style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                    />
                  ))}
                  {Array.from({ length: conn.pairCount }).map((_, li) => (
                    <line
                      key={`hit-${li}`}
                      data-hit={li}
                      x1={0} y1={0} x2={0} y2={0}
                      stroke="transparent"
                      strokeWidth={14}
                      style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredIntersection(conn.id)}
                      onMouseLeave={() => setHoveredIntersection(null)}
                    />
                  ))}
                </g>
              ))}
            </svg>
          )}

          {/* Hover tooltip for connection - position updated by RAF */}
          <AnimatePresence>
            {hoveredIntersection && (() => {
              const conn = connectionLineData.find(c => c.id === hoveredIntersection);
              if (!conn) return null;
              return (
                <motion.div
                  key={conn.id}
                  data-tooltip={conn.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute z-20 px-3 py-1.5 rounded-lg text-xs text-gray-200 max-w-[220px] text-center pointer-events-none"
                  style={{
                    left: 0,
                    top: 0,
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(20,15,30,0.92)',
                    border: `1px solid ${AMETHYST}40`,
                    boxShadow: `0 0 12px ${AMETHYST}30`,
                  }}
                >
                  {conn.description}
                  <button
                    onClick={() => { onRemoveIntersection(conn.id); setHoveredIntersection(null); }}
                    className="ml-2 text-gray-500 hover:text-red-400 pointer-events-auto"
                  >
                    &times;
                  </button>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Floating pills */}
          <AnimatePresence>
            {items.map((item, index) => {
              const pos = positions[index] || { x: 0, y: 0 };
              const isSelected = selectedIds.includes(item.id);
              const isConnected = connectedItems.has(item.id);
              const tint = SOURCE_TINTS[item.source] || AMETHYST;
              const driftDurX = 6 + (index % 5);
              const driftDurY = 5 + ((index * 3) % 4);

              const glowValue = isSelected
                ? `0 0 20px ${tint}80`
                : isConnected
                  ? `0 0 8px ${tint}25`
                  : undefined;

              return (
                <motion.div
                  key={item.id}
                  ref={(el: HTMLDivElement | null) => {
                    if (el) pillRefs.current.set(item.id, el);
                    else pillRefs.current.delete(item.id);
                  }}
                  initial={{ opacity: 0, scale: 0.8, x: pos.x, y: pos.y }}
                  animate={{
                    opacity: isSelected ? 1 : 0.7,
                    scale: isSelected ? 1.15 : 0.88,
                    x: [pos.x - 15, pos.x + 15, pos.x - 15],
                    y: [pos.y - 10, pos.y + 10, pos.y - 10],
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    x: { duration: driftDurX, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: driftDurY, repeat: Infinity, ease: 'easeInOut' },
                    scale: { duration: 0.3 },
                    opacity: { duration: 0.3 },
                  }}
                  onClick={() => {
                    if (editingId === item.id) return;
                    if (editMode) startEdit(item);
                    else toggleSelect(item.id);
                  }}
                  className="absolute cursor-pointer rounded-full"
                  style={{
                    left: 0,
                    top: 0,
                    zIndex: isSelected ? 10 : 1,
                    filter: glowValue
                      ? `drop-shadow(${glowValue})`
                      : `drop-shadow(0 0 6px ${tint}35)`,
                  }}
                >
                  {renderPill(item)}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add more - floating bottom right */}
          {!editMode && (
            <div className="absolute bottom-3 right-3 z-10">
              {showAddInput ? (
                <div className="flex items-center gap-2 bg-gray-900/90 rounded-full px-2 py-1 backdrop-blur-sm">
                  <input
                    type="text"
                    value={addInput}
                    onChange={e => setAddInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddItem();
                      if (e.key === 'Escape') { setShowAddInput(false); setAddInput(''); }
                    }}
                    placeholder="New curiosity..."
                    className="px-3 py-1.5 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:outline-none"
                    autoFocus
                  />
                  <button onClick={handleAddItem} className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `${AMETHYST}30`, color: AMETHYST }}>Add</button>
                  <button onClick={() => { setShowAddInput(false); setAddInput(''); }} className="text-gray-500 hover:text-white text-xs px-1">&times;</button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddInput(true)}
                  className="px-3.5 py-2 rounded-full text-sm border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-colors bg-gray-900/50 backdrop-blur-sm"
                >
                  + Add more
                </button>
              )}
            </div>
          )}
        </div>
      )}

      </div>{/* end pool column */}

      {/* Curiosity Sparks sidebar - desktop only */}
      {!isMobile && (
        <div className="w-56 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={AMETHYST} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: AMETHYST }}>
              Curiosity Sparks
            </h3>
          </div>
          <div className="space-y-2">
            {intersections.map((ix, i) => (
              <motion.div
                key={ix.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group px-3 py-2 rounded-lg border transition-colors cursor-default"
                style={{
                  background: hoveredIntersection === ix.id ? `${AMETHYST}15` : 'rgba(255,255,255,0.02)',
                  borderColor: hoveredIntersection === ix.id ? `${AMETHYST}40` : 'rgba(255,255,255,0.06)',
                }}
                onMouseEnter={() => setHoveredIntersection(ix.id)}
                onMouseLeave={() => setHoveredIntersection(null)}
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="text-xs text-gray-300 leading-relaxed">{ix.description}</p>
                  <button
                    onClick={() => onRemoveIntersection(ix.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs flex-shrink-0 mt-0.5"
                  >
                    &times;
                  </button>
                </div>
                <AnimatePresence>
                  {hoveredIntersection === ix.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-1 mt-1.5 overflow-hidden"
                    >
                      {ix.itemIds.map(id => {
                        const item = items.find(i => i.id === id);
                        return item ? (
                          <span key={id} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${AMETHYST}15`, color: '#b09cd0' }}>
                            {item.text}
                          </span>
                        ) : null;
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {/* Empty placeholder slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="px-3 py-2 rounded-lg border border-dashed border-white/5 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${AMETHYST}20` }} />
                <span className="text-[11px] text-gray-700 italic">undiscovered</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>{/* end flex row */}

      {/* Mobile-only: saved intersections list */}
      {isMobile && intersections.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Connections
          </h3>
          <div className="space-y-3">
            {intersections.map(ix => (
              <motion.div
                key={ix.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 group"
              >
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {ix.itemIds.map(id => {
                    const item = items.find(i => i.id === id);
                    return item ? (
                      <span
                        key={id}
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: `${AMETHYST}20`, color: '#c0a8e0' }}
                      >
                        {item.text}
                      </span>
                    ) : (
                      <span key={id} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-600">
                        (removed)
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-gray-300 leading-relaxed">{ix.description}</p>
                  <button
                    onClick={() => onRemoveIntersection(ix.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
