
-- Create the tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'to-do',
  due_date DATE,
  task_type TEXT NOT NULL DEFAULT 'general'
);

-- Create indexes for better query performance
CREATE INDEX idx_tasks_tenant_id ON public.tasks(tenant_id);
CREATE INDEX idx_tasks_property_id ON public.tasks(property_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view all tasks that belong to their tenant
CREATE POLICY "Users can view tasks in their tenant" 
  ON public.tasks 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

-- RLS Policy: Users can insert tasks for their own tenant
CREATE POLICY "Users can create tasks for their tenant" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

-- RLS Policy: Users can update any task within their tenant
CREATE POLICY "Users can update tasks in their tenant" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

-- RLS Policy: Only tenant admins can delete tasks
CREATE POLICY "Only admins can delete tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
