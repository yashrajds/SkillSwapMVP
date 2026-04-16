export interface Skill {
  name: string;
  level: string;
  experience: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePic: string;
  skillsOffered: Skill[];
  skillsWanted: string[];
  location: string;
  createdAt: string;
  matchCount: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  bio: string;
  skillsOffered: Skill[];
  skillsWanted: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  skillsOffered?: Skill[];
  skillsWanted?: string[];
}

export interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderPic: string;
  receiverName: string;
  receiverPic: string;
  skillOffered: string;
  skillRequested: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSwapPayload {
  receiverId: string;
  skillOffered: string;
  skillRequested: string;
  message?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPic: string;
  skillWanted: string;
  description: string;
  createdAt: string;
  responses: number;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface CreatePostPayload {
  skillWanted: string;
  description: string;
}

export interface Notification {
  id: string;
  type: "request" | "match" | "accepted" | "message" | "system";
  title: string;
  body: string;
  read: boolean;
  avatar?: string;
  createdAt: string;
}
