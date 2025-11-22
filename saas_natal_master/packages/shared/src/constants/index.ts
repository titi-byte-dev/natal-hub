export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export const CONTEST_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ENDED: 'ended',
  ARCHIVED: 'archived',
} as const;

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  VIEWER: 'viewer',
} as const;

