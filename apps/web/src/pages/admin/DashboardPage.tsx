import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, BarChart3, Settings, LogOut, PlusCircle, Code } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || (user.role !== 'admin' && user.role !== 'super_admin')) {
      navigate('/admin/login');
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch dashboard stats
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'problems', label: 'Problems', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '30px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E85D04, #F48C06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}>
              A
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Admin Panel</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>Adyapan</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 0' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: activeTab === tab.id ? 'rgba(232, 93, 4, 0.2)' : 'transparent',
                  border: 'none',
                  borderLeft: activeTab === tab.id ? '3px solid #E85D04' : '3px solid transparent',
                  color: '#fff',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s',
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            padding: '15px 20px',
            background: 'transparent',
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '30px', color: '#1a1a2e' }}>
          {tabs.find(t => t.id === activeTab)?.label}
        </h1>

        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
              {[
                { label: 'Total Students', value: stats?.totalStudents || 0, color: '#E85D04' },
                { label: 'Active Courses', value: stats?.totalCourses || 0, color: '#3498db' },
                { label: 'Total Problems', value: stats?.totalProblems || 0, color: '#2ecc71' },
                { label: 'Submissions Today', value: stats?.submissionsToday || 0, color: '#9b59b6' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: '#fff',
                  padding: '25px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, marginBottom: '8px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ marginBottom: '20px' }}>Recent Activity</h3>
              <p style={{ color: '#999' }}>Activity feed coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <button style={{
                background: 'linear-gradient(135deg, #E85D04, #F48C06)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <PlusCircle size={18} />
                Add Student
              </button>
            </div>
            <div style={{
              background: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ marginBottom: '20px' }}>Student Management</h3>
              <p style={{ color: '#999' }}>Student list and performance analytics coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <button style={{
                background: 'linear-gradient(135deg, #E85D04, #F48C06)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <PlusCircle size={18} />
                Create Course
              </button>
            </div>
            <div style={{
              background: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ marginBottom: '20px' }}>Content Creation</h3>
              <p style={{ color: '#999' }}>Course and content management coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => navigate('/admin/problems/create')}
                style={{
                  background: 'linear-gradient(135deg, #E85D04, #F48C06)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <PlusCircle size={18} />
                Create Problem
              </button>
            </div>
            <div style={{
              background: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ marginBottom: '20px' }}>Coding Problems</h3>
              <p style={{ color: '#999' }}>Problem management interface coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ marginBottom: '20px' }}>Platform Settings</h3>
            <p style={{ color: '#999' }}>Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
