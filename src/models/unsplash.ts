export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  urls: URLCollection;
  user: UnsplashUser;
  links: PhotoLinks;
}

interface PhotoLinks {
  self: string;
  html: string;
  download: string;
  downloadLocation: string;
}

interface URLCollection {
  raw: string;
  full: string;
  thumb: string;
  regular: string;
  small: string;
}

export interface UnsplashUser {
  id: string;
  username: string;
  name: string;
  portfolioUrl: string;
  links: UserLinks;
}

interface UserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
}

export interface UnsplashSearchResponse {
  total: number;
  totalPages: number;
  results: UnsplashPhoto[];
}

export interface UnsplashDownloadResponse {
  url: string;
}
