export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null; // 서비스 내 표시용 닉네임 (기본: 이메일 앞부분)
  userName?: string | null;   // 구글 계정 사용자명 / 실제 성명 (기본: user.displayName || "사용자")
  photoURL?: string | null;   // 프로필 사진 URL
  badge?: string;
  bio?: string;
  lastLoginAt?: any;
  createdAt?: any;
  updatedAt?: any;
}

