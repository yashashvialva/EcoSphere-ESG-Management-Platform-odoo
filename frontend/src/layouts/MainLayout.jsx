import React, { useState } from 'react';
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
  Sun,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-emerald-500' },
    { name: 'Emission Factors', href: '/environmental/emission-factors', icon: Leaf, permission: 'environmental.read', color: 'text-green-500' },
    { name: 'Carbon Transactions', href: '/environmental/carbon-transactions', icon: Recycle, permission: 'environmental.read', color: 'text-green-500' },
    { name: 'ESG Goals', href: '/environmental/esg-goals', icon: Target, permission: 'environmental.read', color: 'text-green-500' },
    { name: 'Product Profiles', href: '/environmental/product-profiles', icon: Globe, permission: 'environmental.read', color: 'text-green-500' },
    { name: 'Social', href: '/social', icon: Users, permission: 'social.read', color: 'text-blue-500' },
    { name: 'Governance', href: '/governance', icon: ShieldCheck, permission: 'governance.read', color: 'text-purple-500' },
    { name: 'Gamification', href: '/gamification', icon: Award, permission: 'gamification.read', color: 'text-amber-500' },
    { name: 'Settings', href: '/settings', icon: Settings, permission: 'settings.manage', color: 'text-gray-400' },
  ];

  const filteredNav = navigation.filter(item => !item.permission || hasPermission(item.permission));

  const userInitials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 'US';

  return (
    <div className="min-h-screen bg-background flex text-text-primary">
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 z-20 bg-secondary transition-all duration-300 ease-in-out border-r border-[#1a441d] ${
          isCollapsed ? 'w-[70px]' : 'w-[250px]'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo / Brand Header */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 justify-between bg-[#0e2710]">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-secondary-green animate-pulse" />
                <span className="text-lg font-bold text-white tracking-wider">EcoSphere</span>
              </div>
            )}
            {isCollapsed && (
              <Leaf className="h-6 w-6 text-secondary-green mx-auto" />
            )}
            
            {/* Collapse toggle button */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-[#a4cca6] hover:text-white hover:bg-[#1a441d] p-1.5 rounded-lg hidden md:block transition-colors"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col overflow-y-auto mt-4">
            <nav className="flex-1 px-3 py-2 space-y-1">
              {filteredNav.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    title={isCollapsed ? item.name : ''}
                    className={`group flex items-center py-2.5 rounded-xl transition-all duration-150 relative ${
                      isCollapsed ? 'justify-center px-0' : 'px-3'
                    } ${
                      isActive 
                        ? 'bg-primary text-white font-medium shadow-sm shadow-black/10' 
                        : 'text-[#badcbb] hover:bg-[#1b441e]/50 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`flex-shrink-0 h-5 w-5 transition-transform duration-150 group-hover:scale-105 ${
                        isCollapsed ? '' : 'mr-3'
                      } ${isActive ? 'text-white' : item.color}`}
                      aria-hidden="true"
                    />
                    {!isCollapsed && <span className="text-sm">{item.name}</span>}
                    
                    {/* Active highlight pill indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-md"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile footer */}
          <div className="flex-shrink-0 flex bg-[#0e2710] p-4 border-t border-[#1a441d] transition-all duration-300">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center min-w-0">
                <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0 border border-secondary-green/20">
                  {userInitials}
                </div>
                {!isCollapsed && (
                  <div className="ml-3 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] font-medium text-[#badcbb] truncate">{user?.role}</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={logout} 
                className="text-[#badcbb] hover:text-white p-1.5 hover:bg-[#1b441e] rounded-lg transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Layout Container */}
      <div 
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:pl-[70px]' : 'md:pl-[250px]'
        }`}
      >
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-10 bg-white h-16 border-b border-border-main flex items-center justify-between px-6">
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex items-center space-x-2 ml-3">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-base font-bold text-text-primary tracking-wider">EcoSphere</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center max-w-md w-full relative">
            <Search className="absolute left-3 h-4 w-4 text-text-secondary pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search data, metrics, reports..." 
              className="w-full bg-[#fcfdfc] border border-border-main rounded-xl pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Header Action Items */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-xl transition-all" title="Toggle Theme">
              <Sun className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-xl transition-all relative" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger"></span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-border-main hidden sm:block"></div>

            {/* Profile Menu Info */}
            <div className="items-center space-x-3 hidden sm:flex">
              <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                {userInitials}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-text-primary">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-text-secondary">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Router Outlet */}
        <main className="flex-1 p-8 bg-background">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Slide-Out Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
            aria-hidden="true" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-secondary border-r border-[#1a441d]">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-xl bg-secondary/80 text-white focus:outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex-shrink-0 flex items-center px-6 h-16 bg-[#0e2710]">
              <Leaf className="h-6 w-6 text-secondary-green mr-2" />
              <h1 className="text-lg font-bold text-white tracking-wider">EcoSphere</h1>
            </div>

            <div className="mt-5 flex-1 h-0 overflow-y-auto px-3">
              <nav className="space-y-1">
                {filteredNav.map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center px-3 py-3 text-base rounded-xl transition-all duration-150 ${
                        isActive 
                          ? 'bg-primary text-white font-medium' 
                          : 'text-[#badcbb] hover:bg-[#1b441e]/50 hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`flex-shrink-0 h-6 w-6 mr-4 ${isActive ? 'text-white' : item.color}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Profile footer inside mobile drawer */}
            <div className="flex-shrink-0 flex bg-[#0e2710] p-4 border-t border-[#1a441d]">
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-secondary-green font-semibold text-sm">
                    {userInitials}
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] text-[#badcbb]">{user?.role}</p>
                  </div>
                </div>
                <button onClick={logout} className="text-[#badcbb] hover:text-white p-1.5 rounded-lg" title="Sign Out">
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
