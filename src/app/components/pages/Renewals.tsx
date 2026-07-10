import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { RefreshCw, Phone, AlertTriangle, CheckCircle, Clock, Bot, TrendingUp, MessageSquare, Mail, Download } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const renewalTrend = [
  { month: "Feb", due: 980, renewed: 820, lapsed: 160 },
  { month: "Mar", due: 1120, renewed: 940, lapsed: 180 },
  { month: "Apr", due: 1050, renewed: 880, lapsed: 170 },
  { month: "May", due: 1180, renewed: 1010, lapsed: 170 },
  { month: "Jun", due: 1300, renewed: 1090, lapsed: 210 },
  { month: "Jul", due: 1240, renewed: 316, lapsed: 0 },
];

const highRiskCustomers = [
  { name: "Pooja Kapoor", product: "Health Insurance", due: "Jul 18", premium: "₹42K", risk: 89, advisor: "Sunita Rao" },
  { name: "Ravi Bhatia", product: "Term Life", due: "Jul 20", premium: "₹28K", risk: 85, advisor: "Aakash Gupta" },
  { name: "Neha Joshi", product: "Motor Insurance", due: "Jul 22", premium: "₹12K", risk: 78, advisor: "Manish Kapoor" },
  { name: "Arjun Singh", product: "Health Insurance", due: "Jul 25", premium: "₹55K", risk: 74, advisor: "Deepika Sharma" },
  { name: "Smita Rao", product: "Corporate Health", due: "Jul 28", premium: "₹2.4L", risk: 71, advisor: "Rohit Malhotra" },
];

const calendarDays = [
  { day: 1, count: 12, risk: "low" }, { day: 2, count: 8, risk: "low" }, { day: 3, count: 24, risk: "high" },
  { day: 4, count: 6, risk: "low" }, { day: 5, count: 18, risk: "medium" }, { day: 6, count: 5, risk: "low" },
  { day: 7, count: 31, risk: "high" }, { day: 8, count: 14, risk: "medium" }, { day: 9, count: 22, risk: "high" },
  { day: 10, count: 9, risk: "low" }, { day: 11, count: 16, risk: "medium" }, { day: 12, count: 38, risk: "high" },
  { day: 13, count: 11, risk: "low" }, { day: 14, count: 27, risk: "high" }, { day: 15, count: 19, risk: "medium" },
  { day: 16, count: 42, risk: "high" }, { day: 17, count: 7, risk: "low" }, { day: 18, count: 29, risk: "high" },
  { day: 19, count: 15, risk: "medium" }, { day: 20, count: 33, risk: "high" }, { day: 21, count: 8, risk: "low" },
];

const riskColors = { low: "#10B981", medium: "#F59E0B", high: "#EF4444" };

const actionButtons = [
  { label: "Start Campaign", icon: Phone },
  { label: "Send WhatsApp", icon: MessageSquare },
  { label: "Email Template", icon: Mail },
  { label: "Export List", icon: Download },
];

