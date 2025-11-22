import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getContestBySlug(slug: string) {
  try {
    const response = await axios.get(`${API_URL}/contests/public/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contest:', error);
    return null;
  }
}

