
import { Building2, Home, ClipboardList, Settings, Plug, LogOut, User, Calendar, Package, AlertTriangle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";

interface TenantSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const TenantSidebar = ({ activePage, setActivePage }: TenantSidebarProps) => {
  const { tenant } = useTenant();
  const { profile, signOut } = useAuth();

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, roles: ['admin', 'member'] },
    { id: 'properties', name: 'Properties', icon: Building2, roles: ['admin', 'member'] },
    { id: 'bookings', name: 'Bookings', icon: Calendar, roles: ['admin', 'member'] },
    { id: 'inventory', name: 'Inventory', icon: Package, roles: ['admin', 'member'] },
    { id: 'damage-reports', name: 'Damage Reports', icon: AlertTriangle, roles: ['admin', 'member'] },
    { id: 'integrations', name: 'Integrations', icon: Plug, roles: ['admin', 'member'] },
    { id: 'tasks', name: 'Tasks', icon: ClipboardList, roles: ['admin', 'member'] },
    { id: 'settings', name: 'Settings', icon: Settings, roles: ['admin'] }, // Only admins can access settings
  ];

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => 
    item.roles.includes(profile?.role || 'member')
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getNavLinkClass = (isActive: boolean) => {
    return `w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      isActive
        ? 'text-white shadow-sm'
        : 'text-gray-700 hover:text-gray-900'
    }`;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Branding Section */}
      <div className="p-6 border-b border-gray-200">
        {tenant?.logo_url ? (
          <img 
            src={tenant.logo_url} 
            alt={`${tenant.name} logo`}
            className="h-8 w-auto"
          />
        ) : (
          <h1 
            className="text-xl font-bold"
            style={{ color: tenant?.primary_color || '#0ea5e9' }}
          >
            {tenant?.name || 'Arivio'}
          </h1>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigationItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={getNavLinkClass(isActive)}
              style={isActive ? { backgroundColor: tenant?.primary_color || '#0ea5e9' } : {}}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User Info Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {profile?.role || 'member'}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSignOut}
          className="w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default TenantSidebar;
