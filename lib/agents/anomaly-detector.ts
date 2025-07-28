interface TimeEntry {
  id: string
  employeeId: string
  projectId: string
  taskId: string
  description: string
  startTime: string
  endTime: string
  duration: string
  billable: boolean
  tags: string[]
}

interface Anomaly {
  id: string
  employeeId: string
  date: string
  type: "missing-entry" | "overtime" | "duplicate" | "policy-violation" | "suspicious-pattern"
  description: string
  severity: "low" | "medium" | "high"
  relatedEntries: string[]
  detectionMethod: string
}

export class AnomalyDetector {
  private companyPolicies: any

  constructor(companyPolicies: any) {
    this.companyPolicies = companyPolicies
  }

  async detectAnomalies(timeEntries: TimeEntry[], employeeData: any[]) {
    const anomalies: Anomaly[] = []

    // Group time entries by employee and date
    const entriesByEmployeeAndDate = this.groupEntriesByEmployeeAndDate(timeEntries)

    // Detect missing entries
    const missingEntryAnomalies = this.detectMissingEntries(entriesByEmployeeAndDate, employeeData)
    anomalies.push(...missingEntryAnomalies)

    // Detect overtime
    const overtimeAnomalies = this.detectOvertime(entriesByEmployeeAndDate)
    anomalies.push(...overtimeAnomalies)

    // Detect duplicates
    const duplicateAnomalies = this.detectDuplicates(timeEntries)
    anomalies.push(...duplicateAnomalies)

    // Detect policy violations
    const policyViolationAnomalies = this.detectPolicyViolations(timeEntries)
    anomalies.push(...policyViolationAnomalies)

    // Detect suspicious patterns
    const suspiciousPatternAnomalies = this.detectSuspiciousPatterns(entriesByEmployeeAndDate)
    anomalies.push(...suspiciousPatternAnomalies)

    return {
      success: true,
      data: anomalies,
      message: `Detected ${anomalies.length} anomalies in timesheet data`,
    }
  }

  private groupEntriesByEmployeeAndDate(timeEntries: TimeEntry[]) {
    const grouped = {}

    timeEntries.forEach((entry) => {
      const date = new Date(entry.startTime).toISOString().split("T")[0]
      const key = `${entry.employeeId}-${date}`

      if (!grouped[key]) {
        grouped[key] = {
          employeeId: entry.employeeId,
          date,
          entries: [],
        }
      }

      grouped[key].entries.push(entry)
    })

    return grouped
  }

  private detectMissingEntries(entriesByEmployeeAndDate: any, employeeData: any[]) {
    const anomalies: Anomaly[] = []
    const workDays = this.getWorkDays(new Date(), 14) // Get work days for the last 14 days

    employeeData.forEach((employee) => {
      workDays.forEach((date) => {
        const key = `${employee.id}-${date}`

        if (!entriesByEmployeeAndDate[key]) {
          anomalies.push({
            id: `missing-${employee.id}-${date}`,
            employeeId: employee.id,
            date,
            type: "missing-entry",
            description: `No time entry for ${date}, but entries exist for surrounding days.`,
            severity: "medium",
            relatedEntries: [],
            detectionMethod: "gap-analysis",
          })
        }
      })
    })

    return anomalies
  }

  private detectOvertime(entriesByEmployeeAndDate: any) {
    const anomalies: Anomaly[] = []
    const maxHoursPerDay = this.companyPolicies?.maxHoursPerDay || 12

    Object.values(entriesByEmployeeAndDate).forEach((dayData: any) => {
      let totalHours = 0

      dayData.entries.forEach((entry) => {
        const start = new Date(entry.startTime)
        const end = new Date(entry.endTime)
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        totalHours += hours
      })

      if (totalHours > maxHoursPerDay) {
        anomalies.push({
          id: `overtime-${dayData.employeeId}-${dayData.date}`,
          employeeId: dayData.employeeId,
          date: dayData.date,
          type: "overtime",
          description: `Logged ${totalHours.toFixed(1)} hours on ${dayData.date}, exceeding company policy of maximum ${maxHoursPerDay} hours per day.`,
          severity: "high",
          relatedEntries: dayData.entries.map((e) => e.id),
          detectionMethod: "threshold-analysis",
        })
      }
    })

    return anomalies
  }

