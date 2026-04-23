import type { Invitation } from '../types/invitation';

export const mockInvitations: Invitation[] = [
  {
    id: 'inv1',
    projectId: 'p1',
    projectName: 'EduTech Platform',
    invitedUserName: 'bwilson',
    invitedBy: 'jdoe',
    status: 'PENDING',
    createdAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 'inv2',
    projectId: 'p1',
    projectName: 'EduTech Platform',
    invitedUserName: 'cmartinez',
    invitedBy: 'jdoe',
    status: 'ACCEPTED',
    createdAt: '2026-04-08T11:00:00Z',
  },
];
