import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Revenue', value: '$45,231', change: '+5.4%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Sessions', value: '453', change: '-2%', icon: Activity, color: 'bg-purple-500' },
    { label: 'Growth', value: '24%', change: '+4%', icon: TrendingUp, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Admin!</h2>
          <p className="text-blue-200">Here's what's happening with your projects today.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 -mr-16"></div>
        <div className="absolute right-20 bottom-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg shadow-indigo-100`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-slate-400 ml-2">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity / Content Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 min-h-[400px]">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <Activity size={48} className="mb-4 opacity-50" />
          <p>No recent activity to show</p>
        </div>
      </div>
    </div>
  );
}