  private detectDuplicates(timeEntries: TimeEntry[]) {
    const anomalies: Anomaly[] = []
    const entriesByProject = {}

    timeEntries.forEach((entry) => {
      const key = `${entry.employeeId}-${entry.projectId}-${entry.startTime.substring(0, 10)}`

      if (!entriesByProject[key]) {
        entriesByProject[key] = []
      }

      entriesByProject[key].push(entry)
    })

    Object.entries(entriesByProject).forEach(([key, entries]: [string, any]) => {
      if (entries.length > 1) {
        // Check for overlapping time periods
        for (let i = 0; i < entries.length; i++) {
          for (let j = i + 1; j < entries.length; j++) {
            const entry1 = entries[i]
            const entry2 = entries[j]

            const start1 = new Date(entry1.startTime)
            const end1 = new Date(entry1.endTime)
            const start2 = new Date(entry2.startTime)
            const end2 = new Date(entry2.endTime)

            if (start1 <= end2 && start2 <= end1) {
              const date = start1.toISOString().split("T")[0]

              anomalies.push({
                id: `duplicate-${entry1.employeeId}-${date}-${entry1.id}-${entry2.id}`,
                employeeId: entry1.employeeId,
                date,
                type: "duplicate",
                description: `Two overlapping time entries for the same project on ${date}.`,
                severity: "low",
                relatedEntries: [entry1.id, entry2.id],
                detectionMethod: "overlap-detection",
              })

              // Only report one anomaly per pair
              break
            }
          }
        }
      }
    })

    return anomalies
  }

  private detectPolicyViolations(timeEntries: TimeEntry[]) {
    const anomalies: Anomaly[] = []

    timeEntries.forEach((entry) => {
      // Check for missing project code
      if (!entry.projectId && this.companyPolicies.requireProjectCode) {
        const date = new Date(entry.startTime).toISOString().split("T")[0]

        anomalies.push({
          id: `policy-${entry.employeeId}-${date}-${entry.id}`,
          employeeId: entry.employeeId,
          date,
          type: "policy-violation",
          description: `Time entry lacks required project code for billable work.`,
          severity: "medium",
          relatedEntries: [entry.id],
          detectionMethod: "policy-check",
        })
      }

      // Check for missing description
      if (!entry.description && this.companyPolicies.requireDescription) {
        const date = new Date(entry.startTime).toISOString().split("T")[0]

        anomalies.push({
          id: `policy-desc-${entry.employeeId}-${date}-${entry.id}`,
          employeeId: entry.employeeId,
          date,
          type: "policy-violation",
          description: `Time entry lacks required description.`,
          severity: "low",
          relatedEntries: [entry.id],
          detectionMethod: "policy-check",
        })
      }
    })

    return anomalies
  }

  private detectSuspiciousPatterns(entriesByEmployeeAndDate: any) {
    const anomalies: Anomaly[] = []

    // Group by employee
    const entriesByEmployee = {}

    Object.values(entriesByEmployeeAndDate).forEach((dayData: any) => {
      if (!entriesByEmployee[dayData.employeeId]) {
        entriesByEmployee[dayData.employeeId] = []
      }

      entriesByEmployee[dayData.employeeId].push(dayData)
    })

    // Check for suspicious patterns
    Object.entries(entriesByEmployee).forEach(([employeeId, days]: [string, any]) => {
      // Check for exact same hours every day
      if (days.length >= 5) {
        // At least 5 days of data
        const hourCounts = days.map((day) => {
          let totalHours = 0
          day.entries.forEach((entry) => {
            const start = new Date(entry.startTime)
            const end = new Date(entry.endTime)
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
            totalHours += hours
          })
          return Math.round(totalHours * 100) / 100 // Round to 2 decimal places
        })

        // Check if all hours are the same
        const allSameHours = hourCounts.every((hours) => hours === hourCounts[0])

        if (allSameHours && hourCounts[0] > 0) {
          anomalies.push({
            id: `pattern-${employeeId}-${days[0].date}`,
            employeeId,
            date: days[0].date,
            type: "suspicious-pattern",
            description: `Exactly ${hourCounts[0]} hours logged every day for ${days.length} days, which is unusual for this role.`,
            severity: "low",
            relatedEntries: days.flatMap((day) => day.entries.map((e) => e.id)),
            detectionMethod: "pattern-analysis",
          })
        }
      }
    })

    return anomalies
  }

  private getWorkDays(endDate: Date, daysBack: number) {
    const workDays = []
    const currentDate = new Date(endDate)

    while (workDays.length < daysBack) {
      const dayOfWeek = currentDate.getDay()

      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workDays.push(currentDate.toISOString().split("T")[0])
      }

      currentDate.setDate(currentDate.getDate() - 1)
    }

    return workDays
  }
}
