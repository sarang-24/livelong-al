import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import { Megaphone, TrendingUp, Users, DollarSign, Bot, Target, X, Check, Loader2, Play, Mic } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { speakText } from "../../utils/voice";

const initialCampaigns = [
  { name: "Health Summer Campaign", channel: "WhatsApp", leads: 840, converted: 312, cost: "₹42K", roi: 380, status: "Active" },
  { name: "Motor Renewal Drive", channel: "SMS", leads: 620, converted: 248, cost: "₹18K", roi: 420, status: "Active" },
  { name: "Life Insurance Webinar", channel: "Email", leads: 480, converted: 96, cost: "₹28K", roi: 210, status: "Completed" },
  { name: "Corporate Health Drive", channel: "LinkedIn", leads: 180, converted: 72, cost: "₹85K", roi: 280, status: "Active" },
  { name: "Google Ads - Health", channel: "Digital", leads: 1240, converted: 186, cost: "₹1.2L", roi: 190, status: "Active" },
];

const channelData = [
  { channel: "WhatsApp", leads: 840, cost: 42, roi: 380, color: "#10B981" },
  { channel: "SMS", leads: 620, cost: 18, roi: 420, color: "#6366F1" },
  { channel: "Email", leads: 480, cost: 28, roi: 210, color: "#3B82F6" },
  { channel: "Digital Ads", leads: 1240, cost: 120, roi: 190, color: "#F59E0B" },
  { channel: "LinkedIn", leads: 180, cost: 85, roi: 280, color: "#EF4444" },
];

const monthlyROI = [
  { month: "Mar", whatsapp: 320, sms: 380, email: 180, digital: 160 },
  { month: "Apr", whatsapp: 340, sms: 400, email: 190, digital: 175 },
  { month: "May", whatsapp: 360, sms: 410, email: 200, digital: 180 },
  { month: "Jun", whatsapp: 380, sms: 420, email: 210, digital: 190 },
  { month: "Jul", whatsapp: 380, sms: 420, email: 210, digital: 190 },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Active: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  Completed: { bg: "rgba(148,163,184,0.12)", color: "#94A3B8" },
  Paused: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
};

