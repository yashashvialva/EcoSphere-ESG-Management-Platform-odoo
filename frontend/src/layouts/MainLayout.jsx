import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import {
  LayoutDashboard,
  Leaf,
  Users,
  ShieldCheck,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Target,
  Recycle,
  Globe,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Trophy,
  Medal,
  Gift
} from 'lucide-react';

// Static sample notifications — replace with real API data when ready
const SAMPLE_NOTIFICATIONS = [
  { id: 1, type: 'success', message: 'ESG Goal "Reduce Scope 1" reached 80%', time: '2 min ago' },
  { id: 2, type: 'warning', message: 'Carbon transaction pending review', time: '15 min ago' },
  { id: 3, type: 'info',    message: 'Monthly emission report is ready', time: '1 hr ago' },
];

const notifIcon = { success: CheckCircle2, warning: AlertTriangle, info: Info };
const notifColor = { success: '#5E9E6F', warning: '#c49800', info: '#7CA9D6' };

const MainLayout = () => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unread, setUnread] = useState(SAMPLE_NOTIFICATIONS.length);
  const notifRef = useRef(null);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handler = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigation = [
    { name: 'Dashboard',           href: '/dashboard',                          icon: LayoutDashboard },
    
    // Environmental Links
    { name: 'Emission Factors',    href: '/environmental/emission-factors',      icon: Leaf,        permission: 'environmental.read' },
    { name: 'Carbon Transactions', href: '/environmental/carbon-transactions',   icon: Recycle,     permission: 'environmental.read' },
    { name: 'ESG Goals',           href: '/environmental/esg-goals',             icon: Target,      permission: 'environmental.read' },
    { name: 'Product Profiles',    href: '/environmental/product-profiles',      icon: Globe,       permission: 'environmental.read' },
    
    // Social Links
    { name: 'CSR Activities', href: '/social/csr-activities', icon: Leaf },
    { name: 'Training', href: '/social/training', icon: BookOpen },
    { name: 'Diversity', href: '/social/diversity', icon: Users },
    
    // Gamification Links
    { name: 'Leaderboard',         href: '/gamification/leaderboard',            icon: Trophy,      permission: 'gamification.read' },
    { name: 'Challenges',          href: '/gamification/challenges',             icon: Award,       permission: 'gamification.read' },
    { name: 'Badges',              href: '/gamification/badges',                 icon: Medal,       permission: 'gamification.read' },
    { name: 'Rewards',             href: '/gamification/rewards',                icon: Gift,        permission: 'gamification.read' },
    
    { name: 'Governance',          href: '/governance',                          icon: ShieldCheck, permission: 'governance.read' },
    { name: 'Settings',            href: '/settings',                            icon: Settings,    permission: 'settings.manage' },
  ];

  const filteredNav = navigation.filter(item => !item.permission || hasPermission(item.permission));

  const userInitials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'U';

  const handleOpenNotifications = () => {
    setShowNotifications(prev => !prev);
    setUnread(0); // mark all as read when opened
  };

  return (
    <div className="min-h-screen bg-background flex" style={{ color: '#2F2F2F' }}>

      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <aside
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 z-20 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}`}
        style={{ background: '#9BBDAF' }}
      >
        {/* Brand */}
        <div
          className="flex items-center h-16 flex-shrink-0 px-4 justify-between"
          style={{ background: '#82a596' }}
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-white" />
              <span className="text-lg font-bold text-white tracking-wide">EcoSphere</span>
            </div>
          )}
          {isCollapsed && <Leaf className="h-6 w-6 text-white mx-auto" />}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg transition-all duration-150 ml-1 hover:bg-black/10"
            style={{ color: '#2F2F2F' }}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col overflow-y-auto py-4 px-3 space-y-0.5">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                title={isCollapsed ? item.name : ''}
                className={`group flex items-center py-2.5 rounded-xl transition-all duration-200 relative
                  ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                  ${isActive ? 'shadow-sm' : ''}`}
                style={
                  isActive
                    ? { background: '#F27D88', color: '#ffffff' }
                    : { color: '#2F2F2F' }
                }
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#FFF8C9'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = ''; }}
              >
                <item.icon
                  className={`flex-shrink-0 h-5 w-5 transition-all duration-150 group-hover:scale-105
                    ${isCollapsed ? '' : 'mr-3'}`}
                  style={{ color: isActive ? '#ffffff' : '#836A78' }}
                />
                {!isCollapsed && (
                  <span className="text-sm font-semibold">{item.name}</span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="flex-shrink-0 p-4 border-t border-white/30" style={{ background: '#82a596' }}>
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center min-w-0">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: '#ffffff33', color: '#2F2F2F' }}
              >
                {userInitials}
              </div>
              {!isCollapsed && (
                <div className="ml-3 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: '#2F2F2F' }}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: '#2F2F2F99' }}>
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg transition-all ml-1 hover:bg-black/10"
              style={{ color: '#2F2F2F' }}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out
          ${isCollapsed ? 'md:pl-[70px]' : 'md:pl-[250px]'}`}
      >
        {/* Top Navbar */}
        <header
          className="sticky top-0 z-10 h-16 border-b border-border-main flex items-center justify-between px-6 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.92)' }}
        >
          {/* Mobile: hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-background transition-all"
              style={{ color: '#836A78' }}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2 ml-3">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-base font-bold tracking-wide" style={{ color: '#2F2F2F' }}>EcoSphere</span>
            </div>
          </div>

          {/* Desktop search — pill shape */}
          <div className="hidden md:flex items-center max-w-sm w-full">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: '#836A78' }} />
              <input
                type="text"
                placeholder="Search data, metrics, reports..."
                className="w-full bg-background border border-border-main rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400"
                style={{ color: '#2F2F2F' }}
                onFocus={e => { e.target.style.borderColor = '#F27D88'; e.target.style.boxShadow = '0 0 0 2px #F27D8840'; }}
                onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
              />
            </div>
          </div>

          {/* Right items */}
          <div className="flex items-center space-x-1">
            {/* Notification bell with panel */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleOpenNotifications}
                className="relative p-2.5 rounded-xl transition-all hover:bg-background"
                style={{ color: '#836A78' }}
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full flex items-center justify-center text-white font-bold text-[9px]"
                    style={{ background: '#F27D88' }}
                  >
                    {unread}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div
                  className="absolute right-0 top-12 w-80 rounded-2xl border border-border-main shadow-lg overflow-hidden z-50"
                  style={{ background: '#fff' }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border-main">
                    <p className="text-sm font-bold" style={{ color: '#2F2F2F' }}>Notifications</p>
                    <button
                      className="text-xs font-medium"
                      style={{ color: '#9BBDAF' }}
                      onClick={() => setShowNotifications(false)}
                    >
                      Mark all read
                    </button>
                  </div>
                  <ul className="divide-y divide-border-main max-h-72 overflow-y-auto">
                    {SAMPLE_NOTIFICATIONS.map(n => {
                      const Icon = notifIcon[n.type];
                      return (
                        <li key={n.id} className="flex items-start px-4 py-3 hover:bg-background transition-colors cursor-pointer">
                          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 mr-3" style={{ color: notifColor[n.type] }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium" style={{ color: '#2F2F2F' }}>{n.message}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: '#6B7280' }}>{n.time}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="px-4 py-2.5 border-t border-border-main">
                    <button className="text-xs font-semibold w-full text-center" style={{ color: '#F27D88' }}>
                      View all notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-border-main hidden sm:block mx-1" />

            {/* User avatar + name */}
            <div className="hidden sm:flex items-center space-x-3 pl-1">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: '#9BBDAF', color: '#2F2F2F' }}
              >
                {userInitials}
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#2F2F2F' }}>{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px]" style={{ color: '#6B7280' }}>{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 bg-background">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col max-w-xs w-full" style={{ background: '#9BBDAF' }}>
            <div className="absolute top-3 right-0 translate-x-full pl-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center"
                style={{ color: '#2F2F2F' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center h-16 px-5" style={{ background: '#82a596' }}>
              <Leaf className="h-6 w-6 text-white mr-2" />
              <span className="text-lg font-bold text-white tracking-wide">EcoSphere</span>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {filteredNav.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-3 rounded-xl transition-all duration-150"
                    style={
                      isActive
                        ? { background: '#F27D88', color: '#ffffff' }
                        : { color: '#2F2F2F' }
                    }
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#FFF8C9'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = ''; }}
                  >
                    <item.icon
                      className="flex-shrink-0 h-6 w-6 mr-4"
                      style={{ color: isActive ? '#ffffff' : '#836A78' }}
                    />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/30" style={{ background: '#82a596' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: '#ffffff33', color: '#2F2F2F' }}
                  >
                    {userInitials}
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-bold" style={{ color: '#2F2F2F' }}>
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px]" style={{ color: '#2F2F2F99' }}>{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg hover:bg-black/10 transition-all"
                  style={{ color: '#2F2F2F' }}
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
