import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line
} from "recharts";
import { UserCog, TrendingUp, Bot, Phone, Trophy, Award, BookOpen, AlertTriangle, Star, Search, CheckCircle2, XCircle } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { speakText } from "../../utils/voice";

const agents = [
  { rank: 1, name: "Aakash Gupta", id: "AG-001", policies: 42, premium: 18.4, brokerage: 1.84, target: 94, rating: 98, status: "Active", certified: true, training: 100 },
  { rank: 2, name: "Sunita Rao", id: "AG-002", policies: 38, premium: 16.2, brokerage: 1.62, target: 88, rating: 95, status: "Active", certified: true, training: 95 },
  { rank: 3, name: "Manish Kapoor", id: "AG-003", policies: 35, premium: 14.8, brokerage: 1.48, target: 82, rating: 92, status: "Active", certified: true, training: 88 },
  { rank: 4, name: "Deepika Sharma", id: "AG-004", policies: 31, premium: 13.1, brokerage: 1.31, target: 72, rating: 90, status: "Active", certified: false, training: 76 },
  { rank: 5, name: "Rohit Malhotra", id: "AG-005", policies: 28, premium: 11.9, brokerage: 1.19, target: 68, rating: 87, status: "Active", certified: true, training: 85 },
  { rank: 6, name: "Priya Menon", id: "AG-006", policies: 24, premium: 10.2, brokerage: 1.02, target: 60, rating: 82, status: "Active", certified: false, training: 70 },
  { rank: 7, name: "Kiran Shah", id: "AG-007", policies: 18, premium: 7.8, brokerage: 0.78, target: 48, rating: 74, status: "Warning", certified: false, training: 55 },
  { rank: 8, name: "Anuj Pillai", id: "AG-008", policies: 12, premium: 5.2, brokerage: 0.52, target: 34, rating: 62, status: "Inactive", certified: false, training: 40 },
];

const performanceData = [
  { month: "Mar", avg: 28, top: 42 },
  { month: "Apr", avg: 30, top: 45 },
  { month: "May", avg: 29, top: 41 },
  { month: "Jun", avg: 33, top: 48 },
  { month: "Jul", avg: 31, top: 42 },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Active: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  Warning: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Inactive: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
};

