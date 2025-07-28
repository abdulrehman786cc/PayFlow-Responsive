"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CheckCircle,
  XCircle,
  Edit3,
  MessageSquare,
  FileText,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  User,
} from "lucide-react"
import IssueDetailPanel from "./issue-detail-panel"

interface PayrollIssue {
  id: string
  employeeName: string
  employeeId: string
  employeeAvatar?: string
  datesAffected: string[]
  issueType: "missing-entry" | "overtime" | "duplicate" | "policy-violation" | "suspicious-pattern"
  agentSuggestion: string
  status: "awaiting-review" | "resolved" | "flagged" | "in-progress"
  priority: "low" | "medium" | "high"
  assignedAgent: string
  createdAt: string
  lastUpdated: string
}

export default function IssuesQueue() {
  const [selectedIssue, setSelectedIssue] = useState<PayrollIssue | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const [issues, setIssues] = useState<PayrollIssue[]>([
    {
      id: "issue-001",
      employeeName: "Sarah Johnson",
      employeeId: "emp-123",
      employeeAvatar: "/placeholder.svg?height=40&width=40",
      datesAffected: ["2025-07-10"],
      issueType: "missing-entry",
      agentSuggestion: "Add standard 8-hour workday (9:00 AM - 5:00 PM) based on employee's typical schedule",
      status: "awaiting-review",
      priority: "medium",
      assignedAgent: "Time Tracker Agent",
      createdAt: "2025-07-12T10:30:00Z",
      lastUpdated: "2025-07-12T10:30:00Z",
    },
    {
      id: "issue-002",
      employeeName: "Michael Chen",
      employeeId: "emp-456",
      employeeAvatar: "/placeholder.svg?height=40&width=40",
      datesAffected: ["2025-07-11"],
      issueType: "overtime",
      agentSuggestion: "Flag for supervisor review - 14 hours logged exceeds policy limit",
      status: "flagged",
      priority: "high",
      assignedAgent: "Work Compliance Agent",
      createdAt: "2025-07-12T11:15:00Z",
      lastUpdated: "2025-07-12T14:22:00Z",
    },
    {
      id: "issue-003",
      employeeName: "Jessica Williams",
      employeeId: "emp-789",
      employeeAvatar: "/placeholder.svg?height=40&width=40",
      datesAffected: ["2025-07-09"],
      issueType: "duplicate",
      agentSuggestion: "Merge overlapping entries: 10:00 AM - 12:00 PM and 11:00 AM - 1:00 PM",
      status: "in-progress",
      priority: "low",
      assignedAgent: "Payroll Assembly Agent",
      createdAt: "2025-07-12T09:45:00Z",
      lastUpdated: "2025-07-12T13:10:00Z",
    },
    {
      id: "issue-004",
      employeeName: "David Rodriguez",
      employeeId: "emp-101",
      employeeAvatar: "/placeholder.svg?height=40&width=40",
      datesAffected: ["2025-07-08"],
      issueType: "policy-violation",
      agentSuggestion: "Add project code 'PROJ-2025' based on employee's other entries that week",
      status: "awaiting-review",
      priority: "medium",
      assignedAgent: "Work Compliance Agent",
      createdAt: "2025-07-12T08:20:00Z",
      lastUpdated: "2025-07-12T08:20:00Z",
    },
    {
      id: "issue-005",
      employeeName: "Emma Thompson",
      employeeId: "emp-112",
      employeeAvatar: "/placeholder.svg?height=40&width=40",
      datesAffected: ["2025-07-01", "2025-07-02", "2025-07-03", "2025-07-04", "2025-07-05"],
      issueType: "suspicious-pattern",
      agentSuggestion: "Request verification - exactly 8 hours logged daily for 2 weeks",
      status: "awaiting-review",
      priority: "low",
      assignedAgent: "Employee Engagement Agent",
      createdAt: "2025-07-12T12:00:00Z",
      lastUpdated: "2025-07-12T12:00:00Z",
    },
  ])

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesType = typeFilter === "all" || issue.issueType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "awaiting-review":
        return <Badge className="bg-amber-500">Awaiting Review</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "flagged":
        return <Badge className="bg-red-500">Flagged</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "low":
        return <User className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getIssueTypeLabel = (type: string) => {
    switch (type) {
      case "missing-entry":
        return "Missing Entry"
      case "overtime":
        return "Overtime"
      case "duplicate":
        return "Duplicate"
      case "policy-violation":
        return "Policy Violation"
      case "suspicious-pattern":
        return "Suspicious Pattern"
      default:
        return type
    }
  }

  const handleApprove = (issueId: string) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId ? { ...issue, status: "resolved", lastUpdated: new Date().toISOString() } : issue,
      ),
    )
  }

  const handleReject = (issueId: string) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId ? { ...issue, status: "flagged", lastUpdated: new Date().toISOString() } : issue,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Issues Queue</h2>
          <p className="text-muted-foreground">Review and manage payroll anomalies detected by agents</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8 w-full sm:w-[200px] bg-gray-800 border-white/30 text-white placeholder:text-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] bg-gray-800 border-white/30 text-white">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-white/30">
              <SelectItem
                value="all"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                All Statuses
              </SelectItem>
              <SelectItem
                value="awaiting-review"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                Awaiting Review
              </SelectItem>
              <SelectItem
                value="in-progress"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                In Progress
              </SelectItem>
              <SelectItem
                value="flagged"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                Flagged
              </SelectItem>
              <SelectItem
                value="resolved"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                Resolved
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px] bg-gray-800 border-white/30 text-white">
              <SelectValue placeholder="Issue Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-white/30">
              <SelectItem
                value="all"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                All Types
              </SelectItem>
              <SelectItem
                value="missing-entry"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                Missing Entry
              </SelectItem>
              <SelectItem
                value="overtime"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                Overtime
              </SelectItem>
              <SelectItem
                value="duplicate"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                Duplicate
              </SelectItem>
              <SelectItem
                value="policy-violation"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                Policy Violation
              </SelectItem>
              <SelectItem
                value="suspicious-pattern"
                className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                Suspicious Pattern
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card style={{ backgroundColor: "#1F2937" }} className="border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5" />
            Open Issues ({filteredIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Employee</TableHead>
                  <TableHead className="text-white">Dates Affected</TableHead>
                  <TableHead className="text-white">Issue Type</TableHead>
                  <TableHead className="text-white">Agent Suggestion</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow
                    key={issue.id}
                    className="cursor-pointer hover:bg-white/10 text-white border-white/10"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getPriorityIcon(issue.priority)}
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={issue.employeeAvatar || "/placeholder.svg"} alt={issue.employeeName} />
                          <AvatarFallback className="bg-gray-600 text-white">
                            {issue.employeeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-white">{issue.employeeName}</div>
                          <div className="text-sm text-white/70">{issue.employeeId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {issue.datesAffected.slice(0, 2).map((date) => (
                          <div key={date} className="text-sm text-white">
                            {new Date(date).toLocaleDateString()}
                          </div>
                        ))}
                        {issue.datesAffected.length > 2 && (
                          <div className="text-xs text-white/70">+{issue.datesAffected.length - 2} more</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/30 text-white">
                        {getIssueTypeLabel(issue.issueType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm text-white">{issue.agentSuggestion}</div>
                      <div className="text-xs text-white/70 mt-1">by {issue.assignedAgent}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApprove(issue.id)
                          }}
                          disabled={issue.status === "resolved"}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReject(issue.id)
                          }}
                          disabled={issue.status === "resolved"}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle edit
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle add note
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle view log
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedIssue && (
        <IssueDetailPanel
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onApprove={() => handleApprove(selectedIssue.id)}
          onReject={() => handleReject(selectedIssue.id)}
        />
      )}
    </div>
  )
}
