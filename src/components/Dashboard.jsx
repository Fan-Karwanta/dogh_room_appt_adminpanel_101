import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, CheckCircle, XCircle, Ban, Users, Building2, Loader2 } from 'lucide-react';
import { getDashboard } from '../api';

function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboard();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-gray-500">
        Failed to load dashboard data.
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Appointments',
      value: stats.total,
      icon: CalendarDays,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      onClick: () => onNavigate('appointments')
    },
    {
      label: 'Pending Requests',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      onClick: () => onNavigate('pending')
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      onClick: () => onNavigate('approved')
    },
    {
      label: 'Declined',
      value: stats.declined,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      onClick: () => onNavigate('declined')
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: Ban,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      onClick: () => onNavigate('cancelled')
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={card.onClick}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
                  <Icon size={20} className={card.textColor} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Today's Approved</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</p>
          <p className="text-sm text-gray-500 mt-1">appointments today</p>
        </div>

        {/* Room Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Building2 size={20} className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Room Bookings (Approved)</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.roomStats).map(([room, count]) => (
              <div key={room} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{room}</span>
                <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('pending')}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
          >
            <Clock size={16} />
            Review Pending ({stats.pending})
          </button>
          <button
            onClick={() => onNavigate('appointments')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <CalendarDays size={16} />
            View All Appointments
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
