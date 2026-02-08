import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, MapPin, CheckCircle, XCircle, Loader2, Trash2, Mail } from 'lucide-react';
import { updateAppointment, deleteAppointment } from '../api';

function AppointmentDetail({ appointment, onClose, onUpdate }) {
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState(appointment.adminNotes || '');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  };

  const statusColors = {
    approved: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    declined: 'bg-red-100 text-red-800 border-red-200'
  };

  const handleAction = async (status) => {
    try {
      setActionLoading(true);
      await updateAppointment(appointment._id, { status, adminNotes });
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      setActionLoading(true);
      await deleteAppointment(appointment._id);
      onUpdate();
    } catch (err) {
      alert('Failed to delete appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setActionLoading(true);
      await updateAppointment(appointment._id, { adminNotes });
      onUpdate();
    } catch (err) {
      alert('Failed to save notes');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Appointment Details</h2>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${statusColors[appointment.status]}`}>
              {appointment.status}
            </span>
            <span className="text-xs text-gray-400">
              ID: {appointment._id.slice(-8)}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Room</p>
                <p className="text-sm text-gray-900 font-medium">{appointment.room}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Booked By</p>
                <p className="text-sm text-gray-900 font-medium">{appointment.bookerName}</p>
              </div>
            </div>

            {appointment.bookerEmail && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-900">{appointment.bookerEmail}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Date</p>
                <p className="text-sm text-gray-900">{formatDate(appointment.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Time</p>
                <p className="text-sm text-gray-900">{appointment.timeStart} - {appointment.timeEnd}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Reason</p>
                <p className="text-sm text-gray-900">{appointment.reason}</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium mb-1">Submitted At</p>
              <p className="text-sm text-gray-900">{formatDateTime(appointment.createdAt)}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium mb-1">Device ID</p>
              <p className="text-xs text-gray-600 font-mono break-all">{appointment.deviceId}</p>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="Add notes about this appointment..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {appointment.status !== 'approved' && (
              <button
                onClick={() => handleAction('approved')}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Approve
              </button>
            )}
            {appointment.status !== 'declined' && (
              <button
                onClick={() => handleAction('declined')}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                Decline
              </button>
            )}
            <button
              onClick={handleSaveNotes}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              Save Notes
            </button>
          </div>

          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetail;
