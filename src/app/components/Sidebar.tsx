import { type Page } from "../App";
import {
  LayoutDashboard, Bot, Users, UserCheck, FileText, DollarSign,
  Briefcase, RefreshCw, AlertCircle, UserCog, Building2, Package,
  Megaphone, Shield, FolderOpen, BarChart3, Settings, ChevronLeft,
  ChevronRight, Zap, X
} from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  dark: boolean;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const navItems: { id: Page; label: string; icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "copilot", label: "AI Copilot", icon: Bot },
  { id: "leads", label: "Leads", icon: Zap },
  { id: "customers", label: "Customers", icon: UserCheck },
  { id: "policies", label: "Policies", icon: FileText },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "brokerage", label: "Brokerage", icon: Briefcase },
  { id: "renewals", label: "Renewals", icon: RefreshCw },
  { id: "claims", label: "Claims", icon: AlertCircle },
  { id: "agents", label: "Agents / POSP", icon: UserCog },
  { id: "branches", label: "Branches", icon: Building2 },
  { id: "products", label: "Products", icon: Package },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activePage, setActivePage, dark, collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const isMobile = useIsMobile();
  const width = collapsed ? 64 : 240;
  const sidebarWidth = isMobile ? (mobileOpen ? 280 : 0) : width;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
          }}
        />
      )}
      <div
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          background: "linear-gradient(180deg, var(--sidebar) 0%, #05070B 100%)",
          borderRight: "1px solid var(--sidebar-border)",
          display: "flex",
          flexDirection: "column",
          transition: isMobile ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" : "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: isMobile ? 1000 : 1,
          transform: isMobile && !mobileOpen ? "translateX(-100%)" : "translateX(0)",
          boxShadow: isMobile ? "10px 0 30px rgba(0,0,0,0.5)" : "none",
        }}
      >
      {/* Logo */}
      <div
        style={{
          padding: isMobile ? "20px" : (collapsed ? "20px 14px" : "20px 20px"),
          borderBottom: "1px solid var(--sidebar-border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 72,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            <Zap size={20} color="white" />
          </div>
          {(!collapsed || isMobile) && (
            <div>
              <div style={{ color: "var(--sidebar-foreground)", fontWeight: 800, fontSize: 16, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
                Livlong AI
              </div>
              <div style={{ color: "rgba(248,250,252,0.5)", fontSize: 11, fontWeight: 500 }}>
                Insurance Intelligence
              </div>
            </div>
          )}
        </div>
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {navItems.map((item) => {
          const active = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "10px 14px" : "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: active
                  ? "var(--sidebar-accent)"
                  : "transparent",
                marginBottom: 2,
                transition: "all 0.15s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    height: "60%",
                    width: 3,
                    borderRadius: "0 3px 3px 0",
                    background: "var(--sidebar-primary)",
                  }}
                />
              )}
              <Icon
                size={18}
                color={active ? "var(--sidebar-accent-foreground)" : "rgba(248,250,252,0.5)"}
              />
              {(!collapsed || isMobile) && (
                <span
                  style={{
                    color: active ? "var(--sidebar-foreground)" : "rgba(248,250,252,0.5)",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              )}
              {item.id === "copilot" && (!collapsed || isMobile) && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "linear-gradient(135deg, var(--primary), var(--chart-5))",
                    color: "white",
                    fontSize: 9,
                    padding: "2px 6px",
                    borderRadius: 10,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse button - only show on desktop */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            right: -12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--sidebar)",
            border: `2px solid var(--sidebar-border)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--sidebar-foreground)",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-accent)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--sidebar-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--sidebar-foreground)";
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      )}

      {/* Bottom user */}
      {(!collapsed || isMobile) && (
        <div
          style={{
            padding: "16px 16px",
            borderTop: "1px solid var(--sidebar-border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--chart-5))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(99,102,241,0.2)",
            }}
          >
            R
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "var(--sidebar-foreground)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Raj Sharma
            </div>
            <div style={{ color: "rgba(248,250,252,0.4)", fontSize: 11, whiteSpace: "nowrap", fontWeight: 500 }}>
              Super Admin
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
