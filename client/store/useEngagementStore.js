import { create } from "zustand";

const useEngagementStore = create((set, get) => ({
  engagement: [],
  currentPage: 1,
  hasMore: true,
  error: null,
  isLoading: false,
  activeTab: "comments",
  setActiveTab: (tab) =>
    set({ activeTab: tab, engagement: [], currentPage: 1, hasMore: true }),

  fetchEngagement: async (axiosPrivate, postId) => {
    const state = get();
    if (state.isLoading || !state.hasMore) return;

    const isComments = state.activeTab === "comments";
    const endpoint = isComments ? "comments" : "reposts";
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.get(
        `/posts/${endpoint}/${postId}?page=${state.currentPage}&limit=10`
      );
      console.log(res.data);
      set({
        isLoading: false,
        currentPage: state.currentPage + 1,
        hasMore: res.data.length === 10,
        engagement: [...state.engagement, ...res.data], // Append new data
      });
    } catch (e) {
      set({
        error: e.response?.data?.error || "Error fetching posts",
        isLoading: false,
      });
    }
  },
}));

export default useEngagementStore;
