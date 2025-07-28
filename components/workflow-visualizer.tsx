"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pause, Play, RefreshCw, ZoomIn, ZoomOut } from "lucide-react"

export default function WorkflowVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedView, setSelectedView] = useState("full")

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = 500
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Define agent nodes
    const agents = [
      { id: "timesheet-collector", name: "Timesheet Collector", x: 100, y: 100, color: "#3b82f6", status: "active" },
      { id: "anomaly-detector", name: "Anomaly Detector", x: 300, y: 100, color: "#ef4444", status: "active" },
      { id: "policy-enforcer", name: "Policy Enforcer", x: 500, y: 100, color: "#f59e0b", status: "active" },
      { id: "correction-proposer", name: "Correction Proposer", x: 300, y: 250, color: "#10b981", status: "active" },
      {
        id: "workflow-orchestrator",
        name: "Workflow Orchestrator",
        x: 300,
        y: 400,
        color: "#8b5cf6",
        status: "active",
      },
    ]

    // Define connections between agents
    const connections = [
      { from: "timesheet-collector", to: "anomaly-detector", messages: [] },
      { from: "anomaly-detector", to: "policy-enforcer", messages: [] },
      { from: "policy-enforcer", to: "correction-proposer", messages: [] },
      { from: "workflow-orchestrator", to: "timesheet-collector", messages: [] },
      { from: "workflow-orchestrator", to: "anomaly-detector", messages: [] },
      { from: "workflow-orchestrator", to: "policy-enforcer", messages: [] },
      { from: "workflow-orchestrator", to: "correction-proposer", messages: [] },
    ]

    // Animation variables
    let animationFrameId: number
    let messageParticles: any[] = []

    // Draw functions
    const drawNode = (x: number, y: number, label: string, color: string, status: string) => {
      const radius = 40 * zoomLevel

      // Draw circle
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color + "40" // Add transparency
      ctx.fill()

      // Draw border
      ctx.lineWidth = 2
      ctx.strokeStyle = color
      ctx.stroke()

      // Draw status indicator
      ctx.beginPath()
      ctx.arc(x + radius - 10, y - radius + 10, 5, 0, Math.PI * 2)
      ctx.fillStyle = status === "active" ? "#10b981" : "#f59e0b"
      ctx.fill()

      // Draw label
      ctx.font = `${12 * zoomLevel}px sans-serif`
      ctx.textAlign = "center"
      ctx.fillStyle = "#000"
      ctx.fillText(label, x, y + radius + 15)
    }

    const drawConnection = (fromX: number, fromY: number, toX: number, toY: number) => {
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 3])
      ctx.stroke()
      ctx.setLineDash([])
    }

    const drawMessageParticle = (x: number, y: number, color: string) => {
      ctx.beginPath()
      ctx.arc(x, y, 4 * zoomLevel, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }

    // Create a new message particle
    const createMessageParticle = () => {
      if (!isPlaying) return

      const randomConnection = connections[Math.floor(Math.random() * connections.length)]
      const fromAgent = agents.find((a) => a.id === randomConnection.from)
      const toAgent = agents.find((a) => a.id === randomConnection.to)

      if (fromAgent && toAgent) {
        messageParticles.push({
          fromX: fromAgent.x,
          fromY: fromAgent.y,
          toX: toAgent.x,
          toY: toAgent.y,
          progress: 0,
          color: fromAgent.color,
          speed: 0.01 + Math.random() * 0.01,
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply zoom and centering
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(zoomLevel, zoomLevel)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      // Draw connections
      connections.forEach((connection) => {
        const fromAgent = agents.find((a) => a.id === connection.from)
        const toAgent = agents.find((a) => a.id === connection.to)

        if (fromAgent && toAgent) {
          drawConnection(fromAgent.x, fromAgent.y, toAgent.x, toAgent.y)
        }
      })

      // Draw agents
      agents.forEach((agent) => {
        drawNode(agent.x, agent.y, agent.name, agent.color, agent.status)
      })

      // Update and draw message particles
      messageParticles = messageParticles.filter((particle) => {
        particle.progress += particle.speed

        if (particle.progress >= 1) {
          return false
        }

        const currentX = particle.fromX + (particle.toX - particle.fromX) * particle.progress
        const currentY = particle.fromY + (particle.toY - particle.fromY) * particle.progress

        drawMessageParticle(currentX, currentY, particle.color)

        return true
      })

      ctx.restore()

      // Randomly create new message particles
      if (Math.random() < 0.05 && isPlaying) {
        createMessageParticle()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [zoomLevel, isPlaying, selectedView])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workflow Visualization</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Workflow</SelectItem>
              <SelectItem value="data-processing">Data Processing</SelectItem>
              <SelectItem value="anomaly-resolution">Anomaly Resolution</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="icon" onClick={() => setZoomLevel(1)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Agent Workflow Visualization</CardTitle>
          <CardDescription>Real-time visualization of agent communication and workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[500px] bg-slate-50 rounded-md overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              This visualization shows how agents communicate and collaborate to resolve payroll anomalies. The Workflow
              Orchestrator coordinates the entire process, while specialized agents handle specific tasks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
