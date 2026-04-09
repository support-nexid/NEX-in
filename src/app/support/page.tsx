"use client";

import React, { useState, useEffect } from 'react';
import { syncGetDocs, syncSetDoc, syncSubscribe } from '@/lib/db-sync';

/* ─────── Sidebar Items ─────── */
const sidebarItems = [
  { icon: '📊', label: 'Overview', id: 'overview' },
  { icon: '🎫', label: 'Ticket Queue', id: 'tickets' },
  { icon: '💬', label: 'Live Chat', id: 'chat' },
  { icon: '📧', label: 'Email Support', id: 'email' },
  { icon: '📚', label: 'Knowledge Base', id: 'kb' },
  { icon: '🔔', label: 'Escalations', id: 'escalations' },
  { icon: '📈', label: 'Performance', id: 'performance' },
  { icon: '👥', label: 'Customer Lookup', id: 'lookup' },
  { icon: '📋', label: 'Canned Responses', id: 'canned' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
];

/* ═════ Support Overview ═════ */
function OverviewView() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Support Center</h1>
        <p className="text-gray-500">Monitor team performance, ticket health, and customer satisfaction.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets', value: '23', icon: '🎫', color: 'from-blue-500/20 to-blue-500/5', badge: '' },
          { label: 'Avg Response Time', value: '18m', icon: '⏱️', color: 'from-emerald-500/20 to-emerald-500/5', badge: '-12%' },
          { label: 'Resolution Rate', value: '94.2%', icon: '✅', color: 'from-indigo-500/20 to-indigo-500/5', badge: '+3%' },
          { label: 'CSAT Score', value: '4.7/5', icon: '⭐', color: 'from-amber-500/20 to-amber-500/5', badge: '+0.2' },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-2xl p-6 bg-gradient-to-br ${kpi.color} border border-white/5`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{kpi.icon}</span>
              {kpi.badge && <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{kpi.badge}</span>}
            </div>
            <div className="text-3xl font-black text-white">{kpi.value}</div>
            <div className="text-sm text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Ticket Distribution + Queue Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-8 hover:transform-none">
          <h3 className="text-lg font-bold mb-6">Ticket Distribution by Category</h3>
          <div className="space-y-4">
            {[
              { cat: 'Payment / Billing', count: 8, pct: 35, color: 'bg-amber-500' },
              { cat: 'Portfolio / Builder', count: 6, pct: 26, color: 'bg-indigo-500' },
              { cat: 'Domain / DNS', count: 4, pct: 17, color: 'bg-purple-500' },
              { cat: 'Account / Auth', count: 3, pct: 13, color: 'bg-emerald-500' },
              { cat: 'Bug Reports', count: 2, pct: 9, color: 'bg-rose-500' },
            ].map((c) => (
              <div key={c.cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300">{c.cat}</span>
                  <span className="text-white font-bold">{c.count} tickets ({c.pct}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full transition-all duration-700`} style={{ width: `${c.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 hover:transform-none">
          <h3 className="text-lg font-bold mb-6">Queue Health</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Urgent', count: 3, color: 'bg-rose-500/20 text-rose-400 border-rose-500/20' },
              { label: 'High', count: 7, color: 'bg-amber-500/20 text-amber-400 border-amber-500/20' },
              { label: 'Medium', count: 9, color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
              { label: 'Low', count: 4, color: 'bg-gray-500/20 text-gray-400 border-gray-500/20' },
            ].map((q) => (
              <div key={q.label} className={`rounded-xl p-4 border ${q.color} text-center`}>
                <div className="text-2xl font-black">{q.count}</div>
                <div className="text-xs font-semibold uppercase tracking-wider mt-1">{q.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/5">
            <h4 className="text-sm font-bold text-gray-400 mb-3">SLA Breach Risk</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Tickets approaching SLA</span>
                <span className="text-sm font-bold text-amber-400">4 tickets</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Breached SLA</span>
                <span className="text-sm font-bold text-rose-400">1 ticket</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Feed */}
      <div className="glass-card rounded-2xl p-8 hover:transform-none">
        <h3 className="text-lg font-bold mb-6">Recent Ticket Activity</h3>
        <div className="space-y-4">
          {[
            { id: 'NID-TKT-9924', subject: 'Payment not reflecting after UTR submission', user: 'arjun@demo.com', status: 'open', priority: 'urgent', time: '5 min ago' },
            { id: 'NID-TKT-9923', subject: 'Custom domain CNAME not propagating', user: 'priya@demo.com', status: 'in_progress', priority: 'high', time: '1 hr ago' },
            { id: 'NID-TKT-9922', subject: 'Portfolio 404 after publish', user: 'rahul@demo.com', status: 'waiting', priority: 'medium', time: '3 hrs ago' },
            { id: 'NID-TKT-9921', subject: 'How to add custom animations?', user: 'sneha@demo.com', status: 'resolved', priority: 'low', time: '6 hrs ago' },
          ].map((t) => (
            <div key={t.id} className="flex items-center gap-4 py-3 border-b border-white/[0.03] last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'urgent' ? 'bg-rose-400 animate-pulse' : t.priority === 'high' ? 'bg-amber-400' : t.priority === 'medium' ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-0.5">
                  <span className="font-mono text-xs text-gray-500">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${t.status === 'open' ? 'bg-blue-500/10 text-blue-400' : t.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400' : t.status === 'waiting' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{t.status.replace('_', ' ')}</span>
                </div>
                <p className="text-sm text-white font-medium truncate">{t.subject}</p>
                <p className="text-xs text-gray-500">{t.user}</p>
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">{t.time}</span>
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-400 transition-colors">Open</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═════ Ticket Queue (Full CRM) ═════ */
function TicketQueueView() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const liveTickets = await syncGetDocs('tickets');
        setTickets(liveTickets || []);
      } catch (e) {
        console.error("Failed fetching tickets", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const filtered = tickets.filter(t => (statusFilter === 'all' || t.status === statusFilter) && (priorityFilter === 'all' || t.priority === priorityFilter));

  const priorityColors: Record<string, string> = { urgent: 'bg-rose-500/10 text-rose-400', high: 'bg-amber-500/10 text-amber-400', medium: 'bg-blue-500/10 text-blue-400', low: 'bg-gray-500/10 text-gray-400' };
  const statusColors: Record<string, string> = { open: 'bg-blue-500/10 text-blue-400', in_progress: 'bg-amber-500/10 text-amber-400', waiting: 'bg-purple-500/10 text-purple-400', resolved: 'bg-emerald-500/10 text-emerald-400', escalated: 'bg-rose-500/10 text-rose-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Ticket Queue</h1>
          <p className="text-gray-500">Full CRM view of all support tickets.</p>
        </div>
        <div className="flex gap-3">
          <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full font-bold text-sm">{tickets.filter(t => t.status === 'open').length} Open</span>
          <span className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-full font-bold text-sm">{tickets.filter(t => t.status === 'escalated').length} Escalated</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status:</span>
          {['all', 'open', 'in_progress', 'waiting', 'escalated', 'resolved'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-gray-500 border border-white/5'}`}>{s.replace('_', ' ')}</button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Priority:</span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${priorityFilter === p ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-gray-500 border border-white/5'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 w-full space-y-4 animate-pulse"><div className="h-16 bg-white/5 rounded-xl w-full"></div><div className="h-16 bg-white/5 rounded-xl w-full"></div><div className="h-16 bg-white/5 rounded-xl w-full"></div></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-500">No tickets found in this queue.</div>
        ) : filtered.map((t) => (
          <div key={t.id} onClick={() => setSelectedTicket(selectedTicket === t.id ? null : t.id)} className={`glass-card rounded-2xl p-5 hover:transform-none cursor-pointer transition-all ${selectedTicket === t.id ? 'border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.05)]' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-mono text-xs text-gray-500">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${statusColors[t.status]}`}>{t.status.replace('_', ' ')}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${priorityColors[t.priority]}`}>{t.priority}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400">{t.category}</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{t.subject}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{t.user} ({t.email})</span>
                  <span>·</span>
                  <span className="font-mono">{t.subdomain}.nexid.in</span>
                  <span>·</span>
                  <span>{t.messages} messages</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-xs text-gray-600">{t.created}</div>
                <div className="text-xs text-gray-500 mt-1">Assigned: <span className={`font-semibold ${t.assigned === 'Unassigned' ? 'text-rose-400' : 'text-indigo-400'}`}>{t.assigned}</span></div>
              </div>
            </div>

            {/* Expanded View */}
            {selectedTicket === t.id && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                    <option>Assign to...</option>
                    <option>Ankit</option>
                    <option>Veer</option>
                    <option>Priti</option>
                  </select>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                    <option>Set Status</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Waiting</option>
                    <option>Resolved</option>
                  </select>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                    <option>Set Priority</option>
                    <option>Urgent</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <button className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg px-3 py-2 text-xs font-bold transition-colors border border-rose-500/20">⚠ Escalate</button>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">{t.user[0]}</div>
                    <span className="text-sm text-white font-semibold">{t.user}</span>
                    <span className="text-xs text-gray-600">· {t.created}</span>
                  </div>
                  <p className="text-sm text-gray-400">{t.subject}. I've completed the payment and submitted the UTR but my account still shows Free tier. Please help.</p>
                </div>
                <div className="flex gap-3">
                  <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none" placeholder="Type your reply..." />
                  <button className="btn-primary !rounded-xl !py-3 !px-6 text-sm">Send Reply</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════ Escalations ═════ */
function EscalationsView() {
  const escalated = [
    { id: 'NID-TKT-9919', subject: 'Refund request — Plan does not suit needs', user: 'Dev Patel', email: 'dev@demo.com', tier: 'Pro', amount: '₹299', reason: 'User requesting full refund within 7 days of purchase. Policy allows it.', escalatedBy: 'Ankit', time: '6 hrs ago' },
    { id: 'NID-TKT-9915', subject: 'Account access issue after email change', user: 'Meera K', email: 'meera@demo.com', tier: 'Enterprise', amount: '₹999', reason: 'User changed email but auth not updated. Needs manual intervention.', escalatedBy: 'Ankit', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Escalations</h1>
          <p className="text-gray-500">Tickets escalated to admin review requiring management action.</p>
        </div>
        <span className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-full font-bold text-sm">{escalated.length} Pending</span>
      </div>

      <div className="space-y-4">
        {escalated.map((e) => (
          <div key={e.id} className="glass-card rounded-2xl p-6 hover:transform-none border-l-4 border-rose-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-gray-500">{e.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400">Escalated</span>
                </div>
                <h3 className="text-white font-bold text-lg">{e.subject}</h3>
                <p className="text-sm text-gray-500 mt-1">{e.user} · {e.email} · {e.tier} plan (₹{e.amount})</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">{e.time}</div>
                <div className="text-xs text-gray-500 mt-1">By: <span className="text-amber-400 font-semibold">{e.escalatedBy}</span></div>
              </div>
            </div>
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-300"><span className="text-rose-400 font-bold">Escalation Reason:</span> {e.reason}</p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold text-sm transition-colors border border-emerald-500/20">✓ Approve Refund</button>
              <button className="flex-1 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl font-bold text-sm transition-colors border border-amber-500/20">↩ Return to Agent</button>
              <button className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl font-bold text-sm transition-colors border border-rose-500/20">✗ Deny Request</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════ Customer Lookup ═════ */
function CustomerLookupView() {
  const [query, setQuery] = useState('');
  const mockResult = query.length >= 3 ? {
    name: 'Arjun Mehta', email: 'arjun@demo.com', uid: 'usr_a1b2c3', subdomain: 'arjun', tier: 'Pro', status: 'active', joined: 'Jan 15, 2026', views: 1247, tickets: 3, lastLogin: 'Apr 7, 2026 11:30 PM',
    recentTickets: [
      { id: 'NID-TKT-9924', subject: 'Payment not reflecting', status: 'open' },
      { id: 'NID-TKT-9910', subject: 'How to embed videos?', status: 'resolved' },
    ]
  } : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Customer Lookup</h1>
        <p className="text-gray-500">Search for any user by email, subdomain, or UID to view their full profile.</p>
      </div>

      <div className="relative">
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:outline-none pl-12 text-lg" placeholder="Search by email, subdomain, or UID..." />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔍</span>
      </div>

      {mockResult && (
        <div className="space-y-6">
          {/* User Card */}
          <div className="glass-card rounded-2xl p-8 hover:transform-none">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-2xl">{mockResult.name[0]}</div>
                <div>
                  <h2 className="text-xl font-bold text-white">{mockResult.name}</h2>
                  <p className="text-sm text-gray-500">{mockResult.email}</p>
                  <p className="text-xs text-gray-600 font-mono">{mockResult.uid}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400">Pro</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400">Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Subdomain', value: 'arjun.nexid.in' },
                { label: 'Joined', value: mockResult.joined },
                { label: 'Total Views', value: mockResult.views.toLocaleString() },
                { label: 'Last Login', value: mockResult.lastLogin },
              ].map((f) => (
                <div key={f.label} className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">{f.label}</div>
                  <div className="text-sm text-white font-semibold">{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="glass-card rounded-2xl p-6 hover:transform-none">
            <h3 className="text-lg font-bold mb-4">Recent Tickets ({mockResult.tickets})</h3>
            <div className="space-y-2">
              {mockResult.recentTickets.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3 border-b border-white/[0.03] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-500">{t.id}</span>
                    <span className="text-sm text-gray-300">{t.subject}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.status === 'open' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6 hover:transform-none">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-sm font-bold transition-colors border border-indigo-500/20">Create Ticket</button>
              <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl text-sm font-bold transition-colors border border-amber-500/20">Reset Password</button>
              <button className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl text-sm font-bold transition-colors border border-purple-500/20">View Portfolio</button>
              <button className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-bold transition-colors border border-rose-500/20">Suspend Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═════ Canned Responses ═════ */
function CannedResponsesView() {
  const responses = [
    { title: 'Payment Processing', body: 'Thank you for submitting your UTR. Our finance team typically verifies payments within 2-4 hours during business hours. You will receive email confirmation once approved.', category: 'Payment', uses: 142 },
    { title: 'Domain Propagation', body: 'DNS changes can take up to 24-48 hours to fully propagate worldwide. Please wait a full 48 hours before contacting us again. You can verify propagation at dnschecker.org.', category: 'Domain', uses: 89 },
    { title: 'Password Reset', body: 'You can reset your password from the login page by clicking "Forgot Password". A reset link will be sent to your registered email address.', category: 'Account', uses: 67 },
    { title: 'Animation Guide', body: 'Advanced animations are available for Pro and Enterprise users. Go to your Dashboard → Animations tab to select from our preset library or upload custom animation sequences.', category: 'Builder', uses: 54 },
    { title: 'Refund Policy', body: 'NexId offers a 7-day refund window from the date of purchase. If you are within this window, please provide your UTR and reason for refund, and we will process it within 3-5 business days.', category: 'Payment', uses: 31 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Canned Responses</h1>
          <p className="text-gray-500">Pre-built reply templates for common queries. Click to copy.</p>
        </div>
        <button className="btn-primary !rounded-xl text-sm">+ Create New</button>
      </div>

      <div className="space-y-4">
        {responses.map((r) => (
          <div key={r.title} className="glass-card rounded-2xl p-6 hover:transform-none group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white">{r.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400">{r.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600">Used {r.uses} times</span>
                <button className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold transition-all opacity-0 group-hover:opacity-100">📋 Copy</button>
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs font-bold transition-all opacity-0 group-hover:opacity-100">Edit</button>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════ Performance Metrics ═════ */
function PerformanceView() {
  const agents = [
    { name: 'Ankit', resolved: 47, avgTime: '14m', rating: 4.8, active: 12 },
    { name: 'Veer', resolved: 23, avgTime: '22m', rating: 4.6, active: 5 },
    { name: 'Priti', resolved: 18, avgTime: '31m', rating: 4.4, active: 3 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Agent Performance</h1>
        <p className="text-gray-500">Team productivity, resolution times, and customer ratings.</p>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Resolved (Week)', value: '88', icon: '✅' },
          { label: 'Avg First Response', value: '18m', icon: '⚡' },
          { label: 'Team CSAT', value: '4.7/5', icon: '⭐' },
          { label: 'SLA Compliance', value: '96%', icon: '🎯' },
        ].map((k) => (
          <div key={k.label} className="glass-card rounded-2xl p-5 hover:transform-none">
            <span className="text-lg">{k.icon}</span>
            <div className="text-2xl font-black mt-3">{k.value}</div>
            <div className="text-xs text-gray-500 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Agent Leaderboard */}
      <div className="glass-card rounded-2xl overflow-hidden hover:transform-none">
        <div className="p-6 border-b border-white/5"><h3 className="text-lg font-bold">Agent Leaderboard</h3></div>
        <table className="w-full text-left">
          <thead><tr>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Agent</th>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Resolved</th>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Avg Response</th>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">CSAT</th>
            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Active</th>
          </tr></thead>
          <tbody>
            {agents.map((a, i) => (
              <tr key={a.name} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">{a.name[0]}</span>
                    <div>
                      <span className="font-semibold text-white">{a.name}</span>
                      {i === 0 && <span className="ml-2 text-xs text-amber-400 font-bold">🏆 Top Agent</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-white">{a.resolved}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{a.avgTime}</td>
                <td className="px-6 py-4"><span className="text-sm font-bold text-amber-400">⭐ {a.rating}</span></td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold">{a.active} tickets</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═════ Placeholder ═════ */
function Placeholder({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-black">{title}</h1><p className="text-gray-500">{desc}</p></div>
      <div className="glass-card rounded-2xl p-16 hover:transform-none text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-gray-500">This module is under active development.</p>
      </div>
    </div>
  );
}

/* ═════ Live Chat ═════ */
function ChatView() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);

  useEffect(() => {
    const unsub = syncSubscribe('chat_sessions', [], (data) => setSessions(data));
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-black">Live Chat</h1>
        <p className="text-gray-500">Real-time chat with active visitors.</p>
      </div>
      <div className="flex-1 glass-card rounded-2xl flex overflow-hidden border border-white/5">
        {/* Session List */}
        <div className="w-80 border-r border-white/5 flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/5"><h3 className="font-bold">Active Sessions ({sessions.length})</h3></div>
          <div className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? <div className="p-8 text-center text-gray-500 text-sm">No active chats</div> :
              sessions.map(s => (
                <div key={s.id} onClick={() => setActiveSession(s)} className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] ${activeSession?.id === s.id ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500' : ''}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-white">{s.visitorName || 'Anonymous Visitor'}</span>
                    <span className="text-[10px] text-gray-500">{new Date(s.lastActive || Date.now()).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{s.lastMessage || 'Connected'}</p>
                </div>
              ))
            }
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeSession ? (
            <>
              <div className="p-5 border-b border-white/5 bg-black/40 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">{activeSession.visitorName || 'Anonymous Visitor'}</h3>
                  <span className="text-xs text-emerald-400">● Online</span>
                </div>
                <button className="text-xs bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-lg font-bold">End Session</button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {/* Mock Messages */}
                <div className="flex flex-col gap-1 items-start">
                  <div className="bg-white/10 text-white p-3 rounded-2xl rounded-tl-sm text-sm max-w-[80%]">Hi, I need help with my domain.</div>
                  <span className="text-[10px] text-gray-500">10:42 AM</span>
                </div>
              </div>
              <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex gap-2">
                  <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-indigo-500/50 outline-none" placeholder="Type a message..." />
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 rounded-xl font-bold text-sm transition-colors">Send</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">Select a session to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════ Email Support ═════ */
function EmailView() {
  const emails = [
    { id: '1', from: 'dev@example.com', subject: 'Pre-sales inquiry', date: 'Today, 2:30 PM', read: false },
    { id: '2', from: 'billing@corp.com', subject: 'Invoice #10023 payment failed', date: 'Yesterday', read: true },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Email Support</h1>
          <p className="text-gray-500">Inbox for support@nexid.in.</p>
        </div>
        <button className="btn-primary !rounded-xl text-sm">Compose</button>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        {emails.map(e => (
          <div key={e.id} className={`p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] ${e.read ? 'opacity-70' : 'bg-white/[0.03]'}`}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {!e.read && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>}
              {e.read && <div className="w-2 h-2 rounded-full flex-shrink-0"></div>}
              <div>
                <div className={`text-sm mb-0.5 ${e.read ? 'text-gray-300' : 'text-white font-bold'}`}>{e.from}</div>
                <div className="text-sm text-gray-400 truncate w-full">{e.subject}</div>
              </div>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap pl-6 md:pl-0">{e.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════ Knowledge Base ═════ */
function KnowledgeBaseView() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editorData, setEditorData] = useState({ title: '', content: '' });

  useEffect(() => {
    syncGetDocs('help_articles').then(setArticles);
  }, []);

  const handleSave = async () => {
    await syncSetDoc('help_articles', Date.now().toString(), editorData);
    setEditorData({ title: '', content: '' });
    setIsEditing(false);
    syncGetDocs('help_articles').then(setArticles);
  };

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Write Article</h1>
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleSave} className="btn-primary !rounded-xl text-sm px-6">Publish</button>
          </div>
        </div>
        <input value={editorData.title} onChange={e => setEditorData({...editorData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-xl focus:border-indigo-500/50 outline-none" placeholder="Article Title" />
        <textarea value={editorData.content} onChange={e => setEditorData({...editorData, content: e.target.value})} className="w-full h-96 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500/50 outline-none leading-relaxed resize-none" placeholder="Write markdown content here..."></textarea>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Knowledge Base</h1>
          <p className="text-gray-500">Manage public help articles.</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="btn-primary !rounded-xl text-sm px-5">+ New Article</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.length === 0 && <div className="col-span-full p-8 text-center text-gray-500 glass-card rounded-2xl">No articles published yet.</div>}
        {articles.map(a => (
          <div key={a.id} className="glass-card rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
            <h3 className="font-bold text-white mb-2">{a.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-3">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════ Support Settings ═════ */
function SettingsView() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black">Support Settings</h1>
        <p className="text-gray-500">SLA configurations and team preferences.</p>
      </div>
      
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <h3 className="text-lg font-bold">Service Level Agreements (SLA)</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">Pro Tier Response Target (hours)</label>
            <input type="number" defaultValue={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 font-semibold block mb-2">Enterprise Response Target (hours)</label>
            <input type="number" defaultValue={1} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 space-y-6">
        <h3 className="text-lg font-bold">Auto-Assignment Rules</h3>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
          <div>
            <div className="font-bold text-sm mb-1">Round Robin Assignment</div>
            <div className="text-xs text-gray-500">Automatically distribute new tickets equally among online agents</div>
          </div>
          <div className="w-10 h-6 bg-indigo-500 rounded-full relative cursor-pointer flex-shrink-0">
             <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </div>
        </div>
      </div>
      
      <button className="btn-primary !rounded-xl w-full">Save Changes</button>
    </div>
  );
}

/* ═══════════════ MAIN SUPPORT PANEL ═══════════════ */
export default function SupportDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => { setActiveTab(id); setMobileMenuOpen(false); };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewView />;
      case 'tickets': return <TicketQueueView />;
      case 'escalations': return <EscalationsView />;
      case 'lookup': return <CustomerLookupView />;
      case 'canned': return <CannedResponsesView />;
      case 'performance': return <PerformanceView />;
      case 'chat': return <ChatView />;
      case 'email': return <EmailView />;
      case 'kb': return <KnowledgeBaseView />;
      case 'settings': return <SettingsView />;
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
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-cyan-500/20">S</div>
            <div>
              <span className="text-lg font-bold tracking-tight">NexId</span>
              <span className="text-xs text-cyan-400 font-bold ml-2 bg-cyan-500/10 px-2 py-0.5 rounded">SUPPORT</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white text-xl lg:hidden">✕</button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-cyan-500/15 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'}`}>
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
            <span className="text-sm text-gray-600 font-medium hidden sm:inline">support.nexid.in</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">Support Agent</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">{renderContent()}</div>
      </main>
    </div>
  );
}

