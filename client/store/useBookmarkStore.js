import { create } from "zustand";

const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  currentPage: 1,
  hasMore: true,
  error: null,
  isLoading: false,
  activeTab: "bookmarks",
  setActiveTab: (tab) =>
    set({ activeTab: tab, bookmarks: [], currentPage: 1, hasMore: true }),

  fetchBookmarks: async (axiosPrivate) => {
    const state = get();
    if (state.isLoading || !state.hasMore) return;

    const isBookmarks = state.activeTab === "bookmarks";
    const endpoint = isBookmarks ? "bookmarks" : "liked-posts";
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.get(
        `/posts/${endpoint}?page=${state.currentPage}&limit=10`
      );
      console.log(res.data);
      set({
        isLoading: false,
        currentPage: state.currentPage + 1,
        hasMore: res.data.length === 10,
        bookmarks: [...state.bookmarks, ...res.data], // Append new data
      });
    } catch (e) {
      set({
        error: e.response?.data?.error || "Error fetching posts",
        isLoading: false,
      });
    }
  },
}));

export default useBookmarkStore;
