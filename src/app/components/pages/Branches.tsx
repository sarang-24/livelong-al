import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Building2, TrendingUp, MapPin, Users, Globe, Target } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { speakText } from "../../utils/voice";

const branches = [
  { rank: 1, name: "Mumbai", city: "Mumbai", revenue: 82.4, premium: 648, policies: 1840, agents: 14, target: 102, conversion: 38, claims: 42, renewals: 88 },
  { rank: 2, name: "Delhi", city: "New Delhi", revenue: 74.1, premium: 582, policies: 1620, agents: 12, target: 95, conversion: 35, claims: 38, renewals: 84 },
  { rank: 3, name: "Bengaluru", city: "Bengaluru", revenue: 68.2, premium: 536, policies: 1480, agents: 10, target: 97, conversion: 32, claims: 31, renewals: 82 },
  { rank: 4, name: "Chennai", city: "Chennai", revenue: 55.4, premium: 436, policies: 1240, agents: 8, target: 92, conversion: 28, claims: 28, renewals: 78 },
  { rank: 5, name: "Hyderabad", city: "Hyderabad", revenue: 52.1, premium: 410, policies: 1160, agents: 7, target: 95, conversion: 26, claims: 24, renewals: 79 },
  { rank: 6, name: "Pune", city: "Pune", revenue: 48.3, premium: 380, policies: 1080, agents: 6, target: 74, conversion: 24, claims: 22, renewals: 74 },
  { rank: 7, name: "Ahmedabad", city: "Ahmedabad", revenue: 41.2, premium: 324, policies: 920, agents: 5, target: 85, conversion: 21, claims: 18, renewals: 72 },
  { rank: 8, name: "Kolkata", city: "Kolkata", revenue: 38.6, premium: 304, policies: 860, agents: 5, target: 82, conversion: 19, claims: 17, renewals: 70 },
];

const monthlyData = [
  { month: "Jan", Mumbai: 72, Delhi: 65, Bengaluru: 58, Chennai: 48, Hyderabad: 44, Pune: 40 },
  { month: "Feb", Mumbai: 78, Delhi: 68, Bengaluru: 62, Chennai: 51, Hyderabad: 47, Pune: 42 },
  { month: "Mar", Mumbai: 75, Delhi: 70, Bengaluru: 60, Chennai: 49, Hyderabad: 46, Pune: 41 },
  { month: "Apr", Mumbai: 80, Delhi: 72, Bengaluru: 65, Chennai: 53, Hyderabad: 50, Pune: 45 },
  { month: "May", Mumbai: 79, Delhi: 71, Bengaluru: 63, Chennai: 52, Hyderabad: 49, Pune: 44 },
  { month: "Jun", Mumbai: 84, Delhi: 75, Bengaluru: 69, Chennai: 56, Hyderabad: 53, Pune: 48 },
  { month: "Jul", Mumbai: 82, Delhi: 74, Bengaluru: 68, Chennai: 55, Hyderabad: 52, Pune: 46 },
];

