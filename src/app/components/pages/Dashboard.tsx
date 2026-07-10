import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, TrendingDown, ArrowUpRight, RefreshCw, AlertCircle,
  Users, FileText, DollarSign, Bot, Zap, CheckCircle, Clock, Star
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const premiumData = [
  { month: "Jan", premium: 18.4, brokerage: 1.84, target: 20 },
  { month: "Feb", premium: 21.2, brokerage: 2.12, target: 20 },
  { month: "Mar", premium: 19.8, brokerage: 1.98, target: 22 },
  { month: "Apr", premium: 23.5, brokerage: 2.35, target: 22 },
  { month: "May", premium: 22.1, brokerage: 2.21, target: 24 },
  { month: "Jun", premium: 26.3, brokerage: 2.63, target: 24 },
  { month: "Jul", premium: 24.8, brokerage: 2.48, target: 26 },
];

const productMix = [
  { name: "Health", value: 38, color: "#6366F1" },
  { name: "Motor", value: 28, color: "#10B981" },
  { name: "Life", value: 18, color: "#8B5CF6" },
  { name: "Travel", value: 8, color: "#F59E0B" },
  { name: "Corporate", value: 8, color: "#0D9488" },
];

const topInsurers = [
  { name: "Star Health", premium: 42, color: "#6366F1" },
  { name: "ICICI Lombard", premium: 38, color: "#10B981" },
  { name: "HDFC Ergo", premium: 31, color: "#8B5CF6" },
  { name: "Bajaj Allianz", premium: 27, color: "#F59E0B" },
  { name: "Niva Bupa", premium: 22, color: "#0D9488" },
];

const branchData = [
  { branch: "Mumbai", revenue: 82, target: 80 },
  { branch: "Delhi", revenue: 74, target: 78 },
  { branch: "Bengaluru", revenue: 68, target: 70 },
  { branch: "Chennai", revenue: 55, target: 60 },
  { branch: "Pune", revenue: 48, target: 65 },
  { branch: "Hyderabad", revenue: 52, target: 55 },
];

const recentActivities = [
  { id: 1, type: "policy", msg: "Policy #LI-2847 issued for Ananya Iyer", time: "2 min ago", color: "#10B981" },
  { id: 2, type: "lead", msg: "New high-value lead: Vikas Mehta ₹2.4L", time: "8 min ago", color: "#6366F1" },
  { id: 3, type: "claim", msg: "Claim CNF-9821 approved ₹1.8L", time: "23 min ago", color: "#F59E0B" },
  { id: 4, type: "renewal", msg: "15 renewals due in 7 days — attention needed", time: "1h ago", color: "#EF4444" },
  { id: 5, type: "policy", msg: "Policy #HI-4421 renewed by Priya Singh", time: "2h ago", color: "#10B981" },
  { id: 6, type: "lead", msg: "Lead converted: Rajesh Pillai — Motor Policy", time: "3h ago", color: "#8B5CF6" },
];

const topAgents = [
  { name: "Aakash Gupta", policies: 42, premium: "₹18.4L", rating: 98, trend: "up" },
  { name: "Sunita Rao", policies: 38, premium: "₹16.2L", rating: 95, trend: "up" },
  { name: "Manish Kapoor", policies: 35, premium: "₹14.8L", rating: 92, trend: "down" },
  { name: "Deepika Sharma", policies: 31, premium: "₹13.1L", rating: 90, trend: "up" },
  { name: "Rohit Malhotra", policies: 28, premium: "₹11.9L", rating: 87, trend: "up" },
];

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accent: string;
  dark: boolean;
}

