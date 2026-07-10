import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Search, Plus, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const statusData = [
  { status: "Active", count: 8420, color: "#10B981" },
  { status: "Expired", count: 1240, color: "var(--muted-foreground)" },
  { status: "Pending", count: 380, color: "#F59E0B" },
  { status: "Cancelled", count: 182, color: "#EF4444" },
  { status: "Lapsed", count: 94, color: "#6366F1" },
];

const premiumAnalysis = [
  { month: "Jan", health: 42, motor: 28, life: 18, travel: 8 },
  { month: "Feb", health: 45, motor: 30, life: 20, travel: 9 },
  { month: "Mar", health: 48, motor: 27, life: 22, travel: 11 },
  { month: "Apr", health: 52, motor: 31, life: 24, travel: 10 },
  { month: "May", health: 49, motor: 29, life: 23, travel: 12 },
  { month: "Jun", health: 58, motor: 33, life: 26, travel: 14 },
  { month: "Jul", health: 55, motor: 31, life: 25, travel: 13 },
];

const policies = [
  { id: "HI-20847", customer: "Rajesh Pillai", type: "Health Insurance", insurer: "Star Health", premium: "₹48,000", start: "Mar 2025", end: "Mar 2026", status: "Active" },
  { id: "TL-19243", customer: "Ananya Bose", type: "Term Life", insurer: "HDFC Life", premium: "₹36,000", start: "Apr 2022", end: "Apr 2042", status: "Active" },
  { id: "MI-22845", customer: "Vikas Mehta", type: "Motor Insurance", insurer: "ICICI Lombard", premium: "₹14,200", start: "Aug 2024", end: "Aug 2025", status: "Pending" },
  { id: "HI-18440", customer: "Pooja Sharma", type: "Health Insurance", insurer: "Niva Bupa", premium: "₹28,000", start: "Jun 2024", end: "Jun 2025", status: "Expired" },
  { id: "CI-20012", customer: "Suresh Kumar", type: "Corporate Health", insurer: "Star Health", premium: "₹2,40,000", start: "Jan 2025", end: "Jan 2026", status: "Active" },
  { id: "TI-21088", customer: "Kavya Reddy", type: "Travel Insurance", insurer: "Bajaj Allianz", premium: "₹8,500", start: "May 2025", end: "May 2025", status: "Cancelled" },
  { id: "LI-22104", customer: "Amit Joshi", type: "Life Insurance", insurer: "Max Life", premium: "₹62,000", start: "Feb 2025", end: "Feb 2055", status: "Active" },
  { id: "HI-22841", customer: "Meera Iyer", type: "Health Insurance", insurer: "Niva Bupa", premium: "₹32,000", start: "Jul 2025", end: "Jul 2026", status: "Active" },
];

const statusIcon: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Active: CheckCircle,
  Expired: XCircle,
  Pending: Clock,
  Cancelled: XCircle,
  Lapsed: AlertTriangle,
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  Active: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  Expired: { bg: "var(--border)", color: "var(--muted-foreground)" },
  Pending: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Cancelled: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
  Lapsed: { bg: "rgba(99,102,241,0.12)", color: "#6366F1" },
};

export function Policies({ dark }: { dark: boolean }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const isMobile = useIsMobile();

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = "var(--input-background)";

  const filtered = policies.filter((p) => {
    const matchSearch = p.customer.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 14 : 0 }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Policy Management</h2>
          <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0", fontWeight: 500 }}>10,316 total policies · ₹22.1 Cr annual premium</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "linear-gradient(135deg, var(--primary), var(--chart-5))", border: "none", borderRadius: 10, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}>
          <Plus size={15} /> Issue Policy
        </button>
      </div>

      {/* Status Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: 14 }}>
        {statusData.map((s) => {
          const Icon = statusIcon[s.status];
          return (
            <div
              key={s.status}
              style={{
                background: bg, borderRadius: 16, padding: 16, border: `1px solid ${border}`,
                boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)",
                borderTop: `3px solid ${s.color}`,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon size={16} color={s.color} />
                <span style={{ color: subtext, fontSize: 12, fontWeight: 600 }}>{s.status}</span>
              </div>
              <div style={{ color: text, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>{s.count.toLocaleString()}</div>
              <div style={{ color: subtext, fontSize: 11, marginTop: 2, fontWeight: 500 }}>policies</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 20 }}>
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Premium Analysis by Product</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16, fontWeight: 500 }}>Monthly breakdown (₹L)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={premiumAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Bar dataKey="health" name="Health" stackId="a" fill="#6366F1" />
              <Bar dataKey="motor" name="Motor" stackId="a" fill="#10B981" />
              <Bar dataKey="life" name="Life" stackId="a" fill="#8B5CF6" />
              <Bar dataKey="travel" name="Travel" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Policy Distribution</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 12, fontWeight: 500 }}>By status</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="count" paddingAngle={3}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            {statusData.map((s) => (
              <div key={s.status} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                  <span style={{ color: subtext, fontSize: 11, fontWeight: 600 }}>{s.status}</span>
                </div>
                <span style={{ color: text, fontSize: 11, fontWeight: 700 }}>{s.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Table */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", gap: 12, alignItems: "center", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: inputBg, border: `1px solid ${border}`, borderRadius: 10, padding: "8px 14px", width: isMobile ? "100%" : "auto" }}>
            <Search size={14} color={subtext} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or policy ID..." style={{ border: "none", background: "transparent", outline: "none", color: text, fontSize: 13, width: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 6, width: isMobile ? "100%" : "auto", overflowX: "auto", paddingBottom: isMobile ? 4 : 0 }}>
            {["All", "Active", "Expired", "Pending", "Cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: "7px 14px",
                  background: statusFilter === f ? "var(--primary)" : inputBg,
                  border: `1px solid ${statusFilter === f ? "var(--primary)" : border}`,
                  borderRadius: 8, color: statusFilter === f ? "white" : text, fontSize: 12, cursor: "pointer",
                  fontWeight: 600, flex: isMobile ? 1 : "auto",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Policy ID", "Customer", "Type", "Insurer", "Premium", "Start", "End", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 700, textAlign: "left", letterSpacing: 0.8, whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: `1px solid ${border}`, cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = inputBg; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "var(--primary)", fontSize: 13, fontWeight: 700 }}>{p.id}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 600 }}>{p.customer}</td>
                  <td style={{ padding: "12px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{p.type}</td>
                  <td style={{ padding: "12px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{p.insurer}</td>
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 700 }}>{p.premium}</td>
                  <td style={{ padding: "12px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{p.start}</td>
                  <td style={{ padding: "12px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{p.end}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: statusStyle[p.status]?.bg, color: statusStyle[p.status]?.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "5px 10px", background: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>View</button>
                      <button style={{ padding: "5px 10px", background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Renew</button>
                    </div>
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