export function Branches({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const [selectedBranchName, setSelectedBranchName] = useState("Mumbai");

  useEffect(() => {
    const handleVoiceInspect = (e: Event) => {
      const customEvent = e as CustomEvent<{ branch: string }>;
      const branchKey = customEvent.detail.branch;
      
      const foundBranch = branches.find(b => b.name.toLowerCase() === branchKey.toLowerCase());
      if (foundBranch) {
        setSelectedBranchName(foundBranch.name);
        
        speakText(
          `Displaying ${foundBranch.name} branch performance. Current revenue is ${foundBranch.revenue} Lakhs, achieving ${foundBranch.target} percent of target with ${foundBranch.agents} active agents.`
        );
      }
    };

    window.addEventListener("trigger-branch-inspection", handleVoiceInspect);
    return () => {
      window.removeEventListener("trigger-branch-inspection", handleVoiceInspect);
    };
  }, []);

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  const activeBranch = branches.find((b) => b.name === selectedBranchName) || branches[0];

  const radarBranch = [
    { subject: "Revenue", Score: Math.min(activeBranch.revenue * 1.2, 100), Target: 95 },
    { subject: "Policies", Score: Math.min(activeBranch.policies / 18, 100), Target: 88 },
    { subject: "Renewals", Score: activeBranch.renewals, Target: 85 },
    { subject: "Conversion", Score: Math.min(activeBranch.conversion * 2.6, 100), Target: 80 },
    { subject: "Claims (Low Risk)", Score: Math.max(100 - activeBranch.claims, 50), Target: 75 },
    { subject: "Agents Efficiency", Score: Math.min(activeBranch.agents * 7, 100), Target: 82 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Branch Performance</h2>
        <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>8 branches across India · ₹4.6Cr total revenue</p>
      </div>

      {/* Map & KPIs Row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Total Branches", value: "8", color: "#6366F1" },
            { label: "Total Agents", value: "67", color: "#10B981" },
            { label: "Best Branch", value: "Mumbai", color: "#F59E0B" },
            { label: "Needs Attention", value: "Pune", color: "#EF4444" },
          ].map((k) => (
            <div key={k.label} style={{ background: bg, borderRadius: 14, padding: 14, border: `1px solid ${border}`, borderLeft: `4px solid ${k.color}` }}>
              <div style={{ color: subtext, fontSize: 11 }}>{k.label}</div>
              <div style={{ color: text, fontSize: 20, fontWeight: 800, marginTop: 4 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Branch Grid Selector */}
        <div
          style={{
            background: "linear-gradient(135deg, #090D16, #111827)",
            borderRadius: 18,
            padding: 24,
            border: "1px solid rgba(99,102,241,0.2)",
            position: "relative",
            overflow: "hidden",
            minHeight: 250,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#818CF8", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>
            <Globe size={18} />
            <span>India Branch Network</span>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", 
            gap: 12 
          }}>
            {branches.map((b) => {
              const isSelected = selectedBranchName === b.name;
              return (
                <div
                  key={b.name}
                  onClick={() => setSelectedBranchName(b.name)}
                  style={{
                    background: isSelected 
                      ? "rgba(99,102,241,0.25)" 
                      : b.target >= 100 
                        ? "rgba(16,185,129,0.12)" 
                        : "rgba(37,99,235,0.12)",
                    border: `1px solid ${isSelected 
                      ? "#6366F1" 
                      : b.target >= 100 
                        ? "rgba(16,185,129,0.25)" 
                        : "rgba(37,99,235,0.2)"}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <MapPin size={12} color={b.target >= 100 ? "#6EE7B7" : "#60A5FA"} />
                    <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{b.name}</span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 4 }}>
                    ₹{b.revenue}L revenue
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(b.target, 100)}%`, height: "100%", background: b.target >= 100 ? "#6EE7B7" : "#60A5FA", borderRadius: 2 }} />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 700 }}>{b.target}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", 
        gap: 20 
      }}>
        {/* Regional Comparison */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Regional Revenue Comparison</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Monthly trend compared with top branches (₹L)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Line type="monotone" dataKey="Mumbai" name="Mumbai" stroke="#6366F1" strokeWidth={selectedBranchName === "Mumbai" ? 3 : 1.5} dot={false} />
              <Line type="monotone" dataKey="Delhi" name="Delhi" stroke="#10B981" strokeWidth={selectedBranchName === "Delhi" ? 3 : 1.5} dot={false} />
              <Line type="monotone" dataKey="Bengaluru" name="Bengaluru" stroke="#F59E0B" strokeWidth={selectedBranchName === "Bengaluru" ? 3 : 1.5} dot={false} />
              <Line type="monotone" dataKey="Chennai" name="Chennai" stroke="#3B82F6" strokeWidth={selectedBranchName === "Chennai" ? 3 : 1.5} dot={false} />
              {selectedBranchName !== "Mumbai" && selectedBranchName !== "Delhi" && selectedBranchName !== "Bengaluru" && selectedBranchName !== "Chennai" && (
                <Line type="monotone" dataKey={selectedBranchName} name={selectedBranchName} stroke="#EF4444" strokeWidth={3} dot={true} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Radar Analysis */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{selectedBranchName} Branch Analysis</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 8 }}>Performance vs Target Profile</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarBranch}>
              <PolarGrid stroke={dark ? "rgba(255,255,255,0.05)" : "#E2E8F0"} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: subtext, fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
              <Radar name={selectedBranchName} dataKey="Score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25} />
              <Radar name="Target" dataKey="Target" stroke="#10B981" fill="#10B981" fillOpacity={0.08} strokeDasharray="5 5" />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Table */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>Branch Ranking</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["#", "Branch", "Revenue (₹L)", "Premium (₹L)", "Policies", "Agents", "Target%", "Conversion%", "Renewals%"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 600, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => {
                const isSelected = selectedBranchName === b.name;
                return (
                  <tr 
                    key={b.rank} 
                    onClick={() => setSelectedBranchName(b.name)}
                    style={{ 
                      borderBottom: `1px solid ${border}`,
                      cursor: "pointer",
                      background: isSelected ? (dark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.04)") : "transparent",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={(e) => { 
                      if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = inputBg; 
                    }}
                    onMouseLeave={(e) => { 
                      if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; 
                    }}
                  >
                    <td style={{ padding: "12px 16px", color: text, fontSize: 14, fontWeight: 800 }}>{b.rank}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <MapPin size={14} color="#6366F1" />
                        <div>
                          <div style={{ color: text, fontSize: 13, fontWeight: 700 }}>{b.name}</div>
                          <div style={{ color: subtext, fontSize: 11 }}>{b.city}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 700 }}>₹{b.revenue}L</td>
                    <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>₹{b.premium}L</td>
                    <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>{b.policies.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>{b.agents}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        background: b.target >= 100 ? "rgba(16,185,129,0.12)" : b.target >= 80 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                        color: b.target >= 100 ? "#10B981" : b.target >= 80 ? "#F59E0B" : "#EF4444",
                        padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                      }}>
                        {b.target}%
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>{b.conversion}%</td>
                    <td style={{ padding: "12px 16px", color: "#10B981", fontSize: 13, fontWeight: 700 }}>{b.renewals}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
