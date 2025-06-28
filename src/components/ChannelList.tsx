
import { Hash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Channel } from "@/types/chat";

interface ChannelListProps {
  channels: Channel[];
  selectedChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
}

const ChannelList = ({ channels, selectedChannelId, onChannelSelect }: ChannelListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Channels</h2>
          <Button variant="ghost" size="sm" className="p-1">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onChannelSelect(channel.id)}
              className={`
                w-full flex items-center px-3 py-2 text-left text-sm rounded-md transition-colors
                hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${selectedChannelId === channel.id
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                  : 'text-gray-700'
                }
              `}
            >
              <Hash className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{channel.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelList;
