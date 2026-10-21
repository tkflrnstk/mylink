export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  badge?: string;
  bio?: string;
  lastLoginAt?: any;
  createdAt?: any;
}
