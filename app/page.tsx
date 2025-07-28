"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import SidebarNavigation from "@/components/layout/sidebar-navigation"
import DashboardHome from "@/components/dashboard/dashboard-home"
import IssuesQueue from "@/components/issues/issues-queue"
import AgentWidgets from "@/components/widgets/agent-widgets"
import TrainingConsole from "@/components/training/training-console"
import RecentActivity from "@/components/recent-activity"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Menu } from "lucide-react"

export default function PayFlowDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardHome />
      case "issues":
        return <IssuesQueue />
      case "logs":
        return <RecentActivity />
      case "widgets":
        return <AgentWidgets />
      case "training":
        return <TrainingConsole />
      default:
        return <DashboardHome />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <div className="flex h-screen" style={{ backgroundColor: "#111a26" }}>
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-30">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            style={{ backgroundColor: "#0583f2", borderColor: "#0583f2", color: "white" }}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <SidebarNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#111a26" }}>
          {/* Top Header */}
          <header className="border-b border-white/10" style={{ backgroundColor: "#111a26" }}>
            <div className="flex items-center justify-between px-6 py-4 md:px-6 pl-16 md:pl-6">
              <div>
                <h1 className="text-2xl font-bold text-white">PayFlow Supervision Dashboard</h1>
                <p className="text-sm text-white/70">Human-in-the-loop agentic payroll resolution system</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Notification Badge */}
                <div className="relative">
                  <Bell className="h-5 w-5 text-white/70" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0">
                    3
                  </Badge>
                </div>

                {/* Active Agents Indicator */}
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/20"
                  style={{ backgroundColor: "#0583f2" }}
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-white">5 Agents Active</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto" style={{ backgroundColor: "#111a26" }}>
            <div className="container mx-auto p-6">{renderContent()}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
