// ===== Project Service (Mock Implementation) =====
// Replace this implementation with real API calls when backend is ready.

import type { Project, ProjectMember, CreateProjectRequest } from '../types/project';
import { mockProjects, mockMembers } from '../mocks/projects';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate mutable state
const projects = [...mockProjects];
const members = [...mockMembers];

export const projectService = {
  async getMyProjects(userId: string): Promise<Project[]> {
    await delay(400);
    // Projects where user is owner or member
    const memberProjectIds = members
      .filter((m) => m.userId === userId)
      .map((m) => m.userId);
    return projects.filter(
      (p) => p.ownerId === userId || memberProjectIds.includes(p.ownerId)
    );
  },

  async getProjectById(projectId: string): Promise<Project | undefined> {
    await delay(300);
    return projects.find((p) => p.id === projectId);
  },

  async createProject(data: CreateProjectRequest, userId: string, userName: string): Promise<Project> {
    await delay(600);
    const newProject: Project = {
      id: `p${Date.now()}`,
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
      ownerId: userId,
    };
    projects.push(newProject);

    // Auto-add creator as MASTER
    const newMember: ProjectMember = {
      id: `m${Date.now()}`,
      userId,
      userName,
      role: 'MASTER',
      joinedAt: new Date().toISOString(),
    };
    members.push(newMember);

    return newProject;
  },

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    await delay(300);
    const project = projects.find((p) => p.id === projectId);
    if (!project) return [];
    // Return members whose userId matches project members
    // In mock, we associate members to the project by owner matching
    return members.filter((m) => {
      return projects.some((p) => p.id === projectId && (p.ownerId === m.userId || true));
    });
  },

  async getAllProjects(): Promise<Project[]> {
    await delay(300);
    return [...projects];
  },
};
