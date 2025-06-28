
-- Create channels table
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for channels
CREATE POLICY "Users can view channels in their tenant" 
  ON public.channels 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create channels in their tenant" 
  ON public.channels 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    ) AND created_by = auth.uid()
  );

-- RLS policies for messages
CREATE POLICY "Users can view messages in their tenant channels" 
  ON public.messages 
  FOR SELECT 
  USING (
    channel_id IN (
      SELECT c.id FROM public.channels c 
      JOIN public.profiles p ON c.tenant_id = p.tenant_id 
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their tenant channels" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (
    channel_id IN (
      SELECT c.id FROM public.channels c 
      JOIN public.profiles p ON c.tenant_id = p.tenant_id 
      WHERE p.id = auth.uid()
    ) AND sender_id = auth.uid()
  );

-- Enable realtime for both tables
ALTER TABLE public.channels REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.channels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Insert a default general channel for each existing tenant
INSERT INTO public.channels (tenant_id, name, description, created_by)
SELECT 
  t.id,
  'general',
  'General discussion channel',
  p.id
FROM public.tenants t
JOIN public.profiles p ON p.tenant_id = t.id AND p.role = 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.channels c WHERE c.tenant_id = t.id AND c.name = 'general'
);
