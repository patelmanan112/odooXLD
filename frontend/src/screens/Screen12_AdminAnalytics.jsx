import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, LayoutDashboard, Users, Map, Activity, BarChart2, Download, TrendingUp, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Screen12_AdminAnalytics = () => {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '12,480', growth: '+14%', icon: Users },
    { label: 'Active Trips', value: '4,890', growth: '+22%', icon: Map },
    { label: 'Top City', value: 'Tokyo', growth: '+5%', icon: Activity },
    { label: 'Revenue', value: '₹4.2M', growth: '+18%', icon: TrendingUp }
  ];

  const chartData = [
    { month: 'Jan', val: 30 }, { month: 'Feb', val: 45 }, { month: 'Mar', val: 40 },
    { month: 'Apr', val: 65 }, { month: 'May', val: 55 }, { month: 'Jun', val: 80 }, { month: 'Jul', val: 95 }
  ];

  const cities = [
    { rank: 1, name: 'Tokyo', trips: 1240, growth: '+12%' },
    { rank: 2, name: 'Paris', trips: 980, growth: '+8%' },
    { rank: 3, name: 'New York', trips: 850, growth: '+4%' },
    { rank: 4, name: 'London', trips: 720, growth: '+6%' },
    { rank: 5, name: 'Bali', trips: 690, growth: '+15%' }
  ];

  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', joined: '2023-11-12', trips: 4, status: 'Active', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Sarah Smith', email: 'sarah.s@example.com', joined: '2024-01-05', trips: 2, status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Mike Brown', email: 'mikeb@example.com', joined: '2024-02-18', trips: 0, status: 'Suspended', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', joined: '2024-03-22', trips: 7, status: 'Active', avatar: 'https://i.pravatar.cc/150?u=4' }
  ];

  const handleExport = () => showToast("Exporting data to CSV...");

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Left Sidebar */}
      <div style={{ width: '220px', backgroundColor: '#1A1A2E', color: '#CBD5E1', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Shield color="#E85D26" size={24} />
          <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: '1.2rem' }}>Admin Panel</span>
        </div>

        <div style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'cities', label: 'Cities', icon: Map },
            { id: 'activities', label: 'Activities', icon: Activity },
            { id: 'analytics', label: 'Analytics', icon: BarChart2 }
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                background: 'transparent', border: 'none', width: '100%', textAlign: 'left',
                padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer', transition: 'all 0.2s',
                color: isActive ? '#E85D26' : '#CBD5E1',
                borderLeft: isActive ? '3px solid #E85D26' : '3px solid transparent',
                backgroundColor: isActive ? 'rgba(232,93,38,0.1)' : 'transparent'
              }}>
                <item.icon size={18} color={isActive ? '#E85D26' : '#94A3B8'} />
                <span style={{ fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
              </button>
            )
          })}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChevronLeft size={16} /> Back to App
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div style={{ flex: 1, backgroundColor: '#F5F3EF', padding: '32px 40px', overflowY: 'auto' }}>
        
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#1A1A2E', fontSize: '1.75rem', fontWeight: 'bold' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
            </h1>
            <div style={{ color: '#64748B', marginTop: '4px' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <button onClick={handleExport} style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', borderRadius: '12px', color: '#334155', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <Download size={18} /> Export CSV
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '10px' }}><stat.icon size={20} color="#475569" /></div>
                    <div style={{ color: '#059669', background: '#D1FAE5', padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>{stat.growth}</div>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1A1A2E', marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* 2 Column Grid */}
            <div style={{ display: 'flex', gap: '24px' }}>
              
              {/* Chart */}
              <div style={{ flex: 3, backgroundColor: '#FFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#1A1A2E', fontSize: '1.1rem' }}>User Growth (Past 7 Months)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {chartData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', fontSize: '0.85rem', color: '#64748B', fontWeight: '500' }}>{d.month}</div>
                      <div style={{ flex: 1, height: '24px', backgroundColor: '#F1F5F9', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${d.val}%`, backgroundColor: '#E85D26', borderRadius: '12px' }} />
                      </div>
                      <div style={{ width: '30px', textAlign: 'right', fontSize: '0.85rem', color: '#334155', fontWeight: 'bold' }}>{d.val}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div style={{ flex: 2, backgroundColor: '#FFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ margin: '0 0 24px 0', color: '#1A1A2E', fontSize: '1.1rem' }}>Top Destinations</h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {cities.map((city, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i !== cities.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '24px', height: '24px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748B' }}>{city.rank}</div>
                        <div style={{ fontWeight: '600', color: '#1A1A2E' }}>{city.name}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{city.trips} trips</div>
                        <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 'bold' }}>{city.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div style={{ backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  {['User', 'Email', 'Joined', 'Trips', 'Status', 'Actions'].map((h, i) => (
                    <th key={i} style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA', borderBottom: i !== users.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={u.avatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontWeight: '600', color: '#1A1A2E' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.9rem' }}>{u.email}</td>
                    <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.9rem' }}>{u.joined}</td>
                    <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>{u.trips}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: u.status === 'Active' ? '#D1FAE5' : '#FEE2E2', color: u.status === 'Active' ? '#059669' : '#DC2626' }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button style={{ background: 'transparent', border: 'none', color: '#4F46E5', fontWeight: '500', cursor: 'pointer' }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
