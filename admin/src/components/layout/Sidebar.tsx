import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "../common/Logo";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tags,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )
      }
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar fixed left-0 top-0 z-40 border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && <Logo useImage={false} size="large" textColor="white" className="text-sidebar-foreground" />}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-3">
        <nav className="flex flex-col gap-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/orders" icon={ShoppingBag} label="Orders" collapsed={collapsed} />
          <NavItem to="/products" icon={Package} label="Products" collapsed={collapsed} />
          <NavItem to="/categories" icon={Tags} label="Categories" collapsed={collapsed} />
          <NavItem to="/users" icon={Users} label="Users" collapsed={collapsed} />
          <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
        </nav>
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
