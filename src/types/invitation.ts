// ===== Invitation Types =====

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Invitation {
  id: string;
  projectId: string;
  projectName: string;
  invitedUserName: string;
  invitedBy: string;
  status: InvitationStatus;
  createdAt: string;
}

export interface InviteUserRequest {
  projectId: string;
  userName: string;
}
