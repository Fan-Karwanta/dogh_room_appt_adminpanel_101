import React, { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, Save, Loader2, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { getAdminEmails, updateAdminEmails, getRequestLimit, updateRequestLimit } from '../api';

function Settings() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Request Limit state
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [maxRequests, setMaxRequests] = useState(3);
  const [limitSaving, setLimitSaving] = useState(false);
  const [limitError, setLimitError] = useState('');
  const [limitSuccess, setLimitSuccess] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [emailRes, limitRes] = await Promise.all([
        getAdminEmails(),
        getRequestLimit()
      ]);
      setEmails(emailRes.data.emails || []);
      setLimitEnabled(limitRes.data.enabled || false);
      setMaxRequests(limitRes.data.maxRequests || 3);
    } catch (err) {
      setError('Failed to load settings');
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

  const handleSaveLimit = async () => {
    try {
      setLimitSaving(true);
      setLimitError('');
      setLimitSuccess('');

      if (limitEnabled && (!Number.isInteger(Number(maxRequests)) || Number(maxRequests) < 1)) {
        setLimitError('Maximum requests must be a positive whole number.');
        setLimitSaving(false);
        return;
      }

      await updateRequestLimit({
        enabled: limitEnabled,
        maxRequests: Number(maxRequests)
      });
      setLimitSuccess('Request limit settings saved successfully!');
    } catch (err) {
      setLimitError('Failed to save request limit settings');
    } finally {
      setLimitSaving(false);
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
      {/* Request Limit Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ShieldCheck size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Weekly Request Limit</h3>
              <p className="text-sm text-gray-500">
                Control the maximum number of appointment requests a user can submit per week.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {limitError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{limitError}</p>
            </div>
          )}

          {limitSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <p className="text-green-700 text-sm">{limitSuccess}</p>
            </div>
          )}

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-800">Enable Request Limit</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {limitEnabled
                  ? 'Users are limited in how many requests they can submit per week.'
                  : 'No limit — users can submit unlimited requests.'}
              </p>
            </div>
            <button
              onClick={() => { setLimitEnabled(!limitEnabled); setLimitSuccess(''); }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                limitEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  limitEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Max Requests Input (shown only when enabled) */}
          {limitEnabled && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Requests Per Week
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxRequests}
                  onChange={e => { setMaxRequests(e.target.value); setLimitSuccess(''); }}
                  className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-center font-semibold"
                />
                <span className="text-sm text-gray-500">requests per device per week</span>
              </div>
              <p className="text-xs text-blue-600">
                Each user's device is uniquely identified. This limit applies per device.
              </p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveLimit}
            disabled={limitSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {limitSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Limit Settings
              </>
            )}
          </button>
        </div>
      </div>

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
