"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, CheckCircle, AlertTriangle, FileText, MessageSquare, User, Bot, Activity } from "lucide-react"

export default function TalentFlowDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const metrics = [
    {
      title: "Active Candidates",
      value: "47",
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Pending Reviews",
      value: "12",
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      title: "Approved Today",
      value: "8",
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      title: "Flagged Items",
      value: "3",
      icon: AlertTriangle,
      color: "text-red-400",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Recommender Agent",
      action: "Strong hire with 94% confidence",
      time: "2 min ago",
      status: "success",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Marcus Johnson",
      role: "Human-in-Loop",
      action: "Escalated for manual review",
      time: "5 min ago",
      status: "warning",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "Interviewer Agent",
      action: "Technical interview scheduled",
      time: "12 min ago",
      status: "info",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "David Kim",
      role: "Intake Agent",
      action: "Initial screening completed",
      time: "18 min ago",
      status: "success",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const agentStatus = [
    {
      name: "Intake Agent",
      tasks: "8 active tasks",
      status: "Active",
      progress: 94,
      icon: FileText,
    },
    {
      name: "Insight Agent",
      tasks: "3 active tasks",
      status: "Active",
      progress: 87,
      icon: Activity,
    },
    {
      name: "Interviewer Agent",
      tasks: "0 active tasks",
      status: "Idle",
      progress: 92,
      icon: MessageSquare,
    },
    {
      name: "Human-in-Loop",
      tasks: "5 active tasks",
      status: "Active",
      progress: 98,
      icon: User,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500 text-white border-0">success</Badge>
      case "warning":
        return <Badge className="bg-yellow-500 text-white border-0">warning</Badge>
      case "info":
        return <Badge className="bg-blue-500 text-white border-0">info</Badge>
      default:
        return <Badge className="bg-gray-500 text-white border-0">info</Badge>
    }
  }

  const getStatusIndicator = (status: string) => {
    return status === "Active" ? (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-green-400 text-sm">Active</span>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full" />
        <span className="text-gray-400 text-sm">Idle</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#111a26" }}>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64" style={{ backgroundColor: "#111a26" }}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "#0583f2" }}
            >
              T
            </div>
            <div>
              <div className="font-semibold text-white">TalentFlow</div>
              <div className="text-xs text-white/60">Powered by ClickChain.ai</div>
            </div>
          </div>
        </div>

        <nav className="p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
              style={{ backgroundColor: "#0583f2" }}
            >
              <Bot className="h-5 w-5 mr-3" />
              Dashboard Home
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <Users className="h-5 w-5 mr-3" />
              <span className="flex-1">Candidate Flow</span>
              <Badge className="bg-red-500 text-white border-0">12</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <FileText className="h-5 w-5 mr-3" />
              Agent Logs
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <Bot className="h-5 w-5 mr-3" />
              Agent Widgets
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <Activity className="h-5 w-5 mr-3" />
              Training Console
            </Button>
          </div>
        </nav>

        {/* Issue Notification */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full">
            <span className="text-white text-sm font-medium">N</span>
            <span className="text-white text-sm">1 Issue</span>
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-600 p-0 h-auto">
              ×
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <Button className="text-white border-white/20" style={{ backgroundColor: "#0583f2" }}>
            All Systems Active
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{metric.title}</p>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.name} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {activity.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{activity.name}</span>
                      <Badge className="text-xs" style={{ backgroundColor: "#0583f2", color: "white" }}>
                        {activity.role}
                      </Badge>
                      <span className="text-gray-400 text-xs ml-auto">{activity.time}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{activity.action}</p>
                    <div className="mt-2">{getStatusBadge(activity.status)}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Agent Status */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Agent Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentStatus.map((agent, index) => {
                const Icon = agent.icon
                return (
                  <div key={index} className="p-3 rounded-lg bg-gray-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-blue-400" />
                        <span className="text-white font-medium">{agent.name}</span>
                      </div>
                      {getStatusIndicator(agent.status)}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{agent.tasks}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={agent.progress} className="flex-1 h-2 bg-gray-700" />
                      <span className="text-white text-sm font-medium">{agent.progress}%</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
