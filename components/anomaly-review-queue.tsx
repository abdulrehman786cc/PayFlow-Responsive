"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, Filter, Search, XCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AnomalyItem {
  id: string
  employee: {
    name: string
    id: string
    avatar?: string
  }
  date: string
  type: "missing-entry" | "overtime" | "duplicate" | "policy-violation" | "suspicious-pattern"
  description: string
  suggestedAction: string
  severity: "low" | "medium" | "high"
  status: "pending" | "approved" | "rejected"
}

export default function AnomalyReviewQueue() {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([
    {
      id: "anom-001",
      employee: {
        name: "Sarah Johnson",
        id: "emp-123",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-07-10",
      type: "missing-entry",
      description: "No time entry for Wednesday, July 10th, but entries exist for surrounding days.",
      suggestedAction: "Add standard 8-hour workday (9:00 AM - 5:00 PM) based on employee's typical schedule.",
      severity: "medium",
      status: "pending",
    },
    {
      id: "anom-002",
      employee: {
        name: "Michael Chen",
        id: "emp-456",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-07-11",
      type: "overtime",
      description: "Logged 14 hours on Friday, July 11th, exceeding company policy of maximum 12 hours per day.",
      suggestedAction:
        "Flag for supervisor review. Consider splitting hours across multiple days if work spanned midnight.",
      severity: "high",
      status: "pending",
    },
    {
      id: "anom-003",
      employee: {
        name: "Jessica Williams",
        id: "emp-789",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-07-09",
      type: "duplicate",
      description:
        "Two overlapping time entries for the same project on July 9th (10:00 AM - 12:00 PM and 11:00 AM - 1:00 PM).",
      suggestedAction: "Merge entries into a single 10:00 AM - 1:00 PM entry.",
      severity: "low",
      status: "pending",
    },
    {
      id: "anom-004",
      employee: {
        name: "David Rodriguez",
        id: "emp-101",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-07-08",
      type: "policy-violation",
      description: "Time entry lacks required project code for billable work.",
      suggestedAction: "Add project code 'PROJ-2025' based on employee's other entries that week.",
      severity: "medium",
      status: "pending",
    },
    {
      id: "anom-005",
      employee: {
        name: "Emma Thompson",
        id: "emp-112",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-07-12",
      type: "suspicious-pattern",
      description:
        "Exactly 8 hours logged every day for two weeks without any variation, which is unusual for this role.",
      suggestedAction: "Request verification from employee about time accuracy.",
      severity: "low",
      status: "pending",
    },
  ])

  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  const handleApprove = (id: string) => {
    setAnomalies(anomalies.map((anomaly) => (anomaly.id === id ? { ...anomaly, status: "approved" } : anomaly)))
    setSelectedAnomaly(null)
  }

  const handleReject = (id: string) => {
    setAnomalies(anomalies.map((anomaly) => (anomaly.id === id ? { ...anomaly, status: "rejected" } : anomaly)))
    setSelectedAnomaly(null)
  }

  const filteredAnomalies = anomalies.filter((anomaly) => {
    const matchesSearch =
      anomaly.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anomaly.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || anomaly.type === filterType
    const matchesSeverity = filterSeverity === "all" || anomaly.severity === filterSeverity

    return matchesSearch && matchesType && matchesSeverity
  })

  const pendingAnomalies = filteredAnomalies.filter((a) => a.status === "pending")
  const resolvedAnomalies = filteredAnomalies.filter((a) => a.status !== "pending")

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "missing-entry":
        return <Badge variant="outline">Missing Entry</Badge>
      case "overtime":
        return <Badge variant="outline">Overtime</Badge>
      case "duplicate":
        return <Badge variant="outline">Duplicate</Badge>
      case "policy-violation":
        return <Badge variant="outline">Policy Violation</Badge>
      case "suspicious-pattern":
        return <Badge variant="outline">Suspicious Pattern</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Anomaly Review Queue</h2>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employee or description..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="missing-entry">Missing Entry</SelectItem>
                <SelectItem value="overtime">Overtime</SelectItem>
                <SelectItem value="duplicate">Duplicate</SelectItem>
                <SelectItem value="policy-violation">Policy Violation</SelectItem>
                <SelectItem value="suspicious-pattern">Suspicious Pattern</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-[130px]">
                <AlertCircle className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({pendingAnomalies.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedAnomalies.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAnomalies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-lg font-medium">No pending anomalies</p>
                <p className="text-sm text-muted-foreground">All anomalies have been reviewed</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingAnomalies.map((anomaly) => (
                <Card key={anomaly.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={anomaly.employee.avatar || "/placeholder.svg"}
                            alt={anomaly.employee.name}
                          />
                          <AvatarFallback>
                            {anomaly.employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{anomaly.employee.name}</CardTitle>
                          <CardDescription>ID: {anomaly.employee.id}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getSeverityBadge(anomaly.severity)}
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {anomaly.date}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="mb-2">{getTypeBadge(anomaly.type)}</div>
                    <p className="text-sm mb-2">{anomaly.description}</p>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-xs font-medium">Suggested Action:</p>
                      <p className="text-xs">{anomaly.suggestedAction}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedAnomaly(anomaly)}>
                          Review Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {selectedAnomaly && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Anomaly Review: {selectedAnomaly.employee.name}</DialogTitle>
                              <DialogDescription>Review and take action on this timesheet anomaly</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Avatar>
                                    <AvatarImage
                                      src={selectedAnomaly.employee.avatar || "/placeholder.svg"}
                                      alt={selectedAnomaly.employee.name}
                                    />
                                    <AvatarFallback>
                                      {selectedAnomaly.employee.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium">{selectedAnomaly.employee.name}</h4>
                                    <p className="text-sm text-muted-foreground">ID: {selectedAnomaly.employee.id}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  {getSeverityBadge(selectedAnomaly.severity)}
                                  <span className="text-xs text-muted-foreground">{selectedAnomaly.date}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <h4 className="text-sm font-medium">Anomaly Type</h4>
                                  <p>{getTypeBadge(selectedAnomaly.type)}</p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium">Description</h4>
                                  <p className="text-sm">{selectedAnomaly.description}</p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium">Suggested Action</h4>
                                  <p className="text-sm">{selectedAnomaly.suggestedAction}</p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium">Additional Context</h4>
                                  <p className="text-sm text-muted-foreground">
                                    This employee has had 2 similar anomalies in the past month. Their manager has been
                                    notified about this recurring issue.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => handleReject(selectedAnomaly.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                              <Button onClick={() => handleApprove(selectedAnomaly.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Correction
                              </Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" onClick={() => handleReject(anomaly.id)}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>

                    <Button size="sm" onClick={() => handleApprove(anomaly.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedAnomalies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <p className="text-lg font-medium">No resolved anomalies</p>
                <p className="text-sm text-muted-foreground">Resolved anomalies will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {resolvedAnomalies.map((anomaly) => (
                <Card
                  key={anomaly.id}
                  className={`overflow-hidden ${
                    anomaly.status === "approved" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={anomaly.employee.avatar || "/placeholder.svg"}
                            alt={anomaly.employee.name}
                          />
                          <AvatarFallback>
                            {anomaly.employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{anomaly.employee.name}</CardTitle>
                          <CardDescription>ID: {anomaly.employee.id}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant="outline"
                          className={
                            anomaly.status === "approved"
                              ? "text-green-500 border-green-500"
                              : "text-red-500 border-red-500"
                          }
                        >
                          {anomaly.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {anomaly.date}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">{getTypeBadge(anomaly.type)}</div>
                    <p className="text-sm">{anomaly.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
