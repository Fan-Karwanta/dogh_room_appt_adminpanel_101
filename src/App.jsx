import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AppointmentList from './components/AppointmentList';
import AppointmentDetail from './components/AppointmentDetail';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import { setAdminAuth } from './api';
import { LogOut } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('dogh_admin_password');
    if (savedPassword) {
      setAdminAuth(savedPassword);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (password) => {
    sessionStorage.setItem('dogh_admin_password', password);
    setAdminAuth(password);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dogh_admin_password');
    setAdminAuth('');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setSelectedAppointment(null);
        }}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 capitalize">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'appointments' && 'All Appointments'}
              {currentPage === 'pending' && 'Pending Appointments'}
              {currentPage === 'approved' && 'Approved Appointments'}
              {currentPage === 'declined' && 'Declined Appointments'}
              {currentPage === 'settings' && 'Settings'}
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <div className="p-6">
          {currentPage === 'dashboard' && (
            <Dashboard key={refreshKey} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'appointments' && (
            <AppointmentList
              key={`all-${refreshKey}`}
              onSelectAppointment={setSelectedAppointment}
              onRefresh={handleRefresh}
            />
          )}
          {currentPage === 'pending' && (
            <AppointmentList
              key={`pending-${refreshKey}`}
              filterStatus="pending"
              onSelectAppointment={setSelectedAppointment}
              onRefresh={handleRefresh}
            />
          )}
          {currentPage === 'approved' && (
            <AppointmentList
              key={`approved-${refreshKey}`}
              filterStatus="approved"
              onSelectAppointment={setSelectedAppointment}
              onRefresh={handleRefresh}
            />
          )}
          {currentPage === 'declined' && (
            <AppointmentList
              key={`declined-${refreshKey}`}
              filterStatus="declined"
              onSelectAppointment={setSelectedAppointment}
              onRefresh={handleRefresh}
            />
          )}
          {currentPage === 'settings' && (
            <Settings key={`settings-${refreshKey}`} />
          )}
        </div>

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <AppointmentDetail
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onUpdate={() => {
              setSelectedAppointment(null);
              handleRefresh();
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