export function Marketing({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const [campaignsList, setCampaignsList] = useState(initialCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoadingMap, setAiLoadingMap] = useState<Record<string, "launching" | "launched" | null>>({});
  const [isVoiceFormFilling, setIsVoiceFormFilling] = useState(false);
  const [voiceFormStatus, setVoiceFormStatus] = useState("");

  useEffect(() => {
    const handleVoiceLaunch = () => {
      const newCampaign = {
        name: "Voice Health Campaign",
        channel: "WhatsApp",
        leads: 450,
        converted: 180,
        cost: "₹10K",
        roi: 360,
        status: "Active"
      };

      setCampaignsList(prev => [newCampaign, ...prev]);

      speakText("AI Health campaign has been launched successfully on WhatsApp. Budget allocated: ten thousand rupees.");
    };

    window.addEventListener("trigger-launch-campaign", handleVoiceLaunch);
    return () => {
      window.removeEventListener("trigger-launch-campaign", handleVoiceLaunch);
    };
  }, []);

  const startVoiceFormFill = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsVoiceFormFilling(true);
      setVoiceFormStatus("Listening... (e.g., 'Term Plan on Email cost 50k')");
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceFormStatus(`Heard: "${transcript}"`);
      
      let parsedName = "";
      let parsedChannel = "WhatsApp";
      let parsedCost = "";

      const lower = transcript.toLowerCase();

      if (lower.includes("whatsapp")) parsedChannel = "WhatsApp";
      else if (lower.includes("sms")) parsedChannel = "SMS";
      else if (lower.includes("email")) parsedChannel = "Email";
      else if (lower.includes("linkedin")) parsedChannel = "LinkedIn";
      else if (lower.includes("digital") || lower.includes("google") || lower.includes("ads")) parsedChannel = "Digital Ads";

      const costRegex = /(?:budget|cost|for|of)?\s*(?:₹?\s*\d+\s*[kKlL]?|₹?\s*\d+,\d+|₹?\s*[\d.]+\s*(?:thousand|lakh|crore|K|L|million)?)/i;
      const costMatch = lower.match(costRegex);
      if (costMatch) {
        parsedCost = costMatch[0].replace(/(?:budget|cost|for|of)/i, "").trim().toUpperCase();
        if (!parsedCost.startsWith("₹")) parsedCost = "₹" + parsedCost;
      } else {
        if (lower.includes("ten thousand")) parsedCost = "₹10K";
        else if (lower.includes("twenty thousand")) parsedCost = "₹20K";
        else if (lower.includes("fifty thousand")) parsedCost = "₹50K";
        else if (lower.includes("one lakh")) parsedCost = "₹1L";
      }

      let nameCandidate = transcript;
      const splitTerms = [" on ", " with ", " budget ", " cost ", " channel "];
      for (const term of splitTerms) {
        const idx = nameCandidate.toLowerCase().indexOf(term);
        if (idx !== -1) {
          nameCandidate = nameCandidate.substring(0, idx);
        }
      }
      parsedName = nameCandidate.trim();

      if (parsedName) setFormName(parsedName);
      setFormChannel(parsedChannel);
      if (parsedCost) setFormCost(parsedCost);

      setTimeout(() => {
        setIsVoiceFormFilling(false);
        setVoiceFormStatus("");
      }, 1500);
    };

    rec.onerror = (event: any) => {
      console.error(event.error);
      setIsVoiceFormFilling(false);
      setVoiceFormStatus("Speech recognition error.");
      setTimeout(() => setVoiceFormStatus(""), 2000);
    };

    rec.onend = () => {
      setIsVoiceFormFilling(false);
    };

    rec.start();
  };

  const simulateVoiceFormFill = () => {
    setIsVoiceFormFilling(true);
    setVoiceFormStatus("Simulating voice input...");
    setTimeout(() => {
      setVoiceFormStatus('Voice input: "Health Summer Drive on WhatsApp budget 25k"');
      setTimeout(() => {
        setFormName("Health Summer Drive");
        setFormChannel("WhatsApp");
        setFormCost("₹25K");
        setIsVoiceFormFilling(false);
        setVoiceFormStatus("");
      }, 1000);
    }, 1000);
  };

  // Form states
  const [formName, setFormName] = useState("");
  const [formChannel, setFormChannel] = useState("WhatsApp");
  const [formCost, setFormCost] = useState("");

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  // Calculate dynamic stats
  const totalLeads = campaignsList.reduce((acc, c) => acc + c.leads, 0);
  const totalSpend = campaignsList.reduce((acc, c) => {
    const num = parseFloat(c.cost.replace(/[^0-9.]/g, ""));
    const isLakh = c.cost.includes("L");
    return acc + (isLakh ? num * 100000 : num * 1000);
  }, 0);
  const avgROI = Math.round(campaignsList.reduce((acc, c) => acc + c.roi, 0) / campaignsList.length);

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCost) return;
    setLoading(true);
    setTimeout(() => {
      const leads = Math.floor(300 + Math.random() * 900);
      const converted = Math.floor(leads * (0.15 + Math.random() * 0.2));
      const roi = Math.floor(180 + Math.random() * 260);

      const newCampaign = {
        name: formName,
        channel: formChannel,
        leads,
        converted,
        cost: formCost.startsWith("₹") ? formCost : `₹${formCost}`,
        roi,
        status: "Active",
      };

      setCampaignsList((prev) => [newCampaign, ...prev]);
      setFormName("");
      setFormCost("");
      setLoading(false);
      setShowModal(false);
    }, 1200);
  };

  const handleAiLaunch = (title: string, channel: string, potentialText: string, roiText: string) => {
    setAiLoadingMap((prev) => ({ ...prev, [title]: "launching" }));
    setTimeout(() => {
      const leads = parseInt(potentialText.replace(/[^0-9]/g, ""));
      const converted = Math.floor(leads * 0.3); // High conversion for AI recommendation
      const roi = parseInt(roiText.replace(/[^0-9]/g, ""));

      const newCampaign = {
        name: title,
        channel: channel.split(" + ")[0], // Use primary channel
        leads,
        converted,
        cost: "₹35K",
        roi,
        status: "Active",
      };

      setCampaignsList((prev) => [newCampaign, ...prev]);
      setAiLoadingMap((prev) => ({ ...prev, [title]: "launched" }));
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Marketing Intelligence</h2>
          <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>{campaignsList.filter(c => c.status === "Active").length} active campaigns · {totalLeads.toLocaleString()} leads generated · ₹{(totalSpend / 100000).toFixed(2)}L spend</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "linear-gradient(135deg, #6366F1, #3B82F6)", border: "none", borderRadius: 10, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.3)", transition: "transform 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <Megaphone size={15} /> New Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", 
        gap: 16 
      }}>
        {[
          { label: "Total Leads", value: totalLeads.toLocaleString(), color: "#6366F1", icon: Users },
          { label: "Conversion Rate", value: `${((campaignsList.reduce((acc, c) => acc + c.converted, 0) / totalLeads) * 100).toFixed(1)}%`, color: "#10B981", icon: TrendingUp },
          { label: "Marketing Spend", value: `₹${(totalSpend / 100000).toFixed(2)}L`, color: "#F59E0B", icon: DollarSign },
          { label: "Average ROI", value: `${avgROI}%`, color: "#3B82F6", icon: TrendingUp },
        ].map((k) => (
          <div key={k.label} style={{ background: bg, borderRadius: 16, padding: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", borderTop: `3px solid ${k.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <k.icon size={15} color={k.color} />
              <span style={{ color: subtext, fontSize: 11 }}>{k.label}</span>
            </div>
            <div style={{ color: text, fontSize: 24, fontWeight: 800 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
        gap: 20 
      }}>
        {/* Channel ROI */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Channel ROI Trend</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Monthly ROI by channel (%)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyROI}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Line type="monotone" dataKey="whatsapp" name="WhatsApp" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sms" name="SMS" stroke="#6366F1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="email" name="Email" stroke="#3B82F6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="digital" name="Digital" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Performance */}
        <div style={{ background: bg, borderRadius: 18, padding: 20, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Channel Performance</div>
          <div style={{ color: subtext, fontSize: 12, marginBottom: 16 }}>Leads generated by channel</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} />
              <XAxis dataKey="channel" tick={{ fill: subtext, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#0F172A" : "white", border: `1px solid ${border}`, borderRadius: 10, color: text }} />
              <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                {channelData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Campaign Suggestions */}
      <div style={{ background: "linear-gradient(135deg, #6366F1, #3B82F6)", borderRadius: 18, padding: 20, color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Bot size={20} color="white" />
          <div style={{ fontWeight: 700, fontSize: 15 }}>AI Campaign Suggestions</div>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", 
          gap: 14 
        }}>
          {[
            { title: "Health Monsoon Campaign", channel: "WhatsApp", potential: "1,200 leads", roi: "400%+" },
            { title: "Motor Renewal WhatsApp Blast", channel: "WhatsApp + SMS", potential: "820 renewals", roi: "380%+" },
            { title: "Corporate Health LinkedIn Drive", channel: "LinkedIn", potential: "80 enterprise leads", roi: "290%+" },
          ].map((s) => {
            const aiState = aiLoadingMap[s.title] || null;
            return (
              <div key={s.title} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 8 }}>{s.channel}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, marginBottom: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#6EE7B7" }}>
                      <Target size={12} />
                      <span>{s.potential}</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#FCD34D" }}>
                      <TrendingUp size={12} />
                      <span>{s.roi}</span>
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleAiLaunch(s.title, s.channel, s.potential, s.roi)}
                  disabled={aiState !== null}
                  style={{ 
                    width: "100%", padding: "7px", 
                    background: aiState === "launched" ? "rgba(110,231,183,0.2)" : "rgba(255,255,255,0.15)", 
                    border: `1px solid ${aiState === "launched" ? "rgba(110,231,183,0.3)" : "rgba(255,255,255,0.25)"}`, 
                    borderRadius: 8, color: aiState === "launched" ? "#6EE7B7" : "white", 
                    fontSize: 11, fontWeight: 600, cursor: aiState !== null ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}
                >
                  {aiState === "launching" && (
                    <>
                      <Loader2 size={11} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                      <span>Launching...</span>
                    </>
                  )}
                  {aiState === "launched" && (
                    <>
                      <Check size={11} />
                      <span>Campaign Active</span>
                    </>
                  )}
                  {aiState === null && (
                    <>
                      <Play size={11} />
                      <span>Launch Campaign</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaigns Table */}
      <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>Active Campaigns</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Campaign", "Channel", "Leads", "Converted", "Cost", "ROI", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: subtext, fontSize: 11, fontWeight: 600, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaignsList.map((c, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${border}` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = inputBg; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: dark ? "#0F172A" : "#F1F5F9", color: text, padding: "3px 10px", borderRadius: 10, fontSize: 11 }}>
                      {c.channel}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13, fontWeight: 600 }}>{c.leads.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", color: "#10B981", fontSize: 13, fontWeight: 700 }}>{c.converted}</td>
                  <td style={{ padding: "12px 16px", color: text, fontSize: 13 }}>{c.cost}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: "#10B981", fontSize: 13, fontWeight: 800 }}>{c.roi}%</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: statusStyle[c.status]?.bg, color: statusStyle[c.status]?.color, padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={{ padding: "5px 10px", background: "rgba(99,102,241,0.1)", color: "#6366F1", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Campaign Modal Overlay */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          padding: 16
        }}>
          <div style={{
            background: bg, border: `1px solid ${border}`, borderRadius: 20,
            width: "100%", maxWidth: 460, padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            position: "relative"
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: subtext, cursor: "pointer" }}
            >
              <X size={18} />
            </button>
            <div style={{ color: text, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Create New Campaign</div>
            <div style={{ color: subtext, fontSize: 12, marginBottom: 20 }}>Launch a targeted marketing drive with AI-assisted optimizations</div>
            
            {/* Voice Form Filler Panel */}
            <div style={{ 
              display: "flex", gap: 8, marginBottom: 16, 
              background: dark ? "rgba(255,255,255,0.03)" : "#F8FAFC", 
              padding: 10, borderRadius: 12, border: `1px solid ${border}`, 
              alignItems: "center" 
            }}>
              <Mic size={16} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <div style={{ color: text, fontSize: 11, fontWeight: 700 }}>Voice Form Filler</div>
                <div style={{ color: subtext, fontSize: 10 }}>{voiceFormStatus || "Speak campaign details to auto-fill form"}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={startVoiceFormFill}
                  disabled={isVoiceFormFilling}
                  style={{ padding: "4px 8px", background: "var(--primary)", border: "none", borderRadius: 6, color: "white", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                >
                  {isVoiceFormFilling ? "Listening..." : "Speak"}
                </button>
                <button
                  type="button"
                  onClick={simulateVoiceFormFill}
                  disabled={isVoiceFormFilling}
                  style={{ padding: "4px 8px", background: "none", border: `1px solid ${border}`, borderRadius: 6, color: text, fontSize: 10, fontWeight: 600, cursor: "pointer" }}
                >
                  Demo Fill
                </button>
              </div>
            </div>
            
            <form onSubmit={handleLaunchCampaign} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ color: text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Campaign Name</label>
                <input 
                  value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Q3 Term Insurance Push" required
                  style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${border}`, borderRadius: 10, color: text, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ color: text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Marketing Channel</label>
                <select 
                  value={formChannel} onChange={(e) => setFormChannel(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${border}`, borderRadius: 10, color: text, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                >
                  {["WhatsApp", "SMS", "Email", "LinkedIn", "Digital Ads"].map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: text, fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Budget / Cost (₹)</label>
                <input 
                  value={formCost} onChange={(e) => setFormCost(e.target.value)}
                  placeholder="e.g., ₹25K or ₹1.2L" required
                  style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${border}`, borderRadius: 10, color: text, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "10px 14px", background: "none", border: `1px solid ${border}`, borderRadius: 10, color: text, fontSize: 13, cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={loading}
                  style={{ flex: 1, padding: "10px 14px", background: "linear-gradient(135deg, #6366F1, #3B82F6)", border: "none", borderRadius: 10, color: "white", fontSize: 13, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Launch Now</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
