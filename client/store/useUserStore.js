import { create } from "zustand";
import { axiosPrivate } from "../lib/axiosInstances";

const useUserStore = create((set, get) => ({
  users: [],
  sidebarUsers: [],
  currentPage: 1,
  hasMore: true,
  activeTab: "suggested-users",
  error: null,
  isLoading: false,
  setActiveTab: (tab) =>
    set({ activeTab: tab, users: [], currentPage: 1, hasMore: true }),

  fetchUsers: async (axiosPrivate) => {
    const state = get();
    if (state.isLoading || !state.hasMore) return;
    const isSuggestedUsers = state.activeTab === "suggested-users";
    const isCreatorsForYou = state.activeTab === "creators-for-you";
    const endpoint = isSuggestedUsers
      ? "suggested-users"
      : isCreatorsForYou
      ? "creators-for-you"
      : "you-follow";
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.get(
        `/users/${endpoint}?page=${state.currentPage}&limit=10`
      );

      set({
        users: [...state.users, ...res.data],
        currentPage: state.currentPage + 1,
        hasMore: res.data.length === 10,
        error: null,
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false, error: e.response.data.message });
    }
  },

  fetchSidebarUsers: async (axiosPrivate) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.get(
        "/users/suggested-users?page=1&limit=3"
      );

      set({
        sidebarUsers: res.data,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      set({ isLoading: false, error: e.response.data.message });
    }
  },
  followUnfollowUser: async (axiosPrivate, userId) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.put(`/users/follow/${userId}`);
      set({ isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e.response.data.message });
    }
  },
  updateProfile: async (axiosPrivate, formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosPrivate.put("/users/update-profile", formData);
      set({ isLoading: false });
    } catch (e) {
      const errorMessage =
        e.response?.data?.message || "Failed to update profile";
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage); // Throw with actual error message
    }
  },
}));

export default useUserStore;
