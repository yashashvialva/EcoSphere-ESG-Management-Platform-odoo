import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Award, BookOpen, Leaf, LogOut, Shield, FileText, ClipboardCheck, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Governance', href: '/governance', icon: Shield, children: [
      { name: 'Policies', href: '/governance/policies', icon: FileText },
      { name: 'Audits', href: '/governance/audits', icon: ClipboardCheck },
      { name: 'Compliance', href: '/governance/compliance-issues', icon: AlertTriangle },
      { name: 'Acknowledgements', href: '/governance/acknowledgements', icon: CheckCircle },
    ]},
    { name: 'CSR Activities', href: '/social/csr-activities', icon: Leaf },
    { name: 'Training', href: '/social/training', icon: BookOpen },
    { name: 'Diversity', href: '/social/diversity', icon: Users },
  ];

  const isActive = (href) => location.pathname === href || (href !== '/' && location.pathname.startsWith(href));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-600">EcoSphere</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <div key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    active 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>

                {/* Governance sub-nav */}
                {item.children && isActive(item.href) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = isActive(child.href);
                      return (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            childActive
                              ? 'text-primary-700 font-medium'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <ChildIcon className={`mr-2 h-4 w-4 ${childActive ? 'text-primary-600' : 'text-gray-400'}`} />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="min-h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
