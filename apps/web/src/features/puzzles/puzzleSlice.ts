import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PuzzleOption {
  id: string;
  description?: string;
  imageUrl?: string;
}

interface Puzzle {
  id: string;
  title: string;
  description?: string;
  puzzleType: 'pattern' | 'sequence' | 'logic' | 'shape' | 'odd-one-out';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: PuzzleOption[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
  topic?: string;
  estimatedTime?: number;
  rating: number;
  ratingCount: number;
  completionRate: number;
}

interface PuzzleAttempt {
  id: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  confidence?: number;
  xpEarned: number;
  createdAt: string;
}

interface PuzzleStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  byDifficulty: Record<string, number>;
  byType: Record<string, number>;
}

interface PuzzleState {
  puzzles: Puzzle[];
  currentPuzzle: Puzzle | null;
  attempts: PuzzleAttempt[];
  stats: PuzzleStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: PuzzleState = {
  puzzles: [],
  currentPuzzle: null,
  attempts: [],
  stats: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
};

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Thunks
export const fetchPuzzles = createAsyncThunk(
  'puzzles/fetchPuzzles',
  async (
    params?: { puzzleType?: string; difficulty?: string; category?: string; search?: string; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.puzzleType) queryParams.append('puzzleType', params.puzzleType);
      if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', String(params.page));

      const response = await axios.get(`${API_URL}/puzzles?${queryParams.toString()}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch puzzles');
    }
  }
);

export const fetchPuzzleById = createAsyncThunk(
  'puzzles/fetchPuzzleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/puzzles/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch puzzle');
    }
  }
);

export const submitPuzzleAttempt = createAsyncThunk(
  'puzzles/submitAttempt',
  async (
    data: { puzzleId: string; selectedAnswer: string; timeSpent: number; confidence?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/puzzles/${data.puzzleId}/attempt`, {
        selectedAnswer: data.selectedAnswer,
        timeSpent: data.timeSpent,
        confidence: data.confidence,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit attempt');
    }
  }
);

export const fetchAttempts = createAsyncThunk(
  'puzzles/fetchAttempts',
  async (puzzleId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/puzzles/${puzzleId}/attempts`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attempts');
    }
  }
);

export const submitPuzzleReview = createAsyncThunk(
  'puzzles/submitReview',
  async (
    data: { puzzleId: string; rating: number; comment?: string; helpful?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/puzzles/${data.puzzleId}/review`, {
        rating: data.rating,
        comment: data.comment,
        helpful: data.helpful,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const fetchPuzzleStats = createAsyncThunk(
  'puzzles/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/puzzles/stats/dashboard`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const puzzleSlice = createSlice({
  name: 'puzzles',
  initialState,
  reducers: {
    clearCurrentPuzzle: (state) => {
      state.currentPuzzle = null;
      state.attempts = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Puzzles
    builder
      .addCase(fetchPuzzles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPuzzles.fulfilled, (state, action) => {
        state.loading = false;
        state.puzzles = action.payload.puzzles;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPuzzles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Puzzle By ID
    builder
      .addCase(fetchPuzzleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPuzzleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPuzzle = action.payload;
      })
      .addCase(fetchPuzzleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Submit Attempt
    builder
      .addCase(submitPuzzleAttempt.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitPuzzleAttempt.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitPuzzleAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Attempts
    builder
      .addCase(fetchAttempts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttempts.fulfilled, (state, action) => {
        state.loading = false;
        state.attempts = action.payload.attempts;
      })
      .addCase(fetchAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Submit Review
    builder
      .addCase(submitPuzzleReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitPuzzleReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitPuzzleReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Stats
    builder
      .addCase(fetchPuzzleStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPuzzleStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPuzzleStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentPuzzle, clearError } = puzzleSlice.actions;
export default puzzleSlice.reducer;
