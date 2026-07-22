import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { IUser } from '@adyapan/shared';
import { api, extractError } from '../services/api';

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      const { accessToken, refreshToken, user } = data.data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      return { accessToken, user };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try { await api.post('/auth/logout'); } catch { /* ignore */ }
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('user');
});

export const restoreAuthThunk = createAsyncThunk('auth/restore', async () => {
  const token = await SecureStore.getItemAsync('accessToken');
  const userStr = await SecureStore.getItemAsync('user');
  if (!token || !userStr) return null;
  return { accessToken: token, user: JSON.parse(userStr) as IUser };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; })
      .addCase(logoutThunk.fulfilled, (s) => {
        s.user = null; s.accessToken = null; s.isAuthenticated = false;
      })
      .addCase(restoreAuthThunk.fulfilled, (s, a) => {
        if (a.payload) {
          s.user = a.payload.user;
          s.accessToken = a.payload.accessToken;
          s.isAuthenticated = true;
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
