import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, MapPin, User, Loader2, RefreshCw, CheckCircle, XCircle, Ban, Eye } from 'lucide-react';
import { getAppointments, updateAppointment } from '../api';

function AppointmentList({ filterStatus, onSelectAppointment, onRefresh }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (roomFilter) params.room = roomFilter;
      const res = await getAppointments(params);
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus, roomFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      setActionLoading(id);
      await updateAppointment(id, { status });
      await fetchAppointments();
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update appointment');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      appt.bookerName.toLowerCase().includes(term) ||
      appt.reason.toLowerCase().includes(term) ||
      appt.room.toLowerCase().includes(term) ||
      appt.date.includes(term) ||
      (appt.bookerEmail && appt.bookerEmail.toLowerCase().includes(term))
    );
  });

  const statusColors = {
    approved: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    declined: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, reason, room, or date..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <select
            value={roomFilter}
            onChange={e => setRoomFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">All Rooms</option>
            <option value="AB Conference Room">AB Conference Room</option>
            <option value="Malasakit Lobby">Malasakit Lobby</option>
          </select>
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredAppointments.length} appointment(s)
      </div>

      {/* Appointments Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No appointments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booker</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{appt.bookerName}</p>
                          {appt.bookerEmail && <p className="text-xs text-blue-500 truncate max-w-[200px]">{appt.bookerEmail}</p>}
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{appt.reason}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <MapPin size={12} className="text-gray-400" />
                        <span className="truncate max-w-[150px]">{appt.room}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Calendar size={12} className="text-gray-400" />
                        {formatDate(appt.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Clock size={12} className="text-gray-400" />
                        {appt.timeStart} - {appt.timeEnd}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${statusColors[appt.status]}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDateTime(appt.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectAppointment(appt)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {appt.status !== 'approved' && appt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(appt._id, 'approved')}
                            disabled={actionLoading === appt._id}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            {actionLoading === appt._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle size={16} />
                            )}
                          </button>
                        )}
                        {appt.status !== 'declined' && appt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(appt._id, 'declined')}
                            disabled={actionLoading === appt._id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Decline"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        {appt.status !== 'cancelled' && (
                          <button
                            onClick={() => onSelectAppointment({ ...appt, _openCancelModal: true })}
                            disabled={actionLoading === appt._id}
                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Cancel"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
