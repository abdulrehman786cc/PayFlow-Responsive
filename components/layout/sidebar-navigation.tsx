"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, AlertTriangle, FileText, Bot, GraduationCap, ChevronLeft, ChevronRight, X } from "lucide-react"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  active?: boolean
}

interface SidebarNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export default function SidebarNavigation({
  activeSection,
  onSectionChange,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarNavigationProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile and set initial state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard Home",
      icon: Home,
      active: activeSection === "dashboard",
    },
    {
      id: "issues",
      label: "Issues Queue",
      icon: AlertTriangle,
      badge: 12,
      active: activeSection === "issues",
    },
    {
      id: "logs",
      label: "Agent Logs",
      icon: FileText,
      active: activeSection === "logs",
    },
    {
      id: "widgets",
      label: "Agent Widgets",
      icon: Bot,
      active: activeSection === "widgets",
    },
    {
      id: "training",
      label: "Training Console",
      icon: GraduationCap,
      active: activeSection === "training",
    },
  ]

  const handleToggle = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId)
    if (isMobile) {
      setMobileMenuOpen(false)
    }
  }

  // Mobile overlay
  if (isMobile && mobileMenuOpen) {
    return (
      <>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />

        {/* Mobile Sidebar */}
        <div
          className="fixed left-0 top-0 h-full w-64 z-50 md:hidden border-r border-white/10"
          style={{ backgroundColor: "#111a26" }}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#0583f2" }}
              >
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-white">PayFlow</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 p-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left",
                      item.active ? "text-white hover:bg-white/10" : "text-white/70 hover:text-white hover:bg-white/10",
                    )}
                    style={item.active ? { backgroundColor: "#0583f2" } : {}}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && <Badge className="ml-auto bg-red-500 text-white border-0">{item.badge}</Badge>}
                  </Button>
                )
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>5 Agents Active</span>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "hidden md:flex flex-col h-full transition-all duration-300 border-r border-white/10",
        collapsed ? "w-16" : "w-64",
      )}
      style={{ backgroundColor: "#111a26" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0583f2" }}>
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
                <h1 className="text-lg font-semibold text-gray-100">PayFlow</h1>
                <p className="text-xs text-gray-400">
                  Powered by{" "}
                  <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.top) {
                      window.top.location.href = "https://clickchain.ai/";
                    }
                  }}
                  className="hover:text-talent-accent transition-colors text-[#0583E5]"
                >
                  ClickChain.ai
                </a>
                </p>
              </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left",
                  item.active ? "text-white hover:bg-white/10" : "text-white/70 hover:text-white hover:bg-white/10",
                  collapsed && "justify-center px-2",
                )}
                style={item.active ? { backgroundColor: "#0583f2" } : {}}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && <Badge className="ml-auto bg-red-500 text-white border-0">{item.badge}</Badge>}
                  </>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Status Indicator */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>5 Agents Active</span>
          </div>
        </div>
      )}
    </div>
  )
}
