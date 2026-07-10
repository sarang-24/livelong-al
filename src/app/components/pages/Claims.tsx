import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { AlertTriangle, CheckCircle2, Clock, XCircle, Bot, Search, TrendingDown, FileText, Loader2, Check } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { speakText } from "../../utils/voice";

const initialClaimsStatus = [
  { label: "Cashless Claims", count: 284, amount: "₹8.4L", color: "#6366F1" },
  { label: "Reimbursement", count: 142, amount: "₹5.2L", color: "#3B82F6" },
  { label: "Pending", count: 42, amount: "₹2.1L", color: "#F59E0B" },
  { label: "Approved", count: 380, amount: "₹12.8L", color: "#10B981" },
  { label: "Rejected", count: 22, amount: "₹0.8L", color: "#EF4444" },
];

const initialClaimTrend = [
  { month: "Feb", filed: 420, settled: 380, pending: 40 },
  { month: "Mar", filed: 480, settled: 430, pending: 50 },
  { month: "Apr", filed: 440, settled: 410, pending: 30 },
  { month: "May", filed: 510, settled: 470, pending: 40 },
  { month: "Jun", filed: 560, settled: 510, pending: 50 },
  { month: "Jul", filed: 470, settled: 428, pending: 42 },
];

const tpaPerformance = [
  { name: "Medi Assist", settled: 142, pending: 12, avg_days: 4.2 },
  { name: "Heritage TPA", settled: 98, pending: 8, avg_days: 5.8 },
  { name: "Vidal Health", settled: 84, pending: 15, avg_days: 6.4 },
  { name: "MDIndia", settled: 104, pending: 7, avg_days: 3.9 },
];

const initialClaims = [
  { id: "CNF-9821", customer: "Aditya Kumar", hospital: "Apollo Hospital", type: "Cashless", amount: "₹1.8L", filed: "Jul 10", status: "Approved", fraud: 12 },
  { id: "CNF-9802", customer: "Sneha Verma", hospital: "Fortis Hospital", type: "Reimbursement", amount: "₹84K", filed: "Jul 8", status: "Pending", fraud: 8 },
  { id: "CNF-9786", customer: "Kiran Patil", hospital: "AIIMS Delhi", type: "Cashless", amount: "₹2.4L", filed: "Jul 6", status: "Approved", fraud: 5 },
  { id: "CNF-9771", customer: "Ravi Shah", hospital: "Columbia Asia", type: "Reimbursement", amount: "₹62K", filed: "Jul 5", status: "Rejected", fraud: 72 },
  { id: "CNF-9754", customer: "Meena Rajan", hospital: "Manipal Hospital", type: "Cashless", amount: "₹3.2L", filed: "Jul 4", status: "Pending", fraud: 21 },
  { id: "CNF-9740", customer: "Deepak Nair", hospital: "Medanta", type: "Cashless", amount: "₹4.8L", filed: "Jul 2", status: "Approved", fraud: 14 },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Approved: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  Pending: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Rejected: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
};

