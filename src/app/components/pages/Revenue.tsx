import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Legend
} from "recharts";
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const revenueTrend = [
  { month: "Jan", premium: 18.4, brokerage: 1.84, received: 16.8, pending: 1.6 },
  { month: "Feb", premium: 21.2, brokerage: 2.12, received: 19.4, pending: 1.8 },
  { month: "Mar", premium: 19.8, brokerage: 1.98, received: 18.2, pending: 1.6 },
  { month: "Apr", premium: 23.5, brokerage: 2.35, received: 21.8, pending: 1.7 },
  { month: "May", premium: 22.1, brokerage: 2.21, received: 20.4, pending: 1.7 },
  { month: "Jun", premium: 26.3, brokerage: 2.63, received: 24.1, pending: 2.2 },
  { month: "Jul", premium: 24.8, brokerage: 2.48, received: 22.6, pending: 2.2 },
];

const cashFlow = [
  { month: "Apr", inflow: 21.8, outflow: 4.2, net: 17.6 },
  { month: "May", inflow: 20.4, outflow: 3.8, net: 16.6 },
  { month: "Jun", inflow: 24.1, outflow: 4.8, net: 19.3 },
  { month: "Jul", inflow: 22.6, outflow: 4.1, net: 18.5 },
];

const insurerRevenue = [
  { name: "Star Health", revenue: 42.4, brokerage: 6.2, color: "#6366F1" },
  { name: "ICICI Lombard", revenue: 38.1, brokerage: 5.1, color: "#10B981" },
  { name: "HDFC Ergo", revenue: 31.2, brokerage: 4.8, color: "#8B5CF6" },
  { name: "Bajaj Allianz", revenue: 27.4, brokerage: 3.9, color: "#F59E0B" },
  { name: "Niva Bupa", premium: 22.6, revenue: 22.6, brokerage: 3.4, color: "#0D9488" },
];

export function Revenue({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";

  const kpis = [
    { label: "Total Premium", value: "₹24.8 Cr", change: "+14%", up: true, icon: DollarSign, color: "#6366F1" },
    { label: "Brokerage Earned", value: "₹2.48 Cr", change: "+8%", up: true, icon: TrendingUp, color: "#10B981" },
    { label: "Receivable", value: "₹1.84 Cr", change: "+3%", up: false, icon: ArrowUpRight, color: "#F59E0B" },
    { label: "Received", value: "₹22.6 Cr", change: "+12%", up: true, icon: TrendingUp, color: "#8B5CF6" },
    { label: "Pending", value: "₹2.2 Cr", change: "+5%", up: false, icon: ArrowDownRight, color: "#EF4444" },
    { label: "Collection %", value: "91.1%", change: "+2%", up: true, icon: TrendingUp, color: "#10B981" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ textAlign: isMobile ? "center" : "left" }}>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Revenue Analytics</h2>
        <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0", fontWeight: 500 }}>Financial performance for July 2025</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)", gap: 14 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{ background: bg, borderRadius: 16, padding: 16, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)", borderTop: `3px solid ${kpi.color}` }}>
            <div style={{ color: subtext, fontSize: 11, marginBottom: 8, fontWeight: 600 }}>{kpi.label}</div>
            <div style={{ color: text, fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px" }}>{kpi.value}</div>
            <div style={{ color: kpi.up ? "#10B981" : "#EF4444", fontSize: 11, marginTop: 4, fontWeight: 600 }}>
              {kpi.up ? "↑" : "↓"} {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
        <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Revenue Trend</div>
        <div style={{ color: subtext, fontSize: 12, marginBottom: 16, fontWeight: 500 }}>Premium, Brokerage & Cash Flow (₹Cr)</div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={revenueTrend}>
            <defs>
              <linearGradient id="premGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--card)", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
            <Legend />
            <Area type="monotone" dataKey="premium" name="Premium (₹Cr)" fill="url(#premGrad2)" stroke="#6366F1" strokeWidth={2.5} />
            <Bar dataKey="received" name="Received (₹Cr)" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Line type="monotone" dataKey="brokerage" name="Brokerage (₹Cr)" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        {/* Insurer Revenue */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Insurer Revenue</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16, fontWeight: 500 }}>Top 5 insurers by premium (₹L)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {insurerRevenue.map((ins) => (
              <div key={ins.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{ins.name}</span>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ color: subtext, fontSize: 12, fontWeight: 500 }}>₹{ins.brokerage}L brokerage</span>
                    <span style={{ color: text, fontSize: 13, fontWeight: 700 }}>₹{ins.revenue}L</span>
                  </div>
                </div>
                <div style={{ height: 8, background: dark ? "#1F2937" : "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(ins.revenue / 42.4) * 100}%`,
                      height: "100%",
                      background: ins.color,
                      borderRadius: 4,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cash Flow */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ color: text, fontWeight: 800, fontSize: 15, marginBottom: 4, letterSpacing: "-0.3px" }}>Cash Flow</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16, fontWeight: 500 }}>Inflow vs Outflow (₹Cr)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Bar dataKey="inflow" name="Inflow" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" name="Outflow" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.7} />
              <Line type="monotone" dataKey="net" name="Net" stroke="#6366F1" strokeWidth={2} dot={{ fill: "#6366F1", r: 4 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Finance AI Summary */}
      <div style={{
        background: dark
          ? "linear-gradient(135deg, #022C22 0%, #064E3B 60%, #0D9488 100%)"
          : "linear-gradient(135deg, #064E3B 0%, #0F766E 60%, #10B981 100%)",
        borderRadius: 18,
        padding: 20,
        boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(16,185,129,0.12)",
        border: "1px solid " + (dark ? "rgba(16,185,129,0.2)" : "transparent")
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={16} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>Finance AI Summary</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 500 }}>Generated just now</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
          {[
            { title: "Revenue Health", value: "91%", desc: "Collection efficiency above target", color: "#6EE7B7" },
            { title: "Revenue Leakage", value: "₹2.2Cr", desc: "Pending brokerage from 3 insurers", color: "#FCD34D" },
            { title: "Growth Forecast", value: "+18%", desc: "Expected next quarter premium", color: "#93C5FD" },
          ].map((m) => (
            <div key={m.title} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 6, fontWeight: 600 }}>{m.title}</div>
              <div style={{ color: m.color, fontSize: 24, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.5px" }}>{m.value}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 500 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
