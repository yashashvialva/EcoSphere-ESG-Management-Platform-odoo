import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Award, BookOpen, Leaf, LogOut, Trophy, Medal, Gift, Search, Bell } from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leaderboard', href: '/gamification/leaderboard', icon: Trophy },
    { name: 'Challenges', href: '/gamification/challenges', icon: Award },
    { name: 'Badges', href: '/gamification/badges', icon: Medal },
    { name: 'Rewards', href: '/gamification/rewards', icon: Gift },
    { name: 'CSR Activities', href: '/social/csr-activities', icon: Leaf },
    { name: 'Training', href: '/social/training', icon: BookOpen },
    { name: 'Diversity', href: '/social/diversity', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-app-bg text-text-main font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-sage shadow-soft flex flex-col transition-all duration-250 z-20">
        <div className="h-20 flex items-center px-6 border-b border-white/20">
          <Leaf className="w-7 h-7 text-white mr-2.5" />
          <h1 className="text-2xl font-display font-bold text-white tracking-wide">EcoSphere</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-250 ${
                  isActive 
                    ? 'bg-coral text-white shadow-soft transform scale-[1.02]' 
                    : 'text-text-main hover:bg-cream'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-mauve'} transition-colors duration-250`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-5 border-t border-white/20">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-text-main rounded-xl hover:bg-cream transition-all duration-250"
          >
            <LogOut className="mr-3 h-5 w-5 text-mauve" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border-soft flex items-center justify-between px-8 z-10 transition-all duration-250">
          {/* Search */}
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search EcoSphere..."
              className="block w-full pl-11 pr-4 py-2.5 bg-app-bg border border-border-soft rounded-full text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-all duration-250"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <button className="relative p-2 rounded-full hover:bg-app-bg transition-colors duration-250">
              <Bell className="h-6 w-6 text-mauve" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-coral rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center pl-6 border-l border-border-soft">
              <div className="w-10 h-10 rounded-full bg-sage text-white flex items-center justify-center font-display font-bold text-sm shadow-soft">
                {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-text-main">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-text-muted font-medium mt-0.5">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-app-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
