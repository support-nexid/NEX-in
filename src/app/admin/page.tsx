"use client";

import React, { useState, useEffect } from 'react';
import { syncGetDocs, syncGetDoc, syncSetDoc } from '@/lib/db-sync';
import { LandingConfig, defaultLandingConfig } from '@/lib/default-landing';

/* ─────── Sidebar Items ─────── */
const sidebarItems = [
  { icon: '📊', label: 'Overview', id: 'overview' },
  { icon: '💳', label: 'UTR Verification', id: 'utr' },
  { icon: '👥', label: 'User Directory', id: 'users' },
  { icon: '📋', label: 'Audit Logs', id: 'logs' },
  { icon: '💰', label: 'Revenue', id: 'revenue' },
  { icon: '📈', label: 'Traffic Analytics', id: 'traffic' },
  { icon: '⏰', label: 'Expired Accounts', id: 'expired' },
  { icon: '🛡️', label: 'Staff Management', id: 'staff' },
  { icon: '⚙️', label: 'System Settings', id: 'system' },
];

/* ═════ Overview Dashboard ═════ */
function OverviewView() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Command Center</h1>
        <p className="text-gray-500">Real-time platform health and business metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '2,847', change: '+12%', color: 'from-indigo-500/20 to-indigo-500/5', icon: '👥' },
          { label: 'Active Portfolios', value: '1,932', change: '+8%', color: 'from-emerald-500/20 to-emerald-500/5', icon: '🌐' },
          { label: 'Revenue (MTD)', value: '₹47,200', change: '+23%', color: 'from-amber-500/20 to-amber-500/5', icon: '💰' },
          { label: 'Pending UTRs', value: '7', change: '', color: 'from-rose-500/20 to-rose-500/5', icon: '⏳' },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-2xl p-6 bg-gradient-to-br ${kpi.color} border border-white/5`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{kpi.icon}</span>
              {kpi.change && <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{kpi.change}</span>}
            </div>
            <div className="text-3xl font-black text-white">{kpi.value}</div>
            <div className="text-sm text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart Placeholder + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-8 hover:transform-none">
          <h3 className="text-lg font-bold mb-6">Revenue Overview</h3>
          <div className="space-y-4">
            {['Jan', 'Feb', 'Mar', 'Apr'].map((month, i) => {
              const widths = [45, 62, 78, 55];
              return (
                <div key={month} className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-10">{month}</span>
                  <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500/60 to-purple-500/60 rounded-lg flex items-center justify-end pr-3 transition-all duration-1000" style={{ width: `${widths[i]}%` }}>
                      <span className="text-xs font-bold text-white/80">₹{(widths[i] * 600).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 hover:transform-none">
          <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { text: 'Payment approved for user arjun_m', time: '2 min ago', color: 'bg-emerald-500' },
              { text: 'New user registered: sneha.iyer', time: '15 min ago', color: 'bg-indigo-500' },
              { text: 'Ticket NID-TKT-9921 resolved', time: '1 hr ago', color: 'bg-blue-500' },
              { text: 'Portfolio suspended: expired_user', time: '3 hr ago', color: 'bg-rose-500' },
              { text: 'UTR submitted: SBIN00098765432', time: '5 hr ago', color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`}></div>
                <span className="text-sm text-gray-300 flex-1">{item.text}</span>
                <span className="text-xs text-gray-600 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion + API Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 hover:transform-none">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {[
              { plan: 'Free', count: 1842, pct: 65, color: 'bg-gray-500' },
              { plan: 'Pro', count: 891, pct: 31, color: 'bg-indigo-500' },
              { plan: 'Enterprise', count: 114, pct: 4, color: 'bg-amber-500' },
            ].map((p) => (
              <div key={p.plan}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{p.plan}</span>
                  <span className="text-white font-bold">{p.count} ({p.pct}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 hover:transform-none">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">API Health</h3>
          <div className="space-y-3">
            {[
              { endpoint: 'api.nexid.in', status: 'Operational', ms: '42ms' },
              { endpoint: 'auth.nexid.in', status: 'Operational', ms: '38ms' },
              { endpoint: 'CF Worker', status: 'Operational', ms: '12ms' },
            ].map((api) => (
              <div key={api.endpoint} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-sm text-gray-300">{api.endpoint}</span>
                </div>
                <span className="text-xs font-mono text-gray-500">{api.ms}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 hover:transform-none">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Projected Renewals</h3>
          <div className="text-4xl font-black text-white mb-2">₹23,400</div>
          <p className="text-sm text-gray-500">Expected revenue from 78 renewals in the next 30 days.</p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full">62 Pro</span>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full">16 Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════ UTR Verification Queue ═════ */
function UTRView() {
  const [searchUTR, setSearchUTR] = useState('');
  const mockPayments = [
    { uid: 'usr_a1b2c3', email: 'arjun@demo.com', tier: 'Pro', utr: 'SBIN00012345678', time: '2 hours ago', amount: '₹299' },
    { uid: 'usr_d4e5f6', email: 'priya@demo.com', tier: 'Enterprise', utr: 'HDFC00098765432', time: '5 hours ago', amount: '₹999' },
    { uid: 'usr_g7h8i9', email: 'rahul@demo.com', tier: 'Pro', utr: 'ICIC00055544433', time: '1 day ago', amount: '₹299' },
  ];

  const filtered = searchUTR ? mockPayments.filter(p => p.utr.toLowerCase().includes(searchUTR.toLowerCase()) || p.email.toLowerCase().includes(searchUTR.toLowerCase())) : mockPayments;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">UTR Verification Queue</h1>
          <p className="text-gray-500">Review and verify manual payment submissions.</p>
        </div>
        <span className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-full font-bold text-sm">{mockPayments.length} Pending</span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input value={searchUTR} onChange={(e) => setSearchUTR(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none pl-12" placeholder="Search by UTR number or email..." />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </div>

      {/* Payment Cards */}
      <div className="space-y-4">
        {filtered.map((payment) => (
          <div key={payment.utr} className="glass-card rounded-2xl p-6 hover:transform-none">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-gray-500">{payment.uid}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${payment.tier === 'Pro' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'}`}>{payment.tier}</span>
                </div>
                <div className="text-white font-semibold">{payment.email}</div>
              </div>
              <span className="text-sm text-gray-500">{payment.time}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1">UTR Number</div>
                <div className="font-mono text-sm text-white font-bold">{payment.utr}</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1">Amount</div>
                <div className="text-sm text-white font-bold">{payment.amount}</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1">Screenshot</div>
                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">View Proof →</a>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl font-bold text-sm transition-colors border border-rose-500/20">✗ Reject</button>
              <button className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold text-sm transition-colors border border-emerald-500/20">✓ Approve & Activate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════ User Directory ═════ */
function UsersView() {
  const [filter, setFilter] = useState('all');
  const [mockUsers, setMockUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await syncGetDocs('users');
        setMockUsers(users || []);
      } catch (e) {
        console.error("Failed fetching users", e);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">User Directory</h1>
          <p className="text-gray-500">Manage all platform users and their subscriptions.</p>
        </div>
        <span className="text-sm text-gray-500">{mockUsers.length} total users</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'expired', 'banned'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'}`}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden hover:transform-none">
        <table className="w-full text-left">
          <thead className="border-b border-white/5">
            <tr>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Subdomain</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Tier</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Views</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8"><div className="w-full space-y-4 animate-pulse"><div className="h-12 bg-white/5 rounded-xl w-full"></div><div className="h-12 bg-white/5 rounded-xl w-full"></div><div className="h-12 bg-white/5 rounded-xl w-full"></div></div></td></tr>
            ) : mockUsers.filter(u => filter === 'all' || (u.is_active ? 'active' : 'suspended') === filter).map((user) => (
              <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="p-4 font-mono text-sm text-gray-400">{user.subdomain || 'none'}.nexid.in</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.tier === 'pro' ? 'bg-indigo-500/20 text-indigo-400' : user.tier === 'enterprise' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500'}`}>{user.tier || 'free'}</span></td>
                <td className="p-4"><span className={`flex items-center gap-2 text-sm ${user.is_active !== false ? 'text-emerald-400' : 'text-rose-400'}`}><span className={`w-2 h-2 rounded-full ${user.is_active !== false ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>{user.is_active !== false ? 'active' : 'suspended'}</span></td>
                <td className="p-4 text-sm text-gray-400">0</td>
                <td className="p-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-400 transition-colors">Edit</button>
                    <button className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-xs font-semibold text-rose-400 transition-colors">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═════ Audit Logs ═════ */
function AuditLogsView() {
  const logs = [
    { admin: 'superadmin@nexid.in', action: 'approve_payment', target: 'arjun@demo.com', details: 'Approved UTR SBIN00012345678 → Pro tier', time: '10 min ago' },
    { admin: 'superadmin@nexid.in', action: 'login', target: 'admin.nexid.in', details: 'Admin panel login from 103.21.xx.xx', time: '25 min ago' },
    { admin: 'support@nexid.in', action: 'resolve_ticket', target: 'NID-TKT-9921', details: 'Ticket resolved: DNS propagation delay', time: '1 hr ago' },
    { admin: 'superadmin@nexid.in', action: 'edit_user', target: 'vikram@demo.com', details: 'Set status: banned (ToS violation)', time: '3 hr ago' },
    { admin: 'cron_system', action: 'auto_suspend', target: '3 accounts', details: 'Scheduled expiry check: 3 portfolios suspended', time: '6 hr ago' },
    { admin: 'superadmin@nexid.in', action: 'reject_payment', target: 'fake_user@demo.com', details: 'UTR invalid, screenshot mismatch', time: '1 day ago' },
  ];

  const actionColors: Record<string, string> = {
    approve_payment: 'bg-emerald-500/10 text-emerald-400',
    reject_payment: 'bg-rose-500/10 text-rose-400',
    login: 'bg-blue-500/10 text-blue-400',
    resolve_ticket: 'bg-cyan-500/10 text-cyan-400',
    edit_user: 'bg-amber-500/10 text-amber-400',
    auto_suspend: 'bg-gray-500/10 text-gray-400',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Audit Logs</h1>
        <p className="text-gray-500">Complete black-box recording of all admin and system actions.</p>
      </div>

      <div className="space-y-3">
        {logs.map((log, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 hover:transform-none flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg flex-shrink-0">{log.action.includes('payment') ? '💳' : log.action === 'login' ? '🔐' : log.action.includes('ticket') ? '🎧' : log.action.includes('suspend') ? '⏰' : '✏️'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <span className="font-mono text-sm text-white font-semibold">{log.admin}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${actionColors[log.action] || 'bg-white/5 text-gray-400'}`}>{log.action.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-gray-400">{log.details}</p>
              <p className="text-xs text-gray-600 mt-1">Target: <span className="text-gray-400">{log.target}</span></p>
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════ Staff Management ═════ */
function StaffView() {
  const staff = [
    { name: 'Veer Bhanushali', email: 'veer@nexid.in', role: 'superadmin', status: 'online', lastActive: 'Now' },
    { name: 'Ankit Support', email: 'ankit@nexid.in', role: 'support', status: 'online', lastActive: '5 min ago' },
    { name: 'Priti Finance', email: 'priti@nexid.in', role: 'financial_mod', status: 'offline', lastActive: '2 hrs ago' },
  ];

  const roleLabels: Record<string, { label: string; color: string }> = {
    superadmin: { label: 'Super Admin', color: 'bg-rose-500/20 text-rose-400' },
    support: { label: 'Support Agent', color: 'bg-blue-500/20 text-blue-400' },
    financial_mod: { label: 'Financial Mod', color: 'bg-amber-500/20 text-amber-400' },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Staff Management</h1>
          <p className="text-gray-500">Add, remove, and assign roles to team members.</p>
        </div>
        <button className="btn-primary !rounded-xl text-sm">+ Invite Staff</button>
      </div>

      <div className="space-y-4">
        {staff.map((s) => (
          <div key={s.email} className="glass-card rounded-2xl p-6 hover:transform-none flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">{s.name[0]}</div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0a0a0a] ${s.status === 'online' ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
              </div>
              <div>
                <div className="font-bold text-white">{s.name}</div>
                <div className="text-sm text-gray-500">{s.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleLabels[s.role].color}`}>{roleLabels[s.role].label}</span>
              <span className="text-xs text-gray-600">{s.lastActive}</span>
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-400 transition-colors">Edit Role</button>
              {s.role !== 'superadmin' && <button className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-xs font-semibold text-rose-400 transition-colors">Remove</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Form */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <h3 className="text-lg font-bold mb-6">Invite New Staff Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none" placeholder="Email address" />
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none">
            <option value="support">Support Agent</option>
            <option value="financial_mod">Financial Moderator</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn-primary !rounded-xl">Send Invitation</button>
        </div>
      </div>
    </div>
  );
}

/* ═════ Expired Accounts ═════ */
function ExpiredView() {
  const expired = [
    { name: 'Sneha Iyer', email: 'sneha@demo.com', subdomain: 'sneha', expiredOn: 'Apr 1, 2026', tier: 'Pro', daysExpired: 7 },
    { name: 'Karan Shah', email: 'karan@demo.com', subdomain: 'karan', expiredOn: 'Mar 28, 2026', tier: 'Pro', daysExpired: 11 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Expired Accounts</h1>
        <p className="text-gray-500">Users whose plans have expired. Target for re-marketing.</p>
      </div>

      <div className="space-y-4">
        {expired.map((u) => (
          <div key={u.email} className="glass-card rounded-2xl p-6 hover:transform-none flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-lg">{u.name[0]}</div>
              <div>
                <div className="font-bold text-white">{u.name}</div>
                <div className="text-sm text-gray-500">{u.email} · <span className="font-mono">{u.subdomain}.nexid.in</span></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-rose-400 font-semibold">Expired {u.daysExpired} days ago</div>
                <div className="text-xs text-gray-600">{u.expiredOn}</div>
              </div>
              <button className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-sm font-bold transition-colors">Send Reminder</button>
              <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold transition-colors">Reactivate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════ Traffic Analytics ═════ */
function TrafficView() {
  const [period, setPeriod] = useState('7d');
  const dailyData = [
    { day: 'Mon', opens: 342, regs: 18, unique: 287 },
    { day: 'Tue', opens: 478, regs: 24, unique: 391 },
    { day: 'Wed', opens: 521, regs: 31, unique: 412 },
    { day: 'Thu', opens: 390, regs: 15, unique: 322 },
    { day: 'Fri', opens: 612, regs: 42, unique: 498 },
    { day: 'Sat', opens: 734, regs: 38, unique: 601 },
    { day: 'Sun', opens: 689, regs: 29, unique: 553 },
  ];

  const topPortfolios = [
    { subdomain: 'priya', views: 3891, visitors: 2104, bounce: '32%', avgTime: '2m 14s' },
    { subdomain: 'arjun', views: 1247, visitors: 876, bounce: '41%', avgTime: '1m 48s' },
    { subdomain: 'sneha', views: 892, visitors: 654, bounce: '28%', avgTime: '3m 02s' },
    { subdomain: 'dev-rahul', views: 456, visitors: 312, bounce: '55%', avgTime: '0m 42s' },
    { subdomain: 'karan', views: 234, visitors: 189, bounce: '38%', avgTime: '1m 26s' },
  ];

  const maxOpens = Math.max(...dailyData.map(d => d.opens));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Traffic Analytics</h1>
          <p className="text-gray-500">Portfolio opens, registrations, and visitor engagement.</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${period === p ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-gray-500 border border-white/5'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Traffic KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Portfolio Opens', value: '3,766', change: '+18%', icon: '👁️' },
          { label: 'Unique Visitors', value: '3,064', change: '+14%', icon: '🧑' },
          { label: 'New Registrations', value: '197', change: '+32%', icon: '✨' },
          { label: 'Avg. Session', value: '1m 52s', change: '+6%', icon: '⏱️' },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card rounded-2xl p-5 hover:transform-none">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg">{kpi.icon}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{kpi.change}</span>
            </div>
            <div className="text-2xl font-black">{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Bar Chart: Daily Opens */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <h3 className="text-lg font-bold mb-2">Daily Portfolio Opens</h3>
        <p className="text-sm text-gray-500 mb-6">Total opens vs new registrations over the past 7 days.</p>
        <div className="flex items-end gap-4 h-52">
          {dailyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col-reverse gap-1 items-center" style={{ height: '180px' }}>
                <div className="w-full bg-gradient-to-t from-indigo-500/60 to-indigo-400/30 rounded-t-lg transition-all duration-700 relative group" style={{ height: `${(d.opens / maxOpens) * 100}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.opens} opens</div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 font-medium">{d.day}</span>
                <span className="text-[10px] text-indigo-400 font-bold">+{d.regs} new</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-500/60"></div><span className="text-xs text-gray-500">Portfolio Opens</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-400/30"></div><span className="text-xs text-gray-500">New Registrations</span></div>
        </div>
      </div>

      {/* Top Portfolios + Geo + Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Portfolios Table */}
        <div className="glass-card rounded-2xl overflow-hidden hover:transform-none">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold">Top Performing Portfolios</h3>
          </div>
          <table className="w-full text-left">
            <thead><tr>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Subdomain</th>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Views</th>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Bounce</th>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Avg Time</th>
            </tr></thead>
            <tbody>
              {topPortfolios.map((p, i) => (
                <tr key={p.subdomain} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400">{i + 1}</span>
                      <span className="font-mono text-sm text-white">{p.subdomain}.nexid.in</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-white">{p.views.toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm text-gray-400">{p.bounce}</td>
                  <td className="px-6 py-3 text-sm text-gray-400">{p.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Geography + Referral Sources */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 hover:transform-none">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Top Regions</h3>
            <div className="space-y-3">
              {[
                { region: 'India', pct: 72, flag: '🇮🇳' },
                { region: 'United States', pct: 12, flag: '🇺🇸' },
                { region: 'United Kingdom', pct: 6, flag: '🇬🇧' },
                { region: 'Germany', pct: 4, flag: '🇩🇪' },
                { region: 'Others', pct: 6, flag: '🌍' },
              ].map((r) => (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="text-lg">{r.flag}</span>
                  <span className="text-sm text-gray-300 flex-1">{r.region}</span>
                  <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${r.pct}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-400 font-bold w-10 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 hover:transform-none">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Referral Sources</h3>
            <div className="space-y-3">
              {[
                { source: 'Direct / Bookmark', pct: 45, color: 'bg-indigo-500' },
                { source: 'Google Search', pct: 28, color: 'bg-emerald-500' },
                { source: 'LinkedIn', pct: 14, color: 'bg-blue-500' },
                { source: 'Twitter / X', pct: 8, color: 'bg-cyan-500' },
                { source: 'Other', pct: 5, color: 'bg-gray-500' },
              ].map((r) => (
                <div key={r.source} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${r.color}`}></div>
                  <span className="text-sm text-gray-300 flex-1">{r.source}</span>
                  <span className="text-sm text-gray-400 font-bold">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════ Revenue Analytics ═════ */
function RevenueView() {
  const monthlyData = [
    { month: 'Jan 2026', pro: 34, enterprise: 8, revenue: 27066 },
    { month: 'Feb 2026', pro: 41, enterprise: 11, revenue: 37259 },
    { month: 'Mar 2026', pro: 56, enterprise: 14, revenue: 46844 },
    { month: 'Apr 2026', pro: 48, enterprise: 10, revenue: 24252 },
  ];
  const maxRev = Math.max(...monthlyData.map(d => d.revenue));

  const recentPayments = [
    { email: 'arjun@demo.com', tier: 'Pro', amount: '₹299', status: 'approved', date: 'Apr 7, 2026' },
    { email: 'priya@demo.com', tier: 'Enterprise', amount: '₹999', status: 'approved', date: 'Apr 6, 2026' },
    { email: 'sneha@demo.com', tier: 'Pro', amount: '₹299', status: 'pending', date: 'Apr 6, 2026' },
    { email: 'vikram@demo.com', tier: 'Pro', amount: '₹299', status: 'rejected', date: 'Apr 5, 2026' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Revenue Analytics</h1>
        <p className="text-gray-500">Detailed financial performance and payment history.</p>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹1,35,421', icon: '💰' },
          { label: 'This Month', value: '₹24,252', icon: '📅' },
          { label: 'MRR (Avg)', value: '₹33,855', icon: '📈' },
          { label: 'Churn Rate', value: '4.2%', icon: '📉' },
        ].map((k) => (
          <div key={k.label} className="glass-card rounded-2xl p-5 hover:transform-none">
            <span className="text-lg">{k.icon}</span>
            <div className="text-2xl font-black mt-3">{k.value}</div>
            <div className="text-xs text-gray-500 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <h3 className="text-lg font-bold mb-6">Monthly Revenue Breakdown</h3>
        <div className="space-y-4">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-20 flex-shrink-0">{d.month.split(' ')[0]}</span>
              <div className="flex-1 h-10 bg-white/5 rounded-lg overflow-hidden flex">
                <div className="h-full bg-indigo-500/50 flex items-center justify-center transition-all" style={{ width: `${(d.pro * 299 / d.revenue) * (d.revenue / maxRev) * 100}%` }}>
                  <span className="text-[10px] font-bold text-white/70 whitespace-nowrap">{d.pro} Pro</span>
                </div>
                <div className="h-full bg-amber-500/50 flex items-center justify-center transition-all" style={{ width: `${(d.enterprise * 999 / d.revenue) * (d.revenue / maxRev) * 100}%` }}>
                  <span className="text-[10px] font-bold text-white/70 whitespace-nowrap">{d.enterprise} Ent</span>
                </div>
              </div>
              <span className="text-sm font-bold text-white w-20 text-right">₹{d.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-card rounded-2xl overflow-hidden hover:transform-none">
        <div className="p-6 border-b border-white/5"><h3 className="text-lg font-bold">Payment History</h3></div>
        <table className="w-full text-left">
          <thead><tr>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Plan</th>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
          </tr></thead>
          <tbody>
            {recentPayments.map((p, i) => (
              <tr key={i} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-6 py-3 text-sm text-white">{p.email}</td>
                <td className="px-6 py-3"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.tier === 'Pro' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'}`}>{p.tier}</span></td>
                <td className="px-6 py-3 text-sm font-bold text-white">{p.amount}</td>
                <td className="px-6 py-3 text-sm text-gray-400">{p.date}</td>
                <td className="px-6 py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : p.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═════ Landing Page CMS ═════ */
function LandingCMSView() {
  const [config, setConfig] = useState<LandingConfig>(defaultLandingConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const data = await syncGetDoc('system_config', 'landing_page');
        if (data) {
          // Merge with default to handle missing fields
          const merged = { ...defaultLandingConfig, ...data } as LandingConfig;
          setConfig(merged);
        }
      } catch (e) {
        console.error("Failed to fetch landing config", e);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await syncSetDoc('system_config', 'landing_page', config);
      alert("Landing page configuration saved successfully!");
    } catch (e) {
      console.error("Save failed", e);
      alert("Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section: keyof LandingConfig, field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  if (loading) return <div className="p-8 animate-pulse text-gray-500">Loading Configuration...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Landing Page CMS</h1>
          <p className="text-gray-500">Update the public landing page content in real-time.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary !rounded-xl text-sm px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Hero Section */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><span>🚀</span> Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Badge Text</label>
            <input 
              value={config.hero.badge} 
              onChange={(e) => updateSection('hero', 'badge', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Badge Value</label>
            <input 
              value={config.hero.badgeValue} 
              onChange={(e) => updateSection('hero', 'badgeValue', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Main Title</label>
            <input 
              value={config.hero.title} 
              onChange={(e) => updateSection('hero', 'title', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Highlighted Text</label>
            <input 
              value={config.hero.titleHighlight} 
              onChange={(e) => updateSection('hero', 'titleHighlight', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-indigo-400 font-bold focus:border-indigo-500/50 focus:outline-none" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
            <textarea 
              rows={3}
              value={config.hero.description} 
              onChange={(e) => updateSection('hero', 'description', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none text-sm leading-relaxed" 
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><span>🎯</span> Contact/CTA Section</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CTA Title</label>
            <input 
              value={config.cta.title} 
              onChange={(e) => updateSection('cta', 'title', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CTA Description</label>
            <input 
              value={config.cta.description} 
              onChange={(e) => updateSection('cta', 'description', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none" 
            />
          </div>
        </div>
      </div>

      {/* Advanced Configuration */}
      <div className="glass-card rounded-2xl p-8 border-rose-500/10 hover:transform-none mt-8">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-400"><span>⚙️</span> Advanced Configuration (API & CORS)</h3>
        <p className="text-sm text-gray-400 mb-6">Manage system-wide environment variables, API whitelists, and cross-origin resource sharing policies.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CORS Allowed Origins (Comma Separated)</label>
            <input 
              defaultValue="https://nexid.in, https://app.nexid.in"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none font-mono text-sm" 
            />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payments API Webhook Secret</label>
             <input 
              type="password"
              defaultValue="sk_test_123456789"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none font-mono text-sm" 
            />
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Internal Microservice Token</label>
             <input 
              type="password"
              defaultValue="nexid_internal_token"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none font-mono text-sm" 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end p-4 mt-8">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary !rounded-xl text-sm px-12 py-4 shadow-xl shadow-indigo-500/20"
        >
          {saving ? 'Saving...' : 'Save All Configuration'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN ADMIN PANEL ═══════════════ */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => { setActiveTab(id); setMobileMenuOpen(false); };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewView />;
      case 'utr': return <UTRView />;
      case 'users': return <UsersView />;
      case 'logs': return <AuditLogsView />;
      case 'staff': return <StaffView />;
      case 'expired': return <ExpiredView />;
      case 'revenue': return <RevenueView />;
      case 'traffic': return <TrafficView />;
      case 'system': return <LandingCMSView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>}

      <aside className={`w-64 border-r border-white/5 flex flex-col bg-[#080808] flex-shrink-0 h-screen sticky top-0
        max-lg:fixed max-lg:z-50 max-lg:w-72 max-lg:shadow-2xl max-lg:shadow-black/50 transition-transform duration-300
        ${mobileMenuOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
      `}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-rose-500/20">A</div>
            <div>
              <span className="text-lg font-bold tracking-tight">NexId</span>
              <span className="text-xs text-rose-400 font-bold ml-2 bg-rose-500/10 px-2 py-0.5 rounded">ADMIN</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white text-xl lg:hidden">✕</button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-rose-500/15 text-rose-400 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'}`}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-400 hover:text-white text-xl p-1">☰</button>
            <span className="text-sm text-gray-600 font-medium hidden sm:inline">admin.nexid.in</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">Super Admin</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center font-bold text-sm">V</div>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">{renderContent()}</div>
      </main>
    </div>
  );
}

