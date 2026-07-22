import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { loginThunk, logoutThunk } from '../store/authSlice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector((s: RootState) => s.auth);

  const login = (email: string, password: string) =>
    dispatch(loginThunk({ email, password }));

  const logout = () => dispatch(logoutThunk());

  return { user, isAuthenticated, isLoading, error, login, logout };
}
