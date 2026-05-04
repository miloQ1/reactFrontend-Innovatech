export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type ClientStatus = 'ACTIVE' | 'INACTIVE';
export type PhaseStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';

export interface Client {
  clientId: number;
  name: string;
  industry?: string;
  contactName?: string;
  contactEmail?: string;
  status: ClientStatus;
  createdAt: string;
}

export interface Project {
  projectId: number;
  client: Client;
  code: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status: ProjectStatus;
  progressPct?: number;
  projectManagerId?: number;
  createdAt: string;
}

export interface Phase {
  phaseId: number;
  name: string;
  sequenceOrder: number;
  plannedStart?: string;
  plannedEnd?: string;
  status: string;         // viene del backend como computedStatus
  computedStatus?: string;
}

export interface Task {
  taskId: number;
  taskCode?: string; 
  phaseId: number | null;
  title: string;
  description?: string;
  priority: TaskPriority | null;
  status: TaskStatus;
  assignedResourceId?: number;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: string;
  dueDate?: string;
}
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority | null;
  status?: TaskStatus;
  dueDate?: string;
}

// Request types
export interface CreateClientRequest {
  name: string;
  industry?: string;
  contactName?: string;
  contactEmail?: string;
  status: ClientStatus;
}

export interface CreateProjectRequest {
  code: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status: ProjectStatus;
  progressPct?: number;
  projectManagerId?: number;
}

export interface CreatePhaseRequest {
  name: string;
  sequenceOrder: number;
  plannedStart?: string;
  plannedEnd?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedResourceId?: number;
  estimatedHours?: number;
  startDate?: string;
  dueDate?: string;
  phase?: { phaseId: number };
}

export interface ProjectMember {
  id: number;
  userId: string;
  userName: string;
  joinedAt: string;
  role: string;
}

export interface AddMemberRequest {
  userId: string;
  userName: string;
}

export interface Task {
  taskId: number;
  phaseId: number | null; 
  title: string;
  description?: string;
  priority: TaskPriority | null;
  status: TaskStatus;
  assignedResourceId?: number;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: string;
  dueDate?: string;
}

export interface BoardColumn {
  columnId: number;
  name: string;
  color: string;
  sequenceOrder: number;
  mappedStatus: string | null;
}

export interface CreateColumnRequest {
  name: string;
  color: string;
  mappedStatus?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  phaseId?: number; // ← campo directo
  assignedResourceId?: number;
  estimatedHours?: number;
  startDate?: string;
  dueDate?: string;
}