import { useState, useRef, useEffect } from "react";
import { Bot, Send, Mic, Lightbulb, Sparkles, RefreshCw, Download, Share2, Volume2, VolumeX, Loader2, X, Zap } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useIsMobile } from "../../hooks/useIsMobile";
import { speakText } from "../../utils/voice";

const suggestions = [
  "Why did revenue decrease last month?",
  "Show top performing branches",
  "Predict renewals for next quarter",
  "Generate MIS report for July",
  "Compare this month with last month",
  "Which agents need performance review?",
  "Show claims trend for Health Insurance",
  "What is the brokerage pending summary?",
];

const revenueData = [
  { month: "Mar", current: 18.4, previous: 16.2 },
  { month: "Apr", current: 21.2, previous: 18.8 },
  { month: "May", current: 19.8, previous: 20.1 },
  { month: "Jun", current: 23.5, previous: 19.4 },
  { month: "Jul", current: 22.1, previous: 21.5 },
];

const branchRankData = [
  { name: "Mumbai", value: 82 },
  { name: "Delhi", value: 74 },
  { name: "Bengaluru", value: 68 },
  { name: "Chennai", value: 55 },
  { name: "Pune", value: 48 },
];

type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
  chart?: "revenue" | "branches" | null;
  table?: boolean;
  insights?: string[];
  timestamp: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    content: "Good morning, Raj! I'm your AI Insurance Intelligence Copilot. I can analyze your data, generate reports, predict trends, and recommend actions. What would you like to explore today?",
    timestamp: "09:00 AM",
  },
];

