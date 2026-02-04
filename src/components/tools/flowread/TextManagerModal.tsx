'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SavedText } from './types';
import { SAMPLE_TEXTS, SAGE } from './constants';

interface TextManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTexts: SavedText[];
  selectedTextId: string | null;
  onSelectText: (textId: string) => void;
  onAddText: (title: string, content: string) => SavedText;
  onDeleteText: (id: string) => void;
}

export default function TextManagerModal({
  isOpen,
  onClose,
  savedTexts,
  selectedTextId,
  onSelectText,
  onAddText,
  onDeleteText,
}: TextManagerModalProps) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSave = () => {
    if (!newContent.trim()) return;
    const newText = onAddText(newTitle, newContent);
    onSelectText(newText.id);
    setNewTitle('');
    setNewContent('');
    setShowNewForm(false);
    onClose();
  };

  const wordCount = newContent.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const estimatedMinutes = Math.ceil(wordCount / 250);

  const allTexts = [
    ...SAMPLE_TEXTS.map((t) => ({ ...t, type: 'sample' as const })),
    ...savedTexts.map((t) => ({ ...t, type: 'saved' as const })),
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden"
          style={{
            background: '#0f0f0f',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-white font-medium">Manage Training Texts</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors text-xl"
            >
              ×
            </button>
          </div>

          <div className="flex h-[60vh]">
            {/* Left sidebar - text list */}
            <div className="w-1/3 border-r border-white/10 overflow-y-auto">
              <button
                onClick={() => setShowNewForm(true)}
                className="w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-white/5"
                style={{ color: SAGE }}
              >
                + New Text
              </button>

              <div className="px-2 py-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-600 px-2 py-1">Sample Texts</p>
                {SAMPLE_TEXTS.map((text) => (
                  <button
                    key={text.id}
                    onClick={() => {
                      onSelectText(text.id);
                      setShowNewForm(false);
                    }}
                    className={`w-full px-3 py-2 text-left rounded-lg text-sm transition-colors ${
                      selectedTextId === text.id
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <p className="font-medium truncate">{text.title}</p>
                    <p className="text-xs text-gray-500">{text.wordCount} words</p>
                  </button>
                ))}
              </div>

              {savedTexts.length > 0 && (
                <div className="px-2 py-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-600 px-2 py-1">Your Texts</p>
                  {savedTexts.map((text) => (
                    <button
                      key={text.id}
                      onClick={() => {
                        onSelectText(text.id);
                        setShowNewForm(false);
                      }}
                      className={`w-full px-3 py-2 text-left rounded-lg text-sm transition-colors ${
                        selectedTextId === text.id
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <p className="font-medium truncate">{text.title}</p>
                      <p className="text-xs text-gray-500">{text.wordCount} words</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - content/form */}
            <div className="flex-1 p-4 overflow-y-auto">
              {showNewForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Enter a title..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Content
                    </label>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Paste your text here..."
                      rows={10}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Words: {wordCount}</span>
                    <span>Est. time: {estimatedMinutes} min</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowNewForm(false)}
                      className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!newContent.trim()}
                      className="flex-1 py-2 rounded-lg text-white font-medium transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: SAGE }}
                    >
                      Save & Use
                    </button>
                  </div>
                </div>
              ) : selectedTextId ? (
                <div>
                  {(() => {
                    const selectedText = allTexts.find((t) => t.id === selectedTextId);
                    if (!selectedText) return null;

                    return (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-white font-medium">{selectedText.title}</h3>
                            <p className="text-xs text-gray-500">
                              {selectedText.wordCount} words
                            </p>
                          </div>
                          {selectedText.type === 'saved' && (
                            <button
                              onClick={() => onDeleteText(selectedText.id)}
                              className="text-gray-500 hover:text-red-400 text-xs transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                            {selectedText.content}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-600">
                  Select a text or create a new one
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:scale-[1.02]"
              style={{ background: SAGE }}
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
