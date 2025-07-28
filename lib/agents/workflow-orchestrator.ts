import { TimesheetCollector } from "./timesheet-collector"
import { AnomalyDetector } from "./anomaly-detector"
import { PolicyEnforcer } from "./policy-enforcer"
import { CorrectionProposer } from "./correction-proposer"

interface WorkflowState {
  status: "idle" | "running" | "paused" | "completed" | "error"
  currentStep: string
  startTime: Date | null
  endTime: Date | null
  results: {
    timesheetCollection: any | null
    anomalyDetection: any | null
    policyValidation: any | null
    correctionProposals: any | null
  }
  error: string | null
}

export class WorkflowOrchestrator {
  private timesheetCollector: TimesheetCollector
  private anomalyDetector: AnomalyDetector
  private policyEnforcer: PolicyEnforcer
  private correctionProposer: CorrectionProposer | null = null

  private state: WorkflowState = {
    status: "idle",
    currentStep: "",
    startTime: null,
    endTime: null,
    results: {
      timesheetCollection: null,
      anomalyDetection: null,
      policyValidation: null,
      correctionProposals: null,
    },
    error: null,
  }

  constructor() {
    this.timesheetCollector = new TimesheetCollector()

    const companyPolicies = {
      maxHoursPerDay: 12,
      requireProjectCode: true,
      requireDescription: true,
    }

    this.anomalyDetector = new AnomalyDetector(companyPolicies)
    this.policyEnforcer = new PolicyEnforcer()
  }

  async startWorkflow(startDate: string, endDate: string, workspaceId: string) {
    this.state = {
      status: "running",
      currentStep: "timesheet-collection",
      startTime: new Date(),
      endTime: null,
      results: {
        timesheetCollection: null,
        anomalyDetection: null,
        policyValidation: null,
        correctionProposals: null,
      },
      error: null,
    }

    try {
      // Step 1: Collect timesheet data
      this.state.currentStep = "timesheet-collection"
      const timesheetResult = await this.timesheetCollector.collectTimesheets(startDate, endDate, workspaceId)
      this.state.results.timesheetCollection = timesheetResult

      if (!timesheetResult.success) {
        throw new Error(`Timesheet collection failed: ${timesheetResult.message}`)
      }

      // Get employee data
      const employeeResult = await this.timesheetCollector.getEmployeeData(workspaceId)

      if (!employeeResult.success) {
        throw new Error(`Employee data collection failed: ${employeeResult.message}`)
      }

      // Step 2: Detect anomalies
      this.state.currentStep = "anomaly-detection"
      const anomalyResult = await this.anomalyDetector.detectAnomalies(timesheetResult.data, employeeResult.data)
      this.state.results.anomalyDetection = anomalyResult

      if (!anomalyResult.success) {
        throw new Error(`Anomaly detection failed: ${anomalyResult.message}`)
      }

      // Step 3: Validate against policies
      this.state.currentStep = "policy-validation"
      const validationResult = await this.policyEnforcer.validateAnomalies(anomalyResult.data)
      this.state.results.policyValidation = validationResult

      if (!validationResult.success) {
        throw new Error(`Policy validation failed: ${validationResult.message}`)
      }

      // Step 4: Generate correction proposals
      this.state.currentStep = "correction-proposal"
      this.correctionProposer = new CorrectionProposer(employeeResult.data, timesheetResult.data)
      const proposalResult = await this.correctionProposer.generateCorrectionProposals(validationResult.data)
      this.state.results.correctionProposals = proposalResult

      if (!proposalResult.success) {
        throw new Error(`Correction proposal generation failed: ${proposalResult.message}`)
      }

      // Workflow completed successfully
      this.state.status = "completed"
      this.state.endTime = new Date()

      return {
        success: true,
        data: this.state,
        message: "Workflow completed successfully",
      }
    } catch (error) {
      this.state.status = "error"
      this.state.error = error.message
      this.state.endTime = new Date()

      return {
        success: false,
        data: this.state,
        message: `Workflow failed: ${error.message}`,
      }
    }
  }

  pauseWorkflow() {
    if (this.state.status === "running") {
      this.state.status = "paused"
      return {
        success: true,
        message: "Workflow paused",
      }
    } else {
      return {
        success: false,
        message: `Cannot pause workflow in ${this.state.status} state`,
      }
    }
  }

  resumeWorkflow() {
    if (this.state.status === "paused") {
      this.state.status = "running"
      return {
        success: true,
        message: "Workflow resumed",
      }
    } else {
      return {
        success: false,
        message: `Cannot resume workflow in ${this.state.status} state`,
      }
    }
  }

  getWorkflowState() {
    return {
      success: true,
      data: this.state,
      message: `Current workflow state: ${this.state.status}`,
    }
  }

  async applyCorrection(correctionId: string, approved: boolean) {
    const proposals = this.state.results.correctionProposals?.data || []
    const proposal = proposals.find((p) => p.anomalyId === correctionId)

    if (!proposal) {
      return {
        success: false,
        message: `Correction proposal not found: ${correctionId}`,
      }
    }

    // Update proposal status
    proposal.status = approved ? "approved" : "rejected"

    // If approved, apply the correction
    if (approved) {
      // In a real implementation, this would call the Clockify API to update the time entry
      // For this demo, we'll just simulate the correction

      return {
        success: true,
        message: `Correction applied: ${proposal.suggestedAction}`,
      }
    } else {
      return {
        success: true,
        message: `Correction rejected: ${proposal.suggestedAction}`,
      }
    }
  }
}
