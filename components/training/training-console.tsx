"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Plus, Trash2, Tag, Brain } from "lucide-react"

interface PolicyDocument {
  id: string
  name: string
  type: "pdf" | "markdown"
  uploadDate: string
  size: string
  status: "processed" | "processing" | "error"
}

interface PromptExample {
  id: string
  title: string
  input: string
  expectedOutput: string
  tags: string[]
  category: string
}

export default function TrainingConsole() {
  const [policyDocuments, setPolicyDocuments] = useState<PolicyDocument[]>([
    {
      id: "doc-1",
      name: "Employee Handbook v2.1.pdf",
      type: "pdf",
      uploadDate: "2025-07-10",
      size: "2.3 MB",
      status: "processed",
    },
    {
      id: "doc-2",
      name: "Overtime Policy.md",
      type: "markdown",
      uploadDate: "2025-07-11",
      size: "45 KB",
      status: "processed",
    },
    {
      id: "doc-3",
      name: "Time Tracking Guidelines.pdf",
      type: "pdf",
      uploadDate: "2025-07-12",
      size: "1.8 MB",
      status: "processing",
    },
  ])

  const [promptExamples, setPromptExamples] = useState<PromptExample[]>([
    {
      id: "example-1",
      title: "Missing Time Entry Detection",
      input: "Employee has entries for Monday and Wednesday but not Tuesday",
      expectedOutput: "Detect missing entry for Tuesday and suggest standard 8-hour workday",
      tags: ["missing-entry", "detection"],
      category: "time-tracking",
    },
    {
      id: "example-2",
      title: "Overtime Validation",
      input: "Employee logged 14 hours on Friday",
      expectedOutput: "Flag for supervisor review - exceeds 12-hour daily limit",
      tags: ["overtime", "policy-violation"],
      category: "compliance",
    },
  ])

  const [newExample, setNewExample] = useState({
    title: "",
    input: "",
    expectedOutput: "",
    tags: "",
    category: "",
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const newDoc: PolicyDocument = {
          id: `doc-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.name.endsWith(".pdf") ? "pdf" : "markdown",
          uploadDate: new Date().toISOString().split("T")[0],
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          status: "processing",
        }
        setPolicyDocuments((prev) => [...prev, newDoc])

        // Simulate processing
        setTimeout(() => {
          setPolicyDocuments((prev) =>
            prev.map((doc) => (doc.id === newDoc.id ? { ...doc, status: "processed" } : doc)),
          )
        }, 3000)
      })
    }
  }

  const addPromptExample = () => {
    if (newExample.title && newExample.input && newExample.expectedOutput) {
      const example: PromptExample = {
        id: `example-${Date.now()}`,
        title: newExample.title,
        input: newExample.input,
        expectedOutput: newExample.expectedOutput,
        tags: newExample.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: newExample.category,
      }
      setPromptExamples((prev) => [...prev, example])
      setNewExample({
        title: "",
        input: "",
        expectedOutput: "",
        tags: "",
        category: "",
      })
    }
  }

  const deleteDocument = (id: string) => {
    setPolicyDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const deleteExample = (id: string) => {
    setPromptExamples((prev) => prev.filter((example) => example.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Training Console</h2>
        <p className="text-muted-foreground">Manage policy documents and training examples for agents</p>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="bg-[rgba(31,41,55,1)]">
          <TabsTrigger value="documents">Policy Documents</TabsTrigger>
          <TabsTrigger value="examples">Prompt Examples</TabsTrigger>
          <TabsTrigger value="categories">Categories & Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card style={{ backgroundColor: "#1F2937" }} className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-white/70" />
                Policy Document Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-white/30 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-white/50" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-white">Upload policy files</span>
                      <span className="mt-1 block text-sm text-white/70">PDF or Markdown files up to 10MB</span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept=".pdf,.md,.markdown"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <div className="mt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white">Uploaded Documents ({policyDocuments.length})</h4>
                {policyDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg border-white/10">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-white/70" />
                      <div>
                        <div className="font-medium text-white">{doc.name}</div>
                        <div className="text-sm text-white/70">
                          {doc.size} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          doc.status === "processed"
                            ? "bg-green-500 text-white"
                            : doc.status === "processing"
                              ? "bg-blue-500 text-white"
                              : "bg-red-500 text-white"
                        }
                      >
                        {doc.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteDocument(doc.id)}
                        className="border-white/30 hover:bg-white/10 text-[rgba(31,41,55,1)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card style={{ backgroundColor: "#1F2937" }} className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="h-5 w-5 text-white/70" />
                Add New Training Example
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white">Title</label>
                  <Input
                    placeholder="Example title..."
                    value={newExample.title}
                    onChange={(e) => setNewExample((prev) => ({ ...prev, title: e.target.value }))}
                    className="border-white/30 text-white bg-[rgba(31,41,55,1)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Category</label>
                  <Select
                    value={newExample.category}
                    onValueChange={(value) => setNewExample((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 text-white border-white/30">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-white/30">
                      <SelectItem
                        value="time-tracking"
                        className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                      >
                        Time Tracking
                      </SelectItem>
                      <SelectItem
                        value="compliance"
                        className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                      >
                        Compliance
                      </SelectItem>
                      <SelectItem
                        value="payroll"
                        className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                      >
                        Payroll
                      </SelectItem>
                      <SelectItem
                        value="employee-engagement"
                        className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                      >
                        Employee Engagement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white">Input Scenario</label>
                <Textarea
                  placeholder="Describe the input scenario..."
                  value={newExample.input}
                  onChange={(e) => setNewExample((prev) => ({ ...prev, input: e.target.value }))}
                  className="border-white/30 text-white bg-[rgba(31,41,55,1)]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white">Expected Output</label>
                <Textarea
                  placeholder="Describe the expected agent response..."
                  value={newExample.expectedOutput}
                  onChange={(e) => setNewExample((prev) => ({ ...prev, expectedOutput: e.target.value }))}
                  className="border-white/30 text-white bg-[rgba(31,41,55,1)]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white">Tags (comma-separated)</label>
                <Input
                  placeholder="missing-entry, detection, validation..."
                  value={newExample.tags}
                  onChange={(e) => setNewExample((prev) => ({ ...prev, tags: e.target.value }))}
                  className="border-white/30 text-white bg-[rgba(31,41,55,1)]"
                />
              </div>

              <Button
                variant="outline"
                onClick={addPromptExample}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Example
              </Button>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#1F2937" }} className="border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Training Examples ({promptExamples.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promptExamples.map((example) => (
                  <div key={example.id} className="border rounded-lg p-4 border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white">{example.title}</h4>
                        <Badge variant="outline" className="mt-1 text-white border-white/30">
                          {example.category}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteExample(example.id)}
                        className="border-white/30 hover:bg-white/10 text-black"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-white/70">Input:</span>
                        <p className="text-white">{example.input}</p>
                      </div>
                      <div>
                        <span className="font-medium text-white/70">Expected Output:</span>
                        <p className="text-white">{example.expectedOutput}</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {example.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs text-black">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card style={{ backgroundColor: "#1F2937" }} className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Tag className="h-5 w-5 text-white/70" />
                Vector Search Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-white">Categories</h4>
                  <div className="space-y-2">
                    {["time-tracking", "compliance", "payroll", "employee-engagement"].map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between p-2 border rounded border-white/10"
                      >
                        <span className="capitalize text-white">{category.replace("-", " ")}</span>
                        <Badge variant="outline" className="text-white border-white/30">
                          {promptExamples.filter((ex) => ex.category === category).length} examples
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-white">Common Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(promptExamples.flatMap((ex) => ex.tags))).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs text-black">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-medium mb-3 text-white">Vector Search Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {policyDocuments.filter((d) => d.status === "processed").length}
                    </div>
                    <div className="text-sm text-white/70">Documents Indexed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{promptExamples.length}</div>
                    <div className="text-sm text-white/70">Training Examples</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Array.from(new Set(promptExamples.flatMap((ex) => ex.tags))).length}
                    </div>
                    <div className="text-sm text-white/70">Unique Tags</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
