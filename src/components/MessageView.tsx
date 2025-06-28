
import { useState, useEffect, useRef } from "react";
import { Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import MessageComponent from "./Message";
import MessageInput from "./MessageInput";

interface MessageViewProps {
  channelId: string;
  channelName: string;
}

const MessageView = ({ channelId, channelName }: MessageViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!channelId) return;

      setLoading(true);
      
      // First get the messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      // Then get the profiles for the senders
      const senderIds = [...new Set(messagesData.map(msg => msg.sender_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', senderIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Combine the data
      const formattedMessages: Message[] = messagesData.map(msg => ({
        id: msg.id,
        channel_id: msg.channel_id,
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
        sender: profilesData.find(p => p.id === msg.sender_id) ? {
          full_name: profilesData.find(p => p.id === msg.sender_id)!.full_name,
          avatar_url: undefined
        } : undefined
      }));

      setMessages(formattedMessages);
      setLoading(false);
    };

    fetchMessages();
  }, [channelId]);

  useEffect(() => {
    if (!channelId) return;

    const channel = supabase
      .channel('message-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Fetch the sender's profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', payload.new.sender_id)
            .single();

          if (!profileError && profileData) {
            const newMessage: Message = {
              id: payload.new.id,
              channel_id: payload.new.channel_id,
              sender_id: payload.new.sender_id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              sender: {
                full_name: profileData.full_name,
                avatar_url: undefined
              }
            };

            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageSent = (newMessage: Message) => {
    // Message will be added through the real-time subscription
    // but we can add it immediately for better UX
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-white">
        <Hash className="w-5 h-5 mr-2 text-gray-400" />
        <h1 className="text-lg font-semibold text-gray-900">{channelName}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Hash className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to #{channelName}
              </h3>
              <p className="text-gray-500">
                This is the beginning of the #{channelName} channel.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput channelId={channelId} onMessageSent={handleMessageSent} />
    </div>
  );
};

export default MessageView;
