import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Users, UserCheck, Truck,
  FolderKanban, Calculator, LogOut, ChevronLeft, Menu, ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Company Details", path: "/company", icon: Building2 },
  { title: "Members", path: "/members", icon: Users },
  { title: "Clients", path: "/clients", icon: UserCheck },
  { title: "Vendors", path: "/vendors", icon: Truck },
  { title: "Projects", path: "/projects", icon: FolderKanban },
  { title: "Estimations", path: "/estimations", icon: Calculator },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function AppLayout({ children, title, breadcrumbs }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getInitials = (name: string) => {
    return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 card-shadow ${collapsed ? "w-16" : "w-60"
          }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <span className="text-lg font-bold text-primary tracking-tight">Forge IPA</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 h-14 bg-card border-b border-border flex items-center justify-between px-6 card-shadow">
          <div className="flex items-center gap-2">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1 text-sm text-muted-foreground">
                {breadcrumbs.map((bc, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="h-3 w-3" />}
                    {bc.path ? (
                      <Link to={bc.path} className="hover:text-primary transition-colors">{bc.label}</Link>
                    ) : (
                      <span className="text-foreground font-medium">{bc.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            {!breadcrumbs && <h1 className="text-lg font-semibold">{title}</h1>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{user?.role || 'User'}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity">
                  {getInitials(user?.name || '')}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate("/login");
                }} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 animate-fade-in">
          {title && !breadcrumbs && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
          {breadcrumbs && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
          {children}
        </main>
      </div>
    </div>
  );
}
