/**
 * ⚡ POSTS STORE - Gestión optimizada de posts
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PostsState {
  posts: any[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;

  // Actions
  setPosts: (posts: any[]) => void;
  addPosts: (posts: any[]) => void;
  addPost: (post: any) => void;
  updatePost: (postId: number, updates: any) => void;
  deletePost: (postId: number) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  nextPage: () => void;
  reset: () => void;
}

export const usePostsStore = create<PostsState>()(
  devtools(
    (set) => ({
      posts: [],
      isLoading: false,
      hasMore: true,
      page: 1,

      setPosts: (posts) => set({ posts, isLoading: false }),

      addPosts: (newPosts) =>
        set((state) => ({
          posts: [...state.posts, ...newPosts],
          isLoading: false,
        })),

      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),

      updatePost: (postId, updates) =>
        set((state) => ({
          posts: state.posts.map((post) => (post.id === postId ? { ...post, ...updates } : post)),
        })),

      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setHasMore: (hasMore) => set({ hasMore }),

      nextPage: () => set((state) => ({ page: state.page + 1 })),

      reset: () => set({ posts: [], page: 1, hasMore: true, isLoading: false }),
    }),
    { name: "PostsStore" }
  )
);
