import { useState, useEffect } from "react";
import { 
  Download, FileText, Bot, Zap, CheckCircle, Clock, 
  BarChart3, TrendingUp, ClipboardList, Building2, Scale, Users, Activity 
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const reportTypes = [
  { id: "daily-mis", name: "Daily MIS Report", icon: BarChart3, desc: "Complete daily business summary", lastGen: "Today 9:00 AM", formats: ["Excel", "PDF"] },
  { id: "weekly", name: "Weekly Business Report", icon: TrendingUp, desc: "7-day performance overview", lastGen: "Mon Jul 14", formats: ["Excel", "PDF", "PPT"] },
  { id: "monthly", name: "Monthly Performance", icon: ClipboardList, desc: "Full month analysis & insights", lastGen: "Jun 30, 2025", formats: ["Excel", "PDF", "PPT"] },
  { id: "quarterly", name: "Quarterly Review", icon: TrendingUp, desc: "Q2 comprehensive review", lastGen: "Jun 30, 2025", formats: ["PDF", "PPT"] },
  { id: "board", name: "Board Report", icon: Building2, desc: "Executive board presentation", lastGen: "Jun 30, 2025", formats: ["PPT", "PDF"] },
  { id: "irdai", name: "IRDAI Regulatory Report", icon: Scale, desc: "Statutory compliance report", lastGen: "Jul 1, 2025", formats: ["Excel", "PDF"] },
  { id: "agent-perf", name: "Agent Performance Report", icon: Users, desc: "Individual & team analysis", lastGen: "Today 8:00 AM", formats: ["Excel"] },
  { id: "claims-mis", name: "Claims MIS", icon: Activity, desc: "Claims status & settlement", lastGen: "Today 8:30 AM", formats: ["Excel", "PDF"] },
];

const recentReports = [
  { name: "Daily MIS — Jul 14, 2025", generated: "9:00 AM today", size: "2.4 MB", format: "Excel", status: "Ready" },
  { name: "Agent Performance — Week 28", generated: "8:00 AM today", size: "1.8 MB", format: "Excel", status: "Ready" },
  { name: "Claims MIS — Jul 2025", generated: "8:30 AM today", size: "3.1 MB", format: "PDF", status: "Ready" },
  { name: "Monthly Report — June 2025", generated: "Jun 30, 2025", size: "8.4 MB", format: "PPT", status: "Ready" },
  { name: "Renewal Intelligence — Q2", generated: "Jun 30, 2025", size: "4.2 MB", format: "PDF", status: "Ready" },
];

export function Reports({ dark }: { dark: boolean }) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = "var(--input-background)";

  const aiReportStatus = [
    { label: "Reports Generated Today", value: "12", color: "#6366F1" },
    { label: "Avg Generation Time", value: "4.2s", color: "#10B981" },
    { label: "Scheduled Reports", value: "8", color: "#8B5CF6" },
    { label: "Pending Approval", value: "2", color: "#F59E0B" },
  ];

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated((prev) => new Set([...prev, id]));
    }, 2000);
  };

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const reportId = customEvent.detail?.id;
      if (reportId) {
        handleGenerate(reportId);
      }
    };
    window.addEventListener("trigger-report-generation", handleTrigger);
    return () => window.removeEventListener("trigger-report-generation", handleTrigger);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 14 : 0 }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Reports Center</h2>
          <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0", fontWeight: 500 }}>AI-powered one-click report generation</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "linear-gradient(135deg, var(--primary), var(--chart-5))", border: "none", borderRadius: 10, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}>
          <Zap size={15} /> Generate All
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 14 }}>
        {aiReportStatus.map((s) => (
          <div key={s.label} style={{ background: bg, borderRadius: 16, padding: 16, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)", borderTop: `3px solid ${s.color}` }}>
            <div style={{ color: subtext, fontSize: 11, marginBottom: 8, fontWeight: 600 }}>{s.label}</div>
            <div style={{ color: text, fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* AI Report Generator */}
      <div
        style={{
          background: dark
            ? "linear-gradient(135deg, #0A0F1D 0%, #171E30 100%)"
            : "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)",
          borderRadius: 18,
          padding: 24,
          color: "white",
          border: "1px solid " + (dark ? "rgba(99,102,241,0.15)" : "transparent"),
          boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(79,70,229,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Bot size={22} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>One-Click AI Report Generator</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4, fontWeight: 500 }}>
              Generate comprehensive reports in seconds using AI analysis
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 12 }}>
          {["Daily MIS Report", "Weekly Summary", "Monthly Board Pack", "Custom AI Report"].map((rpt) => (
            <button
              key={rpt}
              style={{
                padding: "14px 16px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                color: "white",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ marginBottom: 10 }}>
                <FileText size={22} color="white" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{rpt}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, fontWeight: 500 }}>Generate instantly</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
          {["Excel", "PDF", "PowerPoint"].map((fmt) => (
            <button key={fmt} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              <Download size={14} />
              Export as {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards Grid */}
      <div>
        <div style={{ color: text, fontWeight: 800, fontSize: 16, marginBottom: 14, letterSpacing: "-0.3px" }}>Available Reports</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {reportTypes.map((r) => {
            const IconComponent = r.icon;
            return (
              <div
                key={r.id}
                style={{
                  background: bg,
                  borderRadius: 18,
                  padding: 18,
                  border: `1px solid ${border}`,
                  boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)",
                  cursor: "default",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = dark ? "0 8px 30px rgba(0,0,0,0.5)" : "0 10px 25px rgba(99,102,241,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.02)";
                }}
              >
                <div style={{ marginBottom: 10 }}>
                  <IconComponent size={28} color="var(--primary)" />
                </div>
                <div style={{ color: text, fontWeight: 800, fontSize: 14, marginBottom: 4, letterSpacing: "-0.2px" }}>{r.name}</div>
                <div style={{ color: subtext, fontSize: 12, marginBottom: 10, fontWeight: 500, height: 34, overflow: "hidden" }}>{r.desc}</div>
                <div style={{ color: subtext, fontSize: 11, marginBottom: 12, fontWeight: 600 }}>
                  Last: {r.lastGen}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {r.formats.map((fmt) => (
                    <span key={fmt} style={{ background: "var(--secondary)", color: subtext, padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600 }}>
                      {fmt}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleGenerate(r.id)}
                  disabled={generating === r.id}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: generated.has(r.id)
                      ? "rgba(16,185,129,0.15)"
                      : generating === r.id
                      ? "rgba(99,102,241,0.08)"
                      : "linear-gradient(135deg, var(--primary), var(--chart-5))",
                    color: generated.has(r.id) ? "#10B981" : generating === r.id ? "var(--primary)" : "white",
                    border: generated.has(r.id)
                      ? "1px solid rgba(16,185,129,0.3)"
                      : generating === r.id
                      ? "1px solid rgba(99,102,241,0.2)"
                      : "none",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: generating === r.id ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                  }}
                >
                  {generated.has(r.id) ? (
                    <><CheckCircle size={13} /> Generated</>
                  ) : generating === r.id ? (
                    <><Clock size={13} /> Generating...</>
                  ) : (
                    <><Zap size={13} /> Generate</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>Recent Reports</div>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Report Name", "Generated", "Size", "Format", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 700, textAlign: "left", letterSpacing: 0.5 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${border}`, cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = inputBg; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FileText size={15} color="var(--primary)" />
                      <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{r.generated}</td>
                  <td style={{ padding: "12px 16px", color: subtext, fontSize: 12, fontWeight: 500 }}>{r.size}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "var(--secondary)", color: text, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                      {r.format}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: "#10B981", fontSize: 12, fontWeight: 600 }}>✓ {r.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>
                        <Download size={11} /> Download
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
