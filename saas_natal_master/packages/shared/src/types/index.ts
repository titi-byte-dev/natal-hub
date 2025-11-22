export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';

export type ContestStatus = 'draft' | 'active' | 'ended' | 'archived';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type UserRole = 'admin' | 'moderator' | 'viewer';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

