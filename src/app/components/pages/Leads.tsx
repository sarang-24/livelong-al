import { useState } from "react";
import {
  FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from "recharts";
import { Search, Plus, Phone, Bot, CheckCircle } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const funnelData = [
  { name: "Total Leads", value: 2840, fill: "#6366F1" },
  { name: "Qualified", value: 1920, fill: "#4F46E5" },
  { name: "Interested", value: 1240, fill: "#8B5CF6" },
  { name: "Proposal Sent", value: 680, fill: "#A78BFA" },
  { name: "Converted", value: 412, fill: "#10B981" },
];

const sourceData = [
  { source: "Referral", leads: 840, color: "#6366F1" },
  { source: "Website", leads: 620, color: "#4F46E5" },
  { source: "Social Media", leads: 480, color: "#10B981" },
  { source: "Cold Call", leads: 380, color: "#F59E0B" },
  { source: "Campaign", leads: 320, color: "#EF4444" },
  { source: "Walk-in", leads: 200, color: "#8B5CF6" },
];

const leads = [
  { id: 1, name: "Vikas Mehta", phone: "+91 98765 43210", product: "Health Insurance", score: 94, probability: "89%", advisor: "Aakash Gupta", status: "Hot", action: "Call Today", amount: "₹2.4L" },
  { id: 2, name: "Priya Nair", phone: "+91 87654 32109", product: "Life Insurance", score: 88, probability: "78%", advisor: "Sunita Rao", status: "Warm", action: "Follow Up", amount: "₹1.8L" },
  { id: 3, name: "Suresh Kumar", phone: "+91 76543 21098", product: "Motor Insurance", score: 76, probability: "65%", advisor: "Manish Kapoor", status: "Warm", action: "Send Proposal", amount: "₹45K" },
  { id: 4, name: "Ananya Bose", phone: "+91 65432 10987", product: "Term Insurance", score: 71, probability: "58%", advisor: "Deepika Sharma", status: "Warm", action: "Nurture", amount: "₹3.2L" },
  { id: 5, name: "Rahul Verma", phone: "+91 54321 09876", product: "Health Insurance", score: 62, probability: "45%", advisor: "Rohit Malhotra", status: "Cold", action: "Re-engage", amount: "₹1.1L" },
  { id: 6, name: "Kavya Reddy", phone: "+91 43210 98765", product: "Travel Insurance", score: 55, probability: "38%", advisor: "Aakash Gupta", status: "Cold", action: "Email", amount: "₹28K" },
  { id: 7, name: "Amit Joshi", phone: "+91 32109 87654", product: "Corporate Health", score: 92, probability: "85%", advisor: "Sunita Rao", status: "Hot", action: "Call Today", amount: "₹12L" },
  { id: 8, name: "Meera Iyer", phone: "+91 21098 76543", product: "Health Insurance", score: 83, probability: "72%", advisor: "Manish Kapoor", status: "Warm", action: "Follow Up", amount: "₹1.6L" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Hot: { bg: "rgba(239,68,68,0.12)", text: "#EF4444" },
  Warm: { bg: "rgba(245,158,11,0.12)", text: "#F59E0B" },
  Cold: { bg: "var(--border)", text: "var(--muted-foreground)" },
};

const actionColors: Record<string, string> = {
  "Call Today": "#EF4444",
  "Follow Up": "#F59E0B",
  "Send Proposal": "#6366F1",
  "Nurture": "#8B5CF6",
  "Re-engage": "var(--muted-foreground)",
  "Email": "#10B981",
};

export function Leads({ dark }: { dark: boolean }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const isMobile = useIsMobile();

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = "var(--input-background)";
  const rowHover = "var(--accent)";

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.product.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || l.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 14 : 0 }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Leads Intelligence</h2>
          <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0", fontWeight: 500 }}>2,840 total leads · 412 converted this month</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px", background: "linear-gradient(135deg, var(--primary), var(--chart-5))",
              border: "none", borderRadius: 10, color: "white", fontSize: 13,
              fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
            }}
          >
            <Plus size={15} /> Add Lead
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total Leads", value: "2,840", change: "+18%", color: "#6366F1" },
          { label: "Conversion Rate", value: "32%", change: "+4%", color: "#10B981" },
          { label: "Hot Leads", value: "284", change: "+22%", color: "#EF4444" },
          { label: "Avg Lead Score", value: "71.4", change: "+5%", color: "#F59E0B" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: bg, borderRadius: 16, padding: 18, border: `1px solid ${border}`,
              boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)",
              borderTop: `3px solid ${kpi.color}`,
            }}
          >
            <div style={{ color: subtext, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>{kpi.label}</div>
            <div style={{ color: text, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>{kpi.value}</div>
            <div style={{ color: "#10B981", fontSize: 12, marginTop: 4, fontWeight: 600 }}>↑ {kpi.change} this month</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Sales Pipeline Funnel</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16, fontWeight: 500 }}>Lead progression this month</div>
          <ResponsiveContainer width="100%" height={220}>
            <FunnelChart>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  color: text,
                }}
              />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill={subtext} stroke="none" dataKey="name" style={{ fontSize: 11, fontWeight: 600 }} />
                <LabelList position="center" fill="white" stroke="none" dataKey="value" style={{ fontSize: 12, fontWeight: 700 }} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Lead Sources</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16, fontWeight: 500 }}>Where leads are coming from</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
              <XAxis dataKey="source" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  color: text,
                }}
              />
              <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                {sourceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div
        style={{
          background: dark
            ? "linear-gradient(135deg, #0A0F1D 0%, #171E30 100%)"
            : "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)",
          borderRadius: 16,
          padding: "16px 20px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 14,
          color: "white",
          border: "1px solid " + (dark ? "rgba(99,102,241,0.15)" : "transparent"),
          boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(79,70,229,0.12)",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flex: 1 }}>
          <Bot size={22} color="white" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>AI Lead Intelligence</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4, lineHeight: 1.4 }}>
              7 hot leads need immediate attention today. Vikas Mehta & Amit Joshi have highest conversion probability.
              Recommend calling between 10 AM – 12 PM for best pickup rates.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignSelf: isMobile ? "stretch" : "auto", justifyContent: isMobile ? "flex-end" : "flex-start", marginTop: isMobile ? 8 : 0 }}>
          {["View Hot Leads", "Auto-Assign"].map((btn) => (
            <button
              key={btn}
              style={{
                padding: "7px 14px", background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
                color: "white", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
                fontWeight: 600, flex: isMobile ? 1 : "auto",
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", gap: 12, alignItems: "center", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: inputBg, border: `1px solid ${border}`, borderRadius: 10, padding: "8px 14px", width: isMobile ? "100%" : "auto" }}>
            <Search size={14} color={subtext} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              style={{ border: "none", background: "transparent", outline: "none", color: text, fontSize: 13, width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, width: isMobile ? "100%" : "auto", overflowX: "auto", paddingBottom: isMobile ? 4 : 0 }}>
            {["All", "Hot", "Warm", "Cold"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "8px 14px", background: filter === f ? "var(--primary)" : inputBg,
                  border: `1px solid ${filter === f ? "var(--primary)" : border}`,
                  borderRadius: 8, color: filter === f ? "white" : text, fontSize: 12, cursor: "pointer",
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
                {["Lead Name", "Product", "Score", "Probability", "Advisor", "Status", "Value", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 700, textAlign: "left", letterSpacing: 0.8, whiteSpace: "nowrap" }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  style={{ borderBottom: `1px solid ${border}`, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = rowHover; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: `hsl(${lead.id * 40}, 65%, 55%)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        {lead.name[0]}
                      </div>
                      <div>
                        <div style={{ color: text, fontWeight: 600, fontSize: 13 }}>{lead.name}</div>
                        <div style={{ color: subtext, fontSize: 11, fontWeight: 500 }}>{lead.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{lead.product}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div
                        style={{
                          width: 36, height: 6, borderRadius: 3,
                          background: dark ? "#1F2937" : "#E2E8F0", overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${lead.score}%`, height: "100%",
                            background: lead.score > 80 ? "#10B981" : lead.score > 60 ? "#F59E0B" : "#EF4444",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span style={{ color: text, fontSize: 12, fontWeight: 700 }}>{lead.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: text, fontSize: 13, fontWeight: 600 }}>{lead.probability}</td>
                  <td style={{ padding: "14px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{lead.advisor}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        background: statusColors[lead.status]?.bg,
                        color: statusColors[lead.status]?.text,
                        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: text, fontSize: 13, fontWeight: 700 }}>{lead.amount}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        style={{
                          padding: "5px 10px",
                          background: `${actionColors[lead.action]}15`,
                          color: actionColors[lead.action],
                          border: `1px solid ${actionColors[lead.action]}30`,
                          borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${actionColors[lead.action]}25`; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${actionColors[lead.action]}15`; }}
                      >
                        {lead.action}
                      </button>
                      <button
                        style={{
                          width: 28, height: 28, borderRadius: 6, background: inputBg,
                          border: `1px solid ${border}`, display: "flex", alignItems: "center",
                          justifyContent: "center", cursor: "pointer", transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = rowHover; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = inputBg; }}
                      >
                        <Phone size={12} color={subtext} />
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
