import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BranchInterface } from '@/types/branch';
import { branchService } from '@/services/branch-service';
import { useAuthStore } from './auth-store';

export const useBranchStore = defineStore('branch', () => {
  const authStore = useAuthStore();
  const branches = ref<BranchInterface[]>([]);
  const isLoading = ref(false);

  // Default selected branch: null means "All Branches" (for admin) or specific branchId
  const savedBranch = localStorage.getItem('selected_branch_id');
  const selectedBranchId = ref<number | null>(
    savedBranch !== null ? (savedBranch === 'all' ? null : Number(savedBranch)) : null,
  );

  const activeBranches = computed(() =>
    branches.value.filter((b) => b.status === 'active' || !b.status),
  );

  const currentBranch = computed(() => {
    if (selectedBranchId.value === null) return null;
    return branches.value.find((b) => b.branchId === selectedBranchId.value) || null;
  });

  const selectedBranchName = computed(() => {
    if (selectedBranchId.value === null) {
      return authStore.isAdmin ? 'ทุกสาขา (All Branches)' : (authStore.currentUser?.branchName || 'สาขาหลัก');
    }
    return currentBranch.value?.branchName || `สาขา #${selectedBranchId.value}`;
  });

  const fetchBranches = async () => {
    isLoading.value = true;
    try {
      const res = await branchService.getAll(1, 100);
      branches.value = res.data;

      // If non-admin user, lock to their branch
      if (!authStore.isAdmin && authStore.currentUser?.branchId) {
        selectedBranchId.value = authStore.currentUser.branchId;
      }
    } catch (err) {
      console.warn('Failed to fetch branches:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const setSelectedBranchId = (id: number | null) => {
    selectedBranchId.value = id;
    if (id === null) {
      localStorage.setItem('selected_branch_id', 'all');
    } else {
      localStorage.setItem('selected_branch_id', String(id));
    }
  };

  return {
    branches,
    activeBranches,
    selectedBranchId,
    currentBranch,
    selectedBranchName,
    isLoading,
    fetchBranches,
    setSelectedBranchId,
  };
});
