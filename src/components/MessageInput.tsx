
import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

interface MessageInputProps {
  channelId: string;
  onMessageSent: (message: Message) => void;
}

const MessageInput = ({ channelId, onMessageSent }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const { user, profile } = useAuth();

  const sendMessage = async () => {
    if (!content.trim() || !user || sending) return;

    setSending(true);
    
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          channel_id: channelId,
          sender_id: user.id,
          content: content.trim()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
    } else {
      // Create a local message object for immediate UI update
      const newMessage: Message = {
        id: data.id,
        channel_id: data.channel_id,
        sender_id: data.sender_id,
        content: data.content,
        created_at: data.created_at,
        sender: {
          full_name: profile?.full_name || 'Unknown User'
        }
      };
      
      onMessageSent(newMessage);
      setContent("");
    }
    
    setSending(false);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center space-x-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1"
        />
        <Button 
          onClick={sendMessage}
          disabled={!content.trim() || sending}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
