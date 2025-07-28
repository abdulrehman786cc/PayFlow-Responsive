"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Bot, TrendingUp, TrendingDown, Activity } from "lucide-react"

export default function DashboardHome() {
  const stats = {
    pendingIssues: 12,
    resolvedToday: 24,
    activeAgents: 5,
    avgResolutionTime: "3.2m",
    totalEmployees: 156,
    processingRate: 94,
  }

  const recentActivity = [
    {
      id: "1",
      type: "resolution",
      message: "Missing time entry resolved for Sarah Johnson",
      timestamp: "2 minutes ago",
      agent: "Time Tracker Agent",
    },
    {
      id: "2",
      type: "detection",
      message: "Overtime anomaly detected for Michael Chen",
      timestamp: "5 minutes ago",
      agent: "Work Compliance Agent",
    },
    {
      id: "3",
      type: "approval",
      message: "Supervisor approved correction for Jessica Williams",
      timestamp: "8 minutes ago",
      agent: "Supervisor Review Agent",
    },
  ]

  const agentStatus = [
    { name: "Time Tracker Agent", status: "active", workload: 35, lastRun: "Just now" },
    { name: "Anomaly Detector", status: "active", workload: 65, lastRun: "2 min ago" },
    { name: "Policy Enforcer", status: "active", workload: 20, lastRun: "5 min ago" },
    { name: "Correction Proposer", status: "active", workload: 45, lastRun: "3 min ago" },
    { name: "Workflow Orchestrator", status: "active", workload: 50, lastRun: "Just now" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-white/70">Monitor system performance and agent activity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/10" style={{ backgroundColor: "#1F2937" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Pending Issues</CardTitle>
            <AlertTriangle className="h-4 w-4" style={{ color: "#0583f2" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingIssues}</div>
            <p className="text-xs text-white/50">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2 since yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10" style={{ backgroundColor: "#1F2937" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4" style={{ color: "#0583f2" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.resolvedToday}</div>
            <p className="text-xs text-white/50">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10" style={{ backgroundColor: "#1F2937" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Active Agents</CardTitle>
            <Bot className="h-4 w-4" style={{ color: "#0583f2" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeAgents}/5</div>
            <p className="text-xs text-white/50">All agents operational</p>
          </CardContent>
        </Card>

        <Card className="border-white/10" style={{ backgroundColor: "#1F2937" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4" style={{ color: "#0583f2" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgResolutionTime}</div>
            <p className="text-xs text-white/50">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -0.5m from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status Overview */}
        <Card className="border-white/10" style={{ backgroundColor: "#1F2937" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5" style={{ color: "#0583f2" }} />
              Agent Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentStatus.map((agent, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#0583f2" }} />
                  <div>
                    <div className="font-medium text-sm text-white">{agent.name}</div>
                    <div className="text-xs text-white/50">Last run: {agent.lastRun}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16">
                    <Progress value={agent.workload} className="h-2" />
                  </div>
                  <span className="text-xs text-white/70 w-8">{agent.workload}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-white/10" style={{ backgroundColor: "#1F2937" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5" style={{ color: "#0583f2" }} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: "#0583f2" }} />
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/50">{activity.timestamp}</span>
                    <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                      {activity.agent}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="border-white/10" style={{ backgroundColor: "#1F2937" }}>
        <CardHeader>
          <CardTitle className="text-white">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/70">Processing Rate</span>
                <span className="text-sm text-white/50">{stats.processingRate}%</span>
              </div>
              <Progress value={stats.processingRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/70">API Response Time</span>
                <span className="text-sm text-white/50">120ms</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/70">Agent Availability</span>
                <span className="text-sm text-white/50">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
