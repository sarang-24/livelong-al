import { useState, useEffect } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, Key, Users, Bot, ChevronRight, Save, Check, Link2, Plus, Trash2, UserPlus, Loader2, Mic } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const settingsCategories = [
  { id: "profile", label: "Profile & Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Access", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Database },
  { id: "team", label: "Team Management", icon: Users },
  { id: "ai", label: "AI Configuration", icon: Bot },
];

const initialIntegrations = [
  { name: "WhatsApp Business", desc: "Send policy & renewal messages", connected: true, color: "#10B981" },
  { name: "Salesforce CRM", desc: "Sync lead and customer data", connected: false, color: "#2563EB" },
  { name: "Tally ERP", desc: "Accounting & finance sync", connected: true, color: "#6366F1" },
  { name: "IRCTC Portal", desc: "Travel insurance auto-link", connected: false, color: "#F59E0B" },
  { name: "Google Workspace", desc: "Calendar & email integration", connected: true, color: "#EF4444" },
  { name: "Razorpay", desc: "Payment collection gateway", connected: true, color: "#8B5CF6" },
];

const initialTeamMembers = [
  { name: "Raj Sharma", role: "Super Admin", status: "Active", lastLogin: "Just now" },
  { name: "Aakash Gupta", role: "Agent", status: "Active", lastLogin: "10 min ago" },
  { name: "Sunita Rao", role: "Agent", status: "Active", lastLogin: "1h ago" },
  { name: "Manish Kapoor", role: "Manager", status: "Active", lastLogin: "3h ago" },
  { name: "Deepika Sharma", role: "Agent", status: "Inactive", lastLogin: "2 days ago" },
];

