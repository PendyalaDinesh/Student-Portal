// Week 7 — Conversations & messaging
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConversations, useMessages } from '../hooks/useMessages';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { timeAgo } from '../utils/helpers';
import { PageLoader } from '../components/common/Spinner';

export default function MessagesPage() {
  const { dbUser } = useAuth();
  const { conversations, loading } = useConversations();
  const [activeUser, setActiveUser] = useState(null);
  const { messages, send } = useMessages(activeUser?._id);
  const [text,    setText]    = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try { await send(text); setText(''); }
    catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">💬 Messages</h1>
      <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">

        {/* Conversation list */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 font-semibold text-sm">Conversations</div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-10">No messages yet</p>
            )}
            {conversations.map((conv) => (
              <button key={conv._id}
                onClick={() => setActiveUser(conv.otherUser)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-all text-left
                  ${activeUser?._id === conv.otherUser?._id ? 'bg-gray-800 border-l-2 border-sky-500' : ''}`}>
                <Avatar user={conv.otherUser} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{conv.otherUser?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage?.text}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-sky-500 text-white text-xs rounded-full px-2 py-0.5 shrink-0">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message thread */}
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl flex flex-col overflow-hidden">
          {!activeUser ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                <Avatar user={activeUser} size={36} />
                <span className="font-semibold">{activeUser.name}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => {
                  const isMe = msg.sender._id === dbUser?._id || msg.sender === dbUser?._id;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm
                        ${isMe ? 'bg-sky-600 text-white rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'}`}>
                        {msg.post && <p className="text-xs opacity-70 mb-1">Re: {msg.post.title}</p>}
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-sky-200' : 'text-gray-500'}`}>{timeAgo(msg.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSend} className="p-4 border-t border-gray-800 flex gap-3">
                <input value={text} onChange={e => setText(e.target.value)}
                  placeholder="Type a message..." className="form-input flex-1" />
                <Button type="submit" loading={sending} disabled={!text.trim()}>Send</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
