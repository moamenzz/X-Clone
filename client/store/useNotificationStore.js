import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  currentPage: 1,
  hasMore: true,
  error: null,
  isLoading: false,

  fetchNotifications: async (axiosPrivate) => {
    const state = get();
    if (state.isLoading || !state.hasMore) return;

    try {
      set({ isLoading: true });
      const res = await axiosPrivate.get(
        `/notifications?page=${state.currentPage}&limit=10`
      );
      console.log(res.data);
      set({
        isLoading: false,
        currentPage: state.currentPage + 1,
        hasMore: res.data.length === 10,
        notifications: [...state.notifications, ...res.data],
      });
    } catch (e) {
      set({
        error: e.response?.data?.error || "Error fetching posts",
        isLoading: false,
      });
    }
  },
}));

export default useNotificationStore;