export function Settings({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [intgList, setIntgList] = useState(initialIntegrations);
  const [teamList, setTeamList] = useState(initialTeamMembers);
  const [loadingIntg, setLoadingIntg] = useState<Record<string, boolean>>({});

  // Team form state
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Agent");

  const [isVoiceTeamFilling, setIsVoiceTeamFilling] = useState(false);
  const [voiceTeamStatus, setVoiceTeamStatus] = useState("");

  const startVoiceTeamFill = () => {
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
      setIsVoiceTeamFilling(true);
      setVoiceTeamStatus("Listening... (e.g., 'Aarav Mehta as Admin')");
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTeamStatus(`Heard: "${transcript}"`);
      
      let parsedName = "";
      let parsedRole = "Agent";

      const lower = transcript.toLowerCase();

      if (lower.includes("admin")) parsedRole = "Admin";
      else if (lower.includes("manager")) parsedRole = "Manager";
      else if (lower.includes("agent")) parsedRole = "Agent";

      let nameCandidate = transcript;
      const splitTerms = [" as ", " is ", " role ", " with "];
      for (const term of splitTerms) {
        const idx = nameCandidate.toLowerCase().indexOf(term);
        if (idx !== -1) {
          nameCandidate = nameCandidate.substring(0, idx);
        }
      }
      parsedName = nameCandidate.trim();

      if (parsedName) setNewMemberName(parsedName);
      setNewMemberRole(parsedRole);

      setTimeout(() => {
        setIsVoiceTeamFilling(false);
        setVoiceTeamStatus("");
      }, 1500);
    };

    rec.onerror = (event: any) => {
      console.error(event.error);
      setIsVoiceTeamFilling(false);
      setVoiceTeamStatus("Speech recognition error.");
      setTimeout(() => setVoiceTeamStatus(""), 2000);
    };

    rec.onend = () => {
      setIsVoiceTeamFilling(false);
    };

    rec.start();
  };

  const simulateVoiceTeamFill = () => {
    setIsVoiceTeamFilling(true);
    setVoiceTeamStatus("Simulating voice input...");
    setTimeout(() => {
      setVoiceTeamStatus('Voice input: "Aarav Mehta as Admin"');
      setTimeout(() => {
        setNewMemberName("Aarav Mehta");
        setNewMemberRole("Admin");
        setIsVoiceTeamFilling(false);
        setVoiceTeamStatus("");
      }, 1000);
    }, 1000);
  };

  const [toggles, setToggles] = useState({
    emailNotif: true,
    smsNotif: false,
    whatsappNotif: true,
    renewalAlerts: true,
    claimAlerts: true,
    reportAlerts: false,
    twoFactor: true,
    sessionTimeout: false,
    aiInsights: true,
    autoReport: true,
    predictive: true,
  });

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleIntegration = (name: string) => {
    setLoadingIntg((prev) => ({ ...prev, [name]: true }));
    setTimeout(() => {
      setIntgList((prev) =>
        prev.map((it) =>
          it.name === name ? { ...it, connected: !it.connected } : it
        )
      );
      setLoadingIntg((prev) => ({ ...prev, [name]: false }));
    }, 800);
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;
    const newMember = {
      name: newMemberName,
      role: newMemberRole,
      status: "Active",
      lastLogin: "Never"
    };
    setTeamList((prev) => [...prev, newMember]);
    setNewMemberName("");
  };

  const handleRemoveTeamMember = (name: string) => {
    setTeamList((prev) => prev.filter((m) => m.name !== name));
  };

  const Toggle = ({ id }: { id: keyof typeof toggles }) => (
    <div
      onClick={() => setToggles((prev) => ({ ...prev, [id]: !prev[id] }))}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: toggles[id] ? "#6366F1" : dark ? "#1E293B" : "#CBD5E1",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: 3,
          left: toggles[id] ? 23 : 3,
          transition: "left 0.2s",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case "profile":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "white", flexShrink: 0 }}>
                R
              </div>
              <div>
                <div style={{ color: text, fontSize: 18, fontWeight: 700 }}>Raj Sharma</div>
                <div style={{ color: subtext, fontSize: 13 }}>Super Administrator</div>
                <button style={{ marginTop: 8, padding: "6px 14px", background: "rgba(99,102,241,0.1)", color: "#6366F1", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                  Change Photo
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              {[
                { label: "Full Name", value: "Raj Sharma" },
                { label: "Email", value: "raj.sharma@livlong.com" },
                { label: "Phone", value: "+91 98765 43210" },
                { label: "Designation", value: "Managing Director" },
                { label: "Company", value: "Livlong Insurance Brokers Ltd." },
                { label: "IRDAI License No.", value: "IRDA/DB-614/2024" },
              ].map((field) => (
                <div key={field.label}>
                  <div style={{ color: subtext, fontSize: 12, marginBottom: 6, fontWeight: 500 }}>{field.label}</div>
                  <input
                    defaultValue={field.value}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: inputBg,
                      border: `1px solid ${border}`,
                      borderRadius: 10,
                      color: text,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { id: "emailNotif" as const, label: "Email Notifications", desc: "Receive important updates via email" },
              { id: "smsNotif" as const, label: "SMS Notifications", desc: "Get SMS alerts for critical events" },
              { id: "whatsappNotif" as const, label: "WhatsApp Notifications", desc: "Receive updates on WhatsApp" },
              { id: "renewalAlerts" as const, label: "Renewal Alerts", desc: "Get notified about upcoming renewals" },
              { id: "claimAlerts" as const, label: "Claims Alerts", desc: "Instant notifications for claim updates" },
              { id: "reportAlerts" as const, label: "Report Ready Alerts", desc: "Notify when AI reports are generated" },
            ].map((setting) => (
              <div key={setting.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${border}` }}>
                <div>
                  <div style={{ color: text, fontSize: 14, fontWeight: 600 }}>{setting.label}</div>
                  <div style={{ color: subtext, fontSize: 12, marginTop: 2 }}>{setting.desc}</div>
                </div>
                <Toggle id={setting.id} />
              </div>
            ))}
          </div>
        );

      case "integrations":
        return (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
            gap: 14 
          }}>
            {intgList.map((intg) => {
              const isLoading = loadingIntg[intg.name] || false;
              return (
                <div key={intg.name} style={{ background: inputBg, borderRadius: 14, padding: 16, border: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${intg.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Link2 size={20} color={intg.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: text, fontSize: 13, fontWeight: 700 }}>{intg.name}</div>
                    <div style={{ color: subtext, fontSize: 11, marginTop: 2 }}>{intg.desc}</div>
                  </div>
                  <div>
                    <button 
                      onClick={() => toggleIntegration(intg.name)}
                      disabled={isLoading}
                      style={{ 
                        padding: "6px 12px", 
                        background: isLoading 
                          ? "rgba(99,102,241,0.05)" 
                          : intg.connected 
                            ? "rgba(239,68,68,0.1)" 
                            : "rgba(16,185,129,0.1)", 
                        color: isLoading 
                          ? subtext 
                          : intg.connected 
                            ? "#EF4444" 
                            : "#10B981", 
                        border: `1px solid ${isLoading 
                          ? border 
                          : intg.connected 
                            ? "rgba(239,68,68,0.2)" 
                            : "rgba(16,185,129,0.2)"}`, 
                        borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: isLoading ? "default" : "pointer",
                        display: "flex", alignItems: "center", gap: 4
                      }}
                    >
                      {isLoading ? (
                        <Loader2 size={11} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                      ) : intg.connected ? (
                        <span>Disconnect</span>
                      ) : (
                        <span>Connect</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "team":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Voice Form Filler Panel */}
            <div style={{ 
              display: "flex", gap: 8, 
              background: dark ? "rgba(255,255,255,0.03)" : "#F8FAFC", 
              padding: 12, borderRadius: 14, border: `1px solid ${border}`, 
              alignItems: "center" 
            }}>
              <Mic size={16} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <div style={{ color: text, fontSize: 11, fontWeight: 700 }}>Voice Team Add</div>
                <div style={{ color: subtext, fontSize: 10 }}>{voiceTeamStatus || "Speak team details (e.g., 'Aarav Mehta as Admin') to auto-fill"}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={startVoiceTeamFill}
                  disabled={isVoiceTeamFilling}
                  style={{ padding: "4px 8px", background: "var(--primary)", border: "none", borderRadius: 6, color: "white", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                >
                  {isVoiceTeamFilling ? "Listening..." : "Speak"}
                </button>
                <button
                  type="button"
                  onClick={simulateVoiceTeamFill}
                  disabled={isVoiceTeamFilling}
                  style={{ padding: "4px 8px", background: "none", border: `1px solid ${border}`, borderRadius: 6, color: text, fontSize: 10, fontWeight: 600, cursor: "pointer" }}
                >
                  Demo Fill
                </button>
              </div>
            </div>

            {/* Add Team Member Form */}
            <form onSubmit={handleAddTeamMember} style={{ 
              display: "flex", 
              flexDirection: isMobile ? "column" : "row", 
              gap: 10,
              background: inputBg,
              padding: 16,
              borderRadius: 14,
              border: `1px solid ${border}`
            }}>
              <input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter new member's full name"
                required
                style={{ flex: 2, padding: "10px 14px", background: bg, border: `1px solid ${border}`, borderRadius: 10, color: text, fontSize: 13, outline: "none" }}
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", background: bg, border: `1px solid ${border}`, borderRadius: 10, color: text, fontSize: 13, outline: "none" }}
              >
                {["Agent", "Manager", "Admin"].map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <button 
                type="submit"
                style={{ 
                  padding: "10px 18px", background: "linear-gradient(135deg, #6366F1, #3B82F6)", 
                  border: "none", borderRadius: 10, color: "white", fontSize: 13, 
                  fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", 
                  justifyContent: "center", gap: 6
                }}
              >
                <UserPlus size={15} />
                <span>Add Member</span>
              </button>
            </form>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {["Member", "Role", "Status", "Last Login", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", color: subtext, fontSize: 11, fontWeight: 600, textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamList.map((m) => (
                    <tr key={m.name} style={{ borderBottom: `1px solid ${border}` }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>
                            {m.name[0]}
                          </div>
                          <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{m.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: subtext, fontSize: 12 }}>{m.role}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: m.status === "Active" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: m.status === "Active" ? "#10B981" : "#EF4444", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: subtext, fontSize: 12 }}>{m.lastLogin}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {m.role !== "Super Admin" ? (
                          <button 
                            onClick={() => handleRemoveTeamMember(m.name)}
                            style={{ 
                              padding: "6px", background: "none", border: "none", 
                              color: "#EF4444", cursor: "pointer", display: "flex", 
                              alignItems: "center", justifyContent: "center", borderRadius: 6
                            }}
                            title="Remove Member"
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : (
                          <span style={{ color: subtext, fontSize: 11 }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "ai":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "linear-gradient(135deg, #6366F1, #3B82F6)", borderRadius: 14, padding: 16, color: "white", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Bot size={18} color="white" />
                <div style={{ fontWeight: 700, fontSize: 14 }}>AI Configuration</div>
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Configure how the AI Copilot behaves across your platform
              </div>
            </div>
            {[
              { id: "aiInsights" as const, label: "AI Insights on Dashboard", desc: "Show AI-generated insights on all dashboards" },
              { id: "autoReport" as const, label: "Auto-generate Reports", desc: "Daily AI reports auto-generated at 8 AM" },
              { id: "predictive" as const, label: "Predictive Analytics", desc: "Enable renewal and revenue predictions" },
            ].map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${border}` }}>
                <div>
                  <div style={{ color: text, fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                  <div style={{ color: subtext, fontSize: 12, marginTop: 2 }}>{s.desc}</div>
                </div>
                <Toggle id={s.id} />
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div style={{ color: subtext, fontSize: 14, padding: 20, textAlign: "center" }}>
            Select a category to configure settings
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Settings</h2>
          <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>Configure your platform preferences</p>
        </div>
        <button
          onClick={handleSave}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
            background: saved ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, #6366F1, #3B82F6)",
            border: saved ? "1px solid rgba(16,185,129,0.4)" : "none",
            borderRadius: 10, color: saved ? "#10B981" : "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(99,102,241,0.2)"
          }}
        >
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", 
        gap: 20 
      }}>
        {/* Sidebar */}
        <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, padding: 12, height: "fit-content" }}>
          {settingsCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: activeCategory === cat.id ? (dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)") : "transparent",
                marginBottom: 2,
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat.id) (e.currentTarget as HTMLButtonElement).style.background = inputBg;
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat.id) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <cat.icon size={16} color={activeCategory === cat.id ? "#6366F1" : subtext} />
              <span style={{ color: activeCategory === cat.id ? "#6366F1" : text, fontSize: 13, fontWeight: activeCategory === cat.id ? 700 : 400 }}>
                {cat.label}
              </span>
              <ChevronRight size={13} color={subtext} style={{ marginLeft: "auto" }} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, padding: 24 }}>
          <div style={{ color: text, fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
            {settingsCategories.find((c) => c.id === activeCategory)?.label}
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
