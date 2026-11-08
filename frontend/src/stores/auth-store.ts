import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AuthUser, LoginPayload } from '@/types/auth';
import { authService } from '@/services/auth-service';
import { employeeService } from '@/services/employee-service';

export const useAuthStore = defineStore('auth', () => {
  const getInitialUser = (): AuthUser | null => {
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  };

  const currentUser = ref<AuthUser | null>(getInitialUser());
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed((): boolean => !!currentUser.value || !!token.value);

  const login = async (payload: LoginPayload): Promise<AuthUser> => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await authService.login(payload);
      if (res.user.branch?.branchName && !res.user.branchName) {
        res.user.branchName = res.user.branch.branchName;
      }
      currentUser.value = res.user;
      token.value = res.accessToken;
      localStorage.setItem('auth_token', res.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      return res.user;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      error.value = msg;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProfile = async (): Promise<AuthUser | null> => {
    if (!currentUser.value?.employeeId) return null;
    try {
      const user = await employeeService.getById(currentUser.value.employeeId);
      if (user.branch?.branchName && !user.branchName) {
        user.branchName = user.branch.branchName;
      }
      currentUser.value = user;
      localStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    } catch {
      return currentUser.value;
    }
  };

  const updateProfile = async (payload: Partial<AuthUser>): Promise<AuthUser> => {
    if (!currentUser.value?.employeeId) throw new Error('No active user');
    isLoading.value = true;
    try {
      const updated = await employeeService.update(currentUser.value.employeeId, payload);
      currentUser.value = updated;
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = (): void => {
    currentUser.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return {
    currentUser,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    fetchProfile,
    updateProfile,
    logout,
  };
});
