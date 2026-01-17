import { useMemo } from "react";
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { likePost } from "@/app/actions/like.action";
import { PostType } from "@/types/post.type";

// Definimos un tipo para la data que se cachea en la query de posts
type CachedPostsData = {
  pages: { posts: PostType[] }[];
  pageParams: any[];
};

const useLike = (postId: number, likedIds: number[]) => {
  const { data } = useCurrentUserContext();
  const currentUserId = data?.currentUser?.id;
  const queryClient = useQueryClient();

  // Calculamos si el usuario actual ha dado like
  const hasLiked = useMemo(() => {
    if (!currentUserId) return false;
    return likedIds.includes(currentUserId);
  }, [likedIds, currentUserId]);

  const { mutate: toggleLike, isPending: loading } = useMutation({
    mutationFn: () => likePost(postId),

    onMutate: async () => {
      if (!currentUserId) return;

      // Cancelamos queries para evitar sobreescribir el estado optimista
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Guardamos el estado previo
      const previousPostsData = queryClient.getQueryData<CachedPostsData>(["posts", "infinite"]);

      // Actualizamos el estado de forma optimista
      queryClient.setQueryData<CachedPostsData>(["posts", "infinite"], (oldData) => {
        if (!oldData) {
          return { pages: [], pageParams: [] };
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (post.id === postId) {
                const newLikeIds = hasLiked
                  ? post.likeIds.filter((id) => id !== currentUserId)
                  : [...post.likeIds, currentUserId];
                return { ...post, likeIds: newLikeIds };
              }
              return post;
            }),
          })),
        };
      });

      return { previousPostsData };
    },
    onError: (error, _, context) => {
      // Revertimos en caso de error
      if (context?.previousPostsData) {
        queryClient.setQueryData(["posts", "infinite"], context.previousPostsData);
      }
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Re-sincronizamos con el servidor
      queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });

  return {
    loading,
    hasLiked,
    toggleLike,
  };
};

export default useLike;
