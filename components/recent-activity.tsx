"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActivityItem {
  id: string
  timestamp: string
  agent: string
  action: string
  description: string
  status: "success" | "error" | "warning" | "info"
  employee?: {
    name: string
    id: string
    avatar?: string
  }
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "act-001",
      timestamp: "2025-07-12 17:30:22",
      agent: "Timesheet Collector",
      action: "Data Collection",
      description: "Successfully pulled timesheet data from Clockify API for period July 1-15, 2025.",
      status: "success",
    },
    {
      id: "act-002",
      timestamp: "2025-07-12 17:31:05",
      agent: "Anomaly Detector",
      action: "Anomaly Detection",
      description: "Detected 5 potential anomalies in timesheet data for period July 1-15, 2025.",
      status: "info",
    },
    {
      id: "act-003",
      timestamp: "2025-07-12 17:32:18",
      agent: "Policy Enforcer",
      action: "Policy Validation",
      description: "Validated anomalies against company policies. 3 confirmed policy violations.",
      status: "warning",
    },
    {
      id: "act-004",
      timestamp: "2025-07-12 17:33:42",
      agent: "Correction Proposer",
      action: "Correction Generation",
      description: "Generated correction proposals for 3 confirmed anomalies.",
      status: "success",
    },
    {
      id: "act-005",
      timestamp: "2025-07-12 17:34:10",
      agent: "Workflow Orchestrator",
      action: "Human Intervention",
      description: "Requested human review for overtime anomaly for employee Michael Chen.",
      status: "info",
      employee: {
        name: "Michael Chen",
        id: "emp-456",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "act-006",
      timestamp: "2025-07-12 17:35:22",
      agent: "Workflow Orchestrator",
      action: "Correction Application",
      description: "Applied approved correction for missing time entry for employee Sarah Johnson.",
      status: "success",
      employee: {
        name: "Sarah Johnson",
        id: "emp-123",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "act-007",
      timestamp: "2025-07-12 17:36:15",
      agent: "Timesheet Collector",
      action: "API Error",
      description: "Failed to connect to Clockify API. Retrying in 5 minutes.",
      status: "error",
    },
    {
      id: "act-008",
      timestamp: "2025-07-12 17:40:33",
      agent: "Timesheet Collector",
      action: "API Recovery",
      description: "Successfully reconnected to Clockify API after retry.",
      status: "success",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterAgent, setFilterAgent] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.employee?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesAgent = filterAgent === "all" || activity.agent === filterAgent
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus

    return matchesSearch && matchesAgent && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "info":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      case "warning":
        return <Badge className="bg-amber-500">Warning</Badge>
      case "info":
        return <Badge className="bg-blue-500">Info</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const uniqueAgents = [...new Set(activities.map((a) => a.agent))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Activity Log</h2>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-white/30 text-white placeholder:text-white/50"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterAgent} onValueChange={setFilterAgent}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-white/30 text-white">
                <SelectValue placeholder="Filter by agent" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/30">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                >
                  All Agents
                </SelectItem>
                {uniqueAgents.map((agent) => (
                  <SelectItem
                    key={agent}
                    value={agent}
                    className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                  >
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] bg-gray-800 border-white/30 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/30">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                >
                  All Statuses
                </SelectItem>
                <SelectItem
                  value="success"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                >
                  Success
                </SelectItem>
                <SelectItem
                  value="error"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                >
                  Error
                </SelectItem>
                <SelectItem
                  value="warning"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                >
                  Warning
                </SelectItem>
                <SelectItem
                  value="info"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                >
                  Info
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSearchQuery("")
                setFilterAgent("all")
                setFilterStatus("all")
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card style={{ backgroundColor: "#1F2937" }} className="border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Recent System Activity</CardTitle>
          <CardDescription className="text-white/70">
            Log of recent actions performed by agents in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/70">No activities match your filters</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                >
                  <div className="mt-1">{getStatusIcon(activity.status)}</div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-medium text-white">
                        {activity.agent} - {activity.action}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.status)}
                        <span className="text-xs text-white/50 whitespace-nowrap">{activity.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-sm text-white/80">{activity.description}</p>

                    {activity.employee && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={activity.employee.avatar || "/placeholder.svg"}
                            alt={activity.employee.name}
                          />
                          <AvatarFallback className="bg-gray-600 text-white text-xs">
                            {activity.employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-white/70">
                          Employee: {activity.employee.name} ({activity.employee.id})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
