import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

interface UIState {
  darkMode: boolean;
}

const initialState: UIState = {
  darkMode: Appearance.getColorScheme() === 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) { state.darkMode = !state.darkMode; },
    setDarkMode(state, action: PayloadAction<boolean>) { state.darkMode = action.payload; },
  },
});

export const { toggleDarkMode, setDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
