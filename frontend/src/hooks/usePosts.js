// Week 3+ — Custom hooks for posts data fetching
import { useState, useEffect, useCallback } from 'react';
import { postsAPI } from '../services/api';

export function usePosts(initialParams = {}) {
  const [posts,      setPosts]      = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [params,     setParams]     = useState(initialParams);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await postsAPI.getAll(params);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return { posts, pagination, loading, error, setParams, refetch: fetchPosts };
}

export function usePost(id) {
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    postsAPI.getOne(id)
      .then(({ data }) => setPost(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { post, setPost, loading, error };
}
