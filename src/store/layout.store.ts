import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutStoreState {
  isDesktopCollapsed: boolean;
  isMobileOpen: boolean;
  toggleDesktopCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
}

export const useLayoutStore = create<LayoutStoreState>()(
  persist(
    (set) => ({
      isDesktopCollapsed: false,
      isMobileOpen: false,
      toggleDesktopCollapsed: () =>
        set((state) => ({ isDesktopCollapsed: !state.isDesktopCollapsed })),
      setMobileOpen: (open) => set({ isMobileOpen: open }),
      toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
    }),
    {
      name: 'layout-store',
      partialize: (state) => ({ isDesktopCollapsed: state.isDesktopCollapsed }),
    }
  )
);
