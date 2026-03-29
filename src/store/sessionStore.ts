import { create } from 'zustand';

interface SessionState {
  sessionId: string | null;
  isActive: boolean;
  correctionMode: 'LIGHT' | 'STRICT' | 'FLUENCY';
  setSessionId: (id: string | null) => void;
  setIsActive: (active: boolean) => void;
  setCorrectionMode: (mode: 'LIGHT' | 'STRICT' | 'FLUENCY') => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  isActive: false,
  correctionMode: 'LIGHT',
  setSessionId: (id) => set({ sessionId: id }),
  setIsActive: (active) => set({ isActive: active }),
  setCorrectionMode: (mode) => set({ correctionMode: mode }),
  reset: () => set({ sessionId: null, isActive: false }),
}));
