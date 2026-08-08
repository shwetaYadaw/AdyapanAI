import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
}

// Safe initializer — never call window/localStorage at module level in Redux
function getInitialDarkMode(): boolean {
  try {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
  } catch {
    // localStorage not available
  }
  return false; // Default to light mode
}

const initialState: UIState = {
  darkMode: getInitialDarkMode(),
  sidebarOpen: true,
  mobileSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      try {
        localStorage.setItem('darkMode', String(state.darkMode));
        document.documentElement.classList.toggle('dark', state.darkMode);
      } catch { /* ignore */ }
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
      try {
        localStorage.setItem('darkMode', String(action.payload));
        document.documentElement.classList.toggle('dark', action.payload);
      } catch { /* ignore */ }
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setMobileSidebar(state, action: PayloadAction<boolean>) {
      state.mobileSidebarOpen = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode, toggleSidebar, setSidebarOpen, setMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;
