// This is a mock implementation of a Clockify API client
// In a real application, this would make actual API calls to Clockify

export class ClockifyClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey = "mock-api-key") {
    this.apiKey = apiKey
    this.baseUrl = "https://api.clockify.me/api/v1"
  }

  async getTimeEntries(workspaceId: string, startDate: string, endDate: string) {
    // In a real implementation, this would make an API call to Clockify
    // For this demo, we'll return mock data

    console.log(`Fetching time entries for workspace ${workspaceId} from ${startDate} to ${endDate}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return mock data
    return [
      {
        id: "entry1",
        userId: "emp-123",
        projectId: "proj-1",
        taskId: "task-1",
        description: "Working on feature X",
        timeInterval: {
          start: "2025-07-10T09:00:00Z",
          end: "2025-07-10T17:00:00Z",
          duration: "PT8H",
        },
        billable: true,
        tags: ["development"],
      },
      {
        id: "entry2",
        userId: "emp-456",
        projectId: "proj-2",
        taskId: "task-2",
        description: "Client meeting",
        timeInterval: {
          start: "2025-07-11T10:00:00Z",
          end: "2025-07-12T00:00:00Z",
          duration: "PT14H",
        },
        billable: true,
        tags: ["meeting", "client"],
      },
      // Add more mock entries as needed
    ]
  }

  async getUsers(workspaceId: string) {
    // In a real implementation, this would make an API call to Clockify
    // For this demo, we'll return mock data

    console.log(`Fetching users for workspace ${workspaceId}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Return mock data
    return [
      {
        id: "emp-123",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        status: "active",
      },
      {
        id: "emp-456",
        name: "Michael Chen",
        email: "michael.chen@example.com",
        status: "active",
      },
      {
        id: "emp-789",
        name: "Jessica Williams",
        email: "jessica.williams@example.com",
        status: "active",
      },
      {
        id: "emp-101",
        name: "David Rodriguez",
        email: "david.rodriguez@example.com",
        status: "active",
      },
      {
        id: "emp-112",
        name: "Emma Thompson",
        email: "emma.thompson@example.com",
        status: "active",
      },
    ]
  }

  async updateTimeEntry(workspaceId: string, timeEntryId: string, updates: any) {
    // In a real implementation, this would make an API call to Clockify
    // For this demo, we'll just log the update

    console.log(`Updating time entry ${timeEntryId} in workspace ${workspaceId}:`, updates)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Return success
    return {
      success: true,
      message: "Time entry updated successfully",
    }
  }

  async createTimeEntry(workspaceId: string, userId: string, timeEntry: any) {
    // In a real implementation, this would make an API call to Clockify
    // For this demo, we'll just log the creation

    console.log(`Creating time entry for user ${userId} in workspace ${workspaceId}:`, timeEntry)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Return success with a mock ID
    return {
      success: true,
      id: `entry-${Date.now()}`,
      message: "Time entry created successfully",
    }
  }

  async deleteTimeEntry(workspaceId: string, timeEntryId: string) {
    // In a real implementation, this would make an API call to Clockify
    // For this demo, we'll just log the deletion

    console.log(`Deleting time entry ${timeEntryId} in workspace ${workspaceId}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Return success
    return {
      success: true,
      message: "Time entry deleted successfully",
    }
  }
}
