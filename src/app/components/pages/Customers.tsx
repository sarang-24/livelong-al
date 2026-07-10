import { useState } from "react";
import { Phone, Mail, ChevronRight, Bot, Plus, Search, CheckCircle, HelpCircle, MapPin, FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useIsMobile } from "../../hooks/useIsMobile";

const customers = [
  { id: 1, name: "Rajesh Pillai", age: 42, city: "Mumbai", policies: 4, ltv: "₹8.4L", health: 92, renewal: 94, status: "VIP" },
  { id: 2, name: "Ananya Krishnan", age: 35, city: "Bengaluru", policies: 3, ltv: "₹5.2L", health: 78, renewal: 88, status: "Premium" },
  { id: 3, name: "Vijay Malhotra", age: 51, city: "Delhi", policies: 6, ltv: "₹14.8L", health: 95, renewal: 91, status: "VIP" },
  { id: 4, name: "Pooja Sharma", age: 28, city: "Pune", policies: 2, ltv: "₹2.1L", health: 65, renewal: 72, status: "Standard" },
  { id: 5, name: "Arun Nair", age: 38, city: "Chennai", policies: 3, ltv: "₹4.6L", health: 82, renewal: 85, status: "Premium" },
];

const customerDetailsData: Record<number, {
  id: number;
  name: string;
  age: number;
  city: string;
  email: string;
  phone: string;
  occupation: string;
  income: string;
  healthScore: number;
  lifeTimeValue: string;
  renewalProbability: number;
  policies: { type: string; insurer: string; premium: string; status: string; renewal: string }[];
  premiumHistory: { month: string; amount: number }[];
  claimsHistory: { date: string; type: string; amount: string; status: string }[];
  timeline: { date: string; event: string; type: string }[];
  family: { name: string; relation: string; age: number; covered: boolean }[];
}> = {
  1: {
    id: 1,
    name: "Rajesh Pillai",
    age: 42,
    city: "Mumbai",
    email: "rajesh.pillai@email.com",
    phone: "+91 98765 43210",
    occupation: "Senior Manager — TCS",
    income: "₹28L per annum",
    healthScore: 92,
    lifeTimeValue: "₹8.4L",
    renewalProbability: 94,
    policies: [
      { type: "Health Insurance", insurer: "Star Health", premium: "₹48,000/yr", status: "Active", renewal: "Mar 2026" },
      { type: "Term Life", insurer: "HDFC Life", premium: "₹36,000/yr", status: "Active", renewal: "Apr 2028" },
      { type: "Motor Insurance", insurer: "ICICI Lombard", premium: "₹14,200/yr", status: "Active", renewal: "Aug 2025" },
      { type: "Travel Insurance", insurer: "Bajaj Allianz", premium: "₹8,500/yr", status: "Expired", renewal: "—" },
    ],
    premiumHistory: [
      { month: "Jan", amount: 8400 },
      { month: "Feb", amount: 0 },
      { month: "Mar", amount: 48000 },
      { month: "Apr", amount: 36000 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 0 },
      { month: "Jul", amount: 14200 },
    ],
    claimsHistory: [
      { date: "Mar 2024", type: "Health", amount: "₹2.8L", status: "Approved" },
      { date: "Nov 2023", type: "Motor", amount: "₹42K", status: "Approved" },
      { date: "Jun 2023", type: "Health", amount: "₹1.1L", status: "Approved" },
    ],
    timeline: [
      { date: "Jul 14, 2025", event: "Annual health checkup reminder sent", type: "notification" },
      { date: "Jul 8, 2025", event: "Motor insurance renewal follow-up call", type: "call" },
      { date: "Jun 15, 2025", event: "Policy document emailed", type: "email" },
    ],
    family: [
      { name: "Meera Pillai", relation: "Spouse", age: 38, covered: true },
      { name: "Arjun Pillai", relation: "Son", age: 14, covered: true },
    ],
  },
  2: {
    id: 2,
    name: "Ananya Krishnan",
    age: 35,
    city: "Bengaluru",
    email: "ananya.k@email.com",
    phone: "+91 87654 32109",
    occupation: "Tech Lead — Infosys",
    income: "₹19L per annum",
    healthScore: 78,
    lifeTimeValue: "₹5.2L",
    renewalProbability: 88,
    policies: [
      { type: "Health Insurance", insurer: "Niva Bupa", premium: "₹24,000/yr", status: "Active", renewal: "Jun 2026" },
      { type: "Term Life", insurer: "Max Life", premium: "₹18,000/yr", status: "Active", renewal: "Oct 2027" },
      { type: "Motor Insurance", insurer: "HDFC Ergo", premium: "₹10,500/yr", status: "Active", renewal: "Sep 2025" },
    ],
    premiumHistory: [
      { month: "Jan", amount: 0 },
      { month: "Feb", amount: 18000 },
      { month: "Mar", amount: 0 },
      { month: "Apr", amount: 0 },
      { month: "May", amount: 24000 },
      { month: "Jun", amount: 10500 },
      { month: "Jul", amount: 0 },
    ],
    claimsHistory: [
      { date: "Dec 2024", type: "Motor", amount: "₹18K", status: "Approved" },
    ],
    timeline: [
      { date: "Jul 10, 2025", event: "Motor claim settled successfully", type: "notification" },
      { date: "Jun 28, 2025", event: "Renewal quote sent for HDFC Motor", type: "email" },
    ],
    family: [
      { name: "Rohan Krishnan", relation: "Spouse", age: 37, covered: true },
    ],
  },
  3: {
    id: 3,
    name: "Vijay Malhotra",
    age: 51,
    city: "Delhi",
    email: "vijay.malhotra@email.com",
    phone: "+91 76543 21098",
    occupation: "VP — HDFC Bank",
    income: "₹45L per annum",
    healthScore: 95,
    lifeTimeValue: "₹14.8L",
    renewalProbability: 91,
    policies: [
      { type: "Health Insurance", insurer: "Star Health", premium: "₹72,000/yr", status: "Active", renewal: "Jan 2026" },
      { type: "Term Life", insurer: "Tata AIA", premium: "₹55,000/yr", status: "Active", renewal: "Dec 2028" },
      { type: "Motor Insurance", insurer: "Bajaj Allianz", premium: "₹18,500/yr", status: "Active", renewal: "Nov 2025" },
      { type: "Corporate Cover", insurer: "ICICI Lombard", premium: "₹1,20,000/yr", status: "Active", renewal: "Oct 2025" },
    ],
    premiumHistory: [
      { month: "Jan", amount: 72000 },
      { month: "Feb", amount: 0 },
      { month: "Mar", amount: 0 },
      { month: "Apr", amount: 0 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 120000 },
      { month: "Jul", amount: 0 },
    ],
    claimsHistory: [
      { date: "Apr 2025", type: "Health", amount: "₹4.2L", status: "Approved" },
      { date: "Oct 2024", type: "Health", amount: "₹85K", status: "Approved" },
    ],
    timeline: [
      { date: "Jul 12, 2025", event: "Executive health checkup report uploaded", type: "notification" },
      { date: "May 15, 2025", event: "Corporate policy endorsement added", type: "notification" },
    ],
    family: [
      { name: "Kiran Malhotra", relation: "Spouse", age: 48, covered: true },
      { name: "Siddharth Malhotra", relation: "Son", age: 21, covered: false },
    ],
  },
  4: {
    id: 4,
    name: "Pooja Sharma",
    age: 28,
    city: "Pune",
    email: "pooja.sharma@email.com",
    phone: "+91 65432 10987",
    occupation: "Software Engineer — Cognizant",
    income: "₹12L per annum",
    healthScore: 65,
    lifeTimeValue: "₹2.1L",
    renewalProbability: 72,
    policies: [
      { type: "Health Insurance", insurer: "Niva Bupa", premium: "₹18,000/yr", status: "Active", renewal: "Sep 2025" },
      { type: "Motor Insurance", insurer: "ICICI Lombard", premium: "₹8,400/yr", status: "Active", renewal: "Dec 2025" },
    ],
    premiumHistory: [
      { month: "Jan", amount: 0 },
      { month: "Feb", amount: 0 },
      { month: "Mar", amount: 0 },
      { month: "Apr", amount: 0 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 18000 },
      { month: "Jul", amount: 8400 },
    ],
    claimsHistory: [],
    timeline: [
      { date: "Jul 1, 2025", event: "Welcome kit dispatched for health policy", type: "notification" },
    ],
    family: [],
  },
  5: {
    id: 5,
    name: "Arun Nair",
    age: 38,
    city: "Chennai",
    email: "arun.nair@email.com",
    phone: "+91 54321 09876",
    occupation: "Business Owner",
    income: "₹22L per annum",
    healthScore: 82,
    lifeTimeValue: "₹4.6L",
    renewalProbability: 85,
    policies: [
      { type: "Health Insurance", insurer: "Star Health", premium: "₹28,000/yr", status: "Active", renewal: "May 2026" },
      { type: "Term Life", insurer: "HDFC Life", premium: "₹22,000/yr", status: "Active", renewal: "Jun 2029" },
    ],
    premiumHistory: [
      { month: "Jan", amount: 0 },
      { month: "Feb", amount: 0 },
      { month: "Mar", amount: 0 },
      { month: "Apr", amount: 28000 },
      { month: "May", amount: 22000 },
      { month: "Jun", amount: 0 },
      { month: "Jul", amount: 0 },
    ],
    claimsHistory: [
      { date: "Jan 2025", type: "Health", amount: "₹45K", status: "Approved" },
    ],
    timeline: [
      { date: "Jul 5, 2025", event: "Tax certificate (80D) generated & emailed", type: "notification" },
    ],
    family: [
      { name: "Lakshmi Nair", relation: "Spouse", age: 34, covered: true },
      { name: "Gautham Nair", relation: "Son", age: 8, covered: true },
    ],
  },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  VIP: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Premium: { bg: "rgba(99,102,241,0.12)", color: "#6366F1" },
  Standard: { bg: "var(--border)", color: "var(--muted-foreground)" },
};