export function Claims({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [claimsList, setClaimsList] = useState(initialClaims);
  const [filterHighRisk, setFilterHighRisk] = useState(false);
  const [loadingMap, setLoadingMap] = useState<Record<string, "approving" | "reviewing" | null>>({});

  useEffect(() => {
    const handleVoiceApprove = () => {
      const pendingHighRisk = claimsList.filter(c => c.status === "Pending" && c.isHighRisk);
      if (pendingHighRisk.length === 0) {
        speakText("No pending high risk claims found to approve.");
        return;
      }

      // Speak initial review response
      speakText("Approve claims command received. Reviewing and settling high risk cases.");

      // Set loading state for all pending high risk claims
      const newLoadingMap = { ...loadingMap };
      pendingHighRisk.forEach(c => {
        newLoadingMap[c.id] = "approving";
      });
      setLoadingMap(newLoadingMap);

      setTimeout(() => {
        setClaimsList(prev => prev.map(c => {
          if (c.status === "Pending" && c.isHighRisk) {
            return { ...c, status: "Approved" };
          }
          return c;
        }));
        
        // Clear loading state
        setLoadingMap(prev => {
          const cleared = { ...prev };
          pendingHighRisk.forEach(c => {
            cleared[c.id] = null;
          });
          return cleared;
        });

        // Speak final success response
        speakText("All pending high risk claims have been approved and settled successfully.");
      }, 1500);
    };

    window.addEventListener("trigger-approve-claims", handleVoiceApprove);
    return () => {
      window.removeEventListener("trigger-approve-claims", handleVoiceApprove);
    };
  }, [claimsList, loadingMap]);

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  const handleApprove = (id: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: "approving" }));
    setTimeout(() => {
      setClaimsList((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "Approved", fraud: Math.min(c.fraud, 10) } : c
        )
      );
      setLoadingMap((prev) => ({ ...prev, [id]: null }));
    }, 1000);
  };

  const handleReview = (id: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: "reviewing" }));
    setTimeout(() => {
      setClaimsList((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "Approved", fraud: 5 } : c
        )
      );
      setLoadingMap((prev) => ({ ...prev, [id]: null }));
    }, 1000);
  };

  const filtered = claimsList.filter((c) => {
    const matchesSearch = c.customer.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = filterHighRisk ? c.fraud > 50 : true;
    return matchesSearch && matchesRisk;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Claims Dashboard</h2>
        <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>470 claims this month · ₹21.3L total claim value</p>
      </div>

      {/* Status Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", 
        gap: 14 
      }}>
        {initialClaimsStatus.map((s) => (
          <div key={s.label} style={{ 
            background: bg, borderRadius: 16, padding: 16, border: `1px solid ${border}`, 
            boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", 
            borderTop: `3px solid ${s.color}`, cursor: "pointer", transition: "transform 0.2s" 
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ color: subtext, fontSize: 11, marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
            <div style={{ color: text, fontSize: 22, fontWeight: 800 }}>{s.count}</div>
            <div style={{ color: s.color, fontSize: 13, fontWeight: 700, marginTop: 4 }}>{s.amount}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 20 }}>
        {/* Claim Trend */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Claims Trend</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Filed vs Settled vs Pending</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={initialClaimTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Bar dataKey="settled" name="Settled" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TPA Performance */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>TPA Performance</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Settlement speed & accuracy</div>
          {tpaPerformance.map((t, i) => (
            <div key={t.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                <span style={{ color: subtext, fontSize: 11 }}>Avg {t.avg_days} days</span>
              </div>
              <div style={{ height: 8, background: dark ? "#1E293B" : "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(t.settled / (t.settled + t.pending)) * 100}%`, height: "100%", background: ["#6366F1", "#10B981", "#3B82F6", "#F59E0B"][i], borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                <span style={{ color: "#10B981", fontSize: 10 }}>{t.settled} settled</span>
                <span style={{ color: "#F59E0B", fontSize: 10 }}>{t.pending} pending</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Claim Assistant */}
      <div style={{ background: "linear-gradient(135deg, #090D16, #111827)", borderRadius: 18, padding: 20, border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 8px 24px rgba(99,102,241,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Bot size={22} color="#818CF8" />
          <div style={{ color: "#818CF8", fontWeight: 700, fontSize: 15 }}>AI Claim Assistant</div>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", 
          gap: 14 
        }}>
          {[
            { title: "Document Validation", text: "428 claims validated", icon: CheckCircle2, color: "#10B981" },
            { title: "Fraud Risk Detection", text: `${claimsList.filter(c => c.fraud > 50).length} high-risk claims flagged`, icon: AlertTriangle, color: "#F59E0B" },
            { title: "Missing Documents", text: "18 claims need docs", icon: FileText, color: "#3B82F6" },
          ].map((item) => {
            const AssistantIcon = item.icon;
            return (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 8 }}>{item.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: item.color, fontSize: 13, fontWeight: 600 }}>
                  <AssistantIcon size={14} color={item.color} />
                  <span>{item.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Claims Table */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ 
          padding: "16px 20px", 
          borderBottom: `1px solid ${border}`, 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          gap: 12, 
          alignItems: isMobile ? "stretch" : "center" 
        }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: inputBg, border: `1px solid ${border}`, borderRadius: 10, padding: "8px 14px" }}>
            <Search size={14} color={subtext} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search claims..." style={{ border: "none", background: "transparent", outline: "none", color: text, fontSize: 13, width: "100%" }} />
          </div>
          <button 
            onClick={() => setFilterHighRisk(!filterHighRisk)}
            style={{ 
              padding: "8px 14px", 
              background: filterHighRisk ? "#EF4444" : "rgba(239,68,68,0.1)", 
              color: filterHighRisk ? "white" : "#EF4444", 
              border: "1px solid rgba(239,68,68,0.2)", 
              borderRadius: 8, 
              fontSize: 12, 
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            High Risk ({claimsList.filter(c => c.fraud > 50).length})
          </button>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Claim ID", "Customer", "Hospital", "Type", "Amount", "Filed Date", "Status", "Fraud Risk", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 600, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const actionState = loadingMap[c.id] || null;
                return (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${border}` }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = inputBg; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                  >
                    <td style={{ padding: "12px 16px", color: "#6366F1", fontSize: 13, fontWeight: 700 }}>{c.id}</td>
                    <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 600 }}>{c.customer}</td>
                    <td style={{ padding: "12px 16px", color: subtext, fontSize: 12 }}>{c.hospital}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: c.type === "Cashless" ? "rgba(99,102,241,0.1)" : "rgba(59,130,246,0.1)", color: c.type === "Cashless" ? "#6366F1" : "#3B82F6", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                        {c.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 700 }}>{c.amount}</td>
                    <td style={{ padding: "12px 16px", color: subtext, fontSize: 12 }}>{c.filed}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: statusStyle[c.status]?.bg, color: statusStyle[c.status]?.color, padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 40, height: 6, background: dark ? "#1E293B" : "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${c.fraud}%`, height: "100%", background: c.fraud > 60 ? "#EF4444" : c.fraud > 30 ? "#F59E0B" : "#10B981", borderRadius: 3 }} />
                        </div>
                        <span style={{ color: c.fraud > 60 ? "#EF4444" : c.fraud > 30 ? "#F59E0B" : "#10B981", fontSize: 11, fontWeight: 700 }}>{c.fraud}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {c.status !== "Approved" ? (
                          <>
                            <button
                              onClick={() => handleReview(c.id)}
                              disabled={actionState !== null}
                              style={{
                                padding: "5px 10px",
                                background: actionState === "reviewing" ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)",
                                color: "#6366F1",
                                border: "1px solid rgba(99,102,241,0.2)",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: actionState !== null ? "default" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                              }}
                            >
                              {actionState === "reviewing" ? (
                                <Loader2 size={11} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                              ) : (
                                <span>Review</span>
                              )}
                            </button>
                            <button
                              onClick={() => handleApprove(c.id)}
                              disabled={actionState !== null}
                              style={{
                                padding: "5px 10px",
                                background: actionState === "approving" ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.1)",
                                color: "#10B981",
                                border: "1px solid rgba(16,185,129,0.2)",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: actionState !== null ? "default" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                              }}
                            >
                              {actionState === "approving" ? (
                                <Loader2 size={11} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                              ) : (
                                <span>Approve</span>
                              )}
                            </button>
                          </>
                        ) : (
                          <div style={{ color: "#10B981", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600 }}>
                            <Check size={12} />
                            <span>Settled</span>
                          </div>
                        )}
                      </div>
                    </td>
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
