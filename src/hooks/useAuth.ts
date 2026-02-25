// Auth state is now managed by a single AuthProvider in src/context/AuthContext.tsx.
// This file re-exports the hook so all existing imports continue to work unchanged.
export { useAuth } from '@/context/AuthContext';