export function Customers({ dark }: { dark: boolean }) {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = "var(--input-background)";
  const rowHover = "var(--accent)";

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = customerDetailsData[selectedId] || customerDetailsData[1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 14 : 0 }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Customer 360°</h2>
          <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0", fontWeight: 500 }}>12,480 total customers · 94% satisfaction score</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "linear-gradient(135deg, var(--primary), var(--chart-5))", border: "none", borderRadius: 10, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}>
          <Plus size={15} /> Add Customer
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "320px 1fr", gap: 20 }}>
        {/* Customer List */}
        <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden", height: "fit-content" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: inputBg, border: `1px solid ${border}`, borderRadius: 8, padding: "7px 12px" }}>
              <Search size={13} color={subtext} style={{ width: 14, height: 14 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                style={{ border: "none", background: "transparent", outline: "none", color: text, fontSize: 12, width: "100%" }}
              />
            </div>
          </div>
          <div style={{ maxHeight: isMobile ? "280px" : "600px", overflowY: "auto" }}>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  style={{
                    padding: "14px 16px",
                    borderBottom: `1px solid ${border}`,
                    cursor: "pointer",
                    background: selectedId === c.id ? (dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.06)") : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedId !== c.id) (e.currentTarget as HTMLDivElement).style.background = rowHover;
                  }}
                  onMouseLeave={(e) => {
                    if (selectedId !== c.id) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: `hsl(${c.id * 55}, 65%, 55%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: 14, fontWeight: 700, flexShrink: 0,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    {c.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ color: text, fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                      <span style={{ background: statusColors[c.status]?.bg, color: statusColors[c.status]?.color, fontSize: 10, padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ color: subtext, fontSize: 11, marginTop: 2, fontWeight: 500 }}>
                      {c.policies} policies · LTV {c.ltv}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ color: subtext, fontSize: 10, fontWeight: 500 }}>Renewal Risk</span>
                        <span style={{ color: text, fontSize: 10, fontWeight: 700 }}>{c.renewal}%</span>
                      </div>
                      <div style={{ height: 4, background: dark ? "#1F2937" : "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${c.renewal}%`, height: "100%", background: c.renewal > 85 ? "#10B981" : c.renewal > 70 ? "#F59E0B" : "#EF4444", borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} color={subtext} />
                </div>
              ))
            ) : (
              <div style={{ padding: "24px 16px", textAlign: "center", color: subtext, fontSize: 13 }}>
                No customers found
              </div>
            )}
          </div>
        </div>

        {/* Customer 360 Profile */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile Header */}
          <div
            style={{
              background: dark 
                ? "linear-gradient(135deg, #090D16 0%, #151D30 60%, #4F46E5 100%)" 
                : "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #6366F1 100%)",
              borderRadius: 18, padding: "20px 24px",
              boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(99,102,241,0.12)",
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center", color: "white", flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
              <div
                style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, fontWeight: 800, flexShrink: 0,
                  border: "2px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                {selectedCustomer.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>{selectedCustomer.name}</div>
                <div style={{ opacity: 0.8, fontSize: 13, marginTop: 2, fontWeight: 500 }}>{selectedCustomer.occupation}</div>
                <div style={{ display: "flex", gap: "14px 16px", marginTop: 8, fontSize: 12, opacity: 0.9, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={13} color="white" />
                    <span>{selectedCustomer.city}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Phone size={13} color="white" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Mail size={13} color="white" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "center", width: isMobile ? "100%" : "auto", marginTop: isMobile ? 12 : 0 }}>
                {[
                  { label: "LTV", value: selectedCustomer.lifeTimeValue },
                  { label: "Health Score", value: `${selectedCustomer.healthScore}%` },
                  { label: "Renewal Prob.", value: `${selectedCustomer.renewalProbability}%` },
                  { label: "Policies", value: `${selectedCustomer.policies.length}` },
                ].map((m) => (
                  <div key={m.label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{m.value}</div>
                    <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            {/* Policies */}
            <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, padding: 18, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ color: text, fontWeight: 800, fontSize: 14, marginBottom: 12, letterSpacing: "-0.3px" }}>Insurance Portfolio</div>
              {selectedCustomer.policies.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < selectedCustomer.policies.length - 1 ? `1px solid ${border}` : "none" }}>
                  <div>
                    <div style={{ color: text, fontSize: 13, fontWeight: 600 }}>{p.type}</div>
                    <div style={{ color: subtext, fontSize: 11, fontWeight: 500 }}>{p.insurer} · {p.premium}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      background: p.status === "Active" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                      color: p.status === "Active" ? "#10B981" : "#EF4444",
                      padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                    }}>
                      {p.status}
                    </span>
                    <div style={{ color: subtext, fontSize: 10, marginTop: 4, fontWeight: 500 }}>Due: {p.renewal}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium History */}
            <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, padding: 18, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ color: text, fontWeight: 800, fontSize: 14, marginBottom: 12, letterSpacing: "-0.3px" }}>Premium History</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={selectedCustomer.premiumHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: subtext, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
                  <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            {/* Claims History */}
            <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, padding: 18, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ color: text, fontWeight: 800, fontSize: 14, marginBottom: 12, letterSpacing: "-0.3px" }}>Claims History</div>
              {selectedCustomer.claimsHistory.length > 0 ? (
                selectedCustomer.claimsHistory.map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < selectedCustomer.claimsHistory.length - 1 ? `1px solid ${border}` : "none" }}>
                    <div>
                      <div style={{ color: text, fontSize: 13, fontWeight: 600 }}>{c.type} Claim</div>
                      <div style={{ color: subtext, fontSize: 11, fontWeight: 500 }}>{c.date}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: text, fontSize: 13, fontWeight: 700 }}>{c.amount}</div>
                      <span style={{ color: "#10B981", fontSize: 11, fontWeight: 600 }}>✓ {c.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "20px 0", color: subtext, fontSize: 13, justifyContent: "center" }}>
                  <HelpCircle size={15} />
                  <span>No claims history found</span>
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div style={{ background: dark ? "linear-gradient(135deg, #0A0F1D 0%, #171E30 100%)" : "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)", borderRadius: 18, border: `1px solid ${dark ? "rgba(99,102,241,0.2)" : "transparent"}`, padding: 18, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(99,102,241,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Bot size={16} color="white" />
                <div style={{ color: "white", fontWeight: 800, fontSize: 13 }}>AI Customer Insights</div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
                This customer has <strong style={{ color: "#6EE7B7" }}>{selectedCustomer.renewalProbability}% renewal probability</strong>. VIP segment with {selectedCustomer.lifeTimeValue} lifetime value. Recommend <strong style={{ color: "#FCD34D" }}>Critical Illness Cover</strong> — high upsell potential.
              </div>
              {[
                "Send Critical Illness proposal by Friday",
                "Motor policy due in 24 days — call this week",
                "Family floater upgrade opportunity",
              ].map((rec, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}>
                  <CheckCircle size={12} color="#6EE7B7" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 500 }}>{rec}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <button style={{ flex: 1, padding: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "white", fontSize: 12, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Phone size={12} /> Call
                </button>
                <button style={{ flex: 1, padding: "8px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "white", fontSize: 12, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <FileText size={12} /> Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
