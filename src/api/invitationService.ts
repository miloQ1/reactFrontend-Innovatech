// ===== Invitation Service (Mock Implementation) =====
// Replace this implementation with real API calls when backend is ready.

import type { Invitation, InviteUserRequest } from '../types/invitation';
import { mockInvitations } from '../mocks/invitations';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate mutable state
const invitations = [...mockInvitations];

export const invitationService = {
  async getMyInvitations(userName: string): Promise<Invitation[]> {
    await delay(400);
    return invitations.filter(
      (inv) => inv.invitedUserName === userName && inv.status === 'PENDING'
    );
  },

  async getSentInvitations(projectId: string): Promise<Invitation[]> {
    await delay(300);
    return invitations.filter((inv) => inv.projectId === projectId);
  },

  async inviteUser(data: InviteUserRequest, invitedBy: string, projectName: string): Promise<Invitation> {
    await delay(500);
    const existing = invitations.find(
      (inv) =>
        inv.projectId === data.projectId &&
        inv.invitedUserName === data.userName &&
        inv.status === 'PENDING'
    );
    if (existing) {
      throw new Error('User already has a pending invitation for this project');
    }

    const newInvitation: Invitation = {
      id: `inv${Date.now()}`,
      projectId: data.projectId,
      projectName,
      invitedUserName: data.userName,
      invitedBy,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    invitations.push(newInvitation);
    return newInvitation;
  },

  async acceptInvitation(invitationId: string): Promise<Invitation> {
    await delay(400);
    const invitation = invitations.find((inv) => inv.id === invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }
    invitation.status = 'ACCEPTED';
    return invitation;
  },

  async rejectInvitation(invitationId: string): Promise<Invitation> {
    await delay(400);
    const invitation = invitations.find((inv) => inv.id === invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }
    invitation.status = 'REJECTED';
    return invitation;
  },
};
