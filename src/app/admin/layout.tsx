'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sparkles 
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-indigo-900 text-white transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-indigo-800">
            {isSidebarOpen ? (
              <Link href="/admin" className="font-bold text-xl flex items-center gap-2">
                <Sparkles className="text-yellow-400 w-5 h-5" />
                <span>Admin Panel</span>
              </Link>
            ) : (
              <div className="mx-auto">
                <Sparkles className="text-yellow-400 w-6 h-6" />
              </div>
            )}
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded hover:bg-indigo-800 text-indigo-300 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-6 space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                    active 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                      : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
                  }`}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <Icon size={22} className={`${active ? 'text-white' : 'text-indigo-400 group-hover:text-white'} transition-colors`} />
                  
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium truncate">
                      {item.label}
                    </span>
                  )}
                  
                  {active && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-indigo-800">
            <button className={`flex items-center w-full px-3 py-3 rounded-xl text-pink-400 hover:bg-indigo-800 hover:text-pink-300 transition-colors ${!isSidebarOpen && 'justify-center'}`}>
              <LogOut size={22} />
              {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <header className="h-16 bg-white border-b border-indigo-100 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-bold text-indigo-900">
            {navItems.find(i => isActive(i.href))?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              A
            </div>
            <span className="text-sm font-medium text-indigo-900">Administrator</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
