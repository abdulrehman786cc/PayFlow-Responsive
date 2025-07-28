"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, User, FileText, MessageSquare, Bot, AlertTriangle, X } from "lucide-react"

interface PayrollIssue {
  id: string
  employeeName: string
  employeeId: string
  employeeAvatar?: string
  datesAffected: string[]
  issueType: string
  agentSuggestion: string
  status: string
  priority: string
  assignedAgent: string
  createdAt: string
  lastUpdated: string
}

interface IssueDetailPanelProps {
  issue: PayrollIssue
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}

export default function IssueDetailPanel({ issue, onClose, onApprove, onReject }: IssueDetailPanelProps) {
  const [supervisorNote, setSupervisorNote] = useState("")
  const [showApprovalHistory, setShowApprovalHistory] = useState(false)

  const agentReasoning = {
    analysis:
      "Employee Sarah Johnson has consistent time entry patterns for the past 3 months, typically working 8-hour days from 9:00 AM to 5:00 PM with a 1-hour lunch break. The missing entry for July 10th appears to be an oversight as entries exist for July 9th and July 11th with normal patterns.",
    confidence: 0.85,
    sources: [
      {
        type: "Historical Pattern",
        content: "Employee has logged 8-hour days for 89% of working days in the past 90 days",
        relevance: 0.92,
      },
      {
        type: "Company Policy",
        content: "Standard work schedule: 8 hours/day, 40 hours/week for full-time employees",
        relevance: 0.78,
      },
      {
        type: "Manager Confirmation",
        content: "Manager confirmed employee was present and working on July 10th",
        relevance: 0.95,
      },
    ],
    riskFactors: [
      "No unusual activity detected in surrounding days",
      "Employee has good attendance record",
      "No policy violations in past 6 months",
    ],
  }

  const approvalHistory = [
    {
      id: "1",
      timestamp: "2025-07-12T10:30:00Z",
      action: "Issue Created",
      user: "Time Tracker Agent",
      note: "Detected missing time entry for July 10th",
    },
    {
      id: "2",
      timestamp: "2025-07-12T10:32:00Z",
      action: "Analysis Complete",
      user: "Work Compliance Agent",
      note: "Validated against company policies - no violations found",
    },
    {
      id: "3",
      timestamp: "2025-07-12T10:35:00Z",
      action: "Suggestion Generated",
      user: "Payroll Assembly Agent",
      note: "Proposed standard 8-hour entry based on historical patterns",
    },
  ]

  const handleApproveWithNote = () => {
    // In a real app, this would save the supervisor note
    console.log("Approving with note:", supervisorNote)
    onApprove()
    onClose()
  }

  const handleRejectWithNote = () => {
    // In a real app, this would save the supervisor note
    console.log("Rejecting with note:", supervisorNote)
    onReject()
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={issue.employeeAvatar || "/placeholder.svg"} alt={issue.employeeName} />
                <AvatarFallback>
                  {issue.employeeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">{issue.employeeName}</DialogTitle>
                <DialogDescription>
                  Issue ID: {issue.id} • Employee ID: {issue.employeeId}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Issue Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Issue Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Issue Type</label>
                    <div className="mt-1">
                      <Badge variant="outline">{issue.issueType.replace("-", " ")}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <div className="mt-1">
                      <Badge
                        className={
                          issue.priority === "high"
                            ? "bg-red-500"
                            : issue.priority === "medium"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                        }
                      >
                        {issue.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dates Affected</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {issue.datesAffected.map((date) => (
                      <Badge key={date} variant="secondary">
                        {new Date(date).toLocaleDateString()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned Agent</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span>{issue.assignedAgent}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Reasoning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Agent Reasoning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Analysis</label>
                  <p className="mt-1 text-sm">{agentReasoning.analysis}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Confidence Score</label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${agentReasoning.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(agentReasoning.confidence * 100)}%</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Suggested Action</label>
                  <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                    <p className="text-sm">{issue.agentSuggestion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RAG Source Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Source Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentReasoning.sources.map((source, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{source.type}</span>
                        <Badge variant="secondary">{Math.round(source.relevance * 100)}% relevant</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{source.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Approval History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvalHistory.map((entry, index) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          {entry.user.includes("Agent") ? (
                            <Bot className="h-4 w-4 text-blue-600" />
                          ) : (
                            <User className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        {index < approvalHistory.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{entry.action}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.note}</p>
                        <span className="text-xs text-muted-foreground">by {entry.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supervisor Decision */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Supervisor Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Add Note (Optional)</label>
                  <Textarea
                    placeholder="Add any additional context or reasoning for your decision..."
                    value={supervisorNote}
                    onChange={(e) => setSupervisorNote(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleRejectWithNote}>
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button onClick={handleApproveWithNote}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
