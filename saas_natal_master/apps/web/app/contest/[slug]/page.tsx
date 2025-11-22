import { notFound } from 'next/navigation';
import { getContestBySlug } from '@/lib/api/contests';
import { ContestHeader } from '@/components/contest/ContestHeader';
import { SubmissionGrid } from '@/components/contest/SubmissionGrid';

export default async function ContestPage({
  params,
}: {
  params: { slug: string };
}) {
  const contest = await getContestBySlug(params.slug);

  if (!contest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <ContestHeader contest={contest} />
      <main className="container mx-auto px-4 py-8">
        <SubmissionGrid contestId={contest.id} />
      </main>
    </div>
  );
}

