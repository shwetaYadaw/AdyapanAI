import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IEnrollment } from '@adyapan/shared';
import { api, extractError } from '../../core/services/api';

interface EnrollmentState {
  enrollments: IEnrollment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  isLoading: false,
  error: null,
};

export const fetchMyCoursesThunk = createAsyncThunk(
  'enrollment/fetchMyCourses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/enrollments/my-courses');
      return data.data as IEnrollment[];
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const enrollCourseThunk = createAsyncThunk(
  'enrollment/enroll',
  async (payload: { courseId: string; paymentId?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/enrollments', payload);
      return data.data as IEnrollment;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const updateProgressThunk = createAsyncThunk(
  'enrollment/updateProgress',
  async (
    payload: { courseId: string; lectureId: string; watchedDuration: number; completed: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.put(`/enrollments/${payload.courseId}/progress`, payload);
      return data.data as IEnrollment;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCoursesThunk.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyCoursesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchMyCoursesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder.addCase(enrollCourseThunk.fulfilled, (state, action) => {
      state.enrollments.unshift(action.payload);
    });

    builder.addCase(updateProgressThunk.fulfilled, (state, action) => {
      const idx = state.enrollments.findIndex(
        (e) => e.courseId === action.payload.courseId
      );
      if (idx !== -1) state.enrollments[idx] = action.payload;
    });
  },
});

export default enrollmentSlice.reducer;
