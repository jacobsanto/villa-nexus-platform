
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Home, 
  Settings, 
  ClipboardList, 
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";

interface TenantSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const TenantSidebar = ({ activePage, setActivePage }: TenantSidebarProps) => {
  const { profile, signOut } = useAuth();
  const { tenant } = useTenant();

  const handleSignOut = async () => {
    await signOut();
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Branding Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: tenant?.primary_color || '#0ea5e9' }}
          >
            {tenant?.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="w-8 h-8 rounded" />
            ) : (
              <Building2 className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{tenant?.name || 'Property Company'}</h2>
            <p className="text-xs text-gray-500">Property Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={isActive ? { 
                    backgroundColor: `${tenant?.primary_color || '#0ea5e9'}10`,
                    color: tenant?.primary_color || '#0ea5e9',
                    borderColor: `${tenant?.primary_color || '#0ea5e9'}30`
                  } : {}}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || 'User'}
            </p>
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">
                {profile?.role || 'member'}
              </Badge>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSignOut}
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default TenantSidebar;
