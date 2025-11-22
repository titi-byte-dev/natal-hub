interface ContestHeaderProps {
  contest: {
    title: string;
    description?: string;
    organization?: {
      name: string;
      logoUrl?: string;
    };
  };
}

export function ContestHeader({ contest }: ContestHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          {contest.organization?.logoUrl && (
            <img
              src={contest.organization.logoUrl}
              alt={contest.organization.name}
              className="h-12 w-auto"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contest.title}</h1>
            {contest.description && (
              <p className="text-gray-600 mt-2">{contest.description}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

