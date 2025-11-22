'use client';

import Image from 'next/image';

interface SubmissionCardProps {
  submission: {
    id: string;
    participantName: string;
    imageUrl: string;
    imageThumbnailUrl?: string;
    voteCount: number;
    category?: {
      name: string;
    };
  };
  onVote: () => void;
}

export function SubmissionCard({ submission, onVote }: SubmissionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={submission.imageThumbnailUrl || submission.imageUrl}
          alt={submission.participantName}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{submission.participantName}</h3>
        {submission.category && (
          <p className="text-sm text-gray-500 mb-2">{submission.category.name}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-bold text-lg">{submission.voteCount}</span>
          </div>
          <button
            onClick={onVote}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Votar
          </button>
        </div>
      </div>
    </div>
  );
}

