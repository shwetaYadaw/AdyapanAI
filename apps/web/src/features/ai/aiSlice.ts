import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIChatMessage } from '@adyapan/shared';
import { api, extractError } from '../../services/api';

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
  async (
    payload: { message: string; context?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { ai: AIState };
      const { data } = await api.post('/ai/chat', {
        message: payload.message,
        conversationId: state.ai.conversationId,
        context: payload.context,
      });
      return data.data as { reply: string; conversationId: string };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const generateQuizThunk = createAsyncThunk(
  'ai/generateQuiz',
  async (
    payload: { topic: string; count: number; difficulty: string; type: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/ai/generate-quiz', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const generateFlashcardsThunk = createAsyncThunk(
  'ai/generateFlashcards',
  async (payload: { topic: string; count: number }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/ai/generate-flashcards', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addUserMessage(state, action: PayloadAction<string>) {
      state.chatMessages.push({
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    clearChat(state) {
      state.chatMessages = [];
      state.conversationId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessageThunk.pending, (state) => {
        state.isThinking = true;
        state.error = null;
      })
      .addCase(sendChatMessageThunk.fulfilled, (state, action) => {
        state.isThinking = false;
        state.conversationId = action.payload.conversationId;
        state.chatMessages.push({
          role: 'assistant',
          content: action.payload.reply,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendChatMessageThunk.rejected, (state, action) => {
        state.isThinking = false;
        state.error = action.payload as string;
      });
  },
});

export const { addUserMessage, clearChat } = aiSlice.actions;
export default aiSlice.reducer;
