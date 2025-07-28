interface Anomaly {
  id: string
  employeeId: string
  date: string
  type: string
  description: string
  severity: string
  relatedEntries: string[]
  detectionMethod: string
}

interface ValidationResult {
  anomalyId: string
  anomaly: Anomaly
  isValid: boolean
  applicableRules: any[]
  recommendedAction: string
  requiresHumanReview: boolean
  severity: string
}

interface CorrectionProposal {
  anomalyId: string
  employeeId: string
  date: string
  description: string
  suggestedAction: string
  severity: string
  requiresHumanReview: boolean
  status: "pending" | "approved" | "rejected"
}

export class CorrectionProposer {
  private employeeData: any[]
  private timeEntryHistory: any[]

  constructor(employeeData: any[], timeEntryHistory: any[]) {
    this.employeeData = employeeData
    this.timeEntryHistory = timeEntryHistory
  }

  async generateCorrectionProposals(validationResults: ValidationResult[]) {
    const proposals: CorrectionProposal[] = []

    for (const result of validationResults) {
      if (result.isValid) continue

      const proposal = await this.generateProposal(result)
      proposals.push(proposal)
    }

    return {
      success: true,
      data: proposals,
      message: `Generated ${proposals.length} correction proposals`,
    }
  }

  private async generateProposal(validationResult: ValidationResult): Promise<CorrectionProposal> {
    const { anomaly, recommendedAction, requiresHumanReview, severity } = validationResult

    let suggestedAction = ""

    switch (anomaly.type) {
      case "missing-entry":
        suggestedAction = await this.proposeMissingEntryCorrection(anomaly)
        break
      case "overtime":
        suggestedAction = this.proposeOvertimeCorrection(anomaly)
        break
      case "duplicate":
        suggestedAction = this.proposeDuplicateCorrection(anomaly)
        break
      case "policy-violation":
        suggestedAction = await this.proposePolicyViolationCorrection(anomaly)
        break
      case "suspicious-pattern":
        suggestedAction = this.proposeSuspiciousPatternAction(anomaly)
        break
      default:
        suggestedAction = "Review manually and take appropriate action."
    }

    return {
      anomalyId: anomaly.id,
      employeeId: anomaly.employeeId,
      date: anomaly.date,
      description: anomaly.description,
      suggestedAction,
      severity,
      requiresHumanReview,
      status: "pending",
    }
  }

  private async proposeMissingEntryCorrection(anomaly: Anomaly) {
    // Get employee's typical schedule
    const employeeSchedule = await this.getEmployeeTypicalSchedule(anomaly.employeeId)

    if (employeeSchedule) {
      return `Add standard ${employeeSchedule.hours}-hour workday (${employeeSchedule.startTime} - ${employeeSchedule.endTime}) based on employee's typical schedule.`
    } else {
      return "Add standard 8-hour workday (9:00 AM - 5:00 PM) based on company default schedule."
    }
  }

  private proposeOvertimeCorrection(anomaly: Anomaly) {
    return "Flag for supervisor review. Consider splitting hours across multiple days if work spanned midnight."
  }

  private proposeDuplicateCorrection(anomaly: Anomaly) {
    return "Merge overlapping entries into a single continuous time entry."
  }

  private async proposePolicyViolationCorrection(anomaly: Anomaly) {
    if (anomaly.description.includes("project code")) {
      // Find most common project code for this employee
      const commonProjectCode = await this.getMostCommonProjectCode(anomaly.employeeId)

      if (commonProjectCode) {
        return `Add project code '${commonProjectCode}' based on employee's other entries that week.`
      } else {
        return "Add appropriate project code after consulting with employee."
      }
    } else if (anomaly.description.includes("description")) {
      return "Add a descriptive comment based on the project and task associated with this time entry."
    } else {
      return "Review and correct the policy violation according to company guidelines."
    }
  }

  private proposeSuspiciousPatternAction(anomaly: Anomaly) {
    return "Request verification from employee about time accuracy."
  }

  private async getEmployeeTypicalSchedule(employeeId: string) {
    // Analyze historical time entries to determine typical schedule
    const employeeEntries = this.timeEntryHistory.filter((entry) => entry.employeeId === employeeId)

    if (employeeEntries.length === 0) {
      return null
    }

    // Calculate average start and end times
    let totalStartMinutes = 0
    let totalEndMinutes = 0
    let totalHours = 0

    employeeEntries.forEach((entry) => {
      const startTime = new Date(entry.startTime)
      const endTime = new Date(entry.endTime)

      const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()
      const endMinutes = endTime.getHours() * 60 + endTime.getMinutes()
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

      totalStartMinutes += startMinutes
      totalEndMinutes += endMinutes
      totalHours += hours
    })

    const avgStartMinutes = Math.round(totalStartMinutes / employeeEntries.length)
    const avgEndMinutes = Math.round(totalEndMinutes / employeeEntries.length)
    const avgHours = Math.round((totalHours / employeeEntries.length) * 10) / 10

    const startHour = Math.floor(avgStartMinutes / 60)
    const startMinute = avgStartMinutes % 60
    const endHour = Math.floor(avgEndMinutes / 60)
    const endMinute = avgEndMinutes % 60

    const formatTime = (hour: number, minute: number) => {
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    }

    return {
      startTime: formatTime(startHour, startMinute),
      endTime: formatTime(endHour, endMinute),
      hours: avgHours,
    }
  }

  private async getMostCommonProjectCode(employeeId: string) {
    // Find the most common project code used by this employee
    const employeeEntries = this.timeEntryHistory.filter((entry) => entry.employeeId === employeeId && entry.projectId)

    if (employeeEntries.length === 0) {
      return null
    }

    // Count occurrences of each project code
    const projectCounts = {}

    employeeEntries.forEach((entry) => {
      if (!projectCounts[entry.projectId]) {
        projectCounts[entry.projectId] = 0
      }

      projectCounts[entry.projectId]++
    })

    // Find the most common project code
    let mostCommonCode = null
    let highestCount = 0

    Object.entries(projectCounts).forEach(([code, count]: [string, any]) => {
      if (count > highestCount) {
        mostCommonCode = code
        highestCount = count
      }
    })

    return mostCommonCode
  }
}