function KPICard({ title, value, change, up, icon: Icon, accent, dark }: KPICardProps) {
  return (
    <div
      style={{
        background: "var(--card)",
        borderRadius: 18,
        padding: 20,
        boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)",
        border: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = dark
          ? "0 8px 30px rgba(0,0,0,0.5)"
          : "0 10px 25px rgba(99,102,241,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = dark
          ? "0 4px 20px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,0,0,0.02)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accent,
          borderRadius: "18px 18px 0 0",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "var(--muted-foreground)", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
            {title}
          </div>
          <div style={{ color: "var(--foreground)", fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.5px" }}>
            {value}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 8,
              color: up ? "#10B981" : "#EF4444",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {change} vs last month
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: accent + "15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={accent} />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, dark, children }: { title: string; subtitle?: string; dark: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--card)",
        borderRadius: 18,
        padding: 20,
        boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>{title}</div>
        {subtitle && <div style={{ color: "var(--muted-foreground)", fontSize: 12, marginTop: 2, fontWeight: 500 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

export function Dashboard({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero greeting */}
      <div
        style={{
          background: dark 
            ? "linear-gradient(135deg, #090D16 0%, #151D30 60%, #4F46E5 100%)" 
            : "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #6366F1 100%)",
          borderRadius: 18,
          padding: isMobile ? "20px" : "24px 28px",
          color: "white",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          boxShadow: dark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(99,102,241,0.15)",
          overflow: "hidden",
          position: "relative",
          gap: isMobile ? 20 : 0,
        }}
      >
        <div
          style={{
            position: "absolute", top: -40, right: -40,
            width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -30, right: 100,
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(255,255,255,0.02)",
          }}
        />
        <div>
          <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4, letterSpacing: 1.2, fontWeight: 700, textTransform: "uppercase" }}>
            Monday, July 14, 2025
          </div>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, marginBottom: 6, margin: 0, letterSpacing: "-0.5px" }}>
            Good Morning, Raj Sharma
          </h1>
          <p style={{ opacity: 0.8, fontSize: 13, margin: "6px 0 0 0", lineHeight: 1.4 }}>
            Yesterday's business increased by <strong style={{ color: "#10B981" }}>14%</strong>. Health Insurance generated highest revenue.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
            {[
              { label: "Motor declined 8%", color: "#FCA5A5" },
              { label: "47 renewals at risk", color: "#FCD34D" },
              { label: "₹6.3L brokerage pending", color: "#6EE7B7" },
            ].map((tag) => (
              <div
                key={tag.label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: tag.color,
                }}
              >
                {tag.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: isMobile ? "left" : "right", flexShrink: 0 }}>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: 0.5 }}>TODAY'S COLLECTION</div>
          <div style={{ fontSize: isMobile ? 28 : 34, fontWeight: 900, letterSpacing: "-1px" }}>₹2.48 Cr</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            <span style={{ color: "#10B981", fontWeight: 700 }}>↑ 14%</span> vs yesterday
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16 }}>
        <KPICard title="Today's Premium Sold" value="₹2.48 Cr" change="+14%" up={true} icon={DollarSign} accent="#6366F1" dark={dark} />
        <KPICard title="Brokerage Earned" value="₹24.6 L" change="+8%" up={true} icon={TrendingUp} accent="#10B981" dark={dark} />
        <KPICard title="Brokerage Pending" value="₹5.2 L" change="+3%" up={false} icon={Clock} accent="#F59E0B" dark={dark} />
        <KPICard title="Policies Issued" value="1,428" change="+22%" up={true} icon={FileText} accent="#8B5CF6" dark={dark} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16 }}>
        <KPICard title="Claims Pending" value="42" change="-5%" up={true} icon={AlertCircle} accent="#EF4444" dark={dark} />
        <KPICard title="Renewals Due Today" value="316" change="+12%" up={false} icon={RefreshCw} accent="#3B82F6" dark={dark} />
        <KPICard title="Lead Conversion" value="32%" change="+4%" up={true} icon={Zap} accent="#EC4899" dark={dark} />
        <KPICard title="Customer Satisfaction" value="94%" change="+2%" up={true} icon={Star} accent="#10B981" dark={dark} />
      </div>

      {/* Main Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 20 }}>
        <ChartCard title="Monthly Premium Trend" subtitle="Premium vs Target (₹ Cr)" dark={dark}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={premiumData}>
              <defs>
                <linearGradient id="premGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--foreground)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              />
              <Area type="monotone" dataKey="premium" name="Premium" stroke="#6366F1" fill="url(#premGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#10B981" fill="url(#targGrad)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Product Mix" subtitle="Revenue distribution" dark={dark}>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={productMix}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {productMix.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--foreground)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 12px", marginTop: 8 }}>
            {productMix.map((p) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
                <span style={{ color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }}>{p.name} {p.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <ChartCard title="Top Insurers" subtitle="Premium collected this month (₹L)" dark={dark}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topInsurers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--foreground)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              />
              <Bar dataKey="premium" radius={[0, 6, 6, 0]}>
                {topInsurers.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Branch Performance" subtitle="Revenue vs Target (₹L)" dark={dark}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
              <XAxis dataKey="branch" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--foreground)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              />
              <Bar dataKey="revenue" name="Revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill={dark ? "#1F2937" : "#E2E8F0"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 20 }}>
        {/* Recent Activities */}
        <ChartCard title="Recent Activities" dark={dark}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {recentActivities.map((a) => (
              <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: a.color,
                    marginTop: 5,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${a.color}50`,
                  }}
                />
                <div>
                  <div style={{ color: "var(--foreground)", fontSize: 13, lineHeight: 1.4, fontWeight: 500 }}>{a.msg}</div>
                  <div style={{ color: "var(--muted-foreground)", fontSize: 11, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Top Agents */}
        <ChartCard title="Top Agents" subtitle="This month" dark={dark}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topAgents.map((agent, i) => (
              <div key={agent.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: ["#6366F1", "#10B981", "#8B5CF6", "#F59E0B", "#0D9488"][i],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "var(--foreground)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {agent.name}
                  </div>
                  <div style={{ color: "var(--muted-foreground)", fontSize: 11 }}>{agent.policies} policies · {agent.premium}</div>
                </div>
                <div style={{ color: agent.trend === "up" ? "#10B981" : "#EF4444", fontSize: 12, fontWeight: 700 }}>
                  {agent.trend === "up" ? "↑" : "↓"}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* AI Executive Summary */}
        <div
          style={{
            background: dark
              ? "linear-gradient(135deg, #0A0F1D 0%, #171E30 100%)"
              : "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)",
            borderRadius: 18,
            padding: 20,
            color: "white",
            boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(79,70,229,0.15)",
            border: "1px solid " + (dark ? "rgba(99,102,241,0.15)" : "transparent"),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>AI Executive Summary</div>
              <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 500 }}>Updated just now</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Health Insurance generated highest revenue at ₹38L",
              "Motor Insurance declined 8% — needs attention",
              "47 renewals at high risk this week",
              "Mumbai branch exceeded quarterly target",
              "Pune branch requires immediate action",
            ].map((insight, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <CheckCircle size={13} color="rgba(255,255,255,0.7)" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.4 }}>{insight}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14 }}>
            <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8, fontWeight: 700, letterSpacing: 0.8 }}>
              SUGGESTED ACTIONS
            </div>
            {[
              "Call 32 high-value customers",
              "Follow up with ICICI Lombard",
              "Assign senior advisor to renewals",
            ].map((action, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  marginBottom: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 500,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.15)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)"; }}
              >
                <ArrowUpRight size={12} />
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
