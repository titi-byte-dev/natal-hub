export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateVerificationCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export function calculatePagination(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