function AIResponseCard({ 
  msg, 
  dark, 
  speakingMsgId, 
  speakMessage 
}: { 
  msg: Message; 
  dark: boolean; 
  speakingMsgId: number | null; 
  speakMessage: (id: number, text: string) => void; }) {
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const isSpeaking = speakingMsgId === msg.id;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "linear-gradient(135deg, var(--primary), var(--chart-5))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(99,102,241,0.2)",
        }}
      >
        <Bot size={18} color="white" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            background: "var(--card)",
            border: `1px solid ${border}`,
            borderRadius: "4px 18px 18px 18px",
            padding: "16px 18px",
            boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.02)",
          }}
        >
          <p style={{ color: text, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{msg.content}</p>

          {msg.chart === "revenue" && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: text, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
                Revenue Comparison — Current vs Previous Period
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: `1px solid ${border}`,
                      borderRadius: 10,
                      color: text,
                    }}
                  />
                  <Bar dataKey="current" name="Current" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="previous" name="Previous" fill={dark ? "#1F2937" : "#CBD5E1"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {msg.chart === "branches" && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: text, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
                Branch Revenue Ranking (₹L)
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={branchRankData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#E2E8F0"} horizontal={false} />
                  <XAxis type="number" tick={{ fill: subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: subtext, fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: `1px solid ${border}`,
                      borderRadius: 10,
                      color: text,
                    }}
                  />
                  <Bar dataKey="value" fill="#10B981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {msg.table && (
            <div style={{ marginTop: 16, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 400 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${border}` }}>
                    {["Month", "Premium (₹Cr)", "Brokerage (₹L)", "Policies", "Growth"].map((h) => (
                      <th key={h} style={{ padding: "8px 12px", color: subtext, textAlign: "left", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["May 2025", "19.8", "19.8", "1,180", "-6.6%"],
                    ["Jun 2025", "23.5", "23.5", "1,320", "+18.7%"],
                    ["Jul 2025", "22.1", "22.1", "1,428", "-5.9%"],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: "10px 12px", color: j === 4 ? (cell.startsWith("+") ? "#10B981" : "#EF4444") : text, fontWeight: j === 4 ? 600 : 400 }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {msg.insights && msg.insights.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ color: subtext, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, marginBottom: 4 }}>
                KEY INSIGHTS
              </div>
              {msg.insights.map((ins, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "8px 12px",
                    background: "var(--accent)",
                    borderRadius: 8,
                    border: `1px solid ${border}`,
                  }}
                >
                  <Lightbulb size={13} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: text, fontSize: 13, fontWeight: 500 }}>{ins}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {[
              { icon: Download, label: "Export", onClick: () => alert("Exported successfully.") },
              { icon: Share2, label: "Share", onClick: () => alert("Shared successfully.") },
              { icon: RefreshCw, label: "Regenerate", onClick: () => alert("Regenerating response...") },
              { 
                icon: isSpeaking ? VolumeX : Volume2, 
                label: isSpeaking ? "Stop" : "Read Aloud", 
                onClick: () => speakMessage(msg.id, msg.content),
                highlight: isSpeaking
              },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  background: btn.highlight ? "rgba(99,102,241,0.15)" : "var(--secondary)",
                  border: `1px solid ${btn.highlight ? "var(--primary)" : border}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  color: btn.highlight ? "var(--primary)" : subtext,
                  fontSize: 12,
                  fontWeight: 600,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => { 
                  if (!btn.highlight) (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)"; 
                }}
                onMouseLeave={(e) => { 
                  if (!btn.highlight) (e.currentTarget as HTMLButtonElement).style.background = "var(--secondary)"; 
                }}
              >
                <btn.icon size={12} />
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ color: subtext, fontSize: 11, marginTop: 4, paddingLeft: 4, fontWeight: 500 }}>{msg.timestamp}</div>
      </div>
    </div>
  );
}

export function AICopilot({ dark }: { dark: boolean }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isMobile = useIsMobile();
  const autoSpeakRef = useRef(autoSpeak);

  const border = "var(--border)";
  const bg = "var(--card)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keep ref in sync
  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
  }, [autoSpeak]);

  // Simulated Voice Command Typing
  const handleSimulateVoice = (phrase: string) => {
    setShowVoiceMenu(false);
    setIsListening(true);
    setInput("");
    
    let currentText = "";
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < phrase.length) {
        currentText += phrase[index];
        setInput(currentText);
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setIsListening(false);
          sendMessage(phrase);
        }, 600);
      }
    }, 25); // Typing speed
  };

  // Handle Real Speech-to-Text (Voice Dictation)
  const startRealListening = () => {
    setShowVoiceMenu(false);
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
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    rec.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const toggleVoiceMenu = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setShowVoiceMenu(!showVoiceMenu);
    }
  };

  // Handle Text-to-Speech (Read Aloud)
  const speakMessage = (id: number, textToSpeak: string) => {
    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(id);
      speakText(
        textToSpeak,
        () => setSpeakingMsgId(id),
        () => setSpeakingMsgId(null),
        () => setSpeakingMsgId(null)
      );
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const generateResponse = (query: string): Message => {
    const q = query.toLowerCase();
    let content = "";
    let chart: "revenue" | "branches" | null = null;
    let table = false;
    let insights: string[] = [];

    if (q.includes("revenue") || q.includes("decrease") || q.includes("compare")) {
      content = "I've analyzed your revenue data for the past 5 months. Here's a comparison between the current and previous periods. June showed the strongest growth at +21%, while July saw a slight dip.";
      chart = "revenue";
      insights = [
        "Health Insurance drove 38% of total revenue in Jul",
        "Motor Insurance premium declined 8.4% from Jun to Jul",
        "Corporate segment showed steady 6% growth",
        "Revenue recovery expected in Aug based on pipeline",
      ];
    } else if (q.includes("branch") || q.includes("branches")) {
      content = "Here's the branch performance ranking for the current month. Mumbai continues to lead, while Pune needs immediate attention — it's 26% below target.";
      chart = "branches";
      insights = [
        "Mumbai exceeded target by ₹2L — best performing branch",
        "Pune is ₹17L below target — intervention needed",
        "Delhi on track but missed target by 5%",
      ];
    } else if (q.includes("mis") || q.includes("report") || q.includes("compare")) {
      content = "Here's the Monthly Insurance Summary (MIS) for July 2025. All key metrics are compiled below.";
      table = true;
      insights = [
        "Total premium collected this month: ₹22.1 Cr",
        "Brokerage earned: ₹22.1L (collection efficiency 91%)",
        "Policy issuance up 8% from June",
      ];
    } else if (q.includes("renewal") || q.includes("predict")) {
      content = "Based on AI prediction models, here's the renewal forecast for Q3 2025. My analysis suggests 847 renewals are due, with 68% expected to convert.";
      insights = [
        "High-risk segment: 47 customers with low engagement",
        "Health policies have 82% renewal probability",
        "Motor policies — 71% renewal probability",
        "Priority call list generated: 32 customers",
        "Recommend SMS+WhatsApp campaign for 230 at-risk renewals",
      ];
    } else if (q.includes("agent")) {
      content = "I've analyzed agent performance for July. Here are key findings and recommendations for your team.";
      insights = [
        "Aakash Gupta is top performer with 42 policies (₹18.4L)",
        "3 agents below 70% target — training recommended",
        "New POSP onboarding this month: 12 agents",
        "Average policy per agent: 28.4 this month",
      ];
    } else {
      content = "I've analyzed the relevant data for your query. Based on your insurance portfolio data, here are the key insights and recommended actions for your team.";
      insights = [
        "Overall business performance is 14% above last month",
        "Health Insurance remains the highest revenue segment",
        "Mumbai branch is the top performer this quarter",
        "Brokerage collection efficiency stands at 91%",
      ];
    }

    return {
      id: Date.now(),
      role: "ai",
      content,
      chart,
      table,
      insights,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const sendMessage = (textVal?: string) => {
    const q = textVal || input.trim();
    if (!q) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      const response = generateResponse(q);
      setMessages((prev) => [...prev, response]);
      setLoading(false);
      
      // Auto speak if enabled
      if (autoSpeakRef.current) {
        speakMessage(response.id, response.content);
      }
    }, 1200);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "calc(100vh - 100px)" : "calc(100vh - 130px)",
        background: "var(--background)",
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${border}`,
        boxShadow: dark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.02)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--chart-5) 100%)",
          padding: isMobile ? "12px 16px" : "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 4px 12px rgba(99,102,241,0.12)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: isMobile ? 36 : 40,
            height: isMobile ? 36 : 40,
            borderRadius: 12,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bot size={isMobile ? 18 : 22} color="white" />
        </div>
        <div>
          <div style={{ color: "white", fontWeight: 800, fontSize: isMobile ? 14 : 16, letterSpacing: "-0.3px" }}>Livlong AI Copilot</div>
          {!isMobile && <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 500 }}>
            <span style={{ color: "#6EE7B7" }}>●</span> Online — Powered by LLM + Insurance Intelligence Engine
          </div>}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          {/* Auto Speak Toggle Button */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            style={{
              padding: isMobile ? "5px 10px" : "6px 14px",
              background: autoSpeak ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.15)",
              border: `1px solid ${autoSpeak ? "#10B981" : "rgba(255,255,255,0.2)"}`,
              borderRadius: 8,
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s"
            }}
          >
            {autoSpeak ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span style={{ display: isMobile ? "none" : "inline" }}>{autoSpeak ? "Voice: Auto" : "Voice: Off"}</span>
          </button>

          {["New Chat", "History"].slice(0, isMobile ? 1 : 2).map((btn) => (
            <button
              key={btn}
              style={{
                padding: isMobile ? "5px 10px" : "6px 14px",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "20px" }}>
        {messages.map((msg) =>
          msg.role === "ai" ? (
            <AIResponseCard 
              key={msg.id} 
              msg={msg} 
              dark={dark} 
              speakingMsgId={speakingMsgId}
              speakMessage={speakMessage}
            />
          ) : (
            <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
              <div style={{ maxWidth: isMobile ? "85%" : "70%" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--chart-5) 100%)",
                    color: "white",
                    padding: "12px 16px",
                    borderRadius: "18px 4px 18px 18px",
                    fontSize: 14,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    boxShadow: "0 4px 12px rgba(99,102,241,0.12)",
                  }}
                >
                  {msg.content}
                </div>
                <div style={{ color: subtext, fontSize: 11, marginTop: 4, textAlign: "right", fontWeight: 500 }}>{msg.timestamp}</div>
              </div>
            </div>
          )
        )}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--primary), var(--chart-5))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot size={18} color="white" />
            </div>
            <div
              style={{
                background: "var(--card)",
                border: `1px solid ${border}`,
                borderRadius: "4px 18px 18px 18px",
                padding: "16px 20px",
                display: "flex",
                gap: 6,
                alignItems: "center",
                boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.02)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{ padding: isMobile ? "0 12px 12px" : "0 20px 12px", display: "flex", gap: 8, flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {suggestions.slice(0, isMobile ? 3 : 5).map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              background: "var(--card)",
              border: `1px solid ${border}`,
              borderRadius: 20,
              cursor: "pointer",
              color: text,
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--card)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = border;
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Simulated Voice Command Dropdown Popover */}
      {showVoiceMenu && (
        <div style={{
          position: "absolute",
          bottom: "64px",
          right: isMobile ? "12px" : "16px",
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 16,
          padding: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          width: isMobile ? "calc(100% - 24px)" : "290px",
          zIndex: 100
        }}>
          <div style={{ color: text, fontSize: 13, fontWeight: 800, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Voice Command Menu</span>
            <button onClick={() => setShowVoiceMenu(false)} style={{ background: "none", border: "none", color: subtext, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <X size={14} />
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Real Mic option */}
            <button
              onClick={startRealListening}
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
              <span>Use Live Microphone</span>
            </button>

            <div style={{ height: "1px", background: border, margin: "4px 0" }} />
            <div style={{ color: subtext, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 2 }}>Simulate Voice command</div>

            {[
              "Compare revenue this month with last month",
              "Show top performing branches in India",
              "Predict renewals for the next quarter",
              "Which agents need performance review?",
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleSimulateVoice(cmd)}
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  background: inputBg,
                  border: `1px solid ${border}`,
                  borderRadius: 8,
                  color: text,
                  fontSize: 11,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; }}
              >
                <Zap size={10} color="var(--primary)" />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{cmd}"</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div
        style={{
          padding: isMobile ? "10px 12px" : "12px 16px",
          borderTop: `1px solid ${border}`,
          background: "var(--card)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "var(--input-background)",
            border: `1px solid ${border}`,
            borderRadius: 14,
            padding: isMobile ? "8px 12px" : "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Sparkles size={isMobile ? 14 : 16} color="var(--primary)" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isListening ? "Listening... Speak now" : "Ask anything about your insurance business..."}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              color: text,
              fontSize: isMobile ? 13 : 14,
            }}
          />
          <button
            onClick={toggleVoiceMenu}
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              borderRadius: "50%",
              backgroundColor: isListening ? "rgba(239,68,68,0.15)" : "transparent",
              color: isListening ? "#EF4444" : subtext,
              transition: "all 0.2s",
              boxShadow: isListening ? "0 0 8px rgba(239,68,68,0.4)" : "none",
            }}
          >
            <Mic size={isMobile ? 16 : 18} />
          </button>
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          style={{
            width: isMobile ? 40 : 44,
            height: isMobile ? 40 : 44,
            borderRadius: 12,
            background: "linear-gradient(135deg, var(--primary) 0%, var(--chart-5) 100%)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
            flexShrink: 0,
          }}
        >
          <Send size={18} color="white" />
        </button>
      </div>
    </div>
  );
}
