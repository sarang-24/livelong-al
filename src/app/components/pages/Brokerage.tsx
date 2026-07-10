import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, AlertCircle, FileText, Loader2, ArrowRight } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { speakText } from "../../utils/voice";

const initialReconcData = [
  { insurer: "Star Health", expected: 6.2, received: 5.8, diff: 0.4, status: "Partial" },
  { insurer: "ICICI Lombard", expected: 5.1, received: 5.1, diff: 0.0, status: "Settled" },
  { insurer: "HDFC Ergo", expected: 4.8, received: 4.0, diff: 0.8, status: "Pending" },
  { insurer: "Bajaj Allianz", expected: 3.9, received: 3.9, diff: 0.0, status: "Settled" },
  { insurer: "Niva Bupa", expected: 3.4, received: 2.8, diff: 0.6, status: "Pending" },
  { insurer: "Max Life", expected: 2.8, received: 2.8, diff: 0.0, status: "Settled" },
  { insurer: "Tata AIG", expected: 2.2, received: 1.6, diff: 0.6, status: "Delayed" },
];

const initialAgingData = [
  { range: "0-30 days", amount: 1.2 },
  { range: "31-60 days", amount: 0.8 },
  { range: "61-90 days", amount: 0.6 },
  { range: "90+ days", amount: 0.4 },
];

