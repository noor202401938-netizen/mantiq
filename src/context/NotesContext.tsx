import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudyNote } from '../types';

interface NotesContextType {
  notes: StudyNote[];
  addNote: (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => StudyNote;
  updateNote: (id: string, updates: Partial<StudyNote>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  getNotesByChapter: (chapterId: number) => StudyNote[];
  searchNotes: (query: string, categoryFilter?: string, chapterFilter?: number) => StudyNote[];
  exportNotesMarkdown: () => void;
  loadNotes: (newNotes: StudyNote[]) => void;
  resetNotes: () => void;
}

const INITIAL_NOTES: StudyNote[] = [];

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('mantiq_user_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If the only notes present are the legacy demo note IDs, wipe them
          const isLegacyDemoOnly = parsed.length > 0 && parsed.every(
            (n: StudyNote) => ['note_01', 'note_02', 'note_03', 'note_04', 'note_05'].includes(n.id)
          );
          if (isLegacyDemoOnly) {
            localStorage.removeItem('mantiq_user_notes');
            return [];
          }
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('mantiq_user_notes', JSON.stringify(notes));
    } catch (e) {
      console.warn('Storage quota exceeded when saving notes locally:', e);
    }
  }, [notes]);

  const addNote = (noteData: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>): StudyNote => {
    const now = new Date().toISOString();
    const newNote: StudyNote = {
      ...noteData,
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: now,
      updatedAt: now,
      isPinned: noteData.isPinned ?? false
    };

    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<StudyNote>) => {
    const now = new Date().toISOString();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: now } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const getNotesByChapter = (chapterId: number): StudyNote[] => {
    return notes.filter((n) => n.chapterId === chapterId);
  };

  const searchNotes = (query: string, categoryFilter?: string, chapterFilter?: number): StudyNote[] => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      // Category filter
      if (categoryFilter && categoryFilter !== 'all' && n.category !== categoryFilter) {
        return false;
      }
      // Chapter filter
      if (chapterFilter && chapterFilter > 0 && n.chapterId !== chapterFilter) {
        return false;
      }
      // Query search
      if (!q) return true;
      const titleMatch = n.title.toLowerCase().includes(q);
      const contentMatch = n.content.toLowerCase().includes(q);
      const tagMatch = n.tags.some((t) => t.toLowerCase().includes(q));
      const chapterMatch = n.chapterTitle?.toLowerCase().includes(q);
      return titleMatch || contentMatch || tagMatch || chapterMatch;
    });
  };

  const exportNotesMarkdown = () => {
    const header = `# Mantiq — AI Study Guide & Notes Repository\n*Russell & Norvig: Artificial Intelligence: A Modern Approach (4th Edition)*\n*Exported on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    const body = notes
      .sort((a, b) => a.chapterId - b.chapterId)
      .map((n) => {
        return `## [Chapter ${n.chapterId}] ${n.title}\n**Category:** ${n.category.toUpperCase()} | **Tags:** ${n.tags.join(', ')}\n\n${n.content}\n\n*Created: ${new Date(n.createdAt).toLocaleDateString()}*\n\n---`;
      })
      .join('\n\n');

    const fullText = header + body;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mantiq_AI_Study_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadNotes = (newNotes: StudyNote[]) => {
    if (Array.isArray(newNotes)) {
      setNotes(newNotes);
      localStorage.setItem('mantiq_user_notes', JSON.stringify(newNotes));
    }
  };

  const resetNotes = () => {
    setNotes(INITIAL_NOTES);
    localStorage.setItem('mantiq_user_notes', JSON.stringify(INITIAL_NOTES));
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
        getNotesByChapter,
        searchNotes,
        exportNotesMarkdown,
        loadNotes,
        resetNotes
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
