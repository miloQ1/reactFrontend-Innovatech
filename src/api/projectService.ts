import type {
  Client, Project, Phase, Task,
  CreateClientRequest, CreateProjectRequest,
  CreatePhaseRequest, CreateTaskRequest,
  ProjectMember,
  AddMemberRequest,
  TaskStatus,
} from '../types/projects';
import { apiClient } from './apiClient';

// ── Clients ──────────────────────────────────────────
export const clientService = {
  getAll(): Promise<Client[]> {
    return apiClient.get<Client[]>('/api/clients');
  },
  getById(id: number): Promise<Client> {
    return apiClient.get<Client>(`/api/clients/${id}`);
  },
  create(data: CreateClientRequest): Promise<Client> {
    return apiClient.post<Client>('/api/clients', data);
  },
  update(id: number, data: Partial<CreateClientRequest>): Promise<Client> {
    return apiClient.put<Client>(`/api/clients/${id}`, data);
  },
  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/clients/${id}`);
  },
};

// ── Projects ──────────────────────────────────────────
export const projectService = {
  getAll(): Promise<Project[]> {
    return apiClient.get<Project[]>('/api/projects');
  },
  getById(id: number): Promise<Project> {
    return apiClient.get<Project>(`/api/projects/${id}`);
  },
  getByClient(clientId: number): Promise<Project[]> {
    return apiClient.get<Project[]>(`/api/projects/client/${clientId}`);
  },
  create(clientId: number, data: CreateProjectRequest): Promise<Project> {
    return apiClient.post<Project>(`/api/projects/client/${clientId}`, data);
  },
  update(id: number, data: Partial<CreateProjectRequest>): Promise<Project> {
    return apiClient.put<Project>(`/api/projects/${id}`, data);
  },
  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/projects/${id}`);
  },
};

// ── Phases ────────────────────────────────────────────
export const phaseService = {
  getByProject(projectId: number): Promise<Phase[]> {
    return apiClient.get<Phase[]>(`/api/phases/project/${projectId}`);
  },
  getById(id: number): Promise<Phase> {
    return apiClient.get<Phase>(`/api/phases/${id}`);
  },
  create(projectId: number, data: CreatePhaseRequest): Promise<Phase> {
    return apiClient.post<Phase>(`/api/phases/project/${projectId}`, data);
  },
  update(id: number, data: Partial<CreatePhaseRequest>): Promise<Phase> {
    return apiClient.put<Phase>(`/api/phases/${id}`, data);
  },
  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/phases/${id}`);
  },
};

// ── Tasks ─────────────────────────────────────────────
export const taskService = {
  getByProject(projectId: number): Promise<Task[]> {
    return apiClient.get<Task[]>(`/api/tasks/project/${projectId}`);
  },
  getByPhase(phaseId: number): Promise<Task[]> {
    return apiClient.get<Task[]>(`/api/tasks/phase/${phaseId}`);
  },
  getById(id: number): Promise<Task> {
    return apiClient.get<Task>(`/api/tasks/${id}`);
  },
  create(projectId: number, data: CreateTaskRequest): Promise<Task> {
    return apiClient.post<Task>(`/api/tasks/project/${projectId}`, data);
  },
  update(id: number, data: Partial<CreateTaskRequest>): Promise<Task> {
    return apiClient.put<Task>(`/api/tasks/${id}`, data);
  },
  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/tasks/${id}`);
  },
  updateStatus(id: number, status: TaskStatus): Promise<Task> {
  return apiClient.patch<Task>(`/api/tasks/${id}/status`, { status });
  },
};

export const memberService = {
  getByProject(projectId: number): Promise<ProjectMember[]> {
    return apiClient.get<ProjectMember[]>(`/api/projects/${projectId}/members`);
  },
  add(projectId: number, data: AddMemberRequest): Promise<ProjectMember> {
    return apiClient.post<ProjectMember>(`/api/projects/${projectId}/members`, data);
  },
  remove(projectId: number, userId: string): Promise<void> {
    return apiClient.delete<void>(`/api/projects/${projectId}/members/${userId}`);
  },
};