
export interface Channel {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  created_at: string;
  created_by: string;
}

export interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url?: string;
  };
}
