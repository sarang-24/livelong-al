import { useState, useRef, useEffect } from "react";
import { Search, Bell, Sun, Moon, Bot, ChevronDown, Settings, LogOut, User, Menu, Mic, X, Zap, Loader2, Volume2 } from "lucide-react";
import { type Page } from "../App";
import { useIsMobile } from "../hooks/useIsMobile";
import { speakText } from "../utils/voice";

interface TopNavProps {
  dark: boolean;
  setDark: (v: boolean) => void;
  activePage: Page;
  setActivePage: (page: Page) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}

const pageLabels: Record<Page, string> = {
  dashboard: "Executive Dashboard",
  copilot: "AI Copilot",
  leads: "Leads Intelligence",
  customers: "Customer 360",
  policies: "Policy Management",
  revenue: "Revenue Analytics",
  brokerage: "Brokerage Reconciliation",
  renewals: "Renewal Intelligence",
  claims: "Claims Dashboard",
  agents: "Agents & POSP",
  branches: "Branch Performance",
  products: "Product Analytics",
  marketing: "Marketing Intelligence",
  compliance: "Compliance Center",
  documents: "Document Intelligence",
  reports: "Reports Center",
  settings: "Settings",
};

export function TopNav({ dark, setDark, activePage, setActivePage, mobileMenuOpen, setMobileMenuOpen }: TopNavProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isSystemSpeaking, setIsSystemSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        setIsSystemSpeaking(window.speechSynthesis.speaking);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateCommand = (label: string, phrase: string, action: () => void) => {
    setIsListening(true);
    setStatusText(`Recognizing voice command...`);
    
    setTimeout(() => {
      setStatusText(`Voice command: "${label}"`);
      setTimeout(() => {
        action();
        setStatusText("");
        setIsListening(false);
        setShowVoiceMenu(false);
      }, 800);
    }, 1000);
  };

  const startLiveVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or Safari.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListening(true);
      setStatusText("Listening for command...");
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setStatusText(`Voice command: "${transcript}"`);
      
      setTimeout(() => {
        if (transcript.includes("copilot") || transcript.includes("ai")) {
          setActivePage("copilot");
        } else if (transcript.includes("approve") && (transcript.includes("claim") || transcript.includes("claims"))) {
          setActivePage("claims");
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("trigger-approve-claims"));
          }, 300);
        } else if (transcript.includes("reconcile") || transcript.includes("reconciliation")) {
          setActivePage("brokerage");
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("trigger-reconciliation"));
          }, 300);
        } else if (transcript.includes("launch") || (transcript.includes("marketing") && transcript.includes("campaign"))) {
          setActivePage("marketing");
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("trigger-launch-campaign"));
          }, 300);
        } else if (transcript.includes("inspect") && (transcript.includes("branch") || transcript.includes("mumbai") || transcript.includes("delhi") || transcript.includes("bengaluru") || transcript.includes("chennai") || transcript.includes("pune") || transcript.includes("hyderabad") || transcript.includes("kolkata") || transcript.includes("ahmedabad"))) {
          setActivePage("branches");
          let branch = "mumbai";
          if (transcript.includes("delhi")) branch = "delhi";
          else if (transcript.includes("bengaluru") || transcript.includes("bangalore")) branch = "bengaluru";
          else if (transcript.includes("chennai")) branch = "chennai";
          else if (transcript.includes("hyderabad")) branch = "hyderabad";
          else if (transcript.includes("pune")) branch = "pune";
          else if (transcript.includes("kolkata")) branch = "kolkata";
          else if (transcript.includes("ahmedabad")) branch = "ahmedabad";
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("trigger-branch-inspection", { detail: { branch } }));
          }, 300);
        } else if (transcript.includes("inspect") && (transcript.includes("agent") || transcript.includes("posp") || transcript.includes("rahul") || transcript.includes("priya") || transcript.includes("amit") || transcript.includes("sneha") || transcript.includes("vikram"))) {
          setActivePage("agents");
          let agentId = "AG-001";
          if (transcript.includes("priya")) agentId = "AG-002";
          else if (transcript.includes("amit")) agentId = "AG-003";
          else if (transcript.includes("sneha")) agentId = "AG-004";
          else if (transcript.includes("vikram")) agentId = "AG-005";
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("trigger-agent-inspection", { detail: { agentId } }));
          }, 300);
        } else if (transcript.includes("customer") || transcript.includes("customers") || transcript.includes("custome")) {
          setActivePage("customers");
        } else if (transcript.includes("report") || transcript.includes("reports")) {
          setActivePage("reports");
          if (transcript.includes("generate")) {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("trigger-report-generation", { detail: { id: "daily-mis" } }));
            }, 300);
          }
        } else if (transcript.includes("generate")) {
          setActivePage("reports");
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("trigger-report-generation", { detail: { id: "daily-mis" } }));
          }, 300);
        } else if (transcript.includes("dashboard")) {
          setActivePage("dashboard");
        } else if (transcript.includes("revenue")) {
          setActivePage("revenue");
        } else if (transcript.includes("setting") || transcript.includes("settings")) {
          setActivePage("settings");
        } else {
          alert(`Command "${transcript}" not recognized. Try "approve high-risk claims" or "inspect Mumbai branch".`);
        }
        setStatusText("");
        setIsListening(false);
        setShowVoiceMenu(false);
      }, 1000);
    };

    rec.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setStatusText("");
    };

    rec.onend = () => {
      setIsListening(false);
      setStatusText("");
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handlePageTour = () => {
    if (isSystemSpeaking) {
      window.speechSynthesis.cancel();
      setIsSystemSpeaking(false);
      return;
    }

    const tourScripts: Record<Page, string> = {
      dashboard: "Welcome to your executive dashboard. Your total premium is four point eight Crore rupees, and Mumbai is the top performing branch with eighty-two Lakhs. There are forty-seven high-risk renewals requiring attention.",
      copilot: "This is the AI Copilot. You can speak directly to me or use the text box to analyze policies, draft customer responses, or query business intelligence.",
      leads: "This is the Leads Intelligence panel, showing hot leads, conversion percentages, and target recommendations generated by our AI models.",
      customers: "This is the Customer 360 view. You have one thousand two hundred active clients with a ninety-two percent retention rate. The high-value segment is currently leading.",
      policies: "Welcome to Policy Management. Here you can browse active policies, review coverage details, and inspect premium calculations.",
      revenue: "This is the Revenue Analytics dashboard, displaying premiums, commissions, and expense ratios. Net profit is currently at fifteen point four percent.",
      brokerage: "This is the Brokerage Reconciliation module. You have reconciled three point eight Crores. A gap of five point two Lakhs is currently pending reconciliation.",
      renewals: "This is the Renewal Intelligence panel, highlighting policies up for renewal. Your current retention rate is ninety-two percent.",
      claims: "This is the Claims Center. There are twenty-four active claims, with two high-risk cases flagged for potential fraud. Average processing time is four point two days.",
      agents: "Welcome to the Agents leaderboard. It ranks sixty-seven POSPs across India. You can select any agent to view their radar performance analysis.",
      branches: "This is the Branch Performance analytics. It shows ranking, revenue, and conversion rates across eight cities. Mumbai ranks number one.",
      products: "This is the Product Analytics panel. Health insurance accounts for forty-two percent of total policies, followed closely by Motor and Life.",
      marketing: "This is the Marketing Intelligence center. Your active campaigns are running on WhatsApp and Email. Average cost per lead is forty-two rupees.",
      compliance: "This is the Compliance Center. All regulatory filings are currently green. Audit score is ninety-eight percent.",
      documents: "Welcome to Document Intelligence. Upload policy documents or invoices here, and the AI will extract and parse structured data automatically.",
      reports: "This is the Reports Center. You can generate custom daily, monthly, or quarterly MIS reports with a single click or voice command.",
      settings: "This is the Settings panel, where you can manage security parameters, toggle API integrations, and update your team roster.",
    };

    const textToSpeak = tourScripts[activePage] || "Welcome to Livlong AI Insurance Platform.";
    speakText(
      textToSpeak, 
      () => setIsSystemSpeaking(true), 
      () => setIsSystemSpeaking(false), 
      () => setIsSystemSpeaking(false)
    );
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const notifications = [
    { id: 1, msg: "47 renewals at high risk this week", time: "2m ago", color: "#EF4444", dot: true },
    { id: 2, msg: "Mumbai branch exceeded monthly target", time: "15m ago", color: "#10B981", dot: false },
    { id: 3, msg: "New claim filed - Aditya Kumar", time: "1h ago", color: "#F59E0B", dot: false },
    { id: 4, msg: "Commission reconciliation pending ₹6.3L", time: "3h ago", color: "#6366F1", dot: false },
  ];

  return (
    <div
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "0 16px" : "0 24px",
        height: 64,
        gap: 16,
        boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 1px 12px rgba(0,0,0,0.03)",
        position: "relative",
        zIndex: 100,
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--input-background)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginRight: 4,
          }}
        >
          <Menu size={18} color="var(--muted-foreground)" />
        </button>
      )}

      {/* Page title */}
      <div style={{ minWidth: isMobile ? 0 : 200, flex: 1 }}>
        <div style={{ color: "var(--foreground)", fontSize: isMobile ? 15 : 17, fontWeight: 800, letterSpacing: "-0.5px" }}>
          {pageLabels[activePage]}
        </div>
        {!isMobile && <div style={{ color: "var(--muted-foreground)", fontSize: 11, fontWeight: 500 }}>Livlong AI Insurance Platform</div>}
      </div>

      {/* Search - hide on mobile */}
      {!isMobile && (
        <div style={{ flex: 1, maxWidth: 480 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--input-background)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "8px 14px",
            }}
          >
            <Search size={15} color="var(--muted-foreground)" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers, policies, leads..."
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                color: "var(--foreground)",
                fontSize: 13,
                width: "100%",
              }}
            />
            <kbd
              style={{
                background: "var(--secondary)",
                color: "var(--muted-foreground)",
                fontSize: 10,
                padding: "2px 6px",
                borderRadius: 4,
                fontFamily: "monospace",
                fontWeight: 600,
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      <div style={{ flex: isMobile ? 1 : 0 }} />

      {/* AI Copilot Button - hide on mobile */}
      {!isMobile && (
        <button
          onClick={() => setActivePage("copilot")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, var(--primary), var(--chart-5))",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(99,102,241,0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(99,102,241,0.25)";
          }}
        >
          <Bot size={15} />
          AI Copilot
        </button>
      )}

      {/* Notifications */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setShowVoiceMenu(false); }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--input-background)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <Bell size={17} color="var(--muted-foreground)" />
          <div
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#EF4444",
              border: "2px solid var(--card)",
            }}
          />
        </button>
        {notifOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 46,
              width: 340,
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14 }}>Notifications</div>
              <div style={{ color: "var(--muted-foreground)", fontSize: 12 }}>4 unread alerts</div>
            </div>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ color: "var(--foreground)", fontSize: 13, lineHeight: 1.4 }}>{n.msg}</div>
                  <div style={{ color: "var(--muted-foreground)", fontSize: 11, marginTop: 2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "var(--input-background)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {dark ? <Sun size={17} color="#FFD700" /> : <Moon size={17} color="var(--muted-foreground)" />}
      </button>

      {/* Global Stop Speaking Button */}
      {isSystemSpeaking && (
        <button
          onClick={() => {
            window.speechSynthesis.cancel();
            setIsSystemSpeaking(false);
          }}
          title="Stop AI Voice"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 10,
            padding: "0 10px",
            height: 38,
            cursor: "pointer",
            color: "#EF4444",
            fontSize: 11,
            fontWeight: 700,
            animation: "pulse 1.5s infinite",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
        >
          <div style={{ width: 8, height: 8, background: "#EF4444", borderRadius: 2 }} />
          <span>Stop Voice</span>
        </button>
      )}

      {/* AI Tour Guide Button */}
      <button
        onClick={handlePageTour}
        title={isSystemSpeaking ? "Stop AI Tour" : "Start AI Page Tour"}
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: isSystemSpeaking ? "rgba(239,68,68,0.1)" : "var(--input-background)",
          border: `1px solid ${isSystemSpeaking ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: isSystemSpeaking ? "#EF4444" : "var(--primary)",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = isSystemSpeaking ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.1)";
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = isSystemSpeaking ? "rgba(239,68,68,0.1)" : "var(--input-background)";
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        <Volume2 size={17} className={isSystemSpeaking ? "animate-pulse" : ""} />
      </button>

      {/* Global Voice Command Toggle */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setShowVoiceMenu(!showVoiceMenu); setProfileOpen(false); setNotifOpen(false); }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: showVoiceMenu ? "rgba(99,102,241,0.15)" : "var(--input-background)",
            border: `1px solid ${showVoiceMenu ? "var(--primary)" : "var(--border)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            color: showVoiceMenu ? "var(--primary)" : "var(--muted-foreground)",
            transition: "all 0.2s ease"
          }}
        >
          {isListening ? (
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "#EF4444",
              animation: "pulse 1s infinite"
            }} />
          ) : (
            <Mic size={17} />
          )}
        </button>

        {showVoiceMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 46,
              width: 300,
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              zIndex: 1000,
              padding: 14,
            }}
          >
            <div style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 14, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Mic size={14} color="var(--primary)" />
                Global Voice Assistant
              </span>
              <button onClick={() => setShowVoiceMenu(false)} style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Live Mic Action */}
              <button
                onClick={startLiveVoice}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--chart-5) 100%)",
                  border: "none",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 10px rgba(99,102,241,0.2)"
                }}
              >
                <Mic size={14} color="white" />
                <span>Speak Command Now</span>
              </button>

              <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />
              <div style={{ color: "var(--muted-foreground)", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 2 }}>Simulate Voice command</div>

              {[
                { label: "Go to AI Copilot", phrase: "go to ai copilot", action: () => { setActivePage("copilot"); } },
                { label: "Go to Customer 360", phrase: "go to customers", action: () => { setActivePage("customers"); } },
                { 
                  label: "Approve High-Risk Claims", 
                  phrase: "approve high risk claims", 
                  action: () => { 
                    setActivePage("claims"); 
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("trigger-approve-claims"));
                    }, 300);
                  } 
                },
                { 
                  label: "Reconcile Brokerage Statement", 
                  phrase: "reconcile statements", 
                  action: () => { 
                    setActivePage("brokerage"); 
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("trigger-reconciliation"));
                    }, 300);
                  } 
                },
                { 
                  label: "Launch Health Campaign", 
                  phrase: "launch health campaign", 
                  action: () => { 
                    setActivePage("marketing"); 
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("trigger-launch-campaign"));
                    }, 300);
                  } 
                },
                { 
                  label: "Inspect Mumbai Branch", 
                  phrase: "inspect mumbai branch", 
                  action: () => { 
                    setActivePage("branches"); 
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("trigger-branch-inspection", { detail: { branch: "mumbai" } }));
                    }, 300);
                  } 
                },
                { 
                  label: "Inspect Agent Rahul", 
                  phrase: "inspect agent rahul", 
                  action: () => { 
                    setActivePage("agents"); 
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("trigger-agent-inspection", { detail: { agentId: "AG-001" } }));
                    }, 300);
                  } 
                },
                { 
                  label: "Generate Daily MIS Report", 
                  phrase: "generate daily mis report", 
                  action: () => { 
                    setActivePage("reports"); 
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("trigger-report-generation", { detail: { id: "daily-mis" } }));
                    }, 300);
                  } 
                },
              ].map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => handleSimulateCommand(cmd.label, cmd.phrase, cmd.action)}
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    background: "var(--input-background)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                    fontSize: 11,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <Zap size={10} color="var(--primary)" />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{cmd.label}"</span>
                </button>
              ))}
            </div>

            {/* Status bar */}
            {statusText && (
              <div style={{ 
                marginTop: 10, padding: "6px 10px", background: "var(--accent)", 
                borderRadius: 8, color: "var(--primary)", fontSize: 11, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6
              }}>
                <Loader2 size={12} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                <span>{statusText}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setShowVoiceMenu(false); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--input-background)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--chart-5))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            R
          </div>
          {!isMobile && <span style={{ color: "var(--foreground)", fontSize: 13, fontWeight: 600 }}>Raj Sharma</span>}
          {!isMobile && <ChevronDown size={13} color="var(--muted-foreground)" />}
        </button>
        {profileOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 46,
              width: 200,
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            {[
              { icon: User, label: "My Profile" },
              { icon: Settings, label: "Settings" },
              { icon: LogOut, label: "Sign Out" },
            ].map((item) => (
              <button
                key={item.label}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--foreground)",
                  fontSize: 13,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <item.icon size={15} color="var(--muted-foreground)" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
