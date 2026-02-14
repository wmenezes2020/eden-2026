export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'artist' | 'fan';
  avatar?: string;
  points?: number;
  createdAt: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  bio: string;
  avatar: string;
  banner: string;
  genre: string;
  location: string;
  followers: number;
  tracks: number;
  videos: number;
  isPromoted: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: Artist;
  cover: string;
  duration: number;
  plays: number;
  url: string;
  album?: string;
  releaseDate: string;
}

export interface Video {
  id: string;
  title: string;
  artist: Artist;
  thumbnail: string;
  duration: number;
  views: number;
  url: string;
  releaseDate: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'fan' | 'artist';
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  change: number;
}

export interface DashboardStats {
  totalFans: number;
  totalArtists: number;
  totalStreams: number;
  totalRevenue: number;
  monthlyStreams: number[];
  topArtists: Artist[];
}

export interface ApiError {
  message: string;
  statusCode: number;
}
