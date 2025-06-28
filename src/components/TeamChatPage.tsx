
import { useState, useEffect } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import ChannelList from "./ChannelList";
import MessageView from "./MessageView";
import { Channel } from "@/types/chat";

const TeamChatPage = () => {
  const { tenant } = useTenant();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!tenant?.id) return;

      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('name');

      if (error) {
        console.error('Error fetching channels:', error);
        return;
      }

      setChannels(data || []);
      
      // Auto-select the first channel (usually "general")
      if (data && data.length > 0 && !selectedChannelId) {
        setSelectedChannelId(data[0].id);
      }
    };

    fetchChannels();
  }, [tenant?.id, selectedChannelId]);

  if (!tenant) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      <div className="w-80 border-r border-gray-200 flex-shrink-0">
        <ChannelList 
          channels={channels}
          selectedChannelId={selectedChannelId}
          onChannelSelect={setSelectedChannelId}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChannelId ? (
          <MessageView 
            channelId={selectedChannelId}
            channelName={channels.find(c => c.id === selectedChannelId)?.name || ""}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChatPage;
