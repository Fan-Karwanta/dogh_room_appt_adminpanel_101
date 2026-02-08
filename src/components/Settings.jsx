import React, { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { getAdminEmails, updateAdminEmails } from '../api';

function Settings() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await getAdminEmails();
      setEmails(res.data.emails || []);
    } catch (err) {
      setError('Failed to load admin emails');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = () => {
    setError('');
    setSuccess('');

    if (!newEmail.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (emails.includes(newEmail.trim().toLowerCase())) {
      setError('This email is already in the list.');
      return;
    }

    setEmails([...emails, newEmail.trim().toLowerCase()]);
    setNewEmail('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(e => e !== emailToRemove));
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await updateAdminEmails(emails);
      setSuccess('Admin notification emails saved successfully!');
    } catch (err) {
      setError('Failed to save admin emails');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Admin Notification Emails */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Admin Notification Emails</h3>
              <p className="text-sm text-gray-500">
                These email addresses will receive notifications when someone requests a room appointment.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Add Email Input */}
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin email address"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
            <button
              onClick={handleAddEmail}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Email List */}
          {emails.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Mail size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No admin emails configured yet.</p>
              <p className="text-gray-400 text-xs mt-1">Add emails above to receive appointment notifications.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail size={14} className="text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{email}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove email"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="text-blue-800 font-medium text-sm mb-2">How it works</h4>
        <ul className="text-blue-700 text-sm space-y-1.5">
          <li>• When someone submits a new appointment request, all admin emails listed above will receive a notification.</li>
          <li>• When you approve or decline an appointment, the booker will receive an email notification at the address they provided.</li>
          <li>• Emails are sent via Gmail using the configured DOGH system account.</li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;
