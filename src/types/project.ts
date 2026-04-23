// ===== Project Types =====

export type MemberRole = 'MASTER' | 'MEMBER';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  ownerId: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  userName: string;
  role: MemberRole;
  joinedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}
