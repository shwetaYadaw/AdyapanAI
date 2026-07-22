import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIChatMessage } from '@adyapan/shared';
import { api } from '../services/api';

interface AIState {
  chatMessages: AIChatMessage[];
  conversationId: string | null;
  isThinking: boolean;
  error: string | null;
}

const initialState: AIState = {
  chatMessages: [],
  conversationId: null,
  isThinking: false,
  error: null,
};

export const sendChatMessageThunk = createAsyncThunk(
  'ai/sendChat',
  async (payload: { message: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { ai: AIState };
      const { data } = await api.post('/ai/chat', {
        message: payload.message,
        conversationId: state.ai.conversationId,
      });
      return data as { reply: string; conversationId: string };
    } catch {
      return rejectWithValue('AI is unavailable. Please try again.');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addUserMessage(state, action: PayloadAction<string>) {
      state.chatMessages.push({ role: 'user', content: action.payload, timestamp: new Date().toISOString() });
    },
    clearChat(state) {
      state.chatMessages = [];
      state.conversationId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessageThunk.pending, (s) => { s.isThinking = true; s.error = null; })
      .addCase(sendChatMessageThunk.fulfilled, (s, a) => {
        s.isThinking = false;
        s.conversationId = a.payload.conversationId;
        s.chatMessages.push({ role: 'assistant', content: a.payload.reply, timestamp: new Date().toISOString() });
      })
      .addCase(sendChatMessageThunk.rejected, (s, a) => {
        s.isThinking = false;
        s.error = a.payload as string;
      });
  },
});

export const { addUserMessage, clearChat } = aiSlice.actions;
export default aiSlice.reducer;
