export interface LinkItem {
  id: string;
  title: string;
  url: string;
  subtitle?: string;
  description?: string;
  emoji?: string;
  badge?: string;
  badgeBg?: string;
  createdAt?: any;
  updatedAt?: any;
  createdat?: any;
  updatedat?: any;
}

export interface CreateLinkInput {
  title: string;
  url: string;
  subtitle?: string;
  description?: string;
  emoji?: string;
  badge?: string;
  badgeBg?: string;
}
