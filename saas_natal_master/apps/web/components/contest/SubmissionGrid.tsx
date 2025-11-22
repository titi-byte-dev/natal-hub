'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubmissionsByContest } from '@/lib/api/submissions';
import { SubmissionCard } from './SubmissionCard';
import { VoteModal } from './VoteModal';
import { useState } from 'react';

interface SubmissionGridProps {
  contestId: string;
}

export function SubmissionGrid({ contestId }: SubmissionGridProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['submissions', contestId, page],
    queryFn: () => getSubmissionsByContest(contestId, { page, limit: 18 }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const submissions = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 0 };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission: any) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            onVote={() => setSelectedSubmission(submission.id)}
          />
        ))}
      </div>

      {meta.totalPages > page && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Ver Mais
          </button>
        </div>
      )}

      {selectedSubmission && (
        <VoteModal
          submissionId={selectedSubmission}
          contestId={contestId}
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </>
  );
}

