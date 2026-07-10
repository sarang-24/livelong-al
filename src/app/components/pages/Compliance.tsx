import { useState } from "react";
import { Shield, CheckCircle, AlertTriangle, XCircle, Clock, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const complianceMetrics = [
  { category: "IRDAI Compliance", score: 96, status: "Compliant", items: 24, passed: 23, failed: 1 },
  { category: "DPDP Compliance", score: 88, status: "Partial", items: 16, passed: 14, failed: 2 },
  { category: "Consent Management", score: 98, status: "Compliant", items: 12, passed: 12, failed: 0 },
  { category: "AML / KYC", score: 94, status: "Compliant", items: 18, passed: 17, failed: 1 },
];

const auditLogs = [
  { id: "AL-2841", user: "Aakash Gupta", action: "Policy Issued", resource: "HI-22841", time: "10 min ago", risk: "Low" },
  { id: "AL-2840", user: "Admin System", action: "Bulk Export", resource: "Customer Data", time: "22 min ago", risk: "Medium" },
  { id: "AL-2839", user: "Sunita Rao", action: "Commission Override", resource: "TLF-2021", time: "1h ago", risk: "High" },
  { id: "AL-2838", user: "System", action: "Auto-Renewal Trigger", resource: "384 Policies", time: "2h ago", risk: "Low" },
  { id: "AL-2837", user: "Raj Sharma", action: "User Permission Change", resource: "Manish Kapoor", time: "3h ago", risk: "Medium" },
];

const riskAlerts = [
  { type: "IRDAI", msg: "Commission statement not filed for June", severity: "High", dueDate: "Jul 20" },
  { type: "DPDP", msg: "Customer data consent not captured for 42 leads", severity: "Medium", dueDate: "Jul 25" },
  { type: "AML", msg: "KYC verification pending for 8 high-value customers", severity: "High", dueDate: "Jul 18" },
  { type: "Internal", msg: "Policy document audit — 12 discrepancies found", severity: "Low", dueDate: "Jul 31" },
];

const complianceTrend = [
  { month: "Feb", score: 91 },
  { month: "Mar", score: 93 },
  { month: "Apr", score: 92 },
  { month: "May", score: 94 },
  { month: "Jun", score: 95 },
  { month: "Jul", score: 94 },
];

const severityStyle: Record<string, { bg: string; color: string }> = {
  High: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
  Medium: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Low: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
};

const riskStyle: Record<string, { bg: string; color: string }> = {
  High: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
  Medium: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Low: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
};

export function Compliance({ dark }: { dark: boolean }) {
  const isMobile = window.innerWidth < 768;
  const bg = dark ? "#1E293B" : "white";
  const border = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const text = dark ? "#F1F5F9" : "#0F172A";
  const subtext = dark ? "#94A3B8" : "#64748B";
  const inputBg = dark ? "#0F172A" : "#F8FAFC";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Compliance Center</h2>
        <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>IRDAI · DPDP · AML · Internal Audit</p>
      </div>

      {/* Compliance Score Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {complianceMetrics.map((m) => (
          <div key={m.category} style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ color: subtext, fontSize: 11, marginBottom: 4 }}>{m.category}</div>
                <div style={{ color: text, fontSize: 28, fontWeight: 900 }}>{m.score}%</div>
              </div>
              <span style={{
                background: m.status === "Compliant" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                color: m.status === "Compliant" ? "#10B981" : "#F59E0B",
                padding: "4px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600,
              }}>
                {m.status}
              </span>
            </div>
            <div style={{ height: 8, background: dark ? "#334155" : "#E2E8F0", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: `${m.score}%`, height: "100%", background: m.score >= 95 ? "#10B981" : m.score >= 85 ? "#F59E0B" : "#EF4444", borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "#10B981", fontSize: 11 }}>✓ {m.passed} passed</span>
              {m.failed > 0 && <span style={{ color: "#EF4444", fontSize: 11 }}>✗ {m.failed} failed</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Compliance Trend */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Compliance Score Trend</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Overall compliance health over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={complianceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#334155" : "#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[85, 100]} tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#1E293B" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Line type="monotone" dataKey="score" name="Compliance %" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Alerts */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Risk Alerts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {riskAlerts.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: `${severityStyle[r.severity]?.color}10`, borderRadius: 12, border: `1px solid ${severityStyle[r.severity]?.color}30` }}>
                <AlertTriangle size={16} color={severityStyle[r.severity]?.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{r.msg}</span>
                    <span style={{ background: severityStyle[r.severity]?.bg, color: severityStyle[r.severity]?.color, padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                      {r.severity}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                    <span style={{ color: subtext, fontSize: 11 }}>{r.type}</span>
                    <span style={{ color: "#EF4444", fontSize: 11 }}>Due: {r.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>Audit Logs</div>
          <button style={{ padding: "6px 14px", background: dark ? "#0F172A" : "#F8FAFC", border: `1px solid ${border}`, borderRadius: 8, color: text, fontSize: 12, cursor: "pointer" }}>
            Export Logs
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["Log ID", "User", "Action", "Resource", "Time", "Risk Level"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 600, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: `1px solid ${border}` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = inputBg; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
              >
                <td style={{ padding: "12px 16px", color: "#6366F1", fontSize: 12, fontWeight: 700 }}>{log.id}</td>
                <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>{log.user}</td>
                <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>{log.action}</td>
                <td style={{ padding: "12px 16px", color: subtext, fontSize: 12 }}>{log.resource}</td>
                <td style={{ padding: "12px 16px", color: subtext, fontSize: 12 }}>{log.time}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: riskStyle[log.risk]?.bg, color: riskStyle[log.risk]?.color, padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                    {log.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
