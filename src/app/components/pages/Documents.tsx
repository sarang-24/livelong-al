import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, X, Bot, Eye, Download, Activity, Coins, BarChart3, Loader2, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const initialDocs = [
  {
    id: "DOC-2841",
    name: "Policy_StarHealth_HI22841.pdf",
    type: "Policy PDF",
    size: "2.4 MB",
    status: "Verified",
    confidence: 98,
    extracted: {
      policyNumber: "HI-22841",
      customerName: "Rajesh Pillai",
      premium: "₹48,000",
      insurer: "Star Health",
      validFrom: "Jul 1, 2025",
      validTo: "Jun 30, 2026",
    },
    missingFields: [],
  },
  {
    id: "DOC-2842",
    name: "Claim_CNF9821_Apollo.pdf",
    type: "Claim PDF",
    size: "1.8 MB",
    status: "Partial",
    confidence: 82,
    extracted: {
      claimNumber: "CNF-9821",
      customerName: "Aditya Kumar",
      claimAmount: "₹1.8L",
      hospital: "Apollo Hospital",
      admitDate: "Jul 8, 2025",
    },
    missingFields: ["Discharge Date", "Doctor Certificate"],
  },
  {
    id: "DOC-2843",
    name: "Commission_ICICI_July2025.pdf",
    type: "Commission Statement",
    size: "856 KB",
    status: "Verified",
    confidence: 96,
    extracted: {
      insurer: "ICICI Lombard",
      period: "Jul 2025",
      totalCommission: "₹5.1L",
      policies: "142",
    },
    missingFields: [],
  },
  {
    id: "DOC-2844",
    name: "Invoice_HDFC_Ergo_Jun2025.pdf",
    type: "Invoice",
    size: "420 KB",
    status: "Review",
    confidence: 71,
    extracted: {
      invoiceNumber: "HDFC-INV-2025-06",
      amount: "₹4.0L",
      period: "Jun 2025",
    },
    missingFields: ["Policy List", "TDS Certificate"],
  },
];

const docTypes = [
  { type: "Policy PDF", icon: FileText, desc: "Extract policy number, premium, dates", color: "#6366F1" },
  { type: "Claim PDF", icon: Activity, desc: "Extract claim amount, hospital, status", color: "#10B981" },
  { type: "Invoice", icon: Coins, desc: "Extract invoice details and amounts", color: "#F59E0B" },
  { type: "Commission Statement", icon: BarChart3, desc: "Extract commission data and match", color: "#3B82F6" },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Verified: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
  Partial: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Review: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
};

