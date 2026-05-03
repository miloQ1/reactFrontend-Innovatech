import type {
  Client, Project, Phase, Task,
  CreateClientRequest, CreateProjectRequest,
  CreatePhaseRequest, CreateTaskRequest,
  ProjectMember, AddMemberRequest,
  TaskStatus, BoardColumn, CreateColumnRequest,
  UpdateTaskRequest
} from '../types/projects';
import { apiClient } from './apiClient';

// ── Clients ──────────────────────────────────────────
export const clientService = {
  getAll(): Promise<Client[]> {
    return apiClient.get<Client[]>('/api/clients', true);
  },
  getById(id: number): Promise<Client> {
    return apiClient.get<Client>(`/api/clients/${id}`, true);
  },
  create(data: CreateClientRequest): Promise<Client> {
    return apiClient.post<Client>('/api/clients', data, true);
  },
  update(id: number, data: Partial<CreateClientRequest>): Promise<Client> {
    return apiClient.put<Client>(`/api/clients/${id}`, data, true);
  },
  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/clients/${id}`, true);
  },
};

// ── Projects ──────────────────────────────────────────
export const projectService = {
  getAll(): Promise<Project[]> {
    return apiClient.get<Project[]>('/api/projects', true);
  },
  getById(id: number): Promise<Project> {
    return apiClient.get<Project>(`/api/projects/${id}`, true);
  },
  getByClient(clientId: number): Promise<Project[]> {
    return apiClient.get<Project[]>(`/api/projects/client/${clientId}`, true);
  },
  create(clientId: number, data: CreateProjectRequest): Promise<Project> {
    return apiClient.post<Project>(`/api/projects/client/${clientId}`, data, true);
  },
  update(id: number, data: Partial<CreateProjectRequest>): Promise<Project> {
    return apiClient.put<Project>(`/api/projects/${id}`, data, true);
  },
  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/projects/${id}`, true);
  },
};

// ── Phases ────────────────────────────────────────────
export const phaseService = {
  getByProject(projectId: number): Promise<Phase[]> {
    return apiClient.get<Phase[]>(`/api/phases/project/${projectId}`, true);
  },
  getById(id: number): Promise<Phase> {
    return apiClient.get<Phase>(`/api/phases/${id}`, true);
  },
  create(projectId: number, data: CreatePhaseRequest): Promise<Phase> {
    return apiClient.post<Phase>(`/api/phases/project/${projectId}`, data, true);
  },
  update(id: number, data: Partial<CreatePhaseRequest>): Promise<Phase> {
    return apiClient.patch<Phase>(`/api/phases/${id}`, data, true);
  },
  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/phases/${id}`, true);
  },
};

// ── Tasks ─────────────────────────────────────────────
export const taskService = {
  getByProject(projectId: number): Promise<Task[]> {
    return apiClient.get<Task[]>(`/api/tasks/project/${projectId}`, true);
  },
  getByPhase(phaseId: number): Promise<Task[]> {
    return apiClient.get<Task[]>(`/api/tasks/phase/${phaseId}`, true);
  },
  getById(id: number): Promise<Task> {
    return apiClient.get<Task>(`/api/tasks/${id}`, true);
  },
  create(projectId: number, data: CreateTaskRequest): Promise<Task> {
    return apiClient.post<Task>(`/api/tasks/project/${projectId}`, data, true);
  },
  update(id: number, data: Partial<CreateTaskRequest>): Promise<Task> {
    return apiClient.put<Task>(`/api/tasks/${id}`, data, true);
  },
  updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    return apiClient.put<Task>(`/api/tasks/${id}`, data, true);
  },
  updateStatus(id: number, status: TaskStatus): Promise<Task> {
    return apiClient.patch<Task>(`/api/tasks/${id}/status`, { status }, true);
  },
  deleteTask(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/tasks/${id}`, true);
  },
};

// ── Members ───────────────────────────────────────────
export const memberService = {
  getByProject(projectId: number): Promise<ProjectMember[]> {
    return apiClient.get<ProjectMember[]>(`/api/projects/${projectId}/members`, true);
  },
  add(projectId: number, data: AddMemberRequest): Promise<ProjectMember> {
    return apiClient.post<ProjectMember>(`/api/projects/${projectId}/members`, data, true);
  },
  remove(projectId: number, userId: string): Promise<void> {
    return apiClient.delete<void>(`/api/projects/${projectId}/members/${userId}`, true);
  },
};

// ── Columns ───────────────────────────────────────────
export const columnService = {
  getByPhase(phaseId: number): Promise<BoardColumn[]> {
    return apiClient.get<BoardColumn[]>(`/api/phases/${phaseId}/columns`, true);
  },
  create(phaseId: number, data: CreateColumnRequest): Promise<BoardColumn> {
    return apiClient.post<BoardColumn>(`/api/phases/${phaseId}/columns`, data, true);
  },
  createDefaults(phaseId: number): Promise<void> {
    return apiClient.post<void>(`/api/phases/${phaseId}/columns/defaults`, {}, true);
  },
  update(phaseId: number, columnId: number, data: Partial<CreateColumnRequest>): Promise<BoardColumn> {
    return apiClient.patch<BoardColumn>(`/api/phases/${phaseId}/columns/${columnId}`, data, true);
  },
  delete(phaseId: number, columnId: number): Promise<void> {
    return apiClient.delete<void>(`/api/phases/${phaseId}/columns/${columnId}`, true);
  },
};