export function Brokerage({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const [reconcList, setReconcList] = useState(initialReconcData);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleVoiceReconcile = () => {
      const pendingInsurers = reconcList.filter(r => r.status !== "Settled");
      if (pendingInsurers.length === 0) {
        speakText("All insurer brokerage statements are already reconciled.");
        return;
      }

      // Speak initial review response
      speakText("Brokerage reconciliation command received. Settle insurer statements.");

      // Set loading state for all pending insurers
      const newLoadingMap = { ...loadingMap };
      pendingInsurers.forEach(r => {
        newLoadingMap[r.insurer] = true;
      });
      setLoadingMap(newLoadingMap);

      setTimeout(() => {
        setReconcList(prev => prev.map(r => {
          if (r.status !== "Settled") {
            return { ...r, received: r.expected, diff: 0, status: "Settled" };
          }
          return r;
        }));
        
        // Clear loading state
        setLoadingMap(prev => {
          const cleared = { ...prev };
          pendingInsurers.forEach(r => {
            cleared[r.insurer] = false;
          });
          return cleared;
        });

        // Speak final success response
        speakText("Brokerage statements reconciled. Gap reduced to zero.");
      }, 1500);
    };

    window.addEventListener("trigger-reconciliation", handleVoiceReconcile);
    return () => {
      window.removeEventListener("trigger-reconciliation", handleVoiceReconcile);
    };
  }, [reconcList, loadingMap]);

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  const statusStyle: Record<string, { bg: string; color: string }> = {
    Settled: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
    Partial: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
    Pending: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
    Delayed: { bg: "rgba(99,102,241,0.12)", color: "#6366F1" },
  };

  // Calculate dynamic KPIs based on state
  const totalExpected = reconcList.reduce((acc, r) => acc + r.expected, 0);
  const totalReceived = reconcList.reduce((acc, r) => acc + r.received, 0);
  const totalDiff = reconcList.reduce((acc, r) => acc + r.diff, 0);
  const pendingSettledCount = reconcList.filter((r) => r.status !== "Settled").length;
  const pendingSettledAmt = totalDiff + 2.8; // base offset for pending out-of-month

  const warningCards = [
    { type: "Missing Commission", count: reconcList.filter(r => r.status === "Pending").length, amount: `₹${(totalDiff * 0.6).toFixed(1)}L`, color: "#EF4444", desc: "Policies missing brokerage statements" },
    { type: "Delayed Settlement", count: reconcList.filter(r => r.status === "Delayed").length, amount: "₹0.6L", color: "#F59E0B", desc: "Overdue payments exceeding 45 days" },
    { type: "Revenue Leakage", count: reconcList.filter(r => r.status === "Partial").length, amount: `₹${(totalDiff * 0.4).toFixed(1)}L`, color: "#6366F1", desc: "Commission mismatches detected by AI" },
    { type: "Duplicate Payment", count: 0, amount: "₹0", color: "#10B981", desc: "No duplicates detected this month" },
  ];

  const handleReconcile = (insurer: string) => {
    setLoadingMap((prev) => ({ ...prev, [insurer]: true }));
    setTimeout(() => {
      setReconcList((prev) =>
        prev.map((r) =>
          r.insurer === insurer
            ? { ...r, received: r.expected, diff: 0, status: "Settled" }
            : r
        )
      );
      setLoadingMap((prev) => ({ ...prev, [insurer]: false }));
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Brokerage Reconciliation</h2>
        <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>AI-powered commission tracking & reconciliation</p>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", 
        gap: 16 
      }}>
        {[
          { label: "Expected Commission", value: `₹${totalExpected.toFixed(1)}L`, color: "#6366F1", icon: FileText },
          { label: "Received Commission", value: `₹${totalReceived.toFixed(1)}L`, color: "#10B981", icon: CheckCircle2 },
          { label: "Difference (Gap)", value: `₹${totalDiff.toFixed(1)}L`, color: "#EF4444", icon: AlertTriangle },
          { label: "Pending Settlement", value: `₹${pendingSettledAmt.toFixed(1)}L`, color: "#F59E0B", icon: Clock },
        ].map((k) => {
          const CardIcon = k.icon;
          return (
            <div key={k.label} style={{ 
              background: bg, borderRadius: 16, padding: 18, border: `1px solid ${border}`, 
              boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", 
              borderLeft: `4px solid ${k.color}` 
            }}>
              <div style={{ 
                width: 36, height: 36, borderRadius: 8, 
                background: `${k.color}15`, display: "flex", 
                alignItems: "center", justifyContent: "center", marginBottom: 10
              }}>
                <CardIcon size={18} color={k.color} />
              </div>
              <div style={{ color: subtext, fontSize: 11, marginBottom: 6 }}>{k.label}</div>
              <div style={{ color: text, fontSize: 24, fontWeight: 800 }}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* AI Warning Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", 
        gap: 14 
      }}>
        {warningCards.map((w) => (
          <div
            key={w.type}
            style={{
              background: `${w.color}10`,
              borderRadius: 16,
              padding: 16,
              border: `1px solid ${w.color}30`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <AlertTriangle size={16} color={w.color} />
              <span style={{ color: w.color, fontSize: 12, fontWeight: 700 }}>{w.type}</span>
            </div>
            <div style={{ color: text, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{w.amount}</div>
            <div style={{ color: subtext, fontSize: 11, lineHeight: 1.4 }}>{w.desc}</div>
            {w.count > 0 && (
              <div style={{ marginTop: 10 }}>
                <span style={{ background: `${w.color}20`, color: w.color, padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                  {w.count} issue{w.count > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", 
        gap: 20 
      }}>
        {/* Reconciliation Table */}
        <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
            <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>Insurer-wise Reconciliation</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                  {["Insurer", "Expected (₹L)", "Received (₹L)", "Difference", "Status", "Action"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 600, textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reconcList.map((r) => {
                  const isReconciling = loadingMap[r.insurer] || false;
                  return (
                    <tr
                      key={r.insurer}
                      style={{ borderBottom: `1px solid ${border}` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = inputBg; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                    >
                      <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 600 }}>{r.insurer}</td>
                      <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>₹{r.expected.toFixed(1)}L</td>
                      <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>₹{r.received.toFixed(1)}L</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: r.diff > 0 ? "#EF4444" : "#10B981", fontWeight: 700, fontSize: 13 }}>
                          {r.diff > 0 ? `-₹${r.diff.toFixed(1)}L` : "✓ Matched"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: statusStyle[r.status]?.bg, color: statusStyle[r.status]?.color, padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {r.status !== "Settled" ? (
                          <button
                            onClick={() => handleReconcile(r.insurer)}
                            disabled={isReconciling}
                            style={{
                              padding: "6px 12px",
                              background: "rgba(99,102,241,0.1)",
                              color: "#6366F1",
                              border: "1px solid rgba(99,102,241,0.2)",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: isReconciling ? "default" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                            {isReconciling ? (
                              <>
                                <Loader2 size={12} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                                <span>Settling...</span>
                              </>
                            ) : (
                              <>
                                <span>Reconcile</span>
                                <ArrowRight size={12} />
                              </>
                            )}
                          </button>
                        ) : (
                          <span style={{ color: subtext, fontSize: 11 }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aging Analysis */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Aging Analysis</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Outstanding by age (₹Cr)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={initialAgingData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} />
              <XAxis dataKey="range" tick={{ fill: subtext, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {initialAgingData.map((_, i) => (
                  <Cell key={i} fill={["#10B981", "#F59E0B", "#EF4444", "#7F1D1D"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12 }}>
            {initialAgingData.map((a, i) => (
              <div key={a.range} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < initialAgingData.length - 1 ? `1px solid ${border}` : "none" }}>
                <span style={{ color: subtext, fontSize: 12 }}>{a.range}</span>
                <span style={{ color: text, fontSize: 13, fontWeight: 700 }}>₹{a.amount}Cr</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