export function Documents({ dark }: { dark: boolean }) {
  const isMobile = useIsMobile();
  const [dragging, setDragging] = useState(false);
  const [docsList, setDocsList] = useState(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState(initialDocs[0]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingAll, setProcessingAll] = useState(false);

  const bg = "var(--card)";
  const border = "var(--border)";
  const text = "var(--foreground)";
  const subtext = "var(--muted-foreground)";
  const inputBg = dark ? "#090D16" : "#F8FAFC";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);
  
  const simulateUpload = () => {
    if (uploading) return;
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc = {
              id: `DOC-${Math.floor(2845 + Math.random() * 1000)}`,
              name: `Uploaded_Invoice_${Math.floor(100 + Math.random() * 900)}_LIVLONG.pdf`,
              type: "Invoice",
              size: "640 KB",
              status: "Verified",
              confidence: 94,
              extracted: {
                invoiceNumber: `INV-${Math.floor(202500 + Math.random() * 10000)}`,
                amount: "₹1.25L",
                period: "Jul 2025",
                insurer: "Star Health",
              },
              missingFields: [],
            };
            setDocsList((prevList) => [newDoc, ...prevList]);
            setSelectedDoc(newDoc);
            setUploading(false);
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    simulateUpload();
  };

  const handleProcessAll = () => {
    if (processingAll) return;
    setProcessingAll(true);
    setTimeout(() => {
      setDocsList((prev) => 
        prev.map((doc) => ({
          ...doc,
          status: "Verified",
          confidence: Math.max(doc.confidence, 95),
          missingFields: []
        }))
      );
      setSelectedDoc((prev) => ({
        ...prev,
        status: "Verified",
        confidence: Math.max(prev.confidence, 95),
        missingFields: []
      }));
      setProcessingAll(false);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: 0 }}>Document Intelligence</h2>
        <p style={{ color: subtext, fontSize: 13, margin: "4px 0 0 0" }}>AI-powered document processing & data extraction</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={simulateUpload}
        style={{
          background: dragging
            ? "rgba(99,102,241,0.08)"
            : dark ? "#090D16" : "#F8FAFC",
          borderRadius: 18,
          border: `2px dashed ${dragging ? "#6366F1" : dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
          padding: isMobile ? "24px 16px" : "40px 24px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {uploading ? (
          <div style={{ padding: "20px 0" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Loader2 size={36} color="#6366F1" className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
              <div style={{ color: text, fontWeight: 700, fontSize: 16 }}>Uploading & Extracting Data...</div>
              <div style={{ width: "240px", height: 6, background: dark ? "#1E293B" : "#E2E8F0", borderRadius: 3, overflow: "hidden", marginTop: 8 }}>
                <div style={{ width: `${uploadProgress}%`, height: "100%", background: "var(--accent)", transition: "width 0.2s" }} />
              </div>
              <div style={{ color: subtext, fontSize: 12 }}>{uploadProgress}% processed</div>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #6366F1, #3B82F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
              }}
            >
              <Upload size={24} color="white" />
            </div>
            <div style={{ color: text, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              Drag & Drop Documents
            </div>
            <div style={{ color: subtext, fontSize: 14, marginBottom: 24 }}>
              or click to browse — PDF, PNG, JPG supported
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 12,
              flexWrap: "wrap"
            }}>
              {docTypes.map((dt) => {
                const DocTypeIcon = dt.icon;
                return (
                  <div
                    key={dt.type}
                    style={{
                      background: `${dt.color}15`,
                      border: `1px solid ${dt.color}30`,
                      borderRadius: 12,
                      padding: "12px 16px",
                      cursor: "pointer",
                      width: isMobile ? "100%" : "170px",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ 
                      width: 32, height: 32, borderRadius: 8, 
                      background: `${dt.color}20`, display: "flex", 
                      alignItems: "center", justifyContent: "center", marginBottom: 8
                    }}>
                      <DocTypeIcon size={16} color={dt.color} />
                    </div>
                    <div style={{ color: dt.color, fontSize: 12, fontWeight: 700 }}>{dt.type}</div>
                    <div style={{ color: subtext, fontSize: 10, marginTop: 4, lineHeight: 1.4 }}>{dt.desc}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* AI Processing Banner */}
      <div style={{ 
        background: "linear-gradient(135deg, #6366F1, #3B82F6)", 
        borderRadius: 18, 
        padding: "16px 20px", 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center", 
        gap: 14, 
        color: "white" 
      }}>
        <Bot size={24} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>AI Document Extraction Engine</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
            Powered by OCR + NLP · {docsList.length} documents processed · 98% average accuracy · {docsList.filter(d => d.status !== "Verified").length} require review
          </div>
        </div>
        <div style={{ 
          marginLeft: isMobile ? "0" : "auto", 
          marginTop: isMobile ? "10px" : "0",
          display: "flex", 
          gap: 10,
          width: isMobile ? "100%" : "auto"
        }}>
          <button 
            onClick={handleProcessAll}
            disabled={processingAll}
            style={{ 
              flex: isMobile ? 1 : "none",
              padding: "8px 16px", 
              background: "white", 
              border: "none",
              borderRadius: 8, 
              color: "#6366F1", 
              fontSize: 12, 
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6
            }}
          >
            {processingAll ? (
              <>
                <Loader2 size={12} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                <span>Processing...</span>
              </>
            ) : (
              <span>Process All</span>
            )}
          </button>
        </div>
      </div>

      {/* Document List + Preview */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "360px 1fr", 
        gap: 20 
      }}>
        {/* Document List */}
        <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}` }}>
            <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>Processed Documents</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {docsList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${border}`,
                  cursor: "pointer",
                  background: selectedDoc.id === doc.id ? (dark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)") : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (selectedDoc.id !== doc.id) (e.currentTarget as HTMLDivElement).style.background = inputBg;
                }}
                onMouseLeave={(e) => {
                  if (selectedDoc.id !== doc.id) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <FileText size={18} color="#6366F1" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: text, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {doc.name}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <span style={{ color: subtext, fontSize: 11 }}>{doc.type} · {doc.size}</span>
                      <span style={{ background: statusStyle[doc.status]?.bg, color: statusStyle[doc.status]?.color, padding: "1px 8px", borderRadius: 8, fontSize: 10, fontWeight: 600 }}>
                        {doc.status}
                      </span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ color: subtext, fontSize: 10 }}>Confidence</span>
                        <span style={{ color: text, fontSize: 10, fontWeight: 700 }}>{doc.confidence}%</span>
                      </div>
                      <div style={{ height: 4, background: dark ? "#1E293B" : "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${doc.confidence}%`, height: "100%", background: doc.confidence >= 90 ? "#10B981" : doc.confidence >= 75 ? "#F59E0B" : "#EF4444", borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Preview / Extracted Data */}
        <div style={{ background: bg, borderRadius: 18, border: `1px solid ${border}`, overflow: "hidden" }}>
          <div style={{ 
            padding: "14px 20px", 
            borderBottom: `1px solid ${border}`, 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between", 
            alignItems: isMobile ? "flex-start" : "center",
            gap: 12
          }}>
            <div>
              <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>{selectedDoc.name}</div>
              <div style={{ color: subtext, fontSize: 11, marginTop: 2 }}>{selectedDoc.type} · {selectedDoc.size}</div>
            </div>
            <div style={{ display: "flex", gap: 8, width: isMobile ? "100%" : "auto" }}>
              <button style={{ flex: isMobile ? 1 : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 14px", background: "rgba(99,102,241,0.1)", color: "#6366F1", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                <Eye size={13} /> Preview
              </button>
              <button style={{ flex: isMobile ? 1 : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 14px", background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                <Download size={13} /> Download
              </button>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            {/* Confidence Score */}
            <div style={{ background: dark ? "#090D16" : "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: selectedDoc.confidence >= 90 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", flexShrink: 0 }}>
                <div style={{ color: selectedDoc.confidence >= 90 ? "#10B981" : "#F59E0B", fontSize: 18, fontWeight: 900 }}>{selectedDoc.confidence}%</div>
              </div>
              <div>
                <div style={{ color: text, fontWeight: 700, fontSize: 14 }}>
                  {selectedDoc.confidence >= 90 ? "High Confidence Extraction" : "Medium Confidence — Review Required"}
                </div>
                <div style={{ color: subtext, fontSize: 12, marginTop: 2 }}>
                  AI extracted {Object.keys(selectedDoc.extracted).length} fields successfully
                </div>
              </div>
            </div>

            {/* Extracted Fields */}
            <div style={{ color: text, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Extracted Data</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {Object.entries(selectedDoc.extracted).map(([key, val]) => (
                <div key={key} style={{ background: dark ? "#090D16" : "#F8FAFC", borderRadius: 10, padding: "10px 14px", border: `1px solid ${border}` }}>
                  <div style={{ color: subtext, fontSize: 11, marginBottom: 4, textTransform: "capitalize" }}>
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div style={{ color: text, fontSize: 13, fontWeight: 700 }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Missing Fields */}
            {selectedDoc.missingFields.length > 0 && (
              <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: 12, padding: 14, border: "1px solid rgba(245,158,11,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <AlertTriangle size={16} color="#F59E0B" />
                  <div style={{ color: "#F59E0B", fontWeight: 700, fontSize: 13 }}>Missing Fields</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedDoc.missingFields.map((field) => (
                    <span key={field} style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", padding: "4px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedDoc.missingFields.length === 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10B981", background: "rgba(16,185,129,0.08)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(16,185,129,0.2)" }}>
                <CheckCircle2 size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>All required fields extracted successfully</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
