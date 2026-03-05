// Week 7 — Custom hook for messaging
import { useState, useEffect } from 'react';
import { messagesAPI } from '../services/api';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    messagesAPI.getConversations()
      .then(({ data }) => setConversations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { conversations, loading };
}

export function useMessages(userId) {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    messagesAPI.getMessages(userId)
      .then(({ data }) => setMessages(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const send = async (text, postId = null) => {
    const { data } = await messagesAPI.send({ receiverId: userId, text, postId });
    setMessages(prev => [...prev, data]);
    return data;
  };

  return { messages, loading, send };
}
