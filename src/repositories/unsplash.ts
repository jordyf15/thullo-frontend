import { UnsplashPhoto, UnsplashSearchResponse } from "../models/unsplash";
import { combinedWithQueries, serializeResponse } from "./base";

interface UnsplashRepository {
  listPhotos: (page: number, perPage: number) => Promise<UnsplashPhoto[]>;
  getPhoto: (id: string) => Promise<UnsplashPhoto>;
  searchForPhotos: (
    query: string,
    page: number,
    perPage: number
  ) => Promise<UnsplashSearchResponse>;
  getRandomPhoto: () => Promise<UnsplashPhoto>;
}

const UNSPLASH_API_BASE_URL = "https://api.unsplash.com";

class RealUnsplashRepository implements UnsplashRepository {
  async listPhotos(page: number, perPage: number) {
    return fetch(
      combinedWithQueries(`${UNSPLASH_API_BASE_URL}/photos`, {
        page: page,
        per_page: perPage,
      }),
      {
        method: "GET",
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
        },
      }
    ).then(serializeResponse<UnsplashPhoto[]>());
  }

  async getPhoto(id: string) {
    return fetch(`${UNSPLASH_API_BASE_URL}/photos/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
      },
    }).then(serializeResponse<UnsplashPhoto>());
  }

  async searchForPhotos(query: string, page: number, perPage: number) {
    return fetch(
      combinedWithQueries(`${UNSPLASH_API_BASE_URL}/search/photos`, {
        query: query,
        page: page,
        per_page: perPage,
      }),
      {
        method: "GET",
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
        },
      }
    ).then(serializeResponse<UnsplashSearchResponse>());
  }

  async getRandomPhoto() {
    return fetch(`${UNSPLASH_API_BASE_URL}/photos/random`, {
      method: "GET",
      headers: {
        Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
      },
    }).then(serializeResponse<UnsplashPhoto>());
  }
}

export const NewUnsplashRepository: () => UnsplashRepository = () =>
  new RealUnsplashRepository();

export default UnsplashRepository;
