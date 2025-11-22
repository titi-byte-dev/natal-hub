import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function requestVerificationCode(contestId: string, email: string) {
  try {
    const response = await axios.post(`${API_URL}/votes/request-verification`, {
      contestId,
      email,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to request verification code');
  }
}

export async function submitVote(
  contestId: string,
  data: {
    submissionId: string;
    email: string;
    code: string;
    ipAddress?: string;
    userAgent?: string;
  },
) {
  try {
    const response = await axios.post(`${API_URL}/votes/submit`, {
      contestId,
      ...data,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit vote');
  }
}

