import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../core/services/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
  data?: unknown;
}

interface NotifState {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

const initialState: NotifState = { items: [], unreadCount: 0, isLoading: false };

export const fetchNotificationsThunk = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const { data } = await api.get('/notifications');
    return data;
  }
);

export const markReadThunk = createAsyncThunk(
  'notifications/markRead',
  async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    return id;
  }
);

export const markAllReadThunk = createAsyncThunk(
  'notifications/markAllRead',
  async () => {
    await api.put('/notifications/read-all');
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markReadThunk.fulfilled, (state, action) => {
        const item = state.items.find((n) => n._id === action.payload);
        if (item && !item.isRead) {
          item.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllReadThunk.fulfilled, (state) => {
        state.items.forEach((n) => { n.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export default notificationsSlice.reducer;
