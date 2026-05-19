


export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  actor: User;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
  meta?: {
    count: number;
    strategy?: string;
  };
}



export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
