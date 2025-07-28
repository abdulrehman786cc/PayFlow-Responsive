"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, RefreshCw, StopCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type AgentStatus = "active" | "idle" | "paused" | "error"

interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  lastActive: string
  workload: number
  description: string
}

export default function AgentStatusDashboard() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "timesheet-collector",
      name: "Timesheet Collector",
      role: "Data Acquisition",
      status: "active",
      lastActive: "Just now",
      workload: 35,
      description: "Pulls time entry data from Clockify API and prepares it for analysis",
    },
    {
      id: "anomaly-detector",
      name: "Anomaly Detector",
      role: "Analysis",
      status: "active",
      lastActive: "2 minutes ago",
      workload: 65,
      description: "Identifies potential anomalies in timesheet data using pattern recognition",
    },
    {
      id: "policy-enforcer",
      name: "Policy Enforcer",
      role: "Validation",
      status: "active",
      lastActive: "5 minutes ago",
      workload: 20,
      description: "Validates time entries against company policies and regulations",
    },
    {
      id: "correction-proposer",
      name: "Correction Proposer",
      role: "Resolution",
      status: "active",
      lastActive: "3 minutes ago",
      workload: 45,
      description: "Suggests corrections for identified anomalies based on historical patterns",
    },
    {
      id: "workflow-orchestrator",
      name: "Workflow Orchestrator",
      role: "Coordination",
      status: "active",
      lastActive: "Just now",
      workload: 50,
      description: "Coordinates the entire workflow and manages agent communication",
    },
  ])

  const toggleAgentStatus = (agentId: string) => {
    setAgents(
      agents.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            status: agent.status === "active" ? "paused" : "active",
            lastActive: agent.status === "paused" ? "Just now" : agent.lastActive,
          }
        }
        return agent
      }),
    )
  }

  const refreshAgent = (agentId: string) => {
    setAgents(
      agents.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            lastActive: "Just now",
            status: "active",
          }
        }
        return agent
      }),
    )
  }

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "idle":
        return "bg-blue-500"
      case "paused":
        return "bg-amber-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "idle":
        return <Badge className="bg-blue-500">Idle</Badge>
      case "paused":
        return <Badge className="bg-amber-500">Paused</Badge>
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Status Dashboard</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAgents(agents.map((a) => ({ ...a, lastActive: "Just now" })))}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    {agent.name}
                    <span className={`ml-2 inline-block h-2 w-2 rounded-full ${getStatusColor(agent.status)}`} />
                  </CardTitle>
                  <CardDescription>{agent.role}</CardDescription>
                </div>
                {getStatusBadge(agent.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Workload</span>
                  <span>{agent.workload}%</span>
                </div>
                <Progress value={agent.workload} className="h-2" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Last active: {agent.lastActive}</div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => toggleAgentStatus(agent.id)}>
                      {agent.status === "active" ? (
                        <>
                          <StopCircle className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {agent.status === "active" ? "Pause this agent" : "Resume this agent"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => refreshAgent(agent.id)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh agent status</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
