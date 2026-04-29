import type { Project, ProjectMember } from '../types/projects';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'EduTech Platform',
    description: 'A collaborative academic project management platform for university students.',
    createdAt: '2026-04-01T10:00:00Z',
    ownerId: 'u1',
  },
];

export const mockMembers: ProjectMember[] = [
  {
    id: 'm1',
    userId: 'u1',
    userName: 'jdoe',
    role: 'MASTER',
    joinedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'm2',
    userId: 'u2',
    userName: 'asmith',
    role: 'MEMBER',
    joinedAt: '2026-04-05T14:30:00Z',
  },
];
