
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: 'admin' | 'member' | 'super_admin' | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
