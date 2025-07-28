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

interface PolicyRule {
  id: string
  name: string
  description: string
  condition: (anomaly: Anomaly) => boolean
  severity: "low" | "medium" | "high"
  action: "flag" | "auto-correct" | "reject"
}

export class PolicyEnforcer {
  private policyRules: PolicyRule[]

  constructor() {
    this.policyRules = [
      {
        id: "missing-entry-rule",
        name: "Missing Time Entry",
        description: "Employees must log time for all working days",
        condition: (anomaly) => anomaly.type === "missing-entry",
        severity: "medium",
        action: "auto-correct",
      },
      {
        id: "overtime-rule",
        name: "Overtime Limit",
        description: "Employees cannot log more than 12 hours per day",
        condition: (anomaly) => anomaly.type === "overtime",
        severity: "high",
        action: "flag",
      },
      {
        id: "duplicate-entry-rule",
        name: "Duplicate Entries",
        description: "Employees cannot have overlapping time entries",
        condition: (anomaly) => anomaly.type === "duplicate",
        severity: "low",
        action: "auto-correct",
      },
      {
        id: "project-code-rule",
        name: "Project Code Required",
        description: "All time entries must have a project code",
        condition: (anomaly) => anomaly.type === "policy-violation" && anomaly.description.includes("project code"),
        severity: "medium",
        action: "auto-correct",
      },
      {
        id: "suspicious-pattern-rule",
        name: "Suspicious Time Patterns",
        description: "Unusual time entry patterns require verification",
        condition: (anomaly) => anomaly.type === "suspicious-pattern",
        severity: "low",
        action: "flag",
      },
    ]
  }

  async validateAnomalies(anomalies: Anomaly[]) {
    const validationResults = anomalies.map((anomaly) => {
      // Find applicable policy rules
      const applicableRules = this.policyRules.filter((rule) => rule.condition(anomaly))

      // Determine the highest severity rule
      let highestSeverityRule = null
      for (const rule of applicableRules) {
        if (
          !highestSeverityRule ||
          this.getSeverityWeight(rule.severity) > this.getSeverityWeight(highestSeverityRule.severity)
        ) {
          highestSeverityRule = rule
        }
      }

      return {
        anomalyId: anomaly.id,
        anomaly,
        isValid: applicableRules.length === 0,
        applicableRules,
        recommendedAction: highestSeverityRule?.action || "none",
        requiresHumanReview: highestSeverityRule?.action === "flag",
        severity: highestSeverityRule?.severity || "low",
      }
    })

    return {
      success: true,
      data: validationResults,
      message: `Validated ${anomalies.length} anomalies against policy rules`,
    }
  }

  private getSeverityWeight(severity: string) {
    switch (severity) {
      case "high":
        return 3
      case "medium":
        return 2
      case "low":
        return 1
      default:
        return 0
    }
  }

  async getApplicablePolicies(anomalyType: string) {
    const policies = this.policyRules.filter((rule) => rule.condition({ type: anomalyType } as any))

    return {
      success: true,
      data: policies,
      message: `Found ${policies.length} applicable policies for anomaly type: ${anomalyType}`,
    }
  }
}