export function Renewals({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  
  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const rowHover = "var(--accent)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 14 : 0 }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Renewal Intelligence</h2>
          <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0", fontWeight: 500 }}>1,240 renewals due this month · 316 completed</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "linear-gradient(135deg, var(--primary), var(--chart-5))", border: "none", borderRadius: 10, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}>
          <RefreshCw size={15} /> Send Reminders
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: 14 }}>
        {[
          { label: "Due This Month", value: "1,240", color: "#6366F1", icon: Clock },
          { label: "Renewed", value: "316", color: "#10B981", icon: CheckCircle },
          { label: "At Risk", value: "47", color: "#EF4444", icon: AlertTriangle },
          { label: "Renewal Rate", value: "85%", color: "#8B5CF6", icon: TrendingUp },
          { label: "Revenue at Risk", value: "₹8.4L", color: "#F59E0B", icon: TrendingUp },
        ].map((k) => (
          <div key={k.label} style={{ background: bg, borderRadius: 16, padding: 16, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)", borderTop: `3px solid ${k.color}`, gridColumn: isMobile && k.label === "Revenue at Risk" ? "span 2" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <k.icon size={15} color={k.color} />
              <span style={{ color: subtext, fontSize: 11, fontWeight: 600 }}>{k.label}</span>
            </div>
            <div style={{ color: text, fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        {/* Renewal Calendar Heatmap */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Renewal Calendar — July 2025</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16, fontWeight: 500 }}>Daily renewal volume & risk heatmap</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} style={{ color: subtext, fontSize: 10, textAlign: "center", marginBottom: 4, fontWeight: 600 }}>{d}</div>
            ))}
            {calendarDays.map((d) => (
              <div
                key={d.day}
                title={`${d.count} renewals`}
                style={{
                  background: `${riskColors[d.risk as keyof typeof riskColors]}${d.risk === "high" ? "30" : d.risk === "medium" ? "20" : "15"}`,
                  border: `1px solid ${riskColors[d.risk as keyof typeof riskColors]}40`,
                  borderRadius: 8,
                  padding: "6px 4px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ color: text, fontSize: 11, fontWeight: 700 }}>{d.day}</div>
                <div style={{ color: riskColors[d.risk as keyof typeof riskColors], fontSize: 10, fontWeight: 800 }}>{d.count}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            {Object.entries(riskColors).map(([risk, color]) => (
              <div key={risk} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ color: subtext, fontSize: 11, textTransform: "capitalize", fontWeight: 600 }}>{risk} Risk</span>
              </div>
            ))}
          </div>
        </div>

        {/* Renewal Trend */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Renewal Performance</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16, fontWeight: 500 }}>Due vs Renewed vs Lapsed</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={renewalTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Bar dataKey="renewed" name="Renewed" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lapsed" name="Lapsed" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div
        style={{
          background: dark
            ? "linear-gradient(135deg, #0A0F1D 0%, #171E30 100%)"
            : "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)",
          borderRadius: 18,
          padding: 20,
          color: "white",
          border: "1px solid " + (dark ? "rgba(99,102,241,0.15)" : "transparent"),
          boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(79,70,229,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Bot size={20} color="white" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>AI Renewal Recommendation</div>
            <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 500 }}>Smart priority list based on ML prediction models</div>
          </div>
        </div>
        <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 16, fontStyle: "italic", lineHeight: 1.4, fontWeight: 500 }}>
          "Call these 20 high-risk customers today. Their renewal probability drops by 18% after 7 days of non-contact. WhatsApp message first, then follow-up call."
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {actionButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button key={btn.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "white", fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "background-color 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
              >
                <Icon size={13} />
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* High Risk Table */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 0 }}>
          <div style={{ textAlign: isMobile ? "center" : "left" }}>
            <div style={{ color: text, fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>High-Risk Renewal Priority List</div>
            <div style={{ color: subtext, fontSize: 12, fontWeight: 500 }}>Customers requiring immediate contact</div>
          </div>
          <span style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", padding: "4px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
            47 at risk
          </span>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Customer", "Product", "Due Date", "Premium", "Risk Score", "Advisor", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 700, textAlign: "left", letterSpacing: 0.5 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {highRiskCustomers.map((c, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${border}`, cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = rowHover; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{c.product}</td>
                  <td style={{ padding: "12px 16px", color: "#EF4444", fontSize: 13, fontWeight: 700 }}>{c.due}</td>
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 700 }}>{c.premium}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                      <div style={{ flex: 1, height: 6, background: dark ? "#1F2937" : "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${c.risk}%`, height: "100%", background: c.risk > 80 ? "#EF4444" : "#F59E0B", borderRadius: 3 }} />
                      </div>
                      <span style={{ color: c.risk > 80 ? "#EF4444" : "#F59E0B", fontWeight: 800, fontSize: 12 }}>{c.risk}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{c.advisor}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>
                        <Phone size={10} /> Call
                      </button>
                      <button style={{ padding: "5px 10px", background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>
                        WhatsApp
                      </button>
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