export function Agents({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const [selectedAgentId, setSelectedAgentId] = useState("AG-001");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleVoiceInspectAgent = (e: Event) => {
      const customEvent = e as CustomEvent<{ agentId: string }>;
      const agentKey = customEvent.detail.agentId;
      
      const foundAgent = agents.find(a => a.id.toLowerCase() === agentKey.toLowerCase() || a.name.toLowerCase().includes(agentKey.toLowerCase()));
      if (foundAgent) {
        setSelectedAgentId(foundAgent.id);
        
        speakText(
          `Showing agent ${foundAgent.name}. Premium generated: ${foundAgent.premium} Lakhs, with ${foundAgent.policies} active policies. Efficiency rating is ${foundAgent.rating} stars.`
        );
      }
    };

    window.addEventListener("trigger-agent-inspection", handleVoiceInspectAgent);
    return () => {
      window.removeEventListener("trigger-agent-inspection", handleVoiceInspectAgent);
    };
  }, []);

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Dynamic radar chart data matching the selected agent's actual metrics
  const radarData = [
    { subject: "Policies", Agent: Math.min(selectedAgent.policies * 2.2, 100), Team: 68 },
    { subject: "Premium", Agent: Math.min(selectedAgent.premium * 5.2, 100), Team: 65 },
    { subject: "Renewals", Agent: selectedAgent.target, Team: 72 },
    { subject: "Leads", Agent: selectedAgent.rating, Team: 70 },
    { subject: "Satisfaction", Agent: selectedAgent.rating, Team: 80 },
    { subject: "Training", Agent: selectedAgent.training, Team: 75 },
  ];

  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Agent & POSP Dashboard</h2>
        <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>48 agents · 12 POSP · ₹98.6L total premium this month</p>
      </div>

      {/* KPI Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", 
        gap: 14 
      }}>
        {[
          { label: "Active Agents", value: "48", color: "#10B981" },
          { label: "Avg Policies/Agent", value: "28.4", color: "#6366F1" },
          { label: "Target Achievement", value: "78%", color: "#3B82F6" },
          { label: "Top Performer", value: "Aakash G.", color: "#F59E0B" },
          { label: "Inactive Agents", value: "6", color: "#EF4444" },
        ].map((k) => (
          <div key={k.label} style={{ 
            background: bg, borderRadius: 16, padding: 16, border: `1px solid ${border}`, 
            borderTop: `3px solid ${k.color}`, 
            boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" 
          }}>
            <div style={{ color: subtext, fontSize: 11, marginBottom: 8 }}>{k.label}</div>
            <div style={{ color: text, fontSize: 20, fontWeight: 800 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Charts & Analytics */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
        gap: 20 
      }}>
        {/* Performance Chart */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Team Performance Trend</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Avg vs Top performer (policies)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Line type="monotone" dataKey="top" name="Top Agent" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 4 }} />
              <Line type="monotone" dataKey="avg" name="Team Avg" stroke="#6366F1" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#6366F1", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Analysis */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Agent vs Team Average</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 8 }}>{selectedAgent.name} — Multi-Dimension Capability</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarData}>
              <PolarGrid stroke={dark ? "rgba(255,255,255,0.05)" : "#E2E8F0"} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: subtext, fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
              <Radar name={selectedAgent.name.split(" ")[0]} dataKey="Agent" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.25} />
              <Radar name="Team Avg" dataKey="Team" stroke="#6366F1" fill="#6366F1" fillOpacity={0.12} />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Coach */}
      <div style={{ background: "linear-gradient(135deg, #6366F1, #3B82F6)", borderRadius: 18, padding: 20, color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Bot size={20} color="white" />
          <div style={{ fontWeight: 700, fontSize: 15 }}>AI Performance Coach</div>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", 
          gap: 14 
        }}>
          {[
            { title: "Suggested Training", content: "Kiran Shah & Anuj Pillai need Health Insurance product training. Completion rate: 55%.", icon: BookOpen },
            { title: "High Performers", content: "Aakash, Sunita & Manish exceeded targets. Eligible for Q3 performance bonus (₹45K).", icon: Trophy },
            { title: "Inactive Agents", content: "6 agents have not logged any policy in 14 days. Auto-reminder sent. Manual follow-up recommended.", icon: AlertTriangle },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: 8, 
                  background: "rgba(255,255,255,0.15)", display: "flex", 
                  alignItems: "center", justifyContent: "center", marginBottom: 10
                }}>
                  <Icon size={16} color="white" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.5 }}>{c.content}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ 
          padding: "16px 20px", 
          borderBottom: `1px solid ${border}`,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: 12
        }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>Agent Leaderboard</div>
          
          {/* Search Bar */}
          <div style={{ 
            display: "flex", alignItems: "center", gap: 8, 
            background: inputBg, border: `1px solid ${border}`, 
            borderRadius: 10, padding: "8px 14px", width: isMobile ? "auto" : "260px"
          }}>
            <Search size={14} color={subtext} />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search agents..." 
              style={{ border: "none", background: "transparent", outline: "none", color: text, fontSize: 13, width: "100%" }} 
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Rank", "Agent", "Policies", "Premium (₹L)", "Brokerage", "Target%", "Rating", "Certified", "Status"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 600, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((a) => (
                <tr key={a.id} 
                  onClick={() => setSelectedAgentId(a.id)}
                  style={{ 
                    borderBottom: `1px solid ${border}`,
                    cursor: "pointer",
                    background: selectedAgentId === a.id ? (dark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.04)") : "transparent",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => { 
                    if (selectedAgentId !== a.id) (e.currentTarget as HTMLTableRowElement).style.background = inputBg; 
                  }}
                  onMouseLeave={(e) => { 
                    if (selectedAgentId !== a.id) (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; 
                  }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: a.rank === 1 ? "linear-gradient(135deg, #F59E0B, #D97706)" : a.rank === 2 ? "linear-gradient(135deg, #94A3B8, #475569)" : a.rank === 3 ? "linear-gradient(135deg, #B45309, #78350F)" : "transparent",
                      border: a.rank > 3 ? `1px solid ${border}` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: a.rank <= 3 ? "white" : text, fontSize: 12, fontWeight: 700,
                    }}>
                      {a.rank === 1 ? (
                        <Trophy size={13} color="white" />
                      ) : a.rank === 2 ? (
                        <Award size={13} color="white" />
                      ) : a.rank === 3 ? (
                        <Award size={13} color="white" />
                      ) : (
                        a.rank
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: text, fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                    <div style={{ color: subtext, fontSize: 11 }}>{a.id}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 700 }}>{a.policies}</td>
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>₹{a.premium}L</td>
                  <td style={{ padding: "12px 16px", color: "#10B981", fontSize: 13, fontWeight: 600 }}>₹{a.brokerage}L</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 60, height: 6, background: dark ? "#1E293B" : "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${a.target}%`, height: "100%", background: a.target >= 80 ? "#10B981" : a.target >= 60 ? "#F59E0B" : "#EF4444", borderRadius: 3 }} />
                      </div>
                      <span style={{ color: text, fontSize: 11, fontWeight: 700 }}>{a.target}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={13} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ color: text, fontSize: 13, fontWeight: 700 }}>{a.rating}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {a.certified ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#10B981", fontSize: 12 }}>
                        <CheckCircle2 size={14} />
                        <span>Certified</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#EF4444", fontSize: 12 }}>
                        <XCircle size={14} />
                        <span>Pending</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: statusStyle[a.status]?.bg, color: statusStyle[a.status]?.color, padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
