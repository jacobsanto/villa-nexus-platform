
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Message as MessageType } from "@/types/chat";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { user } = useAuth();
  const isOwnMessage = user?.id === message.sender_id;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div className={`
            px-4 py-2 rounded-lg shadow-sm
            ${isOwnMessage 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-900 border border-gray-200'
            }
          `}>
            <p className="text-sm break-words">{message.content}</p>
          </div>
          
          <div className={`
            flex items-center mt-1 text-xs text-gray-500 space-x-2
            ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'}
          `}>
            <span>{message.sender?.full_name || 'Unknown User'}</span>
            <span>•</span>
            <span>{formatTime(message.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
