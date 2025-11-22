import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getSubmissionsByContest(
  contestId: string,
  options: {
    page?: number;
    limit?: number;
    categoryId?: string;
    sort?: string;
  } = {},
) {
  try {
    const params = new URLSearchParams({
      page: (options.page || 1).toString(),
      limit: (options.limit || 18).toString(),
      ...(options.categoryId && { categoryId: options.categoryId }),
      ...(options.sort && { sort: options.sort }),
    });

    const response = await axios.get(
      `${API_URL}/submissions/contest/${contestId}?${params.toString()}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { data: [], meta: { total: 0, page: 1, limit: 18, totalPages: 0 } };
  }
}

