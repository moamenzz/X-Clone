import { create } from "zustand";
import { axiosPublic } from "../lib/axiosInstances";

const usePostStore = create((set, get) => ({
  posts: [],
  currentPage: 1,
  hasMore: true,
  error: null,
  isLoading: false,
  activeTab: "forYou",
  setPosts: (posts) => set({ posts }),
  setActiveTab: (tab) =>
    set({ activeTab: tab, posts: [], currentPage: 1, hasMore: true }),

  fetchPosts: async (axiosPrivate) => {
    const state = get();
    if (state.isLoading || !state.hasMore) return;

    try {
      set({ isLoading: true });
      const isForYou = state.activeTab === "forYou";
      const axios = isForYou ? axiosPublic : axiosPrivate;
      const endpoint = isForYou ? "for-you" : "followings";

      const res = await axios.get(
        `/posts/${endpoint}?page=${state.currentPage}&limit=10`
      );
      console.log("Fetched posts:", res.data);

      set({
        posts: [...state.posts, ...res.data],
        currentPage: state.currentPage + 1,
        hasMore: res.data.length === 10,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error fetching posts",
        isLoading: false,
      });
    }
  },

  createPost: async (text, img, axiosPrivate) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.post("/posts/create-post", { text, img });
      set({ isLoading: false, posts: [], currentPage: 1, hasMore: true });
    } catch (e) {
      set({ error: e.message, isLoading: false });
      console.error("Error creating post:", e.message);
    }
  },

  deletePost: async (axiosPrivate, postId) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.delete(`/posts/delete-post/${postId}`);
      console.log("Deleted post:", res.data);
      set({ isLoading: false });
    } catch (e) {
      set({
        error: e.response?.data?.error || "Error deleting post",
        isLoading: false,
      });
    }
  },
  bookmark: async (axiosPrivate, postId) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.put(`/posts/bookmark/${postId}`);
      console.log("Bookmarked/Unbookmarked post:", res.data);
      set({ isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e.response?.data?.error });
    }
  },
  likeUnlikePost: async (axiosPrivate, postId) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.put(`/posts/like/${postId}`);
      console.log("Liked/Unliked post:", res.data);
      set({ isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e.response?.data?.error });
      throw e;
    }
  },
  repost: async (axiosPrivate, postId) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.put(`/posts/repost/${postId}`);
      console.log("Reposted post:", res.data);
      set({ isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e.response?.data?.error });
      throw e;
    }
  },
  comment: async (axiosPrivate, postId, text, img) => {
    try {
      set({ isLoading: true });
      const res = await axiosPrivate.post(`/posts/comment/${postId}`, {
        text,
        img,
      });
      set({ isLoading: false });
      return res.data; // Return the new comment data
    } catch (e) {
      set({ isLoading: false, error: e.response?.data?.error });
      throw e;
    }
  },
}));

export default usePostStore;
