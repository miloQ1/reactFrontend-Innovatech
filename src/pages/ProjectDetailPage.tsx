import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../api/projectService';
import { invitationService } from '../api/invitationService';
import { MemberList } from '../components/projects/MemberList';
import { InviteUserForm } from '../components/projects/InviteUserForm';
import { InvitationList } from '../components/invitations/InvitationList';
import type { Project, ProjectMember } from '../types/project';
import type { Invitation } from '../types/invitation';
import styles from './ProjectDetailPage.module.css';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const isOwner = project?.ownerId === user?.id;

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [proj, mems, invs] = await Promise.all([
        projectService.getProjectById(id),
        projectService.getProjectMembers(id),
        invitationService.getSentInvitations(id),
      ]);
      setProject(proj || null);
      setMembers(mems);
      setSentInvitations(invs);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInvite = async (userName: string) => {
    if (!id || !user || !project) return;
    setInviteLoading(true);
    setInviteSuccess(null);
    setInviteError(null);
    try {
      await invitationService.inviteUser(
        { projectId: id, userName },
        user.userName,
        project.name
      );
      setInviteSuccess(`Invitation sent to @${userName}`);
      loadData();
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading project...</div>;
  }

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2 className={styles.notFoundTitle}>Project not found</h2>
        <p className={styles.notFoundText}>The project you're looking for doesn't exist.</p>
        <Link to="/projects" className={styles.backLink}>← Back to projects</Link>
      </div>
    );
  }

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.page}>
      <Link to="/projects" className={styles.backLink}>
        ← Back to projects
      </Link>

      <div className={styles.header}>
        <h1 className={styles.projectName}>{project.name}</h1>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.meta}>
          <span>📅 Created {formattedDate}</span>
          <span>👤 {isOwner ? 'You are the Master' : 'Member'}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>👥 Team Members ({members.length})</h2>
        <MemberList members={members} />
      </div>

      {isOwner && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📨 Invite a Member</h2>
          <InviteUserForm
            onSubmit={handleInvite}
            isLoading={inviteLoading}
            successMessage={inviteSuccess}
            errorMessage={inviteError}
          />
        </div>
      )}

      {sentInvitations.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>✉️ Sent Invitations ({sentInvitations.length})</h2>
          <InvitationList invitations={sentInvitations} />
        </div>
      )}
    </div>
  );
}
