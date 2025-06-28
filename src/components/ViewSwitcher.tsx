
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Calendar } from "lucide-react";

interface ViewSwitcherProps {
  activeView: 'board' | 'list' | 'agenda';
  setActiveView: (view: 'board' | 'list' | 'agenda') => void;
}

const ViewSwitcher = ({ activeView, setActiveView }: ViewSwitcherProps) => {
  const views = [
    { id: 'board' as const, label: 'Board', icon: LayoutGrid },
    { id: 'list' as const, label: 'List', icon: List },
    { id: 'agenda' as const, label: 'Agenda', icon: Calendar },
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = activeView === view.id;
        
        return (
          <Button
            key={view.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveView(view.id)}
            className={`flex items-center px-3 py-2 ${
              isActive ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {view.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ViewSwitcher;
