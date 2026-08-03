import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ICourse, ICourseFilters, ICoursePagination } from '@adyapan/shared';
import { api, extractError } from '../../core/services/api';

interface CoursesState {
  courses: ICourse[];
  currentCourse: ICourse | null;
  pagination: { total: number; page: number; pages: number; limit: number } | null;
  filters: ICourseFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  pagination: null,
  filters: { page: 1, limit: 12 },
  isLoading: false,
  error: null,
};

export const fetchCoursesThunk = createAsyncThunk(
  'courses/fetchAll',
  async (filters: ICourseFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.append(k, String(v));
      });
      const { data } = await api.get(`/courses?${params.toString()}`);
      return data as {
        success: boolean;
        data: ICourse[];
        pagination: { total: number; page: number; pages: number; limit: number };
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const fetchCourseBySlugThunk = createAsyncThunk(
  'courses/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/courses/${slug}`);
      return data.data.course as ICourse;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<ICourseFilters>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = { page: 1, limit: 12 };
    },
    clearCurrentCourse(state) {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesThunk.pending, (state) => {
        state.isLoading = true; state.error = null;
      })
      .addCase(fetchCoursesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCoursesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCourseBySlugThunk.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCourseBySlugThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseBySlugThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters, clearCurrentCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
