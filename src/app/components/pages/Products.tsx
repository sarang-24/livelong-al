import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Package, TrendingUp, TrendingDown, Activity, Car, Heart, Plane, Building2, Play, Check, Loader2 } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const products = [
  { name: "Health Insurance", icon: Activity, premium: 8.4, growth: 18, policies: 4820, profitability: 22, customers: 3200, color: "#6366F1" }, // Indigo
  { name: "Motor Insurance", icon: Car, premium: 6.2, growth: -8, policies: 3640, profitability: 14, customers: 2800, color: "#10B981" }, // Teal/Green
  { name: "Life Insurance", icon: Heart, premium: 4.8, growth: 12, policies: 1840, profitability: 28, customers: 1600, color: "#3B82F6" }, // Blue
  { name: "Travel Insurance", icon: Plane, premium: 1.8, growth: 24, policies: 680, profitability: 32, customers: 620, color: "#F59E0B" }, // Amber
  { name: "Corporate Health", icon: Building2, premium: 3.6, growth: 15, policies: 240, profitability: 18, customers: 84, color: "#EF4444" }, // Red
];

const growthData = [
  { month: "Mar", health: 7.2, motor: 6.8, life: 4.2, travel: 1.4 },
  { month: "Apr", health: 7.8, motor: 6.6, life: 4.5, travel: 1.6 },
  { month: "May", health: 8.0, motor: 6.4, life: 4.6, travel: 1.7 },
  { month: "Jun", health: 8.6, motor: 6.7, life: 4.9, travel: 1.9 },
  { month: "Jul", health: 8.4, motor: 6.2, life: 4.8, travel: 1.8 },
];

const crossSellMatrix = [
  { from: "Health", to: "Life", rate: 42, opportunities: 1340 },
  { from: "Motor", to: "Health", rate: 38, opportunities: 1120 },
  { from: "Life", to: "Health", rate: 28, opportunities: 460 },
  { from: "Health", to: "Travel", rate: 22, opportunities: 706 },
  { from: "Motor", to: "Travel", rate: 18, opportunities: 655 },
];

const productDist = products.map((p) => ({ name: p.name, value: p.policies, color: p.color }));

export function Products({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const [activeCampaigns, setActiveCampaigns] = useState<Record<number, "idle" | "launching" | "active">>({});

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  const handleStartCampaign = (index: number) => {
    setActiveCampaigns((prev) => ({ ...prev, [index]: "launching" }));
    setTimeout(() => {
      setActiveCampaigns((prev) => ({ ...prev, [index]: "active" }));
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Product Analytics</h2>
        <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>5 product lines · ₹24.8Cr total premium</p>
      </div>

      {/* Product Cards Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", 
        gap: 14 
      }}>
        {products.map((p) => {
          const IconComponent = p.icon;
          return (
            <div
              key={p.name}
              style={{
                background: bg, borderRadius: 18, padding: 18, border: `1px solid ${border}`,
                boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)",
                borderTop: `4px solid ${p.color}`,
                cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { 
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = dark ? "0 8px 30px rgba(0,0,0,0.3)" : "0 8px 30px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => { 
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{ 
                width: 48, height: 48, borderRadius: 12, 
                background: `${p.color}15`, display: "flex", 
                alignItems: "center", justifyContent: "center", marginBottom: 14 
              }}>
                <IconComponent size={24} color={p.color} />
              </div>
              <div style={{ color: subtext, fontSize: 11, marginBottom: 6 }}>{p.name}</div>
              <div style={{ color: text, fontSize: 22, fontWeight: 800 }}>₹{p.premium}Cr</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                {p.growth > 0 ? <TrendingUp size={12} color="#10B981" /> : <TrendingDown size={12} color="#EF4444" />}
                <span style={{ color: p.growth > 0 ? "#10B981" : "#EF4444", fontSize: 12, fontWeight: 600 }}>
                  {p.growth > 0 ? "+" : ""}{p.growth}%
                </span>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: subtext, fontSize: 10 }}>Profitability</span>
                  <span style={{ color: text, fontSize: 10, fontWeight: 600 }}>{p.profitability}%</span>
                </div>
                <div style={{ height: 4, background: dark ? "#1E293B" : "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${p.profitability * 3}%`, height: "100%", background: p.color, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ color: subtext, fontSize: 10, marginTop: 10 }}>{p.policies.toLocaleString()} policies</div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", 
        gap: 20 
      }}>
        {/* Growth Trend */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Product Growth Trend</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Monthly premium by product (₹Cr)</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData}>
              <defs>
                {products.slice(0, 4).map((p, i) => (
                  <linearGradient key={p.name} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={p.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={p.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Area type="monotone" dataKey="health" name="Health" stroke="#6366F1" fill="url(#grad0)" strokeWidth={2} />
              <Area type="monotone" dataKey="motor" name="Motor" stroke="#10B981" fill="url(#grad1)" strokeWidth={2} />
              <Area type="monotone" dataKey="life" name="Life" stroke="#3B82F6" fill="url(#grad2)" strokeWidth={2} />
              <Area type="monotone" dataKey="travel" name="Travel" stroke="#F59E0B" fill="url(#grad3)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Policy Distribution</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 12 }}>By product line</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={productDist} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {productDist.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {productDist.map((p) => (
              <div key={p.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
                  <span style={{ color: subtext, fontSize: 11 }}>{p.name.split(" ")[0]}</span>
                </div>
                <span style={{ color: text, fontSize: 11, fontWeight: 600 }}>{p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Sell Matrix */}
      <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Cross-Sell Opportunities</div>
        <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>AI-identified upsell potential by product combination</div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", 
          gap: 12 
        }}>
          {crossSellMatrix.map((c, i) => {
            const status = activeCampaigns[i] || "idle";
            return (
              <div
                key={i}
                style={{
                  background: inputBg,
                  borderRadius: 14, padding: 16, border: `1px solid ${border}`,
                  transition: "transform 0.2s, border-color 0.2s",
                  borderColor: status === "active" ? "#10B981" : border
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
              >
                <div style={{ color: text, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  {c.from} → {c.to}
                </div>
                <div style={{ color: "#10B981", fontSize: 22, fontWeight: 800 }}>{c.rate}%</div>
                <div style={{ color: subtext, fontSize: 11, marginTop: 4 }}>conversion rate</div>
                <div style={{ color: "#6366F1", fontSize: 12, marginTop: 8, fontWeight: 600 }}>
                  {c.opportunities.toLocaleString()} opportunities
                </div>
                <button 
                  onClick={() => handleStartCampaign(i)}
                  disabled={status !== "idle"}
                  style={{ 
                    marginTop: 12, width: "100%", padding: "7px 10px", 
                    background: status === "active" ? "rgba(16,185,129,0.1)" : "rgba(99,102,241,0.1)", 
                    color: status === "active" ? "#10B981" : "#6366F1", 
                    border: `1px solid ${status === "active" ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.2)"}`, 
                    borderRadius: 8, fontSize: 11, cursor: status === "idle" ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    fontWeight: 600
                  }}
                >
                  {status === "idle" && (
                    <>
                      <Play size={11} />
                      <span>Start Campaign</span>
                    </>
                  )}
                  {status === "launching" && (
                    <>
                      <Loader2 size={11} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                      <span>Launching...</span>
                    </>
                  )}
                  {status === "active" && (
                    <>
                      <Check size={11} />
                      <span>Campaign Live</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
