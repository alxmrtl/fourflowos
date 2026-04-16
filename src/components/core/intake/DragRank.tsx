'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AMETHYST, STEEL } from '@/styles/brand-colors';

export interface RankItem {
  id: string;
  label: string;
}

interface Props {
  text: string;
  items: RankItem[];
  onSubmit: (orderedIds: string[]) => void;
}

export default function DragRank({ text, items: initialItems, onSubmit }: Props) {
  const [items, setItems] = useState<RankItem[]>(initialItems);
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  function handleDragStart(id: string) {
    setDragging(id);
  }

  function handleDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (overId !== dragging) setDragOverId(overId);
  }

  function handleDrop(dropId: string) {
    if (!dragging || dragging === dropId) {
      setDragging(null);
      setDragOverId(null);
      return;
    }
    setItems(prev => {
      const next = [...prev];
      const fromIdx = next.findIndex(i => i.id === dragging);
      const toIdx   = next.findIndex(i => i.id === dropId);
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDragging(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDragging(null);
    setDragOverId(null);
  }

  // Touch support: basic touch-drag via pointer events
  const pointerStartY = useRef<number>(0);
  const pointerItemId = useRef<string | null>(null);

  function handlePointerDown(e: React.PointerEvent, id: string) {
    if (e.pointerType === 'touch') {
      pointerStartY.current = e.clientY;
      pointerItemId.current = id;
      setDragging(id);
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!pointerItemId.current || !listRef.current) return;
    const els = listRef.current.querySelectorAll('[data-rank-item]');
    for (const el of els) {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const overId = (el as HTMLElement).dataset.rankItem ?? null;
        if (overId && overId !== pointerItemId.current) setDragOverId(overId);
        break;
      }
    }
  }

  function handlePointerUp() {
    if (pointerItemId.current && dragOverId && dragOverId !== pointerItemId.current) {
      handleDrop(dragOverId);
    }
    pointerItemId.current = null;
    setDragging(null);
    setDragOverId(null);
  }

  function submit() {
    setSubmitted(true);
    onSubmit(items.map(i => i.id));
  }

  return (
    <div className="flex flex-col">
      <p className="text-[9px] uppercase tracking-widest text-white/25 mb-5">Priority ranking</p>
      <p className="text-white text-base font-medium leading-snug mb-5">{text}</p>
      <p className="text-[10px] text-white/25 mb-4">Drag to reorder — most important at top</p>

      <div
        ref={listRef}
        className="space-y-2 mb-5 select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {items.map((item, idx) => {
          const isDragging  = dragging === item.id;
          const isDragOver  = dragOverId === item.id;
          return (
            <div
              key={item.id}
              data-rank-item={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={e => handleDragOver(e, item.id)}
              onDrop={() => handleDrop(item.id)}
              onDragEnd={handleDragEnd}
              onPointerDown={e => handlePointerDown(e, item.id)}
            >
              <motion.div
                layout
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl border cursor-grab active:cursor-grabbing"
                style={{
                  background: isDragOver ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                  borderColor: isDragOver ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                  opacity: isDragging ? 0.4 : 1,
                  transition: 'background 0.12s, border-color 0.12s',
                }}
              >
                <span className="text-white/20 text-xs select-none">⠿</span>
                <span className="text-[10px] text-white/35 w-3.5 flex-shrink-0">{idx + 1}</span>
                <span className="text-sm text-white/65 leading-snug">{item.label}</span>
              </motion.div>
            </div>
          );
        })}
      </div>

      <button
        onClick={submit}
        disabled={submitted}
        className="self-start px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ background: `linear-gradient(135deg, ${STEEL}, ${AMETHYST})` }}
      >
        {submitted ? 'Confirmed' : 'Confirm order →'}
      </button>
    </div>
  );
}
