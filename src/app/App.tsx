import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { Dashboard } from "./components/pages/Dashboard";
import { AICopilot } from "./components/pages/AICopilot";
import { Leads } from "./components/pages/Leads";
import { Customers } from "./components/pages/Customers";
import { Policies } from "./components/pages/Policies";
import { Revenue } from "./components/pages/Revenue";
import { Brokerage } from "./components/pages/Brokerage";
import { Renewals } from "./components/pages/Renewals";
import { Claims } from "./components/pages/Claims";
import { Agents } from "./components/pages/Agents";
import { Branches } from "./components/pages/Branches";
import { Products } from "./components/pages/Products";
import { Marketing } from "./components/pages/Marketing";
import { Compliance } from "./components/pages/Compliance";
import { Documents } from "./components/pages/Documents";
import { Reports } from "./components/pages/Reports";
import { Settings } from "./components/pages/Settings";
import { useIsMobile } from "./hooks/useIsMobile";

export type Page =
  | "dashboard"
  | "copilot"
  | "leads"
  | "customers"
  | "policies"
  | "revenue"
  | "brokerage"
  | "renewals"
  | "claims"
  | "agents"
  | "branches"
  | "products"
  | "marketing"
  | "compliance"
  | "documents"
  | "reports"
  | "settings";

const pageComponents: Record<Page, React.ComponentType<{ dark: boolean }>> = {
  dashboard: Dashboard,
  copilot: AICopilot,
  leads: Leads,
  customers: Customers,
  policies: Policies,
  revenue: Revenue,
  brokerage: Brokerage,
  renewals: Renewals,
  claims: Claims,
  agents: Agents,
  branches: Branches,
  products: Products,
  marketing: Marketing,
  compliance: Compliance,
  documents: Documents,
  reports: Reports,
  settings: Settings,
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [dark, setDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const PageComponent = pageComponents[activePage];

  return (
    <div className={dark ? "dark animate-fade-in" : "animate-fade-in"} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          overflow: "hidden",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          dark={dark}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <TopNav
            dark={dark}
            setDark={setDark}
            activePage={activePage}
            setActivePage={setActivePage}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: isMobile ? "16px" : "24px",
            }}
          >
            <PageComponent dark={dark} />
          </main>
        </div>
      </div>
    </div>
  );
}
