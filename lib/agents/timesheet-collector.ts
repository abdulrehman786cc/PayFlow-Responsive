import { ClockifyClient } from "@/lib/integrations/clockify"

export class TimesheetCollector {
  private clockifyClient: ClockifyClient

  constructor() {
    this.clockifyClient = new ClockifyClient()
  }

  async collectTimesheets(startDate: string, endDate: string, workspaceId: string) {
    try {
      // Fetch timesheet data from Clockify
      const timesheets = await this.clockifyClient.getTimeEntries(workspaceId, startDate, endDate)

      // Process and normalize the data
      const normalizedData = this.normalizeTimesheetData(timesheets)

      return {
        success: true,
        data: normalizedData,
        message: `Successfully collected ${normalizedData.length} time entries for period ${startDate} to ${endDate}`,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `Failed to collect timesheet data: ${error.message}`,
      }
    }
  }

  private normalizeTimesheetData(timesheets: any[]) {
    // Transform the raw Clockify data into a standardized format
    return timesheets.map((entry) => ({
      id: entry.id,
      employeeId: entry.userId,
      projectId: entry.projectId,
      taskId: entry.taskId,
      description: entry.description,
      startTime: entry.timeInterval.start,
      endTime: entry.timeInterval.end,
      duration: entry.timeInterval.duration,
      billable: entry.billable,
      tags: entry.tags,
    }))
  }

  async getEmployeeData(workspaceId: string) {
    try {
      // Fetch employee data from Clockify
      const employees = await this.clockifyClient.getUsers(workspaceId)

      return {
        success: true,
        data: employees,
        message: `Successfully retrieved data for ${employees.length} employees`,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `Failed to retrieve employee data: ${error.message}`,
      }
    }
  }
}